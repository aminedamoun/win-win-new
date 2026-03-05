import { getJobs } from './contentful.js';
import { getAllJobs } from './jobs-db.js';
import { initPage } from './page-utils.js';

let JOBS = [];

function $(id) { return document.getElementById(id); }

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getLang() {
  const lang = document.documentElement.getAttribute("lang") || "";
  return lang.toLowerCase().startsWith("sl") ? "sl" : "en";
}

function qp(name) {
  return new URL(window.location.href).searchParams.get(name);
}

function uniq(arr) {
  return Array.from(new Set(arr)).filter(Boolean);
}

async function loadJobs() {
  try {
    const jobs = await getJobs();
    if (jobs.length > 0) { JOBS = jobs; return; }
  } catch {
  }
  try {
    const dbJobs = await getAllJobs();
    JOBS = dbJobs.map((job) => ({
      id: job.slug,
      slug: job.slug,
      title: { en: job.title_en || "", sl: job.title_sl || "" },
      location: { en: job.location_en || "", sl: job.location_sl || "" },
      type: { en: job.type_en || "", sl: job.type_sl || "" },
      salary: { en: job.salary_en || "", sl: job.salary_sl || "" },
      summary: { en: job.summary_en || "", sl: job.summary_sl || "" },
      bodyHtml: { en: job.description_en || "", sl: job.description_sl || "" },
      requirements: { en: job.requirements_en || [], sl: job.requirements_sl || [] },
      responsibilities: { en: job.responsibilities_en || [], sl: job.responsibilities_sl || [] },
      benefits: { en: job.benefits_en || [], sl: job.benefits_sl || [] },
    }));
  } catch {
    JOBS = [];
  }
}

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
      <div class="p-muted" style="margin-top:10px;">${escapeHtml(job.summary[lang])}</div>
    </div>
  `;
}

async function renderJobsList() {
  const jobsGrid = $("jobsGrid");
  if (!jobsGrid) return false;

  const lang = getLang();
  const jobsLoading = $("jobsLoading");
  const jobsNoJobs = $("jobsNoJobs");
  const filterLocation = $("filterLocation");
  const filterType = $("filterType");
  const jobsSearch = $("jobsSearch");

  await loadJobs();
  buildFilters(lang);

  const applyFilters = () => {
    const loc = (filterLocation?.value || "").trim();
    const typ = (filterType?.value || "").trim();
    const q = (jobsSearch?.value || "").trim().toLowerCase();

    const filtered = JOBS.filter((j) => {
      const matchLoc = !loc || j.location[lang] === loc;
      const matchType = !typ || j.type[lang] === typ;
      const hay = [j.title[lang], j.location[lang], j.type[lang], j.salary[lang], j.summary[lang]].join(" ").toLowerCase();
      return matchLoc && matchType && (!q || hay.includes(q));
    });

    jobsGrid.innerHTML = filtered.map((j) => jobCardHtml(j, lang)).join("");
    if (jobsLoading) jobsLoading.style.display = "none";
    if (jobsNoJobs) jobsNoJobs.style.display = filtered.length ? "none" : "block";
  };

  filterLocation?.addEventListener("change", applyFilters);
  filterType?.addEventListener("change", applyFilters);
  jobsSearch?.addEventListener("input", applyFilters);
  applyFilters();
  initPage();
  return true;
}

export async function renderJobDetail({ applyPageHref } = {}) {
  await loadJobs();

  const lang = getLang();
  const id = qp("id") || qp("job") || qp("slug");
  const job = JOBS.find((j) => j.id === id) || null;

  const titleEl = $("jobTitle");
  const metaEl = $("jobMeta");
  const salaryEl = $("jobSalary");
  const bodyEl = $("jobBody");
  const reqList = $("reqList");
  const respList = $("respList");
  const benefitsList = $("benefitsList");
  const applyBtn = $("applyForJob");

  if (!titleEl || !metaEl || !salaryEl || !bodyEl) return;

  if (!job) {
    titleEl.textContent = lang === "sl" ? "Pozicija ni najdena" : "Position not found";
    metaEl.textContent = lang === "sl" ? "Prosimo, odprite pozicijo iz seznama." : "Please open a position from the list.";
    salaryEl.textContent = "";
    bodyEl.innerHTML = lang === "sl"
      ? "<p>Manjka parameter v URL-ju.</p>"
      : "<p>Missing URL parameter.</p>";
    if (reqList) reqList.innerHTML = "";
    if (respList) respList.innerHTML = "";
    if (benefitsList) benefitsList.innerHTML = "";
    if (applyBtn) applyBtn.href = applyPageHref || (lang === "sl" ? "apply-sl.html" : "apply.html");
    initPage();
    return;
  }

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

  initPage();
}

(async function () {
  await renderJobsList();
})();
