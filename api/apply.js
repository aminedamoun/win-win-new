/**
 * /api/apply — Vercel serverless function (Node runtime).
 *
 * Replaces the dead Supabase edge function + storage bucket. The browser POSTs
 * the application fields plus the CV (base64) as JSON; this function emails
 * office@win-win.si via Resend with the PDF attached. No database, no storage.
 *
 * Env vars (set in Vercel dashboard → Project → Settings → Environment Variables):
 *   RESEND_API_KEY              — REQUIRED. Resend account that owns verified win-win.si.
 *   SUPABASE_URL               — optional. Enables the best-effort archive below.
 *   SUPABASE_SERVICE_ROLE_KEY  — optional. Server-only; NEVER expose to the browser.
 *
 * Flow:
 *   1. (REQUIRED) Email the application + CV to office@win-win.si via Resend. This is
 *      what determines success/failure for the candidate.
 *   2. (BEST-EFFORT) Archive to Supabase: upload the CV to the cv-uploads bucket and
 *      insert a row into public.applications so /admin/applications can show it. Any
 *      failure here is logged and swallowed — a Supabase outage must never break the
 *      form (that is exactly what happened before).
 *
 * Note: Vercel caps a serverless request body at ~4.5MB, so the client limits the
 * CV to 3MB (base64 ≈ 4MB) — see assets/js/apply.js.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TO_ADDRESS = "office@win-win.si";
const FROM_ADDRESS = "Win Win <noreply@win-win.si>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function setCors(res) {
  for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildEmailHtml(data) {
  const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
  const submittedAt = data.submittedAt || new Date().toISOString();
  let formattedDate = submittedAt;
  try {
    formattedDate = new Date(submittedAt).toLocaleString("sl-SI", {
      timeZone: "Europe/Ljubljana",
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch (_) { /* keep ISO string */ }

  const rows = [
    ["Delovno mesto", esc(data.jobTitle) + (data.jobSlug ? ` <span style="color:#999;">(${esc(data.jobSlug)})</span>` : "")],
    ["Ime in priimek", esc(fullName)],
    ["E-pošta", `<a href="mailto:${esc(data.email)}">${esc(data.email)}</a>`],
    ["Telefon", esc(data.phone)],
    ...(data.lokacija ? [["Lokacija razgovora", esc(data.lokacija)]] : []),
    ...(data.vir ? [["Vir prijave", esc(data.vir)]] : []),
    ...(data.preferredInterviewTime ? [["Želeni čas razgovora", esc(data.preferredInterviewTime)]] : []),
    ["Datum prijave", esc(formattedDate)],
  ];

  const tableRows = rows.map(([label, value]) => `
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#555;white-space:nowrap;vertical-align:top;width:200px;">${label}</td>
        <td style="padding:10px 14px;color:#222;">${value}</td>
      </tr>`).join("");

  const messageSection = data.message ? `
      <div style="margin-top:24px;">
        <div style="font-weight:700;color:#555;margin-bottom:6px;">Sporočilo / Motivacija</div>
        <div style="background:#f9f9f9;border-left:4px solid #e53e3e;padding:14px 18px;border-radius:4px;color:#333;line-height:1.7;">
          ${esc(data.message).replace(/\n/g, "<br>")}
        </div>
      </div>` : "";

  const cvNote = data.cvName
    ? `<p style="margin-top:20px;color:#555;font-size:13px;">CV je priložen tej e-pošti kot datoteka <strong>${esc(data.cvName)}</strong>.</p>`
    : `<p style="margin-top:20px;color:#a33;font-size:13px;">Kandidat ni priložil CV-ja.</p>`;

  return `<!DOCTYPE html>
<html lang="sl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:620px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.10);">
    <div style="background:#e53e3e;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:900;">Nova prijava za delovno mesto</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:15px;">${esc(data.jobTitle)}</p>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;background:#fafafa;border-radius:6px;overflow:hidden;">
        <tbody>${tableRows}</tbody>
      </table>
      ${messageSection}
      ${cvNote}
    </div>
    <div style="padding:16px 32px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
      Sporočilo je bilo samodejno poslano preko spletne strani Win-Win Agency.
    </div>
  </div>
</body>
</html>`;
}

// Best-effort archive to Supabase (CV → storage, row → applications).
// Returns silently on any failure; never throws to the caller.
async function archiveToSupabase(data, cvBuffer) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) return; // archive not configured — skip quietly

  const authHeaders = { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` };
  let cvPath = "";

  // 1. Upload CV to the private cv-uploads bucket (service role bypasses RLS).
  if (cvBuffer && data.cvName) {
    try {
      const safe = String(data.cvName).replace(/[^a-zA-Z0-9.-]/g, "_");
      cvPath = `${Date.now()}_${safe}`;
      const up = await fetch(`${SUPABASE_URL}/storage/v1/object/cv-uploads/${encodeURIComponent(cvPath)}`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/pdf", "x-upsert": "false" },
        body: cvBuffer,
      });
      if (!up.ok) {
        console.error("[api/apply] archive: CV upload failed", up.status, await up.text().catch(() => ""));
        cvPath = "";
      }
    } catch (err) {
      console.error("[api/apply] archive: CV upload threw", err && err.message ? err.message : err);
      cvPath = "";
    }
  }

  // 2. Insert application row (job_id left null — jobs come from Contentful, whose
  //    ids are not uuids in public.jobs). Job details still live in the email.
  try {
    const row = {
      first_name: data.firstName || "",
      last_name: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      preferred_interview_time: data.preferredInterviewTime || "",
      message: data.message || "",
      cv_url: cvPath,
      status: "new",
    };
    const ins = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify(row),
    });
    if (!ins.ok) {
      console.error("[api/apply] archive: row insert failed", ins.status, await ins.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[api/apply] archive: row insert threw", err && err.message ? err.message : err);
  }
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("[api/apply] RESEND_API_KEY is not configured");
    res.status(500).json({ success: false, error: "E-poštna storitev ni nastavljena (RESEND_API_KEY manjka)." });
    return;
  }

  let data;
  try {
    data = await readJsonBody(req);
  } catch (err) {
    res.status(400).json({ success: false, error: "Neveljaven zahtevek." });
    return;
  }

  if (!data.firstName || !data.lastName || !data.email) {
    res.status(400).json({ success: false, error: "Manjkajo obvezna polja." });
    return;
  }

  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const emailPayload = {
    from: FROM_ADDRESS,
    to: [TO_ADDRESS],
    reply_to: data.email,
    subject: `Nova prijava: ${data.jobTitle || "Prijava"} — ${fullName}`,
    html: buildEmailHtml(data),
  };

  let cvBuffer = null;
  if (data.cvBase64 && data.cvName) {
    const safeName = `${fullName.replace(/[^a-zA-Z0-9]/g, "-")}-${String(data.jobSlug || "vloga").replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
    emailPayload.attachments = [{
      filename: safeName,
      content: data.cvBase64, // Resend accepts base64 string content
    }];
    try { cvBuffer = Buffer.from(data.cvBase64, "base64"); } catch (_) { cvBuffer = null; }
  }

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const resendBody = await resendResponse.text();

    if (!resendResponse.ok) {
      console.error("[api/apply] Resend error:", resendResponse.status, resendBody);
      res.status(502).json({ success: false, error: `Napaka pri pošiljanju e-pošte (${resendResponse.status}).` });
      return;
    }

    let result = {};
    try { result = JSON.parse(resendBody); } catch (_) { /* non-JSON ok */ }

    // Best-effort archive — awaited so it runs before the function freezes, but
    // its internal failures never affect the response.
    await archiveToSupabase(data, cvBuffer);

    res.status(200).json({ success: true, emailId: result.id || null, cvAttached: !!emailPayload.attachments });
  } catch (err) {
    console.error("[api/apply] uncaught error:", err && err.message ? err.message : err);
    res.status(500).json({ success: false, error: "Notranja napaka strežnika." });
  }
};

// Read the raw request stream ourselves (bodyParser: false) so we bypass Vercel's
// default 1MB body parser — a base64 CV easily exceeds it. The platform still caps
// the request body at ~4.5MB. Set AFTER the handler assignment above so it survives.
module.exports.config = { api: { bodyParser: false } };
