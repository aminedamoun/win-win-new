export const CONFIG = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    storageBucket: "cv-uploads",
  },
  contentful: {
    spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID || "ci4qfwsnd4hi",
    accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || "Fh2uedm8rQ5RnOGFQ1yz0m0IClJH0ZjV_x0Q477-gWU",
    environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master",
  },
  // GoHighLevel — paste the Inbound Webhook URL from your GHL workflow trigger.
  // GHL: Automation → Workflows → Add Trigger → "Inbound Webhook" → copy the URL.
  ghl: {
    inboundWebhookUrl: import.meta.env.VITE_GHL_WEBHOOK_URL || "",
  },
  // Meta (Facebook) Pixel — paste your Pixel ID for conversion tracking.
  // Meta Events Manager → Data sources → your pixel → copy the numeric ID.
  meta: {
    pixelId: import.meta.env.VITE_META_PIXEL_ID || "",
  },
};
