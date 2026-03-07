import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { CONFIG } from "./config.js";

const SPACE_ID = CONFIG.contentful.spaceId;
const ACCESS_TOKEN = CONFIG.contentful.accessToken;
const ENVIRONMENT = CONFIG.contentful.environment;

console.log("[Contentful] SPACE_ID prefix:", SPACE_ID ? SPACE_ID.slice(0, 4) : "MISSING");
console.log("[Contentful] ENVIRONMENT:", ENVIRONMENT || "MISSING");
console.log("[Contentful] ACCESS_TOKEN length:", ACCESS_TOKEN ? ACCESS_TOKEN.length : "MISSING");

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

async function fetchEntries(contentType, params = {}) {
  console.log("[Contentful] fetchEntries content_type:", contentType, "params:", params);
  const url = new URL(`${BASE_URL}/entries`);
  url.searchParams.set("content_type", contentType);
  url.searchParams.set("access_token", ACCESS_TOKEN);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[Contentful] fetch failed:", res.status, errText);
    throw new Error(`Contentful fetch failed: ${res.status}`);
  }
  const json = await res.json();
  console.log("[Contentful] response total:", json.total, "items returned:", json.items?.length);
  if (json.items?.length > 0) {
    const first = json.items[0];
    console.log("[Contentful] first entry — id:", first.sys.id, "slug:", first.fields.slug, "title:", first.fields.title, "published:", first.fields.published, "postedDate:", first.fields.postedDate);
  }
  return json;
}

export function richTextToHtml(doc) {
  if (!doc || typeof doc !== "object" || doc.nodeType !== "document") return "";
  try {
    return documentToHtmlString(doc);
  } catch {
    return "";
  }
}

export function contentfulImageUrl(asset, width = 1200) {
  if (!asset?.fields?.file?.url) return "";
  const url = asset.fields.file.url.startsWith("//")
    ? `https:${asset.fields.file.url}`
    : asset.fields.file.url;
  return width ? `${url}?w=${width}&fm=webp&q=80` : url;
}

export async function getJobs(locale = "en-US") {
  console.log("[Contentful] getJobs locale:", locale);
  const json = await fetchEntries("jobListing", {
    locale,
    "fields.published[eq]": true,
    order: "-fields.postedDate",
    limit: 200,
  });

  const assets = {};
  for (const a of json.includes?.Asset || []) {
    assets[a.sys.id] = a;
  }

  const jobs = (json.items || []).map((item) => {
    const f = item.fields;
    const imageAsset = f.image?.sys?.id ? assets[f.image.sys.id] : null;
    return {
      id: item.sys.id,
      slug: f.slug || "",
      title: f.title || "",
      location: f.location || "",
      type: f.type || "",
      department: f.department || "",
      salary: f.salary || "",
      summary: f.summary || "",
      description: richTextToHtml(f.description),
      responsibilities: f.responsibilities || [],
      requirements: f.requirements || [],
      benefits: f.benefits || [],
      featured: f.featured || false,
      published: f.published || false,
      postedDate: f.postedDate || null,
      deadline: f.deadline || null,
      position: typeof f.position === "number" ? f.position : null,
      image: contentfulImageUrl(imageAsset),
      imageAlt: imageAsset?.fields?.description || f.title || "",
    };
  });

  return jobs.sort((a, b) => {
    const aPos = a.position;
    const bPos = b.position;
    if (aPos !== null && bPos !== null) return aPos - bPos;
    if (aPos !== null) return -1;
    if (bPos !== null) return 1;
    return 0;
  });
}

export async function getJobBySlug(slug, locale = "en-US") {
  console.log("[Contentful] getJobBySlug slug:", slug, "locale:", locale);
  const json = await fetchEntries("jobListing", {
    locale,
    "fields.slug[eq]": slug,
    "fields.published[eq]": true,
    limit: 1,
  });

  const assets = {};
  for (const a of json.includes?.Asset || []) {
    assets[a.sys.id] = a;
  }

  const item = json.items?.[0];
  if (!item) return null;

  const f = item.fields;
  const imageAsset = f.image?.sys?.id ? assets[f.image.sys.id] : null;
  return {
    id: item.sys.id,
    slug: f.slug || "",
    title: f.title || "",
    location: f.location || "",
    type: f.type || "",
    department: f.department || "",
    salary: f.salary || "",
    summary: f.summary || "",
    description: richTextToHtml(f.description),
    responsibilities: f.responsibilities || [],
    requirements: f.requirements || [],
    benefits: f.benefits || [],
    featured: f.featured || false,
    published: f.published || false,
    postedDate: f.postedDate || null,
    deadline: f.deadline || null,
    image: contentfulImageUrl(imageAsset),
    imageAlt: imageAsset?.fields?.description || f.title || "",
  };
}

export async function getArticles(locale = "en-US") {
  const json = await fetchEntries("article", {
    locale,
    "fields.published": true,
    order: "-fields.date",
    limit: 200,
  });

  const assets = {};
  for (const a of json.includes?.Asset || []) {
    assets[a.sys.id] = a;
  }

  return (json.items || []).map((item) => {
    const f = item.fields;
    const imageAsset = f.coverImage?.sys?.id ? assets[f.coverImage.sys.id] : null;
    return {
      id: item.sys.id,
      slug: f.slug || "",
      title: f.title || "",
      category: f.category || "",
      description: f.description || "",
      body: f.body || "",
      readTime: f.readTime || "",
      featured: f.featured || false,
      published: f.published || false,
      date: f.date || null,
      image: contentfulImageUrl(imageAsset),
      imageAlt: imageAsset?.fields?.description || f.title || "",
    };
  });
}

export async function getArticleBySlug(slug, locale = "en-US") {
  const json = await fetchEntries("article", {
    locale,
    "fields.slug": slug,
    "fields.published": true,
    limit: 1,
  });

  const assets = {};
  for (const a of json.includes?.Asset || []) {
    assets[a.sys.id] = a;
  }

  const item = json.items?.[0];
  if (!item) return null;

  const f = item.fields;
  const imageAsset = f.coverImage?.sys?.id ? assets[f.coverImage.sys.id] : null;
  return {
    id: item.sys.id,
    slug: f.slug || "",
    title: f.title || "",
    category: f.category || "",
    description: f.description || "",
    body: f.body || "",
    readTime: f.readTime || "",
    featured: f.featured || false,
    published: f.published || false,
    date: f.date || null,
    image: contentfulImageUrl(imageAsset),
    imageAlt: imageAsset?.fields?.description || f.title || "",
  };
}
