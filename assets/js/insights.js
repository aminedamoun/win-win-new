import { getArticles, getArticleBySlug, richTextToHtml } from './contentful-client.js';
import { initPage } from './page-utils.js';

function $(id) { return document.getElementById(id); }

export function getLang() {
  const lang = document.documentElement.getAttribute("lang") || "";
  return lang.toLowerCase().startsWith("sl") ? "sl" : "en";
}

function contentfulLocale(lang) {
  return lang === "sl" ? "sl" : "en-US";
}

function formatDate(isoDate, lang) {
  if (!isoDate) return "";
  try {
    return new Date(isoDate).toLocaleDateString(lang === "sl" ? "sl-SI" : "en-GB", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return isoDate; }
}

function getArticleUrl(slug, lang) {
  return lang === "sl"
    ? `article-sl.html?slug=${encodeURIComponent(slug)}`
    : `article.html?slug=${encodeURIComponent(slug)}`;
}

function renderFeatured(article, lang) {
  const wrap = document.querySelector(".ib-featured__grid");
  if (!wrap || !article) return;

  const date = formatDate(article.date, lang);
  const url = getArticleUrl(article.slug, lang);
  const featuredLabel = lang === "sl" ? "Izpostavljeno" : "Featured";
  const readLabel = lang === "sl" ? "Preberi članek" : "Read Article";

  wrap.innerHTML = `
    <div class="ib-featured__img-wrap">
      ${article.image
        ? `<img src="${article.image}" alt="${article.imageAlt || article.title}" class="ib-featured__img" loading="eager" />`
        : `<div class="ib-featured__img ib-featured__img--empty"></div>`
      }
    </div>
    <div class="ib-featured__card">
      <div class="ib-featured__top">
        <span class="ib-cat-badge ib-cat-badge--red">${featuredLabel}</span>
        ${article.category ? `<span class="ib-cat-badge">${article.category}</span>` : ""}
      </div>
      <h2 class="ib-featured__title">${article.title}</h2>
      <p class="ib-featured__desc">${article.description}</p>
      <div class="ib-meta">
        ${article.readTime ? `<span class="ib-meta__item">${article.readTime}</span><span class="ib-meta__dot" aria-hidden="true"></span>` : ""}
        <span class="ib-meta__item">${date}</span>
      </div>
      <a href="${url}" class="ib-btn-primary">${readLabel} <span aria-hidden="true">&#8594;</span></a>
    </div>
  `;
}

function renderCards(articles, lang) {
  const grid = document.querySelector(".ib-cards");
  if (!grid) return;

  const nonFeatured = articles.filter((a) => !a.featured);

  if (nonFeatured.length === 0) {
    grid.innerHTML = `<p class="ib-empty">${lang === "sl" ? "Kmalu bo več člankov." : "More articles coming soon."}</p>`;
    return;
  }

  grid.innerHTML = nonFeatured.map((article) => {
    const date = formatDate(article.date, lang);
    const url = getArticleUrl(article.slug, lang);
    return `
      <article class="ib-card">
        <div class="ib-card__img-wrap">
          ${article.image
            ? `<img src="${article.image}" alt="${article.imageAlt || article.title}" class="ib-card__img" loading="lazy" />`
            : `<div class="ib-card__img ib-card__img--empty"></div>`
          }
        </div>
        <div class="ib-card__body">
          ${article.category ? `<span class="ib-cat-badge">${article.category}</span>` : ""}
          <h3 class="ib-card__title">${article.title}</h3>
          <p class="ib-card__desc">${article.description}</p>
          <div class="ib-card__footer">
            <div class="ib-meta">
              ${article.readTime ? `<span class="ib-meta__item">${article.readTime}</span><span class="ib-meta__dot" aria-hidden="true"></span>` : ""}
              <span class="ib-meta__item">${date}</span>
            </div>
            <a href="${url}" class="ib-card__arrow" aria-label="Read article">&#8594;</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

export async function renderArticleDetail() {
  const lang = getLang();
  const locale = contentfulLocale(lang);
  const slug = new URLSearchParams(window.location.search).get("slug");

  const titleEl = $("articleTitle");
  const metaEl = $("articleMeta");
  const bodyEl = $("articleBody");
  const heroImg = $("articleHeroImg");
  const heroTitle = $("articleHeroTitle");
  const heroCat = $("articleHeroCat");
  const heroMeta = $("articleHeroMeta");

  const notFound = lang === "sl" ? "Članek ni najden" : "Article not found";

  if (!slug) {
    if (heroTitle) heroTitle.textContent = notFound;
    if (titleEl) titleEl.textContent = notFound;
    initPage();
    return;
  }

  let article = null;
  try {
    article = await getArticleBySlug(slug, locale);
  } catch { article = null; }

  if (!article) {
    if (heroTitle) heroTitle.textContent = notFound;
    if (titleEl) titleEl.textContent = notFound;
    initPage();
    return;
  }

  const date = formatDate(article.date, lang);
  document.title = `${article.title} — Win Win`;

  if (heroImg && article.image) { heroImg.src = article.image; heroImg.alt = article.imageAlt || article.title; }
  if (heroTitle) heroTitle.textContent = article.title;
  if (heroCat) heroCat.textContent = article.category || "";
  if (heroMeta) heroMeta.textContent = [article.readTime, date].filter(Boolean).join(" · ");
  if (titleEl) titleEl.textContent = article.title;

  if (metaEl) {
    metaEl.innerHTML = [
      article.category ? `<span>${article.category}</span>` : "",
      article.readTime ? `<span style="margin:0 8px;opacity:0.4">·</span><span>${article.readTime}</span>` : "",
      date ? `<span style="margin:0 8px;opacity:0.4">·</span><span>${date}</span>` : "",
    ].join("");
  }

  if (bodyEl) bodyEl.innerHTML = richTextToHtml(article.body) || markdownToHtml(article.body || "");

  initPage();
}

function markdownToHtml(md) {
  const lines = md.split("\n");
  let html = "";
  let inParagraph = false;

  for (const raw of lines) {
    const line = raw
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

    if (line.startsWith("### ")) {
      if (inParagraph) { html += "</p>"; inParagraph = false; }
      html += `<h3>${line.slice(4)}</h3>`;
    } else if (line.startsWith("## ")) {
      if (inParagraph) { html += "</p>"; inParagraph = false; }
      html += `<h2>${line.slice(3)}</h2>`;
    } else if (line.startsWith("# ")) {
      if (inParagraph) { html += "</p>"; inParagraph = false; }
      html += `<h1>${line.slice(2)}</h1>`;
    } else if (line.trim() === "") {
      if (inParagraph) { html += "</p>"; inParagraph = false; }
    } else {
      if (!inParagraph) { html += "<p>"; inParagraph = true; }
      else html += " ";
      html += line;
    }
  }

  if (inParagraph) html += "</p>";
  return html;
}

export async function renderHomeBlog(forceLang) {
  const lang = forceLang || getLang();
  const locale = contentfulLocale(lang);

  const grid = document.getElementById("blogGrid");
  const empty = document.getElementById("blogEmpty");
  if (!grid) return;

  let articles = [];
  try {
    articles = await getArticles(locale);
  } catch { articles = []; }

  const featured = articles
    .filter((a) => a.featured && a.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  if (featured.length === 0) {
    if (empty) empty.textContent = lang === "sl" ? "Kmalu bo več člankov." : "More articles coming soon.";
    return;
  }

  grid.innerHTML = featured.map((article) => {
    const date = formatDate(article.date, lang);
    const url = getArticleUrl(article.slug, lang);
    const readLabel = lang === "sl" ? "Preberi" : "Read";
    return `
      <article class="ib-card">
        <div class="ib-card__img-wrap">
          ${article.image
            ? `<img src="${article.image}" alt="${article.imageAlt || article.title}" class="ib-card__img" loading="lazy" />`
            : `<div class="ib-card__img ib-card__img--empty"></div>`
          }
        </div>
        <div class="ib-card__body">
          ${article.category ? `<span class="ib-cat-badge">${article.category}</span>` : ""}
          <h3 class="ib-card__title">${article.title}</h3>
          <p class="ib-card__desc">${article.description}</p>
          <div class="ib-card__footer">
            <div class="ib-meta">
              ${article.readTime ? `<span class="ib-meta__item">${article.readTime}</span><span class="ib-meta__dot" aria-hidden="true"></span>` : ""}
              <span class="ib-meta__item">${date}</span>
            </div>
            <a href="${url}" class="ib-card__arrow" aria-label="${readLabel} article">&#8594;</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

export async function main(forceLang) {
  const lang = forceLang || getLang();
  const locale = contentfulLocale(lang);

  let articles = [];
  try {
    articles = await getArticles(locale);
  } catch { articles = []; }

  const featured = articles.find((a) => a.featured);
  if (featured) renderFeatured(featured, lang);
  renderCards(articles, lang);
  initPage();
}
