import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ApplicationPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  country?: string;
  jobTitle: string;
  jobSlug?: string;
  jobId?: string;
  preferredInterviewTime?: string;
  message?: string;
  cvPath?: string;
  submittedAt?: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: ApplicationPayload = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("[send-application-email] received:", {
      fullName: `${data.firstName} ${data.lastName}`,
      jobTitle: data.jobTitle,
      jobId: data.jobId || "(none)",
      cvPath: data.cvPath || "(none)",
      supabaseUrl: SUPABASE_URL,
    });

    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
    if (!SUPABASE_URL) throw new Error("SUPABASE_URL is not configured");
    if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- 1. Insert application row using service role (bypasses RLS) ---
    const insertPayload: Record<string, unknown> = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      preferred_interview_time: data.preferredInterviewTime || "",
      message: data.message || "",
      cv_url: data.cvPath || "",
      status: "new",
    };
    if (data.jobId) insertPayload.job_id = data.jobId;

    const { data: insertedRow, error: insertError } = await supabaseAdmin
      .from("applications")
      .insert([insertPayload])
      .select("id")
      .maybeSingle();

    if (insertError) {
      console.error("[send-application-email] DB insert error:", JSON.stringify(insertError));
    } else {
      console.log("[send-application-email] DB insert success, id:", insertedRow?.id);
    }

    // --- 2. Download CV and build attachment ---
    const fullName = `${data.firstName} ${data.lastName}`;
    const submittedAt = data.submittedAt || new Date().toISOString();
    const formattedDate = new Date(submittedAt).toLocaleString("sl-SI", {
      timeZone: "Europe/Ljubljana",
      dateStyle: "long",
      timeStyle: "short",
    });

    let cvAttachment: { filename: string; content: string; contentType: string } | null = null;
    let cvFallbackNote = "";

    if (data.cvPath) {
      console.log("[send-application-email] downloading CV, path:", data.cvPath);

      const { data: fileData, error: downloadError } = await supabaseAdmin.storage
        .from("cv-uploads")
        .download(data.cvPath);

      if (downloadError) {
        console.error("[send-application-email] CV download error:", JSON.stringify(downloadError));

        const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
          .from("cv-uploads")
          .createSignedUrl(data.cvPath, 60 * 60 * 24);

        if (signedUrlError) {
          console.error("[send-application-email] signed URL error:", JSON.stringify(signedUrlError));
          cvFallbackNote = `<p style="margin-top:20px;color:#555;font-size:13px;">CV datoteka shranjena v sistemu (pot: <code>${data.cvPath}</code>). Priložitev ni uspela.</p>`;
        } else {
          cvFallbackNote = `<p style="margin-top:20px;color:#555;font-size:13px;">CV (priložitev ni uspela — odprite neposredno): <a href="${signedUrlData.signedUrl}">Prenesi CV</a> (veljavna 24 ur)</p>`;
        }
      } else if (fileData) {
        const buffer = await fileData.arrayBuffer();
        console.log("[send-application-email] CV downloaded, size bytes:", buffer.byteLength);

        const base64 = arrayBufferToBase64(buffer);
        const safeName = `${fullName.replace(/[^a-zA-Z0-9]/g, "-")}-${(data.jobSlug || "vloga").replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;

        cvAttachment = { filename: safeName, content: base64, contentType: "application/pdf" };
        console.log("[send-application-email] CV attachment ready:", safeName, "base64 length:", base64.length);
      }
    }

    // --- 3. Build and send email ---
    const rows: [string, string][] = [
      ["Delovno mesto", data.jobTitle + (data.jobSlug ? ` <span style="color:#999;">(${data.jobSlug})</span>` : "")],
      ["Ime in priimek", fullName],
      ["E-pošta", `<a href="mailto:${data.email}">${data.email}</a>`],
      ["Telefon", data.phone],
      ...(data.city || data.country ? [["Lokacija", [data.city, data.country].filter(Boolean).join(", ")] as [string, string]] : []),
      ...(data.preferredInterviewTime ? [["Želeni čas razgovora", data.preferredInterviewTime] as [string, string]] : []),
      ["Datum prijave", formattedDate],
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
          ${data.message.replace(/\n/g, "<br>")}
        </div>
      </div>` : "";

    const cvNote = cvAttachment
      ? `<p style="margin-top:20px;color:#555;font-size:13px;">CV je priložen tej e-pošti kot datoteka <strong>${cvAttachment.filename}</strong>.</p>`
      : cvFallbackNote || "";

    const emailHtml = `<!DOCTYPE html>
<html lang="sl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:620px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.10);">
    <div style="background:#e53e3e;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:900;">Nova prijava za delovno mesto</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:15px;">${data.jobTitle}</p>
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

    const emailPayload: Record<string, unknown> = {
      from: "Win Win <noreply@win-win.si>",
      to: ["office@win-win.si"],
      subject: `Nova prijava: ${data.jobTitle} — ${fullName}`,
      html: emailHtml,
    };

    if (cvAttachment) {
      emailPayload.attachments = [{
        filename: cvAttachment.filename,
        content: cvAttachment.content,
        contentType: cvAttachment.contentType,
      }];
    }

    console.log("[send-application-email] sending via Resend, hasAttachment:", !!cvAttachment);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const resendBody = await resendResponse.text();
    console.log("[send-application-email] Resend status:", resendResponse.status, "body:", resendBody);

    if (!resendResponse.ok) {
      console.error("[send-application-email] Resend API error:", resendBody);
      return new Response(
        JSON.stringify({ success: false, error: `Resend API error: ${resendBody}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(resendBody);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: result.id,
        cvAttached: !!cvAttachment,
        applicationId: insertedRow?.id || null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[send-application-email] uncaught error:", error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
