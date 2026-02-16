/**
 * About-SL page renderer (pure HTML/CSS/JS) — same style approach as home.js
 * - Renders Vision/Mission, Values (with clean SVG icons), Culture, Team, FAQ, SEO.
 * - Uses SAME IDs/structure as your EN about.js (so it drops in easily).
 */

const CONTENT = {
  about: {
    hero: {
      title: "O Win Win",
      description:
        "Smo ekipa, ki živi prodajo. Win Win d.o.o. je bil zgrajen na prepričanju, da se lahko prodaja izvaja drugače — pošteno, etično in z dolgoročnim razmišljanjem.",
      img: "https://6949b72b30e1aa8ca4b7eef2.imgix.net/slomap.png?auto=compress&cs=tinysrgb&w=2200",
    },

    vision: {
      title: "Naša vizija",
      description:
        "Postati najbolj učinkovito in spoštovano prodajno podjetje v Sloveniji, znano po naši integriteti, rezultatih in zavezanosti tako strankam kot članom ekipe.",
      icon: "target",
    },

    mission: {
      title: "Naša misija",
      description:
        "Zagotavljati več vrednosti strankam, kot pričakujejo, skozi zaupanje, strukturo in vrhunsko prodajno strokovnost. Gradimo dolgoročne odnose, ki koristijo vsem vključenim.",
      icon: "heart",
    },

    values: {
      title: "Naše temeljne vrednote",
      description: "Ti principi vodijo vse, kar počnemo, in določajo, kdo smo kot podjetje",
      items: [
        {
          icon: "shield",
          title: "Integriteta in poštenost",
          description: "Gradimo zaupanje skozi transparentno komunikacijo in etične poslovne prakse",
          image: "https://6949b72b30e1aa8ca4b7eef2.imgix.net/winwin.webp?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "handshake",
          title: "Zanesljivost",
          description: "Naše stranke in člani ekipe se lahko zanašajo na nas pri izpolnjevanju naših zavez",
          image: "https://6949b72b30e1aa8ca4b7eef2.imgix.net/slomap.png?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "message",
          title: "Profesionalna komunikacija",
          description: "Jasna, spoštljiva in učinkovita komunikacija v vsaki interakciji",
          image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "trendUp",
          title: "Uspešnost in rast",
          description: "Nenehno izboljševanje in merljivi rezultati poganjajo naš uspeh",
          image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "heart",
          title: "Ekipna podpora",
          description: "Skupaj uspemo skozi sodelovanje in medsebojno podporo",
          image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1100",
        },
        {
          icon: "award",
          title: "Odličnost",
          description: "Stremimo k najvišjim standardom v vsem, kar počnemo",
          image: "https://images.pexels.com/photos/5849585/pexels-photo-5849585.jpeg?auto=compress&cs=tinysrgb&w=1100",
        },
      ],
    },

    culture: {
      title: "Podjetniška kultura",
      description: "Zgradili smo okolje, kjer lahko nadarjeni strokovnjaki uspevajo",
      items: [
        "Rezultatno usmerjen način razmišljanja z jasnimi KPI-ji",
        "Ekipno sodelovanje in deljenje znanja",
        "Nenehno učenje in razvoj veščin",
        "Programi coachinga in mentorstva",
        "Priznanje in nagrade za odličnost",
        "Ravnovesje med delom in zasebnim življenjem ter fleksibilnost",
      ],
    },

    team: {
      title: "Naša ekipa",
      description:
        "Delujemo z več lokacij po Sloveniji z rastočo ekipo predanih prodajnih strokovnjakov",
      stats: [
        { icon: "users", value: "50+", label: "Aktivnih članov ekipe" },
        { icon: "mapPin", value: "Teren", label: "Terenska prodaja" },
        { icon: "headset", value: "Klicni center", label: "Podpora" },
        { icon: "award", value: "Več lokacij", label: "Trzin, Kranj in teren" },
      ],
    },

    faq: {
      titleHtml: 'Pogosto zastavljena <span class="text-red">vprašanja</span>',
      description: "Vse, kar moraš vedeti o pridružitvi Win Win",
      still: "Še vedno imaš vprašanja?",
      button: "Kontaktiraj nas",
      items: [
        {
          q: "Ali potrebujem prejšnje prodajne izkušnje?",
          a: "Ne. Prejšnje prodajne izkušnje so prednost, vendar niso obvezne. Zagotavljamo strukturirano uvajanje, skripte in nenehni coaching. Najpomembnejši sta motivacija, disciplina in pripravljenost za učenje.",
        },
        {
          q: "Kakšne vrste prodaje bom opravljal?",
          a: "Delal boš v B2C prodaji, bodisi terenski prodaji od vrat do vrat ali prodaji v klicnem centru. Prodajal boš telekomunikacijske storitve, vključno s pogodbami za internet, TV in mobilne storitve za končne stranke.",
        },
        {
          q: "Ali gre za redno zaposlitev ali delo preko avtorske pogodbe?",
          a: "Možni sta obe možnosti. Odvisno od tvojega profila in dogovora lahko delaš kot redno zaposlen ali kot samostojni podjetnik (s.p. / sodelovanje s podjetjem).",
        },
        {
          q: "Kakšni so delovni časi?",
          a: "Delovni časi so strukturirani in jasno določeni. Urniki za teren in klicni center so organizirani tako, da podpirajo produktivnost in ravnovesje med delom in zasebnim življenjem. Specifični urniki se razpravljajo med razgovorom.",
        },
        {
          q: "Kako deluje plačilo?",
          a: "Prejmeš osnovno plačo ali urno postavko plus provizijo, odvisno od uspešnosti. Tvoj zaslužek je neposredno odvisen od tvojih rezultatov. Visoko uspešni posamezniki lahko dosežejo nadpovprečen mesečni dohodek.",
        },
      ],
    },

    seo: {
      summaryTitle: "O Win Win Sales Team - Vodilno prodajno podjetje v Sloveniji",
      html: (typeof window !== "undefined" && window.__WW_SEO_ABOUT_SL__) || // optional hook if you inject full SEO elsewhere
        "<p><strong>Win Win Sales Team – Zgodba uspeha slovenskega prodajnega podjetja</strong></p>" +
        "<p>Win Win Sales Team je vodilno slovensko podjetje, specializirano za neposredno prodajo, terensko prodajo, klicni center in telekomunikacijske storitve.</p>",
    },
  },
};

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

/** Clean SVG icon set (same idea as your home icons fix) */
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
    <div class="card glass" style="padding: 26px;">
      <div class="card-ic" aria-hidden="true" style="margin-bottom: 14px;">
        ${ICONS[c.icon] || ICONS.target}
      </div>
      <h3 class="h3" style="margin: 0 0 10px;">${escapeHtml(c.title)}</h3>
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
      <div style="position:relative; height: 180px;">
        <img src="${escapeHtml(v.image)}" alt="${escapeHtml(v.title)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
        <div style="position:absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,.8), transparent);"></div>
        <div class="card-ic" aria-hidden="true" style="position:absolute; left: 16px; bottom: 16px; width: 44px; height: 44px; border-radius: 12px; background: rgba(239,68,68,.16); display:flex; align-items:center; justify-content:center;">
          ${ICONS[v.icon] || ICONS.award}
        </div>
      </div>
      <div style="padding: 18px;">
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
    <div class="card glass" style="display:flex; gap:12px; align-items:flex-start; padding: 18px;">
      <span aria-hidden="true" style="width:18px; height:18px; border-radius:999px; background: rgba(239,68,68,.18); display:inline-flex; align-items:center; justify-content:center; margin-top:2px;">
        <span style="width:6px; height:6px; border-radius:999px; background: rgba(239,68,68,1); display:block;"></span>
      </span>
      <div class="card-p" style="margin:0;">${escapeHtml(text)}</div>
    </div>
  `
    )
    .join("");
}

function renderTeam() {
  const root = $("aboutTeamStats"); // keep SAME id as your EN file
  if (!root) return;

  root.innerHTML = CONTENT.about.team.stats
    .map(
      (s) => `
    <div class="card glass" style="text-align:center; padding: 22px;">
      <div class="card-ic" aria-hidden="true" style="margin: 0 auto 12px;">
        ${ICONS[s.icon] || ICONS.users}
      </div>
      <div style="font-weight: 900; font-size: 22px; margin-bottom: 6px;">${escapeHtml(s.value)}</div>
      <div class="p-muted" style="font-weight: 700; margin-bottom: 4px;">${escapeHtml(s.label)}</div>
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
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
    },
    { threshold: 0.12 }
  );
  nodes.forEach((n) => io.observe(n));
}

function fillText() {
  if ($("year")) $("year").textContent = String(new Date().getFullYear());

  // hero
  if ($("aboutHeroImg")) $("aboutHeroImg").src = CONTENT.about.hero.img;
  if ($("aboutHeroTitle")) $("aboutHeroTitle").textContent = CONTENT.about.hero.title;
  if ($("aboutHeroDesc")) $("aboutHeroDesc").textContent = CONTENT.about.hero.description;

  // values header
  if ($("aboutValuesTitle")) $("aboutValuesTitle").textContent = CONTENT.about.values.title;
  if ($("aboutValuesDesc")) $("aboutValuesDesc").textContent = CONTENT.about.values.description;

  // culture header
  if ($("aboutCultureTitle")) $("aboutCultureTitle").textContent = CONTENT.about.culture.title;
  if ($("aboutCultureDesc")) $("aboutCultureDesc").textContent = CONTENT.about.culture.description;

  // team header
  if ($("aboutTeamTitle")) $("aboutTeamTitle").textContent = CONTENT.about.team.title;
  if ($("aboutTeamDesc")) $("aboutTeamDesc").textContent = CONTENT.about.team.description;

  // FAQ header/buttons
  if ($("faqTitle")) $("faqTitle").innerHTML = CONTENT.about.faq.titleHtml;
  if ($("faqDesc")) $("faqDesc").textContent = CONTENT.about.faq.description;
  if ($("faqStill")) $("faqStill").textContent = CONTENT.about.faq.still;
  if ($("faqBtn") && $("faqBtn").childNodes && $("faqBtn").childNodes[0]) {
    $("faqBtn").childNodes[0].textContent = CONTENT.about.faq.button + " ";
  }

  // SEO accordion
  if ($("seoSummaryTitle")) $("seoSummaryTitle").textContent = CONTENT.about.seo.summaryTitle;
  if ($("seoHtml")) $("seoHtml").innerHTML = CONTENT.about.seo.html;
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

main();
