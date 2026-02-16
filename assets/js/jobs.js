/**
 * jobs.js (pure HTML/CSS/JS)
 * - Works for BOTH:
 *   1) Jobs list page (jobs.html / jobs-sl.html)  -> renders cards into #jobsGrid
 *   2) Job detail page (job.html / job-sl.html)   -> renderJobDetail()
 *
 * Loads jobs from Supabase database
 */

import { getAllJobs, getJobBySlug } from './jobs-db.js';

/* =========================
   DATA (loaded from database)
========================= */

let JOBS = [];

const OLD_JOBS = [
  {
    id: "field-sales-advisor",
    title: { en: "Field Sales Advisor (B2C)", sl: "Terenski prodajni svetovalec (B2C)" },
    location: { en: "Slovenia (Nationwide)", sl: "Slovenija (celotna država)" },
    type: { en: "Full-time / Contract", sl: "Polni delovni čas / S.P." },
    salary: { en: "Base + high commissions", sl: "Osnova + visoke provizije" },
    summary: {
      en: "Work on the field with warm promotions and structured daily targets. High commissions and rapid progression.",
      sl: "Delo na terenu s promocijami in jasnimi dnevnimi cilji. Visoke provizije in hitro napredovanje.",
    },
    bodyHtml: {
      en:
        "<p>You will sell telecommunications packages to residential customers through field sales and promotions.</p>" +
        "<p><strong>We provide</strong> onboarding, scripts, CRM tools, team support and clear performance system.</p>",
      sl:
        "<p>Prodaja telekomunikacijskih paketov končnim uporabnikom preko terenske prodaje in promocij.</p>" +
        "<p><strong>Zagotavljamo</strong> uvajanje, skripte, CRM orodja, podporo ekipe in jasen sistem uspešnosti.</p>",
    },
    requirements: {
      en: ["Motivation and discipline", "Good communication", "Driver’s license is a plus", "Willingness to learn"],
      sl: ["Motivacija in disciplina", "Dobra komunikacija", "Vozniški izpit je prednost", "Pripravljenost za učenje"],
    },
    responsibilities: {
      en: ["Present offers to customers", "Work with targets and KPIs", "Use scripts and CRM", "Build long-term relationships"],
      sl: ["Predstavitev ponudb strankam", "Delo s cilji in KPI-ji", "Uporaba skript in CRM", "Gradnja odnosov s strankami"],
    },
    benefits: {
      en: ["Training & mentoring", "High earning potential", "Fast promotion path", "Supportive team culture"],
      sl: ["Usposabljanje in mentorstvo", "Visok potencial zaslužka", "Hitro napredovanje", "Podporna ekipna kultura"],
    },
  },

  {
    id: "call-center-sales",
    title: { en: "Call Center Sales Agent", sl: "Prodajnik v klicnem centru" },
    location: { en: "Trzin / Kranj", sl: "Trzin / Kranj" },
    type: { en: "Full-time / Part-time", sl: "Polni / skrajšani delovni čas" },
    salary: { en: "Hourly + commission", sl: "Urna postavka + provizija" },
    summary: {
      en: "Outbound calling with structured scripts and CRM. Clear KPIs, coaching and stable work environment.",
      sl: "Odhodni klici s strukturiranimi skriptami in CRM. Jasni KPI-ji, coaching in stabilno okolje.",
    },
    bodyHtml: {
      en:
        "<p>You will contact customers by phone, present offers and close deals using proven scripts.</p>" +
        "<p>Perfect for people who like communication, structure and measurable results.</p>",
      sl:
        "<p>Telefonski stik s strankami, predstavitev ponudb in zaključevanje prodaje z dokazano učinkovitimi skriptami.</p>" +
        "<p>Odlično za ljudi, ki imajo radi komunikacijo, strukturo in merljive rezultate.</p>",
    },
    requirements: {
      en: ["Good spoken communication", "Basic computer skills", "Persistence", "Team mindset"],
      sl: ["Dobra govorna komunikacija", "Osnovno računalniško znanje", "Vztrajnost", "Ekipni duh"],
    },
    responsibilities: {
      en: ["Outbound calls", "Follow scripts and CRM", "Hit KPIs", "Report and improve performance"],
      sl: ["Odhodni klici", "Uporaba skript in CRM", "Doseganje KPI-jev", "Spremljanje in izboljšave uspešnosti"],
    },
    benefits: {
      en: ["Coaching & training", "Stable shifts", "Bonuses & competitions", "Growth opportunities"],
      sl: ["Coaching in treningi", "Urejeni urniki", "Bonusi in tekmovanja", "Možnosti rasti"],
    },
  },

  {
    id: "b2b-sales-consultant",
    title: { en: "B2B Sales Consultant", sl: "B2B prodajni svetovalec" },
    location: { en: "Slovenia", sl: "Slovenija" },
    type: { en: "Contract / Full-time", sl: "S.P. / polni delovni čas" },
    salary: { en: "High commissions (B2B)", sl: "Visoke provizije (B2B)" },
    summary: {
      en: "Sell business telecom/ICT solutions. Longer sales cycle, bigger deals, professional environment.",
      sl: "Prodaja poslovnih telekom/IKT rešitev. Daljši cikli, večji posli, profesionalno okolje.",
    },
    bodyHtml: {
      en:
        "<p>You will build relationships with companies and offer telecom/ICT solutions.</p>" +
        "<p>Ideal for experienced salespeople who want bigger deals and long-term partnerships.</p>",
      sl:
        "<p>Gradnja odnosov s podjetji in prodaja telekom/IKT rešitev.</p>" +
        "<p>Primerno za izkušene prodajnike, ki želijo večje posle in dolgoročna partnerstva.</p>",
    },
    requirements: {
      en: ["Sales experience preferred", "Professional communication", "Negotiation skills", "Self-organization"],
      sl: ["Prodajne izkušnje so prednost", "Profesionalna komunikacija", "Pogajalske veščine", "Samostojna organizacija"],
    },
    responsibilities: {
      en: ["Find and develop B2B clients", "Present solutions", "Negotiate and close", "Maintain pipeline/CRM"],
      sl: ["Pridobivanje B2B strank", "Predstavitev rešitev", "Pogajanja in zaključek", "Vodenje pipeline/CRM"],
    },
    benefits: {
      en: ["Top earning potential", "Back-office support", "Training for products", "Career growth"],
      sl: ["Top potencial zaslužka", "Back-office podpora", "Usposabljanje za produkte", "Karierna rast"],
    },
  },
];

/* =========================
   HELPERS
========================= */

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getLang() {
  const htmlLang = document.documentElement.getAttribute("lang") || "";
  // treat "sl" as sl, everything else as en
  return htmlLang.toLowerCase().startsWith("sl") ? "sl" : "en";
}

function uniq(arr) {
  return Array.from(new Set(arr)).filter(Boolean);
}

function qp(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function loadJobsFromCMS() {
  try {
    // Load the jobs index
    const indexResponse = await fetch('/content/jobs-index.json');
    if (!indexResponse.ok) {
      throw new Error('Failed to fetch jobs index');
    }

    const index = await indexResponse.json();
    const jobSlugs = index.jobs || [];

    const jobs = [];
    for (const slug of jobSlugs) {
      try {
        const jobResponse = await fetch(`/content/jobs/${slug}.json`);
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          const isPublished = jobData.settings?.published !== false;
          if (isPublished) {
            jobs.push({
              ...jobData,
              slug
            });
          }
        }
      } catch (err) {
        console.error('Error loading job file:', slug, err);
      }
    }

    return jobs;
  } catch (error) {
    console.error('Error loading jobs from CMS:', error);
    return [];
  }
}

async function loadJobsFromDatabase() {
  try {
    // Try loading from CMS files first
    const cmsJobs = await loadJobsFromCMS();

    // If CMS has jobs, use them
    if (cmsJobs && cmsJobs.length > 0) {
      JOBS = cmsJobs.map(job => {
        const slug = job.slug;
        const enData = job.en || {};
        const slData = job.sl || {};

        // Format English content
        const responsibilitiesHtmlEn = enData.responsibilities
          ? `<ul>${enData.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>`
          : '';
        const requirementsHtmlEn = enData.requirements
          ? `<ul>${enData.requirements.map(r => `<li>${r}</li>`).join('')}</ul>`
          : '';
        const bodyHtmlEn = `
          <p>${enData.description || ''}</p>
          ${responsibilitiesHtmlEn ? '<h3>Responsibilities</h3>' + responsibilitiesHtmlEn : ''}
          ${requirementsHtmlEn ? '<h3>Requirements</h3>' + requirementsHtmlEn : ''}
        `;

        // Format Slovenian content
        const responsibilitiesHtmlSl = slData.responsibilities
          ? `<ul>${slData.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>`
          : '';
        const requirementsHtmlSl = slData.requirements
          ? `<ul>${slData.requirements.map(r => `<li>${r}</li>`).join('')}</ul>`
          : '';
        const bodyHtmlSl = `
          <p>${slData.description || ''}</p>
          ${responsibilitiesHtmlSl ? '<h3>Odgovornosti</h3>' + responsibilitiesHtmlSl : ''}
          ${requirementsHtmlSl ? '<h3>Zahteve</h3>' + requirementsHtmlSl : ''}
        `;

        return {
          id: slug,
          title: { en: enData.title || '', sl: slData.title || '' },
          location: { en: enData.location || '', sl: slData.location || '' },
          type: { en: enData.type || '', sl: slData.type || '' },
          salary: { en: enData.salary || 'Competitive', sl: slData.salary || 'Konkurenčna plača' },
          summary: { en: enData.description || '', sl: slData.description || '' },
          bodyHtml: { en: bodyHtmlEn, sl: bodyHtmlSl },
          requirements: { en: enData.requirements || [], sl: slData.requirements || [] },
          responsibilities: { en: enData.responsibilities || [], sl: slData.responsibilities || [] },
          benefits: { en: enData.benefits || [], sl: slData.benefits || [] }
        };
      });

      return JOBS;
    }

    // Fallback to database
    const dbJobs = await getAllJobs();

    JOBS = dbJobs.map(job => ({
      id: job.slug,
      title: {
        en: job.title_en,
        sl: job.title_sl
      },
      location: {
        en: job.location_en,
        sl: job.location_sl
      },
      type: {
        en: job.type_en,
        sl: job.type_sl
      },
      salary: {
        en: job.salary_en,
        sl: job.salary_sl
      },
      summary: {
        en: job.summary_en,
        sl: job.summary_sl
      },
      bodyHtml: {
        en: job.description_en,
        sl: job.description_sl
      },
      requirements: {
        en: job.requirements_en || [],
        sl: job.requirements_sl || []
      },
      responsibilities: {
        en: job.responsibilities_en || [],
        sl: job.responsibilities_sl || []
      },
      benefits: {
        en: job.benefits_en || [],
        sl: job.benefits_sl || []
      }
    }));

    return JOBS;
  } catch (error) {
    console.error('Error loading jobs from database:', error);
    return [];
  }
}

function setupScrollReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-animate]"));
  if (!nodes.length || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
    },
    { threshold: 0.12 }
  );
  nodes.forEach((n) => io.observe(n));
}

function bindCookieBar() {
  const bar = $("cookieBar");
  const accept = $("cookieAccept");
  const decline = $("cookieDecline");
  if (!bar || !accept || !decline) return;

  const key = "ww_cookie_consent";
  const existing = localStorage.getItem(key);
  if (existing) {
    bar.style.display = "none";
    return;
  }

  const close = (v) => {
    localStorage.setItem(key, v);
    bar.style.display = "none";
  };

  accept.addEventListener("click", () => close("accepted"));
  decline.addEventListener("click", () => close("declined"));
}

/* =========================
   LIST PAGE
========================= */

function buildFilters(lang) {
  const filterLocation = $("filterLocation");
  const filterType = $("filterType");
  if (!filterLocation || !filterType) return;

  const allLocations = uniq(JOBS.map((j) => j.location[lang]));
  const allTypes = uniq(JOBS.map((j) => j.type[lang]));

  const allLabel = lang === "sl" ? "Vse" : "All";

  filterLocation.innerHTML =
    `<option value="">${allLabel} ${lang === "sl" ? "lokacije" : "locations"}</option>` +
    allLocations.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");

  filterType.innerHTML =
    `<option value="">${allLabel} ${lang === "sl" ? "tipi" : "types"}</option>` +
    allTypes.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
}

function jobCardHtml(job, lang) {
  const detailPage = lang === "sl" ? "job-sl.html" : "job.html";
  const viewDetails = lang === "sl" ? "Poglej podrobnosti" : "View details";
  const applyNow = lang === "sl" ? "Prijavi se" : "Apply";

  return `
    <div class="glass card" style="padding:18px;">
      <div style="display:flex; gap:14px; align-items:flex-start; justify-content:space-between; flex-wrap:wrap;">
        <div style="min-width: 240px;">
          <div style="font-weight:900; font-size:18px; margin-bottom:6px;">${escapeHtml(job.title[lang])}</div>
          <div class="p-muted" style="display:flex; gap:10px; flex-wrap:wrap;">
            <span>📍 ${escapeHtml(job.location[lang])}</span>
            <span>•</span>
            <span>${escapeHtml(job.type[lang])}</span>
            <span>•</span>
            <span>${escapeHtml(job.salary[lang])}</span>
          </div>
        </div>

        <div style="display:flex; gap:10px; align-items:center;">
          <a class="btn btn-outline" href="${detailPage}?id=${encodeURIComponent(job.id)}">${viewDetails}</a>
          <a class="btn btn-primary" href="apply${lang === "sl" ? "-sl" : ""}.html?job=${encodeURIComponent(job.id)}">${applyNow} <span aria-hidden="true">→</span></a>
        </div>
      </div>

      <div class="p-muted" style="margin-top:10px;">
        ${escapeHtml(job.summary[lang])}
      </div>
    </div>
  `;
}

async function renderJobsList() {
  const jobsGrid = $("jobsGrid");
  if (!jobsGrid) return false;

  await loadJobsFromDatabase();

  const lang = getLang();

  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  buildFilters(lang);

  const filterLocation = $("filterLocation");
  const filterType = $("filterType");
  const jobsSearch = $("jobsSearch");
  const jobsLoading = $("jobsLoading");
  const jobsNoJobs = $("jobsNoJobs");

  const applyFilters = () => {
    const loc = (filterLocation?.value || "").trim();
    const typ = (filterType?.value || "").trim();
    const q = (jobsSearch?.value || "").trim().toLowerCase();

    const filtered = JOBS.filter((j) => {
      const matchLoc = !loc || j.location[lang] === loc;
      const matchType = !typ || j.type[lang] === typ;

      const hay = [
        j.title[lang],
        j.location[lang],
        j.type[lang],
        j.salary[lang],
        j.summary[lang],
      ]
        .join(" ")
        .toLowerCase();

      const matchQ = !q || hay.includes(q);
      return matchLoc && matchType && matchQ;
    });

    jobsGrid.innerHTML = filtered.map((j) => jobCardHtml(j, lang)).join("");

    if (jobsLoading) jobsLoading.style.display = "none";
    if (jobsNoJobs) jobsNoJobs.style.display = filtered.length ? "none" : "block";
  };

  filterLocation?.addEventListener("change", applyFilters);
  filterType?.addEventListener("change", applyFilters);
  jobsSearch?.addEventListener("input", applyFilters);

  // initial render
  applyFilters();

  // SEO (optional, safe)
  const seoHtml = $("seoHtml");
  if (seoHtml) {
    seoHtml.innerHTML =
      lang === "sl"
        ? "<p>Odkrijte odprta delovna mesta v prodaji po Sloveniji. Prijava je hitra in enostavna.</p>"
        : "<p>Explore open sales positions across Slovenia. Applying takes only a few minutes.</p>";
  }

  setupScrollReveal();
  bindCookieBar();
  return true;
}

/* =========================
   DETAIL PAGE (export)
========================= */

export async function renderJobDetail({ applyPageHref } = {}) {
  await loadJobsFromDatabase();

  const lang = getLang();

  const id = qp("id") || qp("job") || qp("slug");
  const job = JOBS.find((j) => j.id === id) || null;

  // IDs expected by your job.html / job-sl.html
  const titleEl = $("jobTitle");
  const metaEl = $("jobMeta");
  const salaryEl = $("jobSalary");
  const bodyEl = $("jobBody");
  const reqList = $("reqList");
  const respList = $("respList");
  const benefitsList = $("benefitsList");
  const applyBtn = $("applyForJob");

  // If this is not the detail page, just exit quietly.
  if (!titleEl || !metaEl || !salaryEl || !bodyEl) return;

  // year in footer (your sl detail uses id="y", but safe)
  const y = $("y");
  if (y) y.textContent = String(new Date().getFullYear());

  if (!job) {
    titleEl.textContent = lang === "sl" ? "Pozicija ni najdena" : "Position not found";
    metaEl.textContent = lang === "sl" ? "Prosimo, odprite pozicijo iz seznama." : "Please open a position from the list.";
    salaryEl.textContent = "";
    bodyEl.innerHTML = lang === "sl"
      ? "<p>Manjka parameter v URL-ju. Primer: <code>?id=field-sales-advisor</code></p>"
      : "<p>Missing URL parameter. Example: <code>?id=field-sales-advisor</code></p>";
    if (reqList) reqList.innerHTML = "";
    if (respList) respList.innerHTML = "";
    if (benefitsList) benefitsList.innerHTML = "";
    if (applyBtn) applyBtn.href = applyPageHref || (lang === "sl" ? "apply-sl.html" : "apply.html");
    setupScrollReveal();
    bindCookieBar();
    return;
  }

  // Fill content
  titleEl.textContent = job.title[lang];

  metaEl.textContent = `${job.location[lang]} • ${job.type[lang]}`;

  salaryEl.textContent = job.salary[lang];

  bodyEl.innerHTML = job.bodyHtml[lang] || "";

  if (reqList) reqList.innerHTML = (job.requirements[lang] || []).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
  if (respList) respList.innerHTML = (job.responsibilities[lang] || []).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
  if (benefitsList) benefitsList.innerHTML = (job.benefits[lang] || []).map((x) => `<li>${escapeHtml(x)}</li>`).join("");

  if (applyBtn) {
    const base = applyPageHref || (lang === "sl" ? "apply-sl.html" : "apply.html");
    applyBtn.href = `${base}?job=${encodeURIComponent(job.id)}`;
  }

  setupScrollReveal();
  bindCookieBar();
}

/* =========================
   AUTO RUN
========================= */

(async function() {
  await renderJobsList();
})();
