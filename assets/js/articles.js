const ARTICLES_INDEX = "/content/articles-index.json";

export async function loadArticles() {
  try {
    const res = await fetch(ARTICLES_INDEX);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export function formatDate(isoDate, lang) {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(lang === "sl" ? "sl-SI" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export function getArticleUrl(slug, lang) {
  return lang === "sl"
    ? `article-sl.html?slug=${encodeURIComponent(slug)}`
    : `article.html?slug=${encodeURIComponent(slug)}`;
}
