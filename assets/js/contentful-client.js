const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master";

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

async function fetchEntries(contentType, params = {}) {
  const url = new URL(`${BASE_URL}/entries`);
  url.searchParams.set("content_type", contentType);
  url.searchParams.set("access_token", ACCESS_TOKEN);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Contentful fetch failed: ${res.status}`);
  return res.json();
}

export function contentfulImageUrl(asset, width = 1200) {
  if (!asset?.fields?.file?.url) return "";
  const url = asset.fields.file.url.startsWith("//")
    ? `https:${asset.fields.file.url}`
    : asset.fields.file.url;
  return width ? `${url}?w=${width}&fm=webp&q=80` : url;
}

export async function getJobs(locale = "en-US") {
  const json = await fetchEntries("job", {
    locale,
    "fields.published": true,
    order: "-fields.postedDate",
    limit: 200,
  });

  const assets = {};
  for (const a of json.includes?.Asset || []) {
    assets[a.sys.id] = a;
  }

  return (json.items || []).map((item) => {
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
      description: f.description || "",
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
  });
}

export async function getJobBySlug(slug, locale = "en-US") {
  const json = await fetchEntries("job", {
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
    description: f.description || "",
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
