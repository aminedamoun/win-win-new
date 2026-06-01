import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GiveawayPayload {
  ime: string;
  priimek: string;
  naslov: string;
  telefon: string;
  email: string;
  consent: boolean;
  consentTimestampIso: string;
  consentLocationLabel: string;
  consentDisplay: string;
  source?: string;
  userAgent?: string;
}

function esc(s: unknown): string {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: GiveawayPayload = await req.json();

    // Persist the entry to public.giveaway_entries so the admin draw page
    // (/admin/zrebanje/) has the canonical pool of participants.
    // Failures here must not block the email — we just log and continue.
    try {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (SUPABASE_URL && SERVICE_ROLE) {
        const db = createClient(SUPABASE_URL, SERVICE_ROLE);
        const { error: insertErr } = await db.from("giveaway_entries").insert({
          ime: data.ime ?? "",
          priimek: data.priimek ?? "",
          naslov: data.naslov ?? "",
          telefon: data.telefon ?? "",
          email: data.email ?? "",
          consent: !!data.consent,
          consent_timestamp: data.consentTimestampIso || null,
          consent_location_label: data.consentLocationLabel ?? "",
          source: data.source ?? "",
          user_agent: data.userAgent ?? "",
        });
        if (insertErr) {
          console.warn("[send-giveaway-email] DB insert failed:", insertErr.message);
        }
      } else {
        console.warn("[send-giveaway-email] SUPABASE_URL / SERVICE_ROLE_KEY missing — skipping DB insert");
      }
    } catch (dbErr) {
      console.warn("[send-giveaway-email] DB insert threw:", dbErr);
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const fullName = `${data.ime ?? ""} ${data.priimek ?? ""}`.trim();
    const tsIso = data.consentTimestampIso || new Date().toISOString();
    const formattedFull = new Date(tsIso).toLocaleString("sl-SI", {
      timeZone: "Europe/Ljubljana",
      dateStyle: "long",
      timeStyle: "medium",
    });

    console.log("[send-giveaway-email] received:", {
      fullName,
      email: data.email,
      lokacija: data.consentLocationLabel,
      ts: tsIso,
    });

    const rows: [string, string][] = [
      ["Ime in priimek", esc(fullName)],
      ["Naslov", esc(data.naslov)],
      ["Telefonska številka", esc(data.telefon)],
      ["E-naslov", `<a href="mailto:${esc(data.email)}">${esc(data.email)}</a>`],
      ["Lokacija privolitve", esc(data.consentLocationLabel)],
      ["Časovni žig privolitve", `${esc(formattedFull)} <span style="color:#999;">(${esc(tsIso)})</span>`],
      ["Privolitev v pravila", "DA"],
    ];

    const tableRows = rows.map(([label, value]) => `
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#555;white-space:nowrap;vertical-align:top;width:220px;background:#fafafa;">${label}</td>
        <td style="padding:10px 14px;color:#222;border-left:1px solid #eee;">${value}</td>
      </tr>`).join("");

    const consentBlock = `
      <div style="margin-top:24px;padding:16px 18px;background:#fff7ed;border-left:4px solid #f59e0b;border-radius:6px;color:#7c2d12;font-size:13px;line-height:1.6;">
        <strong>GDPR zapis privolitve</strong><br>
        Sodelujoči je s pritiskom na gumb »Sodeluj v nagradni igri« potrdil strinjanje s pravili nagradne igre in
        z obdelavo osebnih podatkov za namen izvedbe nagradne igre in neposrednega trženja (po telefonu, SMS in e-pošti) izdelkov ter storitev organizatorja in poslovnih partnerjev.<br>
        Privolitev velja do preklica.
      </div>`;

    const debugBlock = (data.source || data.userAgent) ? `
      <div style="margin-top:18px;padding:12px 16px;background:#f9fafb;border-radius:6px;font-size:12px;color:#666;line-height:1.6;">
        ${data.source ? `<div><strong>Vir:</strong> ${esc(data.source)}</div>` : ""}
        ${data.userAgent ? `<div><strong>Naprava:</strong> ${esc(data.userAgent)}</div>` : ""}
      </div>` : "";

    const emailHtml = `<!DOCTYPE html>
<html lang="sl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:660px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.10);">
    <div style="background:#dc2626;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:900;">Nova prijava — Nagradna igra Win-Win</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.92);font-size:15px;">${esc(data.consentDisplay || `${data.consentLocationLabel} – ${tsIso}`)}</p>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:6px;overflow:hidden;">
        <tbody>${tableRows}</tbody>
      </table>
      ${consentBlock}
      ${debugBlock}
    </div>
    <div style="padding:16px 32px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
      Sporočilo je samodejno poslano s spletne strani win-win.si/nagradna-igra/.
    </div>
  </div>
</body>
</html>`;

    const subject = `Nagradna igra — ${fullName} (${data.consentLocationLabel || "ni lokacije"})`;

    const emailPayload = {
      from: "Win Win <noreply@win-win.si>",
      to: ["office@win-win.si"],
      reply_to: data.email,
      subject,
      html: emailHtml,
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const resendBody = await resendResponse.text();
    console.log("[send-giveaway-email] Resend status:", resendResponse.status, "body:", resendBody);

    if (!resendResponse.ok) {
      return new Response(
        JSON.stringify({ success: false, error: `Resend API error: ${resendBody}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(resendBody);

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[send-giveaway-email] uncaught error:", error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
