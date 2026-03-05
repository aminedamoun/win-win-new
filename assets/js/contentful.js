const SPACE_ID = "";
const ACCESS_TOKEN = "";
const ENVIRONMENT = "master";
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

async function fetchEntries(contentType, params = {}) {
  const query = new URLSearchParams({
    access_token: ACCESS_TOKEN,
    content_type: contentType,
    ...params,
  });
  const res = await fetch(`${BASE_URL}/entries?${query}`);
  if (!res.ok) throw new Error(`Contentful error: ${res.status}`);
  return res.json();
}

export async function getJobs() {
  const data = await fetchEntries("job", { "fields.active": true });
  return (data.items || []).map((item) => {
    const f = item.fields;
    return {
      id: f.slug,
      slug: f.slug,
      title: { en: f.titleEn || "", sl: f.titleSl || "" },
      location: { en: f.locationEn || "", sl: f.locationSl || "" },
      type: { en: f.typeEn || "", sl: f.typeSl || "" },
      salary: { en: f.salaryEn || "", sl: f.salarySl || "" },
      summary: { en: f.summaryEn || "", sl: f.summarySl || "" },
      bodyHtml: { en: f.bodyHtmlEn || "", sl: f.bodyHtmlSl || "" },
      requirements: { en: f.requirementsEn || [], sl: f.requirementsSl || [] },
      responsibilities: { en: f.responsibilitiesEn || [], sl: f.responsibilitiesSl || [] },
      benefits: { en: f.benefitsEn || [], sl: f.benefitsSl || [] },
    };
  });
}

export async function getArticles() {
  const data = await fetchEntries("article", { "fields.published": true, order: "-fields.date" });
  return (data.items || []).map((item) => {
    const f = item.fields;
    return {
      slug: f.slug,
      settings: {
        published: f.published || false,
        featured: f.featured || false,
        date: f.date || "",
      },
      en: {
        title: f.titleEn || "",
        description: f.descriptionEn || "",
        category: f.categoryEn || "Insights",
        readTime: f.readTimeEn || "",
        image: f.imageEn?.fields?.file?.url ? `https:${f.imageEn.fields.file.url}` : "",
        imageAlt: f.imageAltEn || "",
        body: f.bodyEn || "",
      },
      sl: {
        title: f.titleSl || f.titleEn || "",
        description: f.descriptionSl || f.descriptionEn || "",
        category: f.categorySl || f.categoryEn || "Vpogledi",
        readTime: f.readTimeSl || f.readTimeEn || "",
        image: f.imageSl?.fields?.file?.url ? `https:${f.imageSl.fields.file.url}` : (f.imageEn?.fields?.file?.url ? `https:${f.imageEn.fields.file.url}` : ""),
        imageAlt: f.imageAltSl || f.imageAltEn || "",
        body: f.bodySl || f.bodyEn || "",
      },
    };
  });
}

export async function getArticleBySlug(slug) {
  const data = await fetchEntries("article", { "fields.slug": slug, limit: 1 });
  const item = data.items && data.items[0];
  if (!item) return null;
  const f = item.fields;
  return {
    slug: f.slug,
    settings: {
      published: f.published || false,
      featured: f.featured || false,
      date: f.date || "",
    },
    en: {
      title: f.titleEn || "",
      description: f.descriptionEn || "",
      category: f.categoryEn || "Insights",
      readTime: f.readTimeEn || "",
      image: f.imageEn?.fields?.file?.url ? `https:${f.imageEn.fields.file.url}` : "",
      imageAlt: f.imageAltEn || "",
      body: f.bodyEn || "",
    },
    sl: {
      title: f.titleSl || f.titleEn || "",
      description: f.descriptionSl || f.descriptionEn || "",
      category: f.categorySl || f.categoryEn || "Vpogledi",
      readTime: f.readTimeSl || f.readTimeEn || "",
      image: f.imageSl?.fields?.file?.url ? `https:${f.imageSl.fields.file.url}` : (f.imageEn?.fields?.file?.url ? `https:${f.imageEn.fields.file.url}` : ""),
      imageAlt: f.imageAltSl || f.imageAltEn || "",
      body: f.bodySl || f.bodyEn || "",
    },
  };
}
