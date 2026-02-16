import { CONFIG } from "./config.js";

function sanityBase() {
  const { projectId, dataset, apiVersion, useCdn } = CONFIG.sanity;
  const host = useCdn ? "https://apicdn.sanity.io" : "https://api.sanity.io";
  return `${host}/v${apiVersion}/data/query/${dataset}`;
}

export async function sanityQuery(groq, params = {}) {
  const url = new URL(sanityBase());
  url.searchParams.set("query", groq);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, String(v));

  const headers = {};
  if (CONFIG.sanity.token) headers.Authorization = `Bearer ${CONFIG.sanity.token}`;

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const json = await res.json();
  return json.result;
}

export function sanityImageUrl(assetRef, width = 1600) {
  if (!assetRef) return "";
  const { projectId, dataset } = CONFIG.sanity;

  const [, id, size, format] = assetRef.split("-");
  const [w, h] = size.split("x");
  const finalW = Math.min(Number(w || width), width);

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${finalW}x${h}.${format}`;
}
