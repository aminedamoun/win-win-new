export function qs(sel, root = document) {
  const el = root.querySelector(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el;
}

export function setActiveNav(currentPath) {
  const links = document.querySelectorAll("[data-nav]");
  for (const a of links) {
    const href = a.getAttribute("href") || "";
    if (href === currentPath) a.classList.add("active");
  }
}

export function initScrollAnimations() {
  const els = document.querySelectorAll(".fade-up");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
    },
    { threshold: 0.15 }
  );
  for (const el of els) io.observe(el);
}

export function initCookieConsent() {
  const root = document.getElementById("cookie");
  if (!root) return;
  const key = "cookie_consent_v1";
  if (!localStorage.getItem(key)) root.style.display = "block";

  root.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    localStorage.setItem(key, "accepted");
    root.style.display = "none";
  });
  root.querySelector("[data-cookie-reject]")?.addEventListener("click", () => {
    localStorage.setItem(key, "rejected");
    root.style.display = "none";
  });
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function initBurgerMenu() {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

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
