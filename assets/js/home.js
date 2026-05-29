import { renderHomeBlog } from './insights.js';
import { initPage } from './page-utils.js';

// CRM hook for the homepage "Pokliči me nazaj" contact form.
// Empty by default = JS shows the success state but no backend is hit.
// Drop an n8n webhook URL here to wire it up. Payload is tagged with
// `webhookName` so the workflow can route by form identity.
const CALLBACK_WEBHOOK_URL = "https://n8n.dkrivec.com/webhook/39d461c4-d029-4cfd-b965-060de8749187";
const CALLBACK_WEBHOOK_NAME = "Webhook for the WinWin Contact form - submit";

function initVideoEmbed() {
  const frame = document.getElementById("videoFrame");
  if (!frame) return;
  const ytId = frame.dataset.ytId || "";
  if (!ytId) return;

  const play = () => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = "Win-Win predstavitveni video";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.setAttribute("allowfullscreen", "");
    frame.innerHTML = "";
    frame.appendChild(iframe);
    frame.classList.add("is-playing");
  };

  frame.addEventListener("click", play);
  // Hero "Poglej naš video" link also jumps + plays
  const heroBtn = document.getElementById("heroBtn2");
  if (heroBtn && heroBtn.getAttribute("href") === "#video") {
    heroBtn.addEventListener("click", (e) => {
      // let the anchor jump first, then start playback after scroll
      setTimeout(play, 600);
    });
  }
}

// Win-Win office + presence locations across Slovenia.
// `openPositions` is the count of active vacancies in that region (hardcoded for now —
// can later be wired to Contentful by filtering jobs.location).
const WW_LOCATIONS = [
  { name: "Trzin",         role: "Sedež & HQ",          people: 8, openPositions: 3, lat: 46.131, lng: 14.555, hq: true },
  { name: "Kranj",         role: "Pisarna",             people: 5, openPositions: 2, lat: 46.238, lng: 14.355 },
  { name: "Ljubljana",     role: "Promocijska prodaja", people: 6, openPositions: 4, lat: 46.056, lng: 14.506 },
  { name: "Maribor",       role: "Terenska ekipa",      people: 3, openPositions: 2, lat: 46.554, lng: 15.645 },
  { name: "Celje",         role: "Terenska ekipa",      people: 2, openPositions: 1, lat: 46.232, lng: 15.267 },
  { name: "Novo mesto",    role: "Terenska prodaja",    people: 0, openPositions: 1, faint: true, lat: 45.804, lng: 15.169 },
  { name: "Koper",         role: "Terenska prodaja",    people: 0, openPositions: 1, faint: true, lat: 45.546, lng: 13.730 },
  { name: "Murska Sobota", role: "Terenska prodaja",    people: 0, openPositions: 1, faint: true, lat: 46.657, lng: 16.166 },
];

// Classic teardrop map pin. Anchor is at the bottom tip.
function pinSvg(variant) {
  const fill = variant === "hq" ? "#f59e0b" : "#dc2626";
  const dot  = variant === "hq" ? "#fff" : "#fff";
  return `
    <svg class="ww-pin-svg" viewBox="0 0 32 44" width="32" height="44" aria-hidden="true">
      <defs>
        <filter id="pinShadow" x="-30%" y="-10%" width="160%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path filter="url(#pinShadow)" d="M16 0C7.16 0 0 7.16 0 16c0 11 16 28 16 28s16-17 16-28C32 7.16 24.84 0 16 0z" fill="${fill}"/>
      <circle cx="16" cy="16" r="6" fill="${dot}"/>
    </svg>`;
}

function initSloveniaMap() {
  const el = document.getElementById("slMap");
  if (!el) return;

  if (typeof window.L === "undefined") {
    setTimeout(initSloveniaMap, 120);
    return;
  }
  const L = window.L;

  const slBounds = L.latLngBounds([45.35, 13.30], [46.95, 16.70]);

  const map = L.map(el, {
    center: [46.12, 14.82],
    zoom: 8,
    minZoom: 7,
    maxZoom: 12,
    zoomControl: true,
    scrollWheelZoom: false,
    maxBounds: slBounds.pad(0.25),
    maxBoundsViscosity: 0.85,
  });
  // Extra top padding so the popups over Maribor / Murska Sobota don't
  // need to auto-pan the map (which moves the marker out from under the cursor).
  map.fitBounds(slBounds, { padding: [80, 30] });

  // CartoDB Voyager — clean LIGHT basemap with subtle color.
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  const makePin = (variant, size = 36) => L.divIcon({
    className: `ww-pin-marker${variant ? ` ww-pin-marker--${variant}` : ""}`,
    html: `<div class="ww-pin-pulse"></div>${pinSvg(variant)}`,
    iconSize: [size, size * 1.375],
    iconAnchor: [size / 2, size * 1.375],
    popupAnchor: [0, -size * 1.2],
  });

  const hqPin    = makePin("hq", 42);
  const officePin = makePin(null, 36);
  const fieldPin  = makePin("faint", 28);

  // Shared close-timer state so moving between marker and popup never
  // races itself: any hover anywhere on the marker OR its open popup
  // cancels the pending close. We give a 450ms grace window between
  // mouseout and actual close, which comfortably covers the brief gap
  // when the cursor crosses from the marker tip into the popup body.
  WW_LOCATIONS.forEach((loc) => {
    const icon = loc.hq ? hqPin : loc.faint ? fieldPin : officePin;
    const marker = L.marker([loc.lat, loc.lng], { icon, riseOnHover: true }).addTo(map);

    const employees = loc.people > 0
      ? `<div class="ww-pop-stat"><span class="ww-pop-stat-num">${loc.people}</span><span class="ww-pop-stat-label">sodelavcev</span></div>`
      : `<div class="ww-pop-stat"><span class="ww-pop-stat-num is-muted">—</span><span class="ww-pop-stat-label">terenska ekipa</span></div>`;
    const positions = loc.openPositions > 0
      ? `<div class="ww-pop-stat is-accent"><span class="ww-pop-stat-num">${loc.openPositions}</span><span class="ww-pop-stat-label">odprtih mest</span></div>`
      : `<div class="ww-pop-stat"><span class="ww-pop-stat-num is-muted">0</span><span class="ww-pop-stat-label">odprtih mest</span></div>`;

    const html = `
      <div class="ww-pop">
        <p class="ww-pop-name">${loc.name}${loc.hq ? " · HQ" : ""}</p>
        <p class="ww-pop-role">${loc.role}</p>
        <div class="ww-pop-stats">${employees}${positions}</div>
        ${loc.openPositions > 0 ? '<a class="ww-pop-cta" href="/zaposlitve/">Razišči pozicije →</a>' : ""}
      </div>`;
    marker.bindPopup(html, {
      className: "ww-popup",
      offset: [0, 0],
      closeButton: false,
      // autoPan moves the marker when a top-pin popup opens, which makes
      // the cursor "fall off" the marker and the popup immediately closes
      // again. Keep the map still — we provide enough initial padding
      // above the northernmost markers to fit the popup.
      autoPan: false,
    });

    let closeTimer = null;
    const cancelClose = () => { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } };
    const scheduleClose = () => { cancelClose(); closeTimer = setTimeout(() => marker.closePopup(), 600); };

    marker.on("mouseover", () => { cancelClose(); marker.openPopup(); });
    marker.on("mouseout",  scheduleClose);
    marker.on("click",     () => { cancelClose(); marker.openPopup(); });

    marker.on("popupopen", (e) => {
      const wrapper = e.popup.getElement();
      if (!wrapper) return;
      // Use the whole popup container so the .leaflet-popup-tip is also a hover zone.
      wrapper.addEventListener("mouseenter", cancelClose);
      wrapper.addEventListener("mouseleave", scheduleClose);
    });
  });
}

function initCallbackForm() {
  const form = document.getElementById("callbackForm");
  if (!form) return;
  const btn = document.getElementById("cbSubmit");
  const ok = document.getElementById("cbSuccess");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ime = document.getElementById("cbName").value.trim();
    const telefon = document.getElementById("cbPhone").value.trim();
    const email = document.getElementById("cbEmail").value.trim();

    if (!ime || !telefon) {
      [["cbName", ime], ["cbPhone", telefon]].forEach(([id, v]) => {
        const el = document.getElementById(id);
        if (el && !v) {
          el.style.borderColor = "#ef4444";
          el.addEventListener("input", () => (el.style.borderColor = ""), { once: true });
        }
      });
      return;
    }

    if (btn) btn.disabled = true;

    const payload = {
      formType: "callback",
      webhookName: CALLBACK_WEBHOOK_NAME,
      ime,
      telefon,
      email,
      requestedAt: new Date().toISOString(),
      source: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Fire-and-forget if a webhook URL is configured. Failure must not block the user.
    if (CALLBACK_WEBHOOK_URL) {
      fetch(CALLBACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.warn("Callback webhook failed:", err));
    } else {
      console.info("[callback] no webhook configured — payload would be:", payload);
    }

    if (ok) ok.classList.add("is-open");
    form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  initPage();
  initVideoEmbed();
  initCallbackForm();
  initSloveniaMap();
  try {
    await renderHomeBlog();
  } catch { }
});
