import { initBurgerMenu } from './ui.js';
import { formatDate, getArticleUrl } from './articles.js';

let CONTENT = null;
let ARTICLES = [];

function $(id) { return document.getElementById(id); }

function getLang() {
  const htmlLang = document.documentElement.getAttribute("lang") || "";
  return htmlLang.toLowerCase().startsWith("sl") ? "sl" : "en";
}

async function loadContent() {
  const lang = getLang();
  const path = lang === "sl" ? "/content/sl/insights.json" : "/content/en/insights.json";
  try {
    const res = await fetch(path);
    return await res.json();
  } catch {
    return null;
  }
}

async function loadArticles() {
  try {
    const indexRes = await fetch("/content/articles-index.json");
    if (!indexRes.ok) return [];
    const slugs = await indexRes.json();
    const articles = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const res = await fetch(`/content/articles/${slug}.json`);
          if (!res.ok) return null;
          const data = await res.json();
          return { slug, ...data };
        } catch {
          return null;
        }
      })
    );
    return articles.filter((a) => a && a.settings && a.settings.published);
  } catch {
    return [];
  }
}

function renderSeo() {
  if (!CONTENT || !CONTENT.seo) return;
  const titleEl = $("seoSummaryTitle");
  const htmlEl = $("seoHtml");
  if (titleEl && CONTENT.seo.summaryTitle) titleEl.textContent = CONTENT.seo.summaryTitle;
  if (htmlEl && CONTENT.seo.html) htmlEl.innerHTML = CONTENT.seo.html;
}

function renderFeatured(article, lang) {
  const wrap = document.querySelector(".ib-featured__grid");
  if (!wrap || !article) return;

  const content = article[lang] || article.en;
  const date = formatDate(article.settings.date, lang);
  const url = getArticleUrl(article.slug, lang);
  const featuredLabel = lang === "sl" ? "Izpostavljeno" : "Featured";
  const readLabel = lang === "sl" ? "Preberi članek" : "Read Article";

  wrap.innerHTML = `
    <div class="ib-featured__img-wrap">
      <img
        src="${content.image || ''}"
        alt="${content.imageAlt || content.title}"
        class="ib-featured__img"
        loading="eager"
      />
    </div>
    <div class="ib-featured__card">
      <div class="ib-featured__top">
        <span class="ib-cat-badge ib-cat-badge--red">${featuredLabel}</span>
        <span class="ib-cat-badge">${content.category || 'Insights'}</span>
      </div>
      <h2 class="ib-featured__title">${content.title}</h2>
      <p class="ib-featured__desc">${content.description}</p>
      <div class="ib-meta">
        <span class="ib-meta__item">${content.readTime}</span>
        <span class="ib-meta__dot" aria-hidden="true"></span>
        <span class="ib-meta__item">${date}</span>
      </div>
      <a href="${url}" class="ib-btn-primary">${readLabel} <span aria-hidden="true">&#8594;</span></a>
    </div>
  `;
}

function renderCards(articles, lang) {
  const grid = document.querySelector(".ib-cards");
  if (!grid) return;

  const nonFeatured = articles.filter((a) => !a.settings.featured);

  if (nonFeatured.length === 0) {
    grid.innerHTML = `<p class="ib-empty">${lang === "sl" ? "Kmalu bo več člankov." : "More articles coming soon."}</p>`;
    return;
  }

  grid.innerHTML = nonFeatured.map((article) => {
    const content = article[lang] || article.en;
    const date = formatDate(article.settings.date, lang);
    const url = getArticleUrl(article.slug, lang);
    return `
      <article class="ib-card">
        <div class="ib-card__img-wrap">
          <img
            src="${content.image || ''}"
            alt="${content.imageAlt || content.title}"
            class="ib-card__img"
            loading="lazy"
          />
        </div>
        <div class="ib-card__body">
          <span class="ib-cat-badge">${content.category || 'Insights'}</span>
          <h3 class="ib-card__title">${content.title}</h3>
          <p class="ib-card__desc">${content.description}</p>
          <div class="ib-card__footer">
            <div class="ib-meta">
              <span class="ib-meta__item">${content.readTime}</span>
              <span class="ib-meta__dot" aria-hidden="true"></span>
              <span class="ib-meta__item">${date}</span>
            </div>
            <a href="${url}" class="ib-card__arrow" aria-label="Read article">&#8594;</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function setupScrollReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-animate]"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
    },
    { threshold: 0.12 }
  );
  nodes.forEach((n) => io.observe(n));
}

export async function renderArticleDetail() {
  const lang = getLang();
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const titleEl = $("articleTitle");
  const metaEl = $("articleMeta");
  const bodyEl = $("articleBody");

  if (!slug) {
    if (titleEl) titleEl.textContent = lang === "sl" ? "Članek ni najden" : "Article not found";
    return;
  }

  try {
    const res = await fetch(`/content/articles/${slug}.json`);
    if (!res.ok) throw new Error("Not found");
    const article = await res.json();
    const content = article[lang] || article.en;
    const date = formatDate(article.settings.date, lang);

    document.title = `${content.title} — Win Win`;

    if (titleEl) titleEl.textContent = content.title;

    if (metaEl) {
      metaEl.innerHTML = `
        <span>${content.category || 'Insights'}</span>
        <span style="margin:0 8px;opacity:0.4">·</span>
        <span>${content.readTime}</span>
        <span style="margin:0 8px;opacity:0.4">·</span>
        <span>${date}</span>
      `;
    }

    if (bodyEl && content.body) {
      bodyEl.innerHTML = markdownToHtml(content.body);
    }

    const heroImg = document.getElementById("articleHeroImg");
    if (heroImg && content.image) {
      heroImg.src = content.image;
      heroImg.alt = content.imageAlt || content.title;
    }

    const heroTitle = document.getElementById("articleHeroTitle");
    if (heroTitle) heroTitle.textContent = content.title;

    const heroCat = document.getElementById("articleHeroCat");
    if (heroCat) heroCat.textContent = content.category || 'Insights';

    const heroMeta = document.getElementById("articleHeroMeta");
    if (heroMeta) heroMeta.textContent = `${content.readTime} · ${date}`;

  } catch {
    if (titleEl) titleEl.textContent = lang === "sl" ? "Članek ni najden" : "Article not found";
  }
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

async function main() {
  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const lang = getLang();

  [CONTENT, ARTICLES] = await Promise.all([loadContent(), loadArticles()]);

  renderSeo();

  const featured = ARTICLES.find((a) => a.settings.featured);
  if (featured) renderFeatured(featured, lang);

  renderCards(ARTICLES, lang);

  setupScrollReveal();
  initBurgerMenu();
}

main();
