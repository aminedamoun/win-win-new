import { getArticles, getArticleBySlug, richTextToHtml } from './contentful-client.js';
import { initPage } from './page-utils.js';
import { LOCAL_ARTICLES } from './local-articles.js';

function $(id) { return document.getElementById(id); }

const lang = "sl";
const locale = "sl";

// Merge locally-authored articles with whatever Contentful returns. Local and
// Contentful posts are deduped by slug (local wins), then sorted newest-first.
// Contentful failures are swallowed so the local articles always render.
async function getAllArticles(loc = locale) {
  let remote = [];
  try { remote = await getArticles(loc); } catch { remote = []; }
  const bySlug = new Map();
  for (const a of remote) if (a && a.slug) bySlug.set(a.slug, a);
  for (const a of LOCAL_ARTICLES) bySlug.set(a.slug, a); // local overrides
  return Array.from(bySlug.values())
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function findLocalArticle(slug) {
  return LOCAL_ARTICLES.find((a) => a.slug === slug) || null;
}

function formatDate(isoDate) {
  if (!isoDate) return "";
  try {
    return new Date(isoDate).toLocaleDateString("sl-SI", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return isoDate; }
}

function getArticleUrl(slug) {
  return `/clanek/?slug=${encodeURIComponent(slug)}`;
}

function renderFeatured(article) {
  const wrap = document.querySelector(".ib-featured__grid");
  if (!wrap || !article) return;

  const date = formatDate(article.date);
  const url = getArticleUrl(article.slug);

  wrap.innerHTML = `
    <div class="ib-featured__img-wrap">
      ${article.image
        ? `<img src="${article.image}" alt="${article.imageAlt || article.title}" class="ib-featured__img" loading="eager" />`
        : `<div class="ib-featured__img ib-featured__img--empty"></div>`
      }
    </div>
    <div class="ib-featured__card">
      <div class="ib-featured__top">
        <span class="ib-cat-badge ib-cat-badge--red">Izpostavljeno</span>
        ${article.category ? `<span class="ib-cat-badge">${article.category}</span>` : ""}
      </div>
      <h2 class="ib-featured__title">${article.title}</h2>
      <p class="ib-featured__desc">${article.description}</p>
      <div class="ib-meta">
        ${article.readTime ? `<span class="ib-meta__item">${article.readTime}</span><span class="ib-meta__dot" aria-hidden="true"></span>` : ""}
        <span class="ib-meta__item">${date}</span>
      </div>
      <a href="${url}" class="ib-btn-primary">Preberi članek <span aria-hidden="true">&#8594;</span></a>
    </div>
  `;
}

function renderCards(articles) {
  const grid = document.querySelector(".ib-cards");
  if (!grid) return;

  const nonFeatured = articles.filter((a) => !a.featured);

  if (nonFeatured.length === 0) {
    grid.innerHTML = `<p class="ib-empty">Kmalu bo več člankov.</p>`;
    return;
  }

  grid.innerHTML = nonFeatured.map((article) => {
    const date = formatDate(article.date);
    const url = getArticleUrl(article.slug);
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
            <a href="${url}" class="ib-card__arrow" aria-label="Preberi članek">&#8594;</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

export async function renderArticleDetail() {
  const slug = new URLSearchParams(window.location.search).get("slug");

  const titleEl = $("articleTitle");
  const metaEl = $("articleMeta");
  const bodyEl = $("articleBody");
  const heroImg = $("articleHeroImg");
  const heroTitle = $("articleHeroTitle");
  const heroCat = $("articleHeroCat");
  const heroMeta = $("articleHeroMeta");

  if (!slug) {
    if (heroTitle) heroTitle.textContent = "Članek ni najden";
    if (titleEl) titleEl.textContent = "Članek ni najden";
    initPage();
    return;
  }

  let article = null;
  try {
    article = await getArticleBySlug(slug, locale);
  } catch { article = null; }

  // Fall back to a locally-authored article when Contentful has no match.
  if (!article) article = findLocalArticle(slug);

  if (!article) {
    if (heroTitle) heroTitle.textContent = "Članek ni najden";
    if (titleEl) titleEl.textContent = "Članek ni najden";
    initPage();
    return;
  }

  const date = formatDate(article.date);
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

  if (bodyEl) {
    const richResult = richTextToHtml(article.body);
    bodyEl.innerHTML = (typeof richResult === "string" && richResult) ? richResult : markdownToHtml(article.body || "");
  }

  initPage();
}

function markdownToHtml(md) {
  const lines = md.split("\n");
  let html = "";
  let inParagraph = false;
  let inList = false;

  const closeParagraph = () => { if (inParagraph) { html += "</p>"; inParagraph = false; } };
  const closeList = () => { if (inList) { html += "</ul>"; inList = false; } };

  for (const raw of lines) {
    const line = raw
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

    if (line.startsWith("### ")) {
      closeParagraph(); closeList();
      html += `<h3>${line.slice(4)}</h3>`;
    } else if (line.startsWith("## ")) {
      closeParagraph(); closeList();
      html += `<h2>${line.slice(3)}</h2>`;
    } else if (line.startsWith("# ")) {
      closeParagraph(); closeList();
      html += `<h1>${line.slice(2)}</h1>`;
    } else if (line.startsWith("- ")) {
      closeParagraph();
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${line.slice(2)}</li>`;
    } else if (line.trim() === "") {
      closeParagraph(); closeList();
    } else {
      closeList();
      if (!inParagraph) { html += "<p>"; inParagraph = true; }
      else html += " ";
      html += line;
    }
  }

  closeParagraph();
  closeList();
  return html;
}

export async function renderHomeBlog() {
  const grid = document.getElementById("blogGrid");
  const empty = document.getElementById("blogEmpty");
  if (!grid) return;

  // Newest 3 published articles (Contentful + local), each linking to its
  // real /clanek/?slug=... detail page.
  const articles = (await getAllArticles())
    .filter((a) => a.published)
    .slice(0, 3);

  if (empty) empty.textContent = "";

  grid.innerHTML = articles.map((article) => {
    const date = formatDate(article.date);
    const url = getArticleUrl(article.slug);
    const description = typeof article.description === "string" ? article.description : "";
    return `
      <a href="${url}" class="blog-card">
        ${article.image
          ? `<img src="${article.image}" alt="${article.imageAlt || article.title}" class="blog-card-image" loading="lazy" />`
          : `<div class="blog-card-image blog-card-image--empty"></div>`
        }
        <div class="blog-card-content">
          ${article.category ? `<span class="blog-card-cat">${article.category}</span>` : ""}
          <h3 class="blog-card-title">${article.title}</h3>
          <p class="blog-card-description">${description}</p>
          <div class="blog-card-meta">
            <span class="blog-card-date">${date}</span>
            <span class="blog-card-arrow" aria-hidden="true">&#8594;</span>
          </div>
        </div>
      </a>
    `;
  }).join("");
}

export async function main() {
  const articles = await getAllArticles();

  const featured = articles.find((a) => a.featured);
  if (featured) renderFeatured(featured);
  renderCards(articles);
  initPage();
}
