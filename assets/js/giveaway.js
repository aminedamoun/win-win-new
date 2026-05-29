/**
 * giveaway.js — Win-Win nagradna igra form
 * - Validates all required fields + consent
 * - Captures consent timestamp + booth location
 * - POSTs to Supabase edge function `send-giveaway-email`
 * - Shows success overlay, auto-resets for the next visitor
 */

import { CONFIG } from "./config.js";
import tvImg from "../img/giveaway/tv-philips-65pus8560.jpg";
import vacuumImg from "../img/giveaway/vacuum-xiaomi-g20-lite.jpg";
import airfryerImg from "../img/giveaway/airfryer-philips-na120.jpg";

const ENDPOINT = `${CONFIG.supabase.url}/functions/v1/send-giveaway-email`;
const SUPABASE_ANON_KEY = CONFIG.supabase.anonKey;

// Human-readable name attached to every payload so n8n / the CRM can
// identify which form sent the submission. Rename here when the
// workflow node in n8n is renamed; do NOT change without updating
// the matching workflow.
const WEBHOOK_NAME = "Webhook for the WinWin Giveaway promotion - submit form";

// CRM hook — leave empty to keep email-only. Drop a webhook URL here
// (e.g. "https://n8n.dkrivec.com/webhook/<uuid>") to fire-and-forget
// each submission to n8n in addition to the email. Payload schema
// is the full object built in submitForm() with `formType: "giveaway"`
// and `webhookName: WEBHOOK_NAME`.
const N8N_WEBHOOK_URL = "https://n8n.dkrivec.com/webhook/39d461c4-d029-4cfd-b965-060de8749187";

const FIELDS = ["ime", "priimek", "naslov", "telefon", "email"];

function $(id) { return document.getElementById(id); }

function showErr(field, msg) {
  const el = $(field);
  if (el) el.classList.add("is-error");
  const box = document.querySelector(`[data-err-for="${field}"]`);
  if (box) box.textContent = msg;
}
function clearErr(field) {
  const el = $(field);
  if (el) el.classList.remove("is-error");
  const box = document.querySelector(`[data-err-for="${field}"]`);
  if (box) box.textContent = "";
}
function clearAll() {
  FIELDS.forEach(clearErr);
  clearErr("consent");
  const consentBox = $("consentBox");
  if (consentBox) consentBox.classList.remove("is-error");
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}
function validPhone(v) {
  // accepts +386 41 234 567, 041234567, etc — at least 8 digits
  const digits = String(v || "").replace(/\D/g, "");
  return digits.length >= 8;
}

function getLocationLabel() {
  const sel = $("lokacija");
  if (!sel) return "";
  const val = sel.value || "";
  if (val === "drugo") {
    return ($("lokacijaDrugo")?.value || "").trim();
  }
  return val;
}


function formatStampSl(date) {
  // 18.06 at 12:44 → format requested in spec
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${dd}.${mm} at ${hh}:${mi}`;
}

function validate() {
  clearAll();
  let ok = true;

  FIELDS.forEach((f) => {
    const v = String($(f)?.value || "").trim();
    if (!v) { showErr(f, "Polje je obvezno."); ok = false; }
  });

  if (ok || $("email").value.trim()) {
    if (!validEmail($("email").value)) {
      showErr("email", "Vnesite veljaven e-naslov.");
      ok = false;
    }
  }
  if ($("telefon").value.trim() && !validPhone($("telefon").value)) {
    showErr("telefon", "Vnesite veljavno telefonsko številko.");
    ok = false;
  }

  const loc = getLocationLabel();
  if (!loc) {
    showErr("lokacija", "Izberite lokacijo stojnice.");
    ok = false;
  }

  const consent = $("consent");
  if (!consent.checked) {
    showErr("consent", "Za sodelovanje morate sprejeti pravila.");
    $("consentBox").classList.add("is-error");
    ok = false;
  }

  return ok;
}

function initLocationFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("lokacija") || params.get("location");
  if (!raw) return;

  const sel = $("lokacija");
  const target = String(raw).trim();
  const matchOpt = Array.from(sel.options).find(
    (o) =>
      o.value.toLowerCase() === target.toLowerCase() ||
      o.textContent.trim().toLowerCase() === target.toLowerCase()
  );
  if (matchOpt) {
    sel.value = matchOpt.value;
  } else {
    sel.value = "drugo";
    const txt = $("lokacijaDrugo");
    if (txt) txt.value = target;
  }
  toggleDrugo();
}

function toggleDrugo() {
  const sel = $("lokacija");
  const wrap = $("lokacijaDrugoWrap");
  if (!sel || !wrap) return;
  wrap.style.display = sel.value === "drugo" ? "" : "none";
  if (sel.value !== "drugo") {
    const txt = $("lokacijaDrugo");
    if (txt) txt.value = "";
  }
}


function openSuccess() {
  $("successOverlay").classList.add("is-open");
}
function closeSuccessAndReset() {
  $("successOverlay").classList.remove("is-open");
  $("giveawayForm").reset();
  clearAll();
  toggleDrugo();
  // keep the URL-derived location selected
  initLocationFromUrl();
  // refocus first field for the next visitor
  $("ime")?.focus();
}

async function submitForm(e) {
  e.preventDefault();
  if (!validate()) {
    document.querySelector(".is-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const cta = $("submitBtn");
  cta.disabled = true;
  cta.classList.add("is-loading");

  const now = new Date();
  const locationLabel = getLocationLabel();

  const payload = {
    formType: "giveaway",
    webhookName: WEBHOOK_NAME,
    ime: $("ime").value.trim(),
    priimek: $("priimek").value.trim(),
    naslov: $("naslov").value.trim(),
    telefon: $("telefon").value.trim(),
    email: $("email").value.trim(),
    consent: true,
    consentTimestampIso: now.toISOString(),
    consentLocationLabel: locationLabel,
    consentDisplay: `${locationLabel} – ${formatStampSl(now)}`,
    source: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Fire-and-forget to n8n if a webhook URL is configured. Failures
  // must never block the user, so we don't await this.
  if (N8N_WEBHOOK_URL) {
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.warn("n8n webhook failed:", err));
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let txt = "";
      try { txt = await res.text(); } catch {}
      throw new Error(`HTTP ${res.status} ${txt}`);
    }

    openSuccess();
  } catch (err) {
    console.error("Giveaway submit failed:", err);
    alert(
      "Pri pošiljanju je prišlo do napake. Prosimo, poskusite znova.\n\n" +
      "Če težava ostane, obvestite osebje na stojnici."
    );
  } finally {
    cta.disabled = false;
    cta.classList.remove("is-loading");
  }
}

const PRIZES = {
  tv: {
    rank: "1. nagrada",
    featured: true,
    brand: "PHILIPS",
    name: "Philips 65PUS8560/12",
    price: "~ 499,99 €",
    image: tvImg,
    desc:
      "65-palčni 4K Ultra HD LED televizor z Ambilight tehnologijo in Smart TV platformo. Vrhunska slika in elegantna izvedba za vašo dnevno sobo.",
    specs: [
      "65\" (164 cm) zaslon",
      "4K Ultra HD ločljivost (3840 × 2160)",
      "Ambilight ozadje za potopno izkušnjo",
      "Smart TV platforma (Titan OS)",
      "HDR podpora — HDR10, HLG",
      "Pixel Precise Ultra HD obdelava slike",
      "DTS Play-Fi avdio podpora",
      "Wi-Fi, Bluetooth, HDMI in USB priključki",
    ],
    link: "https://www.bigbang.si/65pus8560-12-izdelek-5000186555/",
  },
  vacuum: {
    rank: "2. nagrada",
    featured: false,
    brand: "XIAOMI",
    name: "Xiaomi G20 Lite",
    price: "~ 109,99 €",
    image: vacuumImg,
    desc:
      "Lahek in zmogljiv pokončni brezžični sesalnik z močnim sesanjem in HEPA filtracijo. Vse, kar potrebujete za hitro čiščenje doma.",
    specs: [
      "18 000 Pa močno sesanje",
      "Do 45 minut delovanja na polnjenje",
      "5-stopenjska filtracija s HEPA filtrom",
      "0,55 L odstranljiva posoda za prah",
      "Le 2,4 kg — lahko in priročno",
      "LED osvetlitev za temne kotičke",
      "Polnjenje v 5 urah (2200 mAh baterija)",
    ],
    link: "https://www.bigbang.si/pokoncni-brezzicni-sesaln-g20-lite-eu-xiaomi-izdelek-21343272/",
  },
  airfryer: {
    rank: "3. nagrada",
    featured: false,
    brand: "PHILIPS",
    name: "Philips NA120/00 Airfryer L",
    price: "~ 79,99 €",
    image: airfryerImg,
    desc:
      "Cvrtnik na vroč zrak za zdravo pripravo hrane brez olja. 12 programov za vse — od krompirčka do mesa, rib in pekovskih izdelkov.",
    specs: [
      "Prostornina 4,2 L (do 500 g hrane)",
      "Moč 1500 W za hitro pripravo",
      "12 programov za pripravo hrane",
      "Mehanske tipke za enostavno upravljanje",
      "StarPlate košara — primerna za pomivalni stroj",
      "Tehnologija Rapid Air za hrustljave rezultate",
      "Kompaktna velikost za vsako kuhinjo",
    ],
    link: "https://www.bigbang.si/philips-na120-00-cvrtnik-na-vroc-zrak-l-izdelek-21051529/",
  },
};

function openPrizeModal(key) {
  const p = PRIZES[key];
  if (!p) return;
  const modal = $("prizeModal");

  $("prizeModalImg").src = p.image;
  $("prizeModalImg").alt = p.name;
  $("prizeModalRank").textContent = p.rank;
  $("prizeModalRank").classList.toggle("is-featured", !!p.featured);
  $("prizeModalBrand").textContent = p.brand;
  $("prizeModalName").textContent = p.name;
  $("prizeModalDesc").textContent = p.desc;
  $("prizeModalLink").href = p.link;
  const specs = $("prizeModalSpecs");
  specs.innerHTML = p.specs.map((s) => `<li>${s}</li>`).join("");

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePrizeModal() {
  const modal = $("prizeModal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function init() {
  document.body.classList.add("gw-body");

  // prize cards
  document.querySelectorAll(".gw-prize[data-prize]").forEach((btn) => {
    btn.addEventListener("click", () => openPrizeModal(btn.dataset.prize));
  });
  $("prizeModalClose")?.addEventListener("click", closePrizeModal);
  $("prizeModal")?.addEventListener("click", (e) => {
    if (e.target.id === "prizeModal") closePrizeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("prizeModal").classList.contains("is-open")) closePrizeModal();
  });

  // location dropdown
  const sel = $("lokacija");
  if (sel) {
    sel.addEventListener("change", toggleDrugo);
    toggleDrugo();
  }
  initLocationFromUrl();

  // clear field errors on input
  FIELDS.forEach((f) => {
    $(f)?.addEventListener("input", () => clearErr(f));
  });
  $("consent")?.addEventListener("change", () => {
    if ($("consent").checked) {
      clearErr("consent");
      $("consentBox").classList.remove("is-error");
    }
  });

  // make the whole consent box toggle the checkbox (except the link)
  $("consentBox")?.addEventListener("click", (e) => {
    if (e.target.tagName === "A" || e.target.tagName === "INPUT") return;
    $("consent").checked = !$("consent").checked;
    $("consent").dispatchEvent(new Event("change"));
  });

  $("giveawayForm")?.addEventListener("submit", submitForm);
  $("successClose")?.addEventListener("click", closeSuccessAndReset);

  // year in footer
  const y = $("year");
  if (y) y.textContent = String(new Date().getFullYear());

  $("ime")?.focus();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
