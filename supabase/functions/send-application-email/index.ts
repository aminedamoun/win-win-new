import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ApplicationEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  preferredInterviewTime?: string;
  message?: string;
  cvUrl: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const applicationData: ApplicationEmailData = await req.json();

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nova prijava za delovno mesto</h2>
            <h3>${applicationData.jobTitle}</h3>
          </div>

          <div class="section">
            <p><span class="label">Ime in priimek:</span> <span class="value">${applicationData.firstName} ${applicationData.lastName}</span></p>
            <p><span class="label">E-pošta:</span> <span class="value">${applicationData.email}</span></p>
            <p><span class="label">Telefon:</span> <span class="value">${applicationData.phone}</span></p>
          </div>

          ${applicationData.preferredInterviewTime ? `
          <div class="section">
            <p><span class="label">Želeni čas razgovora:</span> <span class="value">${applicationData.preferredInterviewTime}</span></p>
          </div>
          ` : ''}

          ${applicationData.message ? `
          <div class="section">
            <p class="label">Sporočilo:</p>
            <p>${applicationData.message}</p>
          </div>
          ` : ''}

          <div class="section">
            <p><span class="label">Življenjepis:</span> <span class="value"><a href="${applicationData.cvUrl}">Prenesi CV</a></span></p>
          </div>

          <div class="section" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #888; font-size: 12px;">To sporočilo je bilo poslano preko spletne strani Win-Win.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Win-Win Prijave <noreply@win-win.si>",
        to: ["office@win-win.si"],
        subject: `Nova prijava: ${applicationData.jobTitle} - ${applicationData.firstName} ${applicationData.lastName}`,
        html: emailContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Resend API error: ${errorText}`);
    }

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
