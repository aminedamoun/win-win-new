function $(id) { return document.getElementById(id); }

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function svgIcon(paths) {
  return `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true" focusable="false">
      ${paths}
    </svg>
  `;
}

const ICONS = {
  shoppingBag: svgIcon(`<path d="M6 7h12l1 14H5L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>`),
  megaphone: svgIcon(`<path d="M3 11v2"/><path d="M4 10.5 14 7v10L4 13.5v-3Z"/><path d="M14 9.5 20 7v10l-6-2.5"/>`),
  phone: svgIcon(`<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.2 1.2.5 2.4 1 3.5a2 2 0 0 1-.5 2.1L9.8 11a16 16 0 0 0 3.2 3.2l.7-.7a2 2 0 0 1 2.1-.5c1.1.5 2.3.8 3.5 1A2 2 0 0 1 22 16.9Z"/>`),
  building: svgIcon(`<path d="M3 21V7a2 2 0 0 1 2-2h6v16"/><path d="M13 21V3h6a2 2 0 0 1 2 2v16"/>`),
  graduationCap: svgIcon(`<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>`),
  users: svgIcon(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>`),
  trendUp: svgIcon(`<path d="M3 17l6-6 4 4 7-7"/><path d="M14 8h6v6"/>`),
  settings: svgIcon(`<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>`),
  userCheck: svgIcon(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="m16 11 2 2 4-4"/>`),
  briefcase: svgIcon(`<path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/><path d="M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/>`),
  chart: svgIcon(`<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>`),
  award: svgIcon(`<path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="M9 14.5 7 22l5-2 5 2-2-7.5"/>`),
  toolbox: svgIcon(`<path d="M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/>`),
  mapPin: svgIcon(`<path d="M12 22s7-4.4 7-12a7 7 0 0 0-14 0c0 7.6 7 12 7 12Z"/>`),
  target: svgIcon(`<path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M12 22a10 10 0 1 0-10-10"/>`)
};

async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function renderCards(targetId, items) {
  const root = $(targetId);
  if (!root) return;
  root.innerHTML = (items || []).map(x => `
    <div class="card">
      <div class="card-ic" aria-hidden="true">${ICONS[x.icon] || ICONS.briefcase}</div>
      <h4 class="card-h">${escapeHtml(x.title || "")}</h4>
      <p class="card-p">${escapeHtml(x.description || "")}</p>
    </div>
  `).join("");
}

function renderProcess(steps) {
  const root = $("processGrid");
  if (!root) return;
  root.innerHTML = (steps || []).map(s => `
    <div class="card" style="text-align:center; min-height:185px">
      <div style="font-weight:900; font-size:46px; color: rgba(156,163,175,.18); margin-bottom:10px">${escapeHtml(s.step)}</div>
      <h4 class="card-h" style="font-size:15px">${escapeHtml(s.title)}</h4>
      <p class="card-p">${escapeHtml(s.desc)}</p>
    </div>
  `).join("");
}

function renderFaq(items) {
  const root = $("faqList");
  if (!root) return;
  root.innerHTML = (items || []).map(x => `
    <details class="faq">
      <summary><span>${escapeHtml(x.q)}</span><span class="chev" aria-hidden="true">⌄</span></summary>
      <div class="faq-body">${escapeHtml(x.a)}</div>
    </details>
  `).join("");
}

function bindCookieBar() {
  const bar = $("cookieBar");
  const accept = $("cookieAccept");
  const decline = $("cookieDecline");
  if (!bar || !accept || !decline) return;

  const key = "ww_cookie_consent";
  if (localStorage.getItem(key)) { bar.style.display = "none"; return; }

  const close = (v) => { localStorage.setItem(key, v); bar.style.display = "none"; };
  accept.addEventListener("click", () => close("accepted"));
  decline.addEventListener("click", () => close("declined"));
}

function setupScrollReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-animate]"));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
  }, { threshold: 0.12 });
  nodes.forEach((n) => io.observe(n));
}

function initBurgerMenu() {
  const burgerBtn = $("burgerBtn");
  const mobileMenu = $("mobileMenu");

  if (!burgerBtn || !mobileMenu) return;

  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      burgerBtn.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

function fillText(d) {
  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Hero title is now hardcoded in HTML
  if ($("heroDescription")) $("heroDescription").textContent = d.hero?.description || "";

  if ($("aboutTitle")) $("aboutTitle").textContent = d.about?.title || "";
  if ($("aboutDescription")) $("aboutDescription").textContent = d.about?.description || "";

  const stats = d.about?.stats || [];
  const statIds = ["statDeals", "statLocations", "statTeam", "statYears"];
  statIds.forEach((id, i) => { const el = $(id); if (el) el.textContent = stats[i]?.value ?? ""; });
  const statLabels = document.querySelectorAll(".stat .stat-label");
  statLabels.forEach((el, i) => { if (stats[i]?.label) el.textContent = stats[i].label; });

  if ($("servicesTitle")) $("servicesTitle").textContent = d.services?.title || "";
  if ($("servicesDesc")) $("servicesDesc").textContent = d.services?.description || "";
  if ($("servicesBlock1")) $("servicesBlock1").textContent = d.services?.blocks?.core || "";
  if ($("servicesBlock2")) $("servicesBlock2").textContent = d.services?.blocks?.support || "";
  if ($("servicesBlock3")) $("servicesBlock3").textContent = d.services?.blocks?.market || "";

  if ($("benefitsTitle")) $("benefitsTitle").textContent = d.benefits?.title || "";
  if ($("benefitsDesc")) $("benefitsDesc").textContent = d.benefits?.description || "";

  if ($("joinTitle")) $("joinTitle").textContent = d.join?.title || "";
  if ($("joinDesc")) $("joinDesc").textContent = d.join?.description || "";
  const joinBtn1 = $("joinBtn1");
  if (joinBtn1 && d.join?.btn1?.label) joinBtn1.childNodes[0].textContent = d.join.btn1.label + " ";
  if (joinBtn1 && d.join?.btn1?.href) joinBtn1.setAttribute("href", d.join.btn1.href);
  const joinBtn2 = $("joinBtn2");
  if (joinBtn2 && d.join?.btn2?.label) joinBtn2.textContent = d.join.btn2.label;
  if (joinBtn2 && d.join?.btn2?.href) joinBtn2.setAttribute("href", d.join.btn2.href);

  if ($("ctaTitle")) $("ctaTitle").textContent = d.cta?.title || "";
  if ($("ctaDesc")) $("ctaDesc").textContent = d.cta?.description || "";
  const ctaBtn1 = $("ctaBtn1");
  if (ctaBtn1 && d.cta?.btn1?.label) ctaBtn1.childNodes[0].textContent = d.cta.btn1.label + " ";
  if (ctaBtn1 && d.cta?.btn1?.href) ctaBtn1.setAttribute("href", d.cta.btn1.href);
  const ctaBtn2 = $("ctaBtn2");
  if (ctaBtn2 && d.cta?.btn2?.label) ctaBtn2.textContent = d.cta.btn2.label;
  if (ctaBtn2 && d.cta?.btn2?.href) ctaBtn2.setAttribute("href", d.cta.btn2.href);

  if ($("processTitle")) $("processTitle").textContent = d.process?.title || "";
  if ($("processDesc")) $("processDesc").textContent = d.process?.description || "";
  const processBtn = $("processBtn");
  if (processBtn && d.process?.button?.label) processBtn.childNodes[0].textContent = d.process.button.label + " ";
  if (processBtn && d.process?.button?.href) processBtn.setAttribute("href", d.process.button.href);

  if ($("appTitle")) $("appTitle").textContent = d.app?.title || "";
  if ($("appDesc")) $("appDesc").textContent = d.app?.description || "";
  if ($("blogEmpty")) $("blogEmpty").textContent = d.blog?.empty || "";

  if ($("faqTitle")) $("faqTitle").innerHTML = d.faq?.titleHtml || "";
  if ($("faqDesc")) $("faqDesc").textContent = d.faq?.description || "";
  if ($("faqStill")) $("faqStill").textContent = d.faq?.still || "";
  const faqBtn = $("faqBtn");
  if (faqBtn && d.faq?.button?.label) faqBtn.childNodes[0].textContent = d.faq.button.label + " ";
  if (faqBtn && d.faq?.button?.href) faqBtn.setAttribute("href", d.faq.button.href);

  if ($("seoSummaryTitle")) $("seoSummaryTitle").textContent = d.seo?.summaryTitle || "";
  if ($("seoHtml")) $("seoHtml").innerHTML = d.seo?.html || "";
}

async function main() {
  const data = await loadJson("content/en/home.json");
  fillText(data);
  renderCards("servicesCore", data.services?.core);
  renderCards("servicesSupport", data.services?.support);
  renderCards("servicesMarket", data.services?.market);
  renderCards("benefitsGrid", data.benefits?.items);
  renderProcess(data.process?.steps);
  renderFaq(data.faq?.items);
  bindCookieBar();
  setupScrollReveal();
  initBurgerMenu();
}

document.addEventListener("DOMContentLoaded", () => {
  main().catch((e) => console.error("home.js error:", e));
});
