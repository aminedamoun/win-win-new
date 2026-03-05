import { getJobs, getJobBySlug } from './contentful-client.js';
import { initPage } from './page-utils.js';

function $(id) { return document.getElementById(id); }

function getLang() {
  const lang = document.documentElement.getAttribute("lang") || "";
  return lang.toLowerCase().startsWith("sl") ? "sl" : "en";
}

function contentfulLocale(lang) {
  return lang === "sl" ? "sl" : "en-US";
}

function qp(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function uniq(arr) {
  return Array.from(new Set(arr)).filter(Boolean);
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(isoDate, lang) {
  if (!isoDate) return "";
  try {
    return new Date(isoDate).toLocaleDateString(lang === "sl" ? "sl-SI" : "en-GB", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return isoDate; }
}

function jobCardHtml(job, lang) {
  const detailPage = lang === "sl" ? "job-sl.html" : "job.html";
  const viewDetails = lang === "sl" ? "Poglej podrobnosti" : "View details";
  const applyNow = lang === "sl" ? "Prijavi se" : "Apply";
  const applyPage = lang === "sl" ? "apply-sl.html" : "apply.html";

  return `
    <div class="glass card" style="padding:18px;">
      <div style="display:flex; gap:14px; align-items:flex-start; justify-content:space-between; flex-wrap:wrap;">
        <div style="min-width:240px;">
          <div style="font-weight:900; font-size:18px; margin-bottom:6px;">${escapeHtml(job.title)}</div>
          <div class="p-muted" style="display:flex; gap:10px; flex-wrap:wrap;">
            <span>📍 ${escapeHtml(job.location)}</span>
            <span>•</span>
            <span>${escapeHtml(job.type)}</span>
            ${job.salary ? `<span>•</span><span>${escapeHtml(job.salary)}</span>` : ""}
          </div>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <a class="btn btn-outline" href="${detailPage}?slug=${encodeURIComponent(job.slug)}">${viewDetails}</a>
          <a class="btn btn-primary" href="${applyPage}?job=${encodeURIComponent(job.slug)}">${applyNow} <span aria-hidden="true">→</span></a>
        </div>
      </div>
      ${job.summary ? `<div class="p-muted" style="margin-top:10px;">${escapeHtml(job.summary)}</div>` : ""}
    </div>
  `;
}

async function renderJobsList() {
  const jobsGrid = $("jobsGrid");
  if (!jobsGrid) return false;

  const lang = getLang();
  const locale = contentfulLocale(lang);
  console.log("[Jobs] lang:", lang, "locale:", locale);
  const jobsLoading = $("jobsLoading");
  const jobsNoJobs = $("jobsNoJobs");
  const filterLocation = $("filterLocation");
  const filterType = $("filterType");
  const jobsSearch = $("jobsSearch");

  let jobs = [];
  try {
    jobs = await getJobs(locale);
    console.log("[Jobs] fetched jobs count:", jobs.length);
    if (jobs.length > 0) {
      console.log("[Jobs] first job:", { slug: jobs[0].slug, title: jobs[0].title, published: jobs[0].published, postedDate: jobs[0].postedDate });
    }
  } catch (err) {
    console.error("[Jobs] getJobs error:", err);
    jobs = [];
  }

  if (filterLocation && filterType) {
    const allLabel = lang === "sl" ? "Vse" : "All";
    const allLocations = uniq(jobs.map((j) => j.location));
    const allTypes = uniq(jobs.map((j) => j.type));

    filterLocation.innerHTML =
      `<option value="">${allLabel} ${lang === "sl" ? "lokacije" : "locations"}</option>` +
      allLocations.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");

    filterType.innerHTML =
      `<option value="">${allLabel} ${lang === "sl" ? "tipi" : "types"}</option>` +
      allTypes.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
  }

  const applyFilters = () => {
    const loc = (filterLocation?.value || "").trim();
    const typ = (filterType?.value || "").trim();
    const q = (jobsSearch?.value || "").trim().toLowerCase();

    const filtered = jobs.filter((j) => {
      const matchLoc = !loc || j.location === loc;
      const matchType = !typ || j.type === typ;
      const hay = [j.title, j.location, j.type, j.salary, j.summary].join(" ").toLowerCase();
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
  const lang = getLang();
  const locale = contentfulLocale(lang);
  const slug = qp("slug") || qp("id") || qp("job");
  console.log("[Job Detail] lang:", lang, "locale:", locale, "slug:", slug);

  const titleEl = $("jobTitle");
  const metaEl = $("jobMeta");
  const salaryEl = $("jobSalary");
  const bodyEl = $("jobBody");
  const introEl = $("jobIntro");
  const reqList = $("reqList");
  const reqCol = $("reqCol");
  const respList = $("respList");
  const respCol = $("respCol");
  const benefitsList = $("benefitsList");
  const benefitsCol = $("benefitsCol");
  const jobColsWrapper = $("jobColsWrapper");
  const applyBtn = $("applyForJob");

  if (!titleEl || !metaEl || !salaryEl || !bodyEl) { initPage(); return; }

  if (!slug) {
    titleEl.textContent = lang === "sl" ? "Pozicija ni najdena" : "Position not found";
    metaEl.textContent = lang === "sl" ? "Prosimo, odprite pozicijo iz seznama." : "Please open a position from the list.";
    salaryEl.textContent = "";
    bodyEl.innerHTML = "";
    initPage();
    return;
  }

  let job = null;
  try {
    job = await getJobBySlug(slug, locale);
    console.log("[Job Detail] result:", job ? { slug: job.slug, title: job.title } : "null");
  } catch (err) {
    console.error("[Job Detail] getJobBySlug error:", err);
    job = null;
  }

  if (!job) {
    titleEl.textContent = lang === "sl" ? "Pozicija ni najdena" : "Position not found";
    metaEl.textContent = lang === "sl" ? "Prosimo, odprite pozicijo iz seznama." : "Please open a position from the list.";
    salaryEl.textContent = "";
    bodyEl.innerHTML = lang === "sl" ? "<p>Pozicija ne obstaja ali ni več aktivna.</p>" : "<p>This position does not exist or is no longer active.</p>";
    if (reqList) reqList.innerHTML = "";
    if (respList) respList.innerHTML = "";
    if (benefitsList) benefitsList.innerHTML = "";
    if (applyBtn) applyBtn.href = applyPageHref || (lang === "sl" ? "apply-sl.html" : "apply.html");
    initPage();
    return;
  }

  document.title = `${job.title} — Win Win`;

  titleEl.textContent = job.title;
  metaEl.textContent = [job.location, job.type, job.department].filter(Boolean).join(" • ");
  salaryEl.textContent = job.salary || "";

  if (introEl && job.summary) {
    introEl.textContent = job.summary;
  }

  bodyEl.innerHTML = job.description || "";

  const renderCol = (col, list, items) => {
    if (!col || !list) return;
    const filled = Array.isArray(items) && items.length > 0;
    if (filled) {
      list.innerHTML = items.map((x) => `<li>${escapeHtml(x)}</li>`).join("");
      col.style.display = "";
    } else {
      col.style.display = "none";
    }
  };

  renderCol(reqCol, reqList, job.requirements);
  renderCol(respCol, respList, job.responsibilities);
  renderCol(benefitsCol, benefitsList, job.benefits);

  if (jobColsWrapper) {
    const visibleCols = [reqCol, respCol, benefitsCol].filter((c) => c && c.style.display !== "none");
    if (visibleCols.length === 0) {
      jobColsWrapper.style.display = "none";
    } else {
      jobColsWrapper.style.display = "";
      jobColsWrapper.className = `job-cols sections-${visibleCols.length}`;
    }
  }

  if (job.image) {
    const heroImg = $("jobHeroImg");
    if (heroImg) { heroImg.src = job.image; heroImg.alt = job.imageAlt || job.title; }
  }

  if (applyBtn) {
    const base = applyPageHref || (lang === "sl" ? "apply-sl.html" : "apply.html");
    applyBtn.href = `${base}?job=${encodeURIComponent(job.slug)}`;
  }

  initPage();
}

(async function () {
  await renderJobsList();
})();
