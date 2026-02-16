/**
 * insights-sl.js (pure HTML/CSS/JS)
 * - Same behavior as EN: year + scroll reveal
 * - For now: empty state (no posts). Later we will render posts into #insightsGrid.
 */

function $(id) { return document.getElementById(id); }

function setupScrollReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-animate]"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
    },
    { threshold: 0.12 }
  );
  nodes.forEach((n) => io.observe(n));
}

function main() {
  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());
  setupScrollReveal();
}

main();
