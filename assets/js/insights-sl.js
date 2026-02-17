/**
 * insights-sl.js (pure HTML/CSS/JS)
 * - Same behavior as EN: year + scroll reveal
 * - For now: empty state (no posts). Later we will render posts into #insightsGrid.
 */

import { initBurgerMenu } from './ui.js';

let CONTENT = null;

function $(id) { return document.getElementById(id); }

function getLang() {
  const htmlLang = document.documentElement.getAttribute("lang") || "";
  return htmlLang.toLowerCase().startsWith("sl") ? "sl" : "en";
}

async function loadContent() {
  const lang = getLang();
  const path = lang === "sl" ? "/content/sl/insights.json" : "/content/en/insights.json";
  try {
    const response = await fetch(path);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading insights content:', error);
    return null;
  }
}

function renderSeo() {
  if (!CONTENT || !CONTENT.seo) return;

  const titleEl = $("seoSummaryTitle");
  const htmlEl = $("seoHtml");

  if (titleEl && CONTENT.seo.summaryTitle) {
    titleEl.textContent = CONTENT.seo.summaryTitle;
  }

  if (htmlEl && CONTENT.seo.html) {
    htmlEl.innerHTML = CONTENT.seo.html;
  }
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

async function main() {
  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  CONTENT = await loadContent();
  renderSeo();

  setupScrollReveal();
  initBurgerMenu();
}

main();
