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
};
