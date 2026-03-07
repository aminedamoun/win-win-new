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
}
