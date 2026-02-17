/**
 * apply.js — EN Apply page (pure HTML/CSS/JS)
 * - File upload UI (PDF)
 * - Form validation and submission to Supabase
 * - Renders "What happens next" cards
 */

import { submitApplication, sendApplicationEmail } from './jobs-db.js';
import { initBurgerMenu } from './ui.js';

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
  const agree = $("agree");
  const cvFile = $("cvFile");

  const successBox = $("successBox");
  const submitBtn = $("submitBtn");

  const clearAllErrs = () => {
    ["firstName", "lastName", "email", "phone", "agree", "cvFile"].forEach(clearErr);
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
      submitBtn.textContent = "Submitting...";
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const jobSlug = urlParams.get('job');

      const applicationData = {
        first_name: firstName.value.trim(),
        last_name: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        preferred_interview_time: $("interviewTime")?.value?.trim() || '',
        message: $("message")?.value?.trim() || '',
        status: 'new'
      };

      let jobTitle = 'General Application';
      if (jobSlug) {
        const { getJobBySlug } = await import('./jobs-db.js');
        const job = await getJobBySlug(jobSlug);
        if (job) {
          applicationData.job_id = job.id;
          jobTitle = job.title_en || jobTitle;
        }
      }

      const cvFileInput = cvFile?.files?.[0] || null;
      const result = await submitApplication(applicationData, cvFileInput);

      sendApplicationEmail({
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        jobTitle: jobTitle,
        preferredInterviewTime: $("interviewTime")?.value?.trim() || '',
        message: $("message")?.value?.trim() || '',
        cvUrl: result.cvUrl || 'No CV uploaded'
      }).catch(emailError => {
        console.log('Email notification not sent (optional feature):', emailError);
      });

      if (successBox) {
        successBox.style.display = "block";
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      setTimeout(() => {
        form.reset();
        clearAllErrs();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Application";
        }
        if (successBox) successBox.style.display = "none";

        const name = $("cvFileName");
        if (name) {
          name.style.display = "none";
          name.textContent = "";
        }
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Application";
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
