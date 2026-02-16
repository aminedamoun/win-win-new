/**
 * about.js — English About page renderer (pure HTML/CSS/JS)
 * Renders: Hero, Vision/Mission, Values, Culture, Team stats, FAQ, SEO.
 * Safe: will NOT crash if an element is missing.
 */

const CONTENT = {
  about: {
    hero: {
      title: "About Win Win",
      description:
        "We are a team that lives sales. Win Win d.o.o. was built on the belief that sales can be done differently — honestly, ethically, and with a long-term mindset.",
      img: "https://6949b72b30e1aa8ca4b7eef2.imgix.net/slomap.png?auto=compress&cs=tinysrgb&w=2200",
    },

    vision: {
      title: "Our Vision",
      description:
        "To become the most effective and respected sales company in Slovenia, known for our integrity, results, and commitment to both clients and team members.",
      icon: "target",
    },

    mission: {
      title: "Our Mission",
      description:
        "To deliver more value to customers than they expect, through trust, structure, and top-level sales expertise. We build long-term relationships that benefit everyone involved.",
      icon: "heart",
    },

    values: {
      title: "Our Core Values",
      description: "These principles guide everything we do and define who we are as a company",
      items: [
        {
          icon: "shield",
          title: "Integrity & Honesty",
          description: "We build trust through transparent communication and ethical business practices",
          image: "https://6949b72b30e1aa8ca4b7eef2.imgix.net/winwin.webp?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "handshake",
          title: "Reliability",
          description: "Our clients and team members can count on us to deliver on our commitments",
          image: "https://6949b72b30e1aa8ca4b7eef2.imgix.net/slomap.png?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "message",
          title: "Professional Communication",
          description: "Clear, respectful, and effective communication in every interaction",
          image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "trendUp",
          title: "Performance & Growth",
          description: "Continuous improvement and measurable results drive our success",
          image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "heart",
          title: "Team Support",
          description: "We succeed together through collaboration and mutual support",
          image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "award",
          title: "Excellence",
          description: "We strive for the highest standards in everything we do",
          image: "https://images.pexels.com/photos/5849585/pexels-photo-5849585.jpeg?auto=compress&cs=tinysrgb&w=1100",
        },
      ],
    },

    culture: {
      title: "Company Culture",
      description: "We've built an environment where talented professionals can thrive",
      items: [
        "Results-driven mindset with clear KPIs",
        "Team collaboration and knowledge sharing",
        "Continuous learning and skill development",
        "Coaching and mentoring programs",
        "Recognition and rewards for excellence",
        "Work-life balance and flexibility",
      ],
    },

    team: {
      title: "Our Team",
      description:
        "We operate from multiple locations across Slovenia with a growing team of dedicated sales professionals",
      stats: [
        { icon: "users", value: "50+", label: "Active Team Members" },
        { icon: "mapPin", value: "Field", label: "Field Sales" },
        { icon: "headset", value: "Call Center", label: "Call Center" },
        { icon: "award", value: "Multiple Locations", label: "Trzin, Kranj & nationwide field ops" },
      ],
    },

    faq: {
      titleHtml: 'Frequently Asked <span class="text-red">Questions</span>',
      description: "Everything you need to know about joining Win Win",
      still: "Still have questions?",
      button: "Get in Touch",
      items: [
        {
          q: "Do I need previous sales experience?",
          a: "No. Previous sales experience is an advantage, but it is not mandatory. We provide structured onboarding, scripts, and continuous coaching. What matters most is motivation, discipline, and the willingness to learn.",
        },
        {
          q: "What type of sales will I be doing?",
          a: "You will work in B2C sales, either door-to-door field sales or call center sales. You will sell telecommunications services, including Internet, TV, and Mobile contracts for end customers.",
        },
        {
          q: "Is this a full-time position or freelance work?",
          a: "Both options are possible. Depending on your profile and agreement, you can work as a full-time employee or as a freelancer (s.p. / company collaboration).",
        },
        {
          q: "What are the working hours?",
          a: "Working hours are structured and clearly defined. Field and call center schedules are organized to support productivity and work-life balance. Specific schedules are discussed during the interview.",
        },
        {
          q: "How does payment work?",
          a: "You receive a base salary or hourly rate plus performance-based commission. Your earnings depend directly on your results. High performers can achieve above-average monthly income.",
        },
      ],
    },

    seo: {
      summaryTitle: "About Win Win Sales Team - Leading Sales Company in Slovenia",
      html:
        "<p><strong>Win Win Sales Team – Built for performance, powered by people</strong></p>" +
        "<p>Win Win is a results-driven sales organization operating across Slovenia through B2C field sales, call center operations, and B2B professional sales. Our focus is on developing sales talent with structured onboarding, coaching culture, and clear performance systems.</p>",
    },
  },
};

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function setHTML(id, value) {
  const el = $(id);
  if (el) el.innerHTML = value;
}

function setSrc(id, value) {
  const el = $(id);
  if (el) el.src = value;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** Clean SVG icon set */
const ICONS = {
  target: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
      <path d="M12 22a10 10 0 1 0-10-10"/>
      <path d="M22 12A10 10 0 0 0 12 2"/>
      <path d="M12 2v3"/><path d="M2 12h3"/><path d="M12 19v3"/><path d="M19 12h3"/>
    </svg>
  `,
  heart: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M20.8 6.6a5.4 5.4 0 0 0-7.6 0L12 7.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 22l7.6-6.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/>
    </svg>
  `,
  shield: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 2 20 6v6c0 5-3.3 9.4-8 10-4.7-.6-8-5-8-10V6l8-4Z"/>
      <path d="M9.5 12.2 11.2 14l3.6-4"/>
    </svg>
  `,
  handshake: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M7 12l2-2a3 3 0 0 1 4.2 0l.8.8"/>
      <path d="M3 11l4-4 4 4-4 4-4-4Z"/>
      <path d="M21 11l-4-4-4 4 4 4 4-4Z"/>
      <path d="M8.5 15.5l1 1a2.5 2.5 0 0 0 3.5 0l3-3"/>
      <path d="M10 18l.7.7a2 2 0 0 0 2.8 0L15 17"/>
    </svg>
  `,
  message: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>
      <path d="M7 8h10"/><path d="M7 12h7"/>
    </svg>
  `,
  trendUp: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 17l6-6 4 4 7-7"/>
      <path d="M14 8h6v6"/>
    </svg>
  `,
  users: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.9"/>
      <path d="M16 3.1a4 4 0 0 1 0 7.8"/>
    </svg>
  `,
  mapPin: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 22s7-4.4 7-12a7 7 0 0 0-14 0c0 7.6 7 12 7 12Z"/>
      <path d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
    </svg>
  `,
  headset: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 0 1 16 0v6a2 2 0 0 1-2 2h-2"/>
      <path d="M4 12v5a2 2 0 0 0 2 2h2"/>
      <path d="M6 12a6 6 0 0 1 12 0"/>
      <path d="M8 21h8"/>
    </svg>
  `,
  award: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/>
      <path d="M9 14.5 7 22l5-2 5 2-2-7.5"/>
    </svg>
  `,
};

function renderVisionMission() {
  const root = $("aboutVM");
  if (!root) return;

  const cards = [CONTENT.about.vision, CONTENT.about.mission];

  root.innerHTML = cards
    .map(
      (c) => `
      <div class="card glass" style="padding:26px;">
        <div class="card-ic" aria-hidden="true" style="margin-bottom:14px;">
          ${ICONS[c.icon] || ICONS.target}
        </div>
        <h3 class="h3" style="margin:0 0 10px;">${escapeHtml(c.title)}</h3>
        <p class="p-muted" style="margin:0;">${escapeHtml(c.description)}</p>
      </div>
    `
    )
    .join("");
}

function renderValues() {
  const root = $("aboutValuesGrid");
  if (!root) return;

  root.innerHTML = CONTENT.about.values.items
    .map(
      (v) => `
      <div class="card glass" style="overflow:hidden;">
        <div style="position:relative; height:180px;">
          <img src="${escapeHtml(v.image)}" alt="${escapeHtml(v.title)}" loading="lazy"
               style="width:100%;height:100%;object-fit:cover;">
          <div style="position:absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,.8), transparent);"></div>
          <div class="card-ic" aria-hidden="true"
               style="position:absolute; left:16px; bottom:16px; width:44px; height:44px; border-radius:12px;
                      background: rgba(239,68,68,.16); display:flex; align-items:center; justify-content:center;">
            ${ICONS[v.icon] || ICONS.award}
          </div>
        </div>
        <div style="padding:18px;">
          <h4 class="card-h">${escapeHtml(v.title)}</h4>
          <p class="card-p">${escapeHtml(v.description)}</p>
        </div>
      </div>
    `
    )
    .join("");
}

function renderCulture() {
  const root = $("aboutCultureGrid");
  if (!root) return;

  root.innerHTML = CONTENT.about.culture.items
    .map(
      (text) => `
      <div class="card glass" style="display:flex; gap:12px; align-items:flex-start; padding:18px;">
        <span aria-hidden="true"
              style="width:18px;height:18px;border-radius:999px;background:rgba(239,68,68,.18);
                     display:inline-flex;align-items:center;justify-content:center;margin-top:2px;">
          <span style="width:6px;height:6px;border-radius:999px;background:rgba(239,68,68,1);display:block;"></span>
        </span>
        <div class="card-p" style="margin:0;">${escapeHtml(text)}</div>
      </div>
    `
    )
    .join("");
}

function renderTeam() {
  const root = $("aboutTeamStats");
  if (!root) return;

  root.innerHTML = CONTENT.about.team.stats
    .map(
      (s) => `
      <div class="card glass" style="text-align:center; padding:22px;">
        <div class="card-ic" aria-hidden="true" style="margin:0 auto 12px;">
          ${ICONS[s.icon] || ICONS.users}
        </div>
        <div style="font-weight:900; font-size:22px; margin-bottom:6px;">${escapeHtml(s.value)}</div>
        <div class="p-muted" style="font-weight:700; margin:0;">${escapeHtml(s.label)}</div>
      </div>
    `
    )
    .join("");
}

function renderFaq() {
  const root = $("faqList");
  if (!root) return;

  root.innerHTML = CONTENT.about.faq.items
    .map(
      (x) => `
      <details class="faq">
        <summary>
          <span>${escapeHtml(x.q)}</span>
          <span class="chev" aria-hidden="true">⌄</span>
        </summary>
        <div class="faq-body">${escapeHtml(x.a)}</div>
      </details>
    `
    )
    .join("");
}

function setupScrollReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-animate]"));
  if (!nodes.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
    },
    { threshold: 0.12 }
  );
  nodes.forEach((n) => io.observe(n));
}

function fillText() {
  // year (footer)
  setText("year", String(new Date().getFullYear()));

  // hero
  setSrc("aboutHeroImg", CONTENT.about.hero.img);
  setText("aboutHeroTitle", CONTENT.about.hero.title);
  setText("aboutHeroDesc", CONTENT.about.hero.description);

  // values header
  setText("aboutValuesTitle", CONTENT.about.values.title);
  setText("aboutValuesDesc", CONTENT.about.values.description);

  // culture header
  setText("aboutCultureTitle", CONTENT.about.culture.title);
  setText("aboutCultureDesc", CONTENT.about.culture.description);

  // team header
  setText("aboutTeamTitle", CONTENT.about.team.title);
  setText("aboutTeamDesc", CONTENT.about.team.description);

  // FAQ header/buttons
  setHTML("faqTitle", CONTENT.about.faq.titleHtml);
  setText("faqDesc", CONTENT.about.faq.description);
  setText("faqStill", CONTENT.about.faq.still);

  // safer than childNodes[0]
  const btn = $("faqBtn");
  if (btn) {
    btn.innerHTML = `${escapeHtml(CONTENT.about.faq.button)} <span aria-hidden="true">→</span>`;
  }

  // SEO accordion
  setText("seoSummaryTitle", CONTENT.about.seo.summaryTitle);
  setHTML("seoHtml", CONTENT.about.seo.html);
}

function main() {
  fillText();
  renderVisionMission();
  renderValues();
  renderCulture();
  renderTeam();
  renderFaq();
  setupScrollReveal();
}

// Wait for DOM so IDs exist
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
