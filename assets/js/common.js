import { sanityQuery } from "./sanity.js";
import { initCookieConsent, initScrollAnimations, setActiveNav } from "./ui.js";

export async function renderSiteChrome({ currentPath, langSwitchHref }) {
  setActiveNav(currentPath);

  const langSwitch = document.querySelector("[data-lang-switch]");
  if (langSwitch && langSwitchHref) langSwitch.setAttribute("href", langSwitchHref);

  try {
    const settings = await sanityQuery(`*[_type=="siteSettings"][0]{
      brandName,
      navLinks[]{label, href},
      footerLinks[]{label, href},
      socials[]{label, href}
    }`);
    if (!settings) return;

    document.querySelectorAll("[data-brand]").forEach((b) => {
      b.textContent = settings.brandName || b.textContent;
    });

    const nav = document.querySelector("[data-nav-container]");
    if (nav && Array.isArray(settings.navLinks) && settings.navLinks.length) {
      nav.innerHTML = settings.navLinks.map((l) => `<a data-nav href="${l.href}">${l.label}</a>`).join("");
      setActiveNav(currentPath);
    }

    const footerLinks = document.querySelector("[data-footer-links]");
    if (footerLinks && Array.isArray(settings.footerLinks)) {
      footerLinks.innerHTML = settings.footerLinks.map((l) => `<div><a href="${l.href}">${l.label}</a></div>`).join("");
    }

    const socials = document.querySelector("[data-footer-socials]");
    if (socials && Array.isArray(settings.socials)) {
      socials.innerHTML = settings.socials
        .map((s) => `<div><a target="_blank" rel="noopener" href="${s.href}">${s.label}</a></div>`)
        .join("");
    }
  } catch {
    // keep HTML fallback
  }

  initScrollAnimations();
  initCookieConsent();
}
