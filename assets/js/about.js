/**
 * about.js — English About page renderer (pure HTML/CSS/JS)
 * Renders: Hero, Vision/Mission, Values, Culture, Team stats, FAQ
 * Loads content from JSON file in content/en/about.json
 */

import { initBurgerMenu } from './ui.js';

let CONTENT = null;

async function loadContent() {
  try {
    const response = await fetch('/content/en/about.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading content:', error);
    return null;
  }
}

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function setHTML(id, value) {
  const el = $(id);
  if (el) el.innerHTML = value;
}

function setSrc(id, value) {
  const el = $(id);
  if (el) el.src = value;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** Clean SVG icon set */
const ICONS = {
  target: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
      <path d="M12 22a10 10 0 1 0-10-10"/>
      <path d="M22 12A10 10 0 0 0 12 2"/>
      <path d="M12 2v3"/><path d="M2 12h3"/><path d="M12 19v3"/><path d="M19 12h3"/>
    </svg>
  `,
  heart: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M20.8 6.6a5.4 5.4 0 0 0-7.6 0L12 7.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 22l7.6-6.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/>
    </svg>
  `,
  shield: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 2 20 6v6c0 5-3.3 9.4-8 10-4.7-.6-8-5-8-10V6l8-4Z"/>
      <path d="M9.5 12.2 11.2 14l3.6-4"/>
    </svg>
  `,
  handshake: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M7 12l2-2a3 3 0 0 1 4.2 0l.8.8"/>
      <path d="M3 11l4-4 4 4-4 4-4-4Z"/>
      <path d="M21 11l-4-4-4 4 4 4 4-4Z"/>
      <path d="M8.5 15.5l1 1a2.5 2.5 0 0 0 3.5 0l3-3"/>
      <path d="M10 18l.7.7a2 2 0 0 0 2.8 0L15 17"/>
    </svg>
  `,
  message: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>
      <path d="M7 8h10"/><path d="M7 12h7"/>
    </svg>
  `,
  trendUp: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 17l6-6 4 4 7-7"/>
      <path d="M14 8h6v6"/>
    </svg>
  `,
  users: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.9"/>
      <path d="M16 3.1a4 4 0 0 1 0 7.8"/>
    </svg>
  `,
  mapPin: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 22s7-4.4 7-12a7 7 0 0 0-14 0c0 7.6 7 12 7 12Z"/>
      <path d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
    </svg>
  `,
  headset: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 0 1 16 0v6a2 2 0 0 1-2 2h-2"/>
      <path d="M4 12v5a2 2 0 0 0 2 2h2"/>
      <path d="M6 12a6 6 0 0 1 12 0"/>
      <path d="M8 21h8"/>
    </svg>
  `,
  award: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/>
      <path d="M9 14.5 7 22l5-2 5 2-2-7.5"/>
    </svg>
  `,
};

function renderVisionMission() {
  const root = $("aboutVM");
  if (!root || !CONTENT) return;

  const cards = [
    { ...CONTENT.vision, icon: "target" },
    { ...CONTENT.mission, icon: "heart" }
  ];

  root.innerHTML = cards
    .map(
      (c) => `
      <div class="card glass" style="padding:26px;">
        <div class="card-ic" aria-hidden="true" style="margin-bottom:14px;">
          ${ICONS[c.icon] || ICONS.target}
        </div>
        <h3 class="h3" style="margin:0 0 10px;">${escapeHtml(c.title)}</h3>
        <p class="p-muted" style="margin:0;">${escapeHtml(c.text)}</p>
      </div>
    `
    )
    .join("");
}

function renderValues() {
  const root = $("aboutValuesGrid");
  if (!root || !CONTENT || !CONTENT.values) return;

  const iconMap = {
    "Performance Culture": "trendUp",
    "Professional Development": "target",
    "Team Support": "users",
    "Transparent Systems": "shield"
  };

  root.innerHTML = CONTENT.values
    .map(
      (v) => `
      <div class="card glass" style="overflow:hidden;">
        <div style="position:relative; height:180px;">
          <img src="${escapeHtml(v.image)}" alt="${escapeHtml(v.title)}" loading="lazy"
               style="width:100%;height:100%;object-fit:cover;">
          <div style="position:absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,.8), transparent);"></div>
          <div class="card-ic" aria-hidden="true"
               style="position:absolute; left:16px; bottom:16px; width:44px; height:44px; border-radius:12px;
                      background: rgba(239,68,68,.16); display:flex; align-items:center; justify-content:center;">
            ${ICONS[iconMap[v.title]] || ICONS.award}
          </div>
        </div>
        <div style="padding:18px;">
          <h4 class="card-h">${escapeHtml(v.title)}</h4>
          <p class="card-p">${escapeHtml(v.description)}</p>
        </div>
      </div>
    `
    )
    .join("");
}

function renderCulture() {
  const root = $("aboutCultureGrid");
  if (!root || !CONTENT || !CONTENT.culture) return;

  root.innerHTML = CONTENT.culture.highlights
    .map(
      (text) => `
      <div class="card glass" style="display:flex; gap:12px; align-items:flex-start; padding:18px;">
        <span aria-hidden="true"
              style="width:18px;height:18px;border-radius:999px;background:rgba(239,68,68,.18);
                     display:inline-flex;align-items:center;justify-content:center;margin-top:2px;">
          <span style="width:6px;height:6px;border-radius:999px;background:rgba(239,68,68,1);display:block;"></span>
        </span>
        <div class="card-p" style="margin:0;">${escapeHtml(text)}</div>
      </div>
    `
    )
    .join("");
}

function renderTeam() {
  const root = $("aboutTeamStats");
  if (!root || !CONTENT || !CONTENT.stats) return;

  const iconList = ["users", "award", "trendUp", "target"];

  root.innerHTML = CONTENT.stats
    .map(
      (s, idx) => `
      <div class="card glass" style="text-align:center; padding:22px;">
        <div class="card-ic" aria-hidden="true" style="margin:0 auto 12px;">
          ${ICONS[iconList[idx % iconList.length]]}
        </div>
        <div style="font-weight:900; font-size:22px; margin-bottom:6px;">${escapeHtml(s.number)}</div>
        <div class="p-muted" style="font-weight:700; margin:0;">${escapeHtml(s.label)}</div>
      </div>
    `
    )
    .join("");
}

function renderFaq() {
  const root = $("faqList");
  if (!root || !CONTENT || !CONTENT.faq) return;

  root.innerHTML = CONTENT.faq
    .map(
      (x) => `
      <details class="faq">
        <summary>
          <span>${escapeHtml(x.question)}</span>
          <span class="chev" aria-hidden="true">⌄</span>
        </summary>
        <div class="faq-body">${escapeHtml(x.answer)}</div>
      </details>
    `
    )
    .join("");
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
  if (!nodes.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
    },
    { threshold: 0.12 }
  );
  nodes.forEach((n) => io.observe(n));
}

function fillText() {
  if (!CONTENT) return;

  setText("year", String(new Date().getFullYear()));

  if (CONTENT.hero) {
    setSrc("aboutHeroImg", CONTENT.hero.backgroundImage);
    setText("aboutHeroTitle", CONTENT.hero.title);
    setText("aboutHeroDesc", CONTENT.hero.subtitle);
  }

  setText("aboutValuesTitle", "Our Core Values");
  setText("aboutValuesDesc", "These principles guide everything we do");

  if (CONTENT.culture) {
    setText("aboutCultureTitle", CONTENT.culture.title);
    setText("aboutCultureDesc", CONTENT.culture.description);
  }

  setText("aboutTeamTitle", "Our Impact");
  setText("aboutTeamDesc", "Measurable results that demonstrate our commitment");

  setHTML("faqTitle", 'Frequently Asked <span class="text-red">Questions</span>');
  setText("faqDesc", "Everything you need to know about Win-Win");
  setText("faqStill", "Still have questions?");

  const btn = $("faqBtn");
  if (btn) {
    btn.innerHTML = `Get in Touch <span aria-hidden="true">→</span>`;
  }
}

async function main() {
  CONTENT = await loadContent();
  if (!CONTENT) {
    console.error('Failed to load content');
    return;
  }

  fillText();
  renderVisionMission();
  renderValues();
  renderCulture();
  renderTeam();
  renderFaq();
  renderSeo();
  setupScrollReveal();
  initBurgerMenu();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
