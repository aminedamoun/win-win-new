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

export function formatDate(isoDate) {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("sl-SI", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export function getArticleUrl(slug) {
  return `/clanek/?slug=${encodeURIComponent(slug)}`;
}
