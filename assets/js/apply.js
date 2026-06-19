/**
 * apply.js — EN Apply page (pure HTML/CSS/JS)
 * - File upload UI (PDF)
 * - Form validation and submission to Supabase
 * - Renders "What happens next" cards
 */

import { uploadCVOnly, sendApplicationEmail } from './jobs-db.js';
import { initBurgerMenu } from './ui.js';
import { CONFIG } from './config.js';

function $(id) { return document.getElementById(id); }

function setYear() {
  const y = $("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function showErr(fieldId, msg) {
  const box = document.querySelector(`[data-err-for="${fieldId}"]`);
  if (!box) return;
  box.textContent = msg;
  box.style.display = "block";
}

function clearErr(fieldId) {
  const box = document.querySelector(`[data-err-for="${fieldId}"]`);
  if (!box) return;
  box.textContent = "";
  box.style.display = "none";
}

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

function bytesToMB(n) {
  return n / (1024 * 1024);
}

function setupUpload() {
  const drop = $("cvDrop");
  const input = $("cvFile");
  const name = $("cvFileName");

  if (!drop || !input || !name) return;

  const updateName = () => {
    const f = input.files && input.files[0];
    if (!f) {
      name.style.display = "none";
      name.textContent = "";
      drop.style.borderColor = "";
      drop.style.background = "";
      return;
    }
    name.style.display = "block";
    name.textContent = `✓ File uploaded: ${f.name}`;
    drop.style.borderColor = "#10b981";
    drop.style.background = "#ecfdf5";
  };

  drop.addEventListener("click", () => input.click());

  input.addEventListener("change", () => {
    clearErr("cvFile");

    const f = input.files && input.files[0];
    if (!f) return updateName();

    if (f.type !== "application/pdf") {
      showErr("cvFile", "Please upload a PDF file.");
      input.value = "";
      return updateName();
    }
    if (bytesToMB(f.size) > 5) {
      showErr("cvFile", "File is too large. Max 5MB.");
      input.value = "";
      return updateName();
    }
    updateName();
  });

  updateName();
}

function renderNextSteps() {
  const grid = $("nextGrid");
  if (!grid) return;

  const steps = [
    { n: "1", title: "We Review", desc: "Your application is reviewed by our recruitment team" },
    { n: "2", title: "We Contact", desc: "We'll reach out within 24 hours to schedule an interview" },
    { n: "3", title: "You Start", desc: "Join our selection program and begin your career" },
  ];

  grid.innerHTML = steps.map(s => `
    <div class="glass" style="padding: 22px; border-radius: 16px; text-align:center;">
      <div style="font-weight:900; font-size: 34px; color: rgba(239,68,68,1); margin-bottom: 8px;">${s.n}</div>
      <div style="font-weight:900; font-size: 18px; margin-bottom: 8px;">${s.title}</div>
      <div class="p-muted" style="margin:0;">${s.desc}</div>
    </div>
  `).join("");
}

function setupForm() {
  const form = $("applyForm");
  if (!form) return;

  const firstName = $("firstName");
  const lastName = $("lastName");
  const email = $("email");
  const phone = $("phone");
  const lokacija = $("lokacija");
  const agree = $("agree");
  const cvFile = $("cvFile");

  const successBox = $("successBox");
  const submitBtn = $("submitBtn");

  const openSuccessModal = () => {
    if (!successBox) return;
    successBox.style.display = "flex";
    successBox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeSuccessModal = () => {
    if (!successBox) return;
    successBox.style.display = "none";
    successBox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const closeBtn = $("successClose");
  const okBtn = $("successOk");
  if (closeBtn) closeBtn.addEventListener("click", closeSuccessModal);
  if (okBtn) okBtn.addEventListener("click", closeSuccessModal);
  if (successBox) {
    successBox.addEventListener("click", (e) => {
      if (e.target === successBox) closeSuccessModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && successBox && successBox.style.display === "flex") {
      closeSuccessModal();
    }
  });

  const clearAllErrs = () => {
    ["firstName", "lastName", "email", "phone", "lokacija", "agree", "cvFile"].forEach(clearErr);
  };

  const validate = () => {
    clearAllErrs();
    let ok = true;

    if (!String(firstName?.value || "").trim()) { showErr("firstName", "First name is required."); ok = false; }
    if (!String(lastName?.value || "").trim()) { showErr("lastName", "Last name is required."); ok = false; }

    const ev = String(email?.value || "").trim();
    if (!ev) { showErr("email", "Email is required."); ok = false; }
    else if (!validateEmail(ev)) { showErr("email", "Enter a valid email address."); ok = false; }

    if (!String(phone?.value || "").trim()) { showErr("phone", "Phone number is required."); ok = false; }

    if (!String(lokacija?.value || "").trim()) { showErr("lokacija", "Izberite lokacijo razgovora."); ok = false; }

    if (!agree?.checked) { showErr("agree", "You must agree before submitting."); ok = false; }

    const f = cvFile?.files && cvFile.files[0];
    if (f) {
      if (f.type !== "application/pdf") { showErr("cvFile", "Please upload a PDF file."); ok = false; }
      if (bytesToMB(f.size) > 5) { showErr("cvFile", "File is too large. Max 5MB."); ok = false; }
    }

    return ok;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Pošiljanje...";
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const jobSlug = urlParams.get('job');

      let jobTitle = 'General Application';
      let jobId = null;
      if (jobSlug) {
        const { getJobBySlug } = await import('./jobs-db.js');
        const job = await getJobBySlug(jobSlug);
        if (job) {
          jobId = job.id;
          jobTitle = job.title_en || jobTitle;
        }
      }

      const cvFileInput = cvFile?.files?.[0] || null;
      let cvPath = '';
      if (cvFileInput) {
        cvPath = await uploadCVOnly(cvFileInput);
      }

      // Traffic source: captured on landing by pixel.js, fall back to current URL or "spletna stran".
      let vir = 'spletna stran';
      try {
        const stored = sessionStorage.getItem('vir_prijave');
        const here = new URLSearchParams(window.location.search);
        vir = stored || here.get('vir') || here.get('utm_source') || vir;
      } catch (_) { /* sessionStorage unavailable */ }

      const submission = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        jobTitle: jobTitle,
        jobSlug: jobSlug || '',
        jobId: jobId || '',
        lokacija: lokacija?.value?.trim() || '',
        vir: vir,
        preferredInterviewTime: $("interviewTime")?.value?.trim() || '',
        message: $("message")?.value?.trim() || '',
        cvPath: cvPath,
        submittedAt: new Date().toISOString()
      };

      fetch('https://n8n.dkrivec.com/webhook/05a9733c-c702-4ceb-8f52-5fa7e92b3e81', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submission,
          source: window.location.href,
          page: window.location.pathname
        })
      }).catch(err => console.warn('Webhook notify failed:', err));

      // Push the lead into GoHighLevel (fire-and-forget — must never block the user flow).
      // Field keys match the GHL custom fields: izbrano_delovno_mesto / lokacija_interesa / vir_prijave.
      if (CONFIG.ghl?.inboundWebhookUrl) {
        fetch(CONFIG.ghl.inboundWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: submission.firstName,
            last_name: submission.lastName,
            email: submission.email,
            phone: submission.phone,
            izbrano_delovno_mesto: submission.jobTitle,
            izbrano_delovno_mesto_slug: submission.jobSlug,
            lokacija_interesa: submission.lokacija,
            vir_prijave: submission.vir,
            preferred_interview_time: submission.preferredInterviewTime,
            message: submission.message,
            source_url: window.location.href,
            submitted_at: submission.submittedAt,
            tags: ['obrazec_izpolnjen']
          })
        }).catch(err => console.warn('GHL webhook failed:', err));
      }

      await sendApplicationEmail(submission);

      // Meta Pixel conversion: online application submitted.
      if (window.fbq) {
        window.fbq('track', 'Lead', { content_name: submission.jobTitle, content_category: submission.lokacija });
        window.fbq('trackCustom', 'SubmitApplication', { job: submission.jobTitle, lokacija: submission.lokacija, vir: submission.vir });
      }

      openSuccessModal();

      form.reset();
      clearAllErrs();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Oddaj prijavo →";
      }
      const cvNameEl = $("cvFileName");
      if (cvNameEl) {
        cvNameEl.style.display = "none";
        cvNameEl.textContent = "";
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMsg = error?.message || 'Neznana napaka';
      alert(`Pri oddaji prijave je prišlo do napake: ${errorMsg}\n\nProsimo, poskusite znova ali nas kontaktirajte na office@win-win.si.`);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Oddaj prijavo →";
      }
    }
  });
}

function setupScrollReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-animate]"));
  if (!nodes.length) return;

  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.12 }
  );
  nodes.forEach(n => io.observe(n));
}

function main() {
  setYear();
  setupUpload();
  renderNextSteps();
  setupForm();
  setupScrollReveal();
  initBurgerMenu();
}

main();
