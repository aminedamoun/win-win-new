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

  root.innerHTML = (items || []).map(x => {
    const iconKey = x.icon || x.iconKey; // ✅ support both
    return `
      <div class="card">
        <div class="card-ic" aria-hidden="true">${ICONS[iconKey] || ICONS.briefcase}</div>
        <h4 class="card-h">${escapeHtml(x.title || "")}</h4>
        <p class="card-p">${escapeHtml(x.description || "")}</p>
      </div>
    `;
  }).join("");
}

function renderProcess(steps) {
  const root = $("processGrid");
  if (!root) return;

  root.innerHTML = (steps || []).map(s => `
    <div class="card" style="text-align:center; min-height:185px">
      <div style="font-weight:900; font-size:46px; color: rgba(156,163,175,.18); margin-bottom:10px">${escapeHtml(s.step || "")}</div>
      <h4 class="card-h" style="font-size:15px">${escapeHtml(s.title || "")}</h4>
      <p class="card-p">${escapeHtml(s.desc || s.description || "")}</p>
    </div>
  `).join("");
}

function renderFaq(items) {
  const root = $("faqList");
  if (!root) return;

  root.innerHTML = (items || []).map(x => `
    <details class="faq">
      <summary><span>${escapeHtml(x.q || "")}</span><span class="chev" aria-hidden="true">⌄</span></summary>
      <div class="faq-body">${escapeHtml(x.a || "")}</div>
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

function setupScrollReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-animate]"));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
  }, { threshold: 0.12 });
  nodes.forEach((n) => io.observe(n));
}

function setLink(el, label, href, addArrowSpace = false) {
  if (!el) return;
  if (label != null) {
    // some buttons are like: <a><span>TEXT</span><span>→</span></a>
    if (el.childNodes && el.childNodes.length) {
      el.childNodes[0].textContent = addArrowSpace ? (label + " ") : label;
    } else {
      el.textContent = label;
    }
  }
  if (href) el.setAttribute("href", href);
}

function fillText(d) {
  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ✅ HERO
  if ($("heroTitle")) $("heroTitle").textContent = d.hero?.titleLine1 || "";
  if ($("heroSubtitle")) $("heroSubtitle").textContent = d.hero?.titleLine2 || "";
  if ($("heroAccent")) $("heroAccent").textContent = "";
  if ($("heroDescription")) $("heroDescription").textContent = d.hero?.description || "";

  setLink($("heroBtn1"), d.hero?.primaryCta?.label, d.hero?.primaryCta?.href, true);
  // heroBtn2 may not have arrow span, so normal
  if ($("heroBtn2")) {
    $("heroBtn2").textContent = d.hero?.secondaryCta?.label || "";
    if (d.hero?.secondaryCta?.href) $("heroBtn2").setAttribute("href", d.hero.secondaryCta.href);
  }

  // ✅ ABOUT
  if ($("aboutTitle")) $("aboutTitle").textContent = d.about?.title || "";
  if ($("aboutDescription")) $("aboutDescription").textContent = d.about?.description || "";

  // ✅ STATS (robust: works with your HTML even if IDs missing)
  // Expecting d.about.stats = [{value,label}, ...]
  const stats = d.about?.stats || [];
  const statBoxes = document.querySelectorAll(".stat");
  statBoxes.forEach((box, i) => {
    const valueEl = box.querySelector(".stat-value") || box.querySelector(".value");
    const labelEl = box.querySelector(".stat-label") || box.querySelector(".label");
    if (stats[i]?.value != null && valueEl) valueEl.textContent = String(stats[i].value);
    if (stats[i]?.label != null && labelEl) labelEl.textContent = String(stats[i].label);
  });

  // ✅ SERVICES
  if ($("servicesTitle")) $("servicesTitle").textContent = d.services?.title || "";
  if ($("servicesDesc")) $("servicesDesc").textContent = d.services?.description || "";
  if ($("servicesBlock1")) $("servicesBlock1").textContent = d.services?.blocks?.core || "";
  if ($("servicesBlock2")) $("servicesBlock2").textContent = d.services?.blocks?.support || "";
  if ($("servicesBlock3")) $("servicesBlock3").textContent = d.services?.blocks?.market || "";

  // ✅ BENEFITS
  if ($("benefitsTitle")) $("benefitsTitle").textContent = d.benefits?.title || "";
  if ($("benefitsDesc")) $("benefitsDesc").textContent = d.benefits?.description || "";

  // ✅ JOIN (your JSON has strings btn1/btn2, not objects)
  if ($("joinTitle")) $("joinTitle").textContent = d.join?.title || "";
  if ($("joinDesc")) $("joinDesc").textContent = d.join?.description || "";
  if ($("joinBtn1")) $("joinBtn1").childNodes[0].textContent = (d.join?.btn1 || "") + " ";
  if ($("joinBtn2")) $("joinBtn2").textContent = d.join?.btn2 || "";

  // ✅ CTA
  if ($("ctaTitle")) $("ctaTitle").textContent = d.cta?.title || "";
  if ($("ctaDesc")) $("ctaDesc").textContent = d.cta?.description || "";
  if ($("ctaBtn1")) $("ctaBtn1").childNodes[0].textContent = (d.cta?.btn1 || "") + " ";
  if ($("ctaBtn2")) $("ctaBtn2").textContent = d.cta?.btn2 || "";

  // ✅ PROCESS
  if ($("processTitle")) $("processTitle").textContent = d.process?.title || "";
  if ($("processDesc")) $("processDesc").textContent = d.process?.description || "";
  if ($("processBtn")) $("processBtn").childNodes[0].textContent = (d.process?.button || "") + " ";

  // ✅ APP
  if ($("appTitle")) $("appTitle").textContent = d.app?.title || "";
  if ($("appDesc")) $("appDesc").textContent = d.app?.description || "";

  // ✅ FAQ
  if ($("faqTitle")) $("faqTitle").innerHTML = d.faq?.titleHtml || "";
  if ($("faqDesc")) $("faqDesc").textContent = d.faq?.description || "";
  if ($("faqStill")) $("faqStill").textContent = d.faq?.still || "";
  if ($("faqBtn")) $("faqBtn").childNodes[0].textContent = (d.faq?.button || "") + " ";

  // ✅ BLOG
  if ($("blogEmpty")) $("blogEmpty").textContent = d.blog?.empty || "";

  // ✅ SEO
  if ($("seoSummaryTitle")) $("seoSummaryTitle").textContent = d.seo?.summaryTitle || "";
  if ($("seoHtml")) $("seoHtml").innerHTML = d.seo?.html || "";
}

async function main() {
  const data = await loadJson("content/sl/home.json");
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
  main().catch((e) => console.error("home-sl.js error:", e));
});
