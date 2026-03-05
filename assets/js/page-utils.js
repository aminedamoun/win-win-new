const detailPageMap = {
  'job.html': 'job-sl.html',
  'job-sl.html': 'job.html',
  'article.html': 'article-sl.html',
  'article-sl.html': 'article.html',
};

const staticPageMap = {
  'index.html': 'index-sl.html',
  'index-sl.html': 'index.html',
  'about.html': 'about-sl.html',
  'about-sl.html': 'about.html',
  'jobs.html': 'jobs-sl.html',
  'jobs-sl.html': 'jobs.html',
  'job.html': 'job-sl.html',
  'job-sl.html': 'job.html',
  'apply.html': 'apply-sl.html',
  'apply-sl.html': 'apply.html',
  'insights.html': 'insights-sl.html',
  'insights-sl.html': 'insights.html',
  'article.html': 'article-sl.html',
  'article-sl.html': 'article.html',
  'cookies.html': 'cookies-sl.html',
  'cookies-sl.html': 'cookies.html',
  'privacy.html': 'privacy-sl.html',
  'privacy-sl.html': 'privacy.html',
  'terms.html': 'terms-sl.html',
  'terms-sl.html': 'terms.html',
};

const detailFallbackMap = {
  'job.html': 'jobs.html',
  'job-sl.html': 'jobs-sl.html',
  'article.html': 'insights.html',
  'article-sl.html': 'insights-sl.html',
};

export function initLanguageSwitcher() {
  const langSwitch = document.querySelector('.lang-switch');
  if (!langSwitch) return;

  const currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  const targetPage = staticPageMap[currentPage];
  if (!targetPage) return;

  if (detailPageMap[currentPage]) {
    const slug = new URLSearchParams(window.location.search).get('slug');
    if (slug) {
      langSwitch.href = `${targetPage}?slug=${encodeURIComponent(slug)}`;
    } else {
      langSwitch.href = detailFallbackMap[currentPage] || targetPage;
    }
  } else {
    langSwitch.href = targetPage + window.location.search;
  }
}

export function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

export function setupScrollReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-animate]"));
  if (!nodes.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => { for (const e of entries) if (e.isIntersecting) e.target.classList.add("in"); },
    { threshold: 0.12 }
  );
  nodes.forEach((n) => io.observe(n));
}

export function bindCookieBar() {
  const bar = document.getElementById("cookieBar");
  const accept = document.getElementById("cookieAccept");
  const decline = document.getElementById("cookieDecline");
  if (!bar || !accept || !decline) return;
  const key = "ww_cookie_consent";
  if (localStorage.getItem(key)) { bar.style.display = "none"; return; }
  const close = (v) => { localStorage.setItem(key, v); bar.style.display = "none"; };
  accept.addEventListener("click", () => close("accepted"));
  decline.addEventListener("click", () => close("declined"));
}

export function initBurgerMenu() {
  const btn = document.getElementById("burgerBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    menu.classList.toggle("active");
    document.body.style.overflow = menu.classList.contains("active") ? "hidden" : "";
  });
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      btn.classList.remove("active");
      menu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

export function initPage() {
  setYear();
  setupScrollReveal();
  bindCookieBar();
  initBurgerMenu();
  initLanguageSwitcher();
}
