/**
 * academy.js — Akademija Win Win (magazine long-read)
 * Reading progress bar, video embeds, and an interactive knowledge quiz.
 */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ---------- top reading progress ---------- */
function initScrollProgress() {
  const bar = $("#acProgressBar");
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = `${Math.min(100, Math.max(0, scrolled * 100))}%`;
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- videos ---------- */
function initVideos() {
  $$(".ac-video").forEach((v) => {
    v.addEventListener("click", () => {
      const yt = v.dataset.yt;
      if (!yt) {
        const thumb = $(".ac-video-thumb", v);
        if (thumb) thumb.innerHTML = '<span style="color:rgba(255,255,255,0.7);font-size:0.9rem;font-weight:600;padding:0 20px;text-align:center">Video bo kmalu na voljo.</span>';
        return;
      }
      const wrap = document.createElement("div");
      wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${yt}?autoplay=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      v.replaceChildren(wrap.firstChild);
    });
  });
}

/* ---------- QUIZ ---------- */
const QUIZ = [
  { q: "Kako poteka komunikacija z vodjo in back-office?",
    options: ["Izključno preko e-maila", "Predvsem po telefonu", "Preko SMS sporočil", "Osebno na sedežu"], correct: 0,
    explain: "Komunikacija poteka izključno preko e-maila — to zagotavlja sledljivost, preglednost in odgovornost. Telemach obdela tudi do 1800 zahtevkov na uro." },
  { q: "Kaj pomeni zelena kljukica (PMP) v sistemu?",
    options: ["100 % zagotovljen priklop", "Da priklop NI nikoli mogoč", "Ne pomeni 100 % zagotovljenega priklopa", "Da je pogodba že aktivirana"], correct: 2,
    explain: "Zelena kljukica ne pomeni 100 % zagotovljenega priklopa. Zaplete lahko povzročijo nepopolne baze, gradbene spremembe, stara infrastruktura ali signalne motnje." },
  { q: "V kolikšnem roku moraš odgovoriti na obvestilo o zavrnitvi ali morebitni stornaciji?",
    options: ["V 7 dneh", "V 24 urah", "V 72 urah", "Ni roka"], correct: 1,
    explain: "Vodja prejme obvestilo z razlogom in 24-urnim rokom za odziv. Pri stornacijah fiksnega omrežja je odziv v 24 urah obvezen." },
  { q: "Koliko časa traja priklop na našem omrežju (COAX / optika / 5G), če ni gradbenih del?",
    options: ["Do 72 ur (3 delovni dnevi)", "Do 1 meseca", "2–5 tednov", "Do 5 delovnih dni"], correct: 0,
    explain: "Na že izgrajenem priključku se priklop izvede v roku 3 delovnih dni (do 72 ur). Če so potrebna gradbena dela, do 1 meseca." },
  { q: "Do kolikšnega zneska Telemach sofinancira izgradnjo OPTIČNEGA (FTTH) priključka?",
    options: ["Do 200 €", "Do 250 €", "Do 600 €", "Ne sofinancira"], correct: 2,
    explain: "Naša optika (FTTH): sofinanciranje do 600 €. Naš COAX: do 200 €. RUNE: priključnina do 250 € (brez popusta)." },
  { q: "Kaj pomeni status s kodo 80?",
    options: ["Waiting for customer", "Completed — pogodba aktivirana", "Canceled", "PMP in process"], correct: 1,
    explain: "Koda 80 = Completed (pogodba uspešno aktivirana). Koda 90 = Canceled, koda 35 = PMP in process, koda 13 = Waiting for customer." },
  { q: "Koliko znaša doplačilo za vsak dodatni EON Box nad vključenimi?",
    options: ["Brezplačno", "5 €/mesec", "7,99 €/mesec", "10 €/mesec"], correct: 1,
    explain: "Vsak dodatni EON Box nad vključenimi se zaračuna 5 €/mesec po veljavnem ceniku — trenutno brez izjem." },
  { q: "Kaj je potrebno za prenos MOBILNE številke?",
    options: ["SPP oznaka", "Username operaterja", "Izključno številka računa", "Davčna številka"], correct: 2,
    explain: "Za prenos mobilne številke je potrebna izključno številka računa (lahko tudi referenčna številka s položnice)." },
  { q: "Kje so navedene dejanske mobilne številke strank?",
    options: ["Na osnovni pogodbi", "V prilogi Zahtevek za prenos", "Na računu", "Nikjer"], correct: 1,
    explain: "Na osnovni pogodbi so vidne začasne (tehnične) številke. Dejanske številke so v prilogi Zahtevek za prenos — prisotnost tam pomeni, da bo prenos izveden." },
  { q: "Kaj pomenijo prve štiri številke računa pri Telekomu in A1?",
    options: ["Šifro stranke", "Leto in mesec izdaje računa", "Vrsto paketa", "Poštno številko"], correct: 1,
    explain: "Prve štiri številke označujejo leto in mesec izdaje (npr. 2506 = junij 2025). Star račun naj stranka nadomesti z novejšim." },
  { q: "Kaj EON Smart Box obvezno potrebuje za delovanje?",
    options: ["Koaksialni kabel", "UTP kabel", "Satelitski krožnik", "Conax kartico"], correct: 1,
    explain: "EON Smart Box za delovanje potrebuje UTP kabel. Conax kartica omogoča le sliko v živo (brez ogleda za nazaj)." },
  { q: "Koliko časa traja priklop na Telekomovi optiki (že izgrajen priključek)?",
    options: ["Do 72 ur", "20–30 dni", "2–3 mesece", "5 delovnih dni"], correct: 1,
    explain: "Na Telekomovi optiki (že izgrajen priključek) se priklop izvede v 20–30 dni. Na OŠO/RUNE 30–45 dni. Za tujo tehnologijo je potreben FNP obrazec." },
];

function initQuiz() {
  const root = $("#acQuiz");
  if (!root) return;
  let i = 0, score = 0, answered = false;
  const qEl = $("#quizQuestion"), optsEl = $("#quizOptions"), fbEl = $("#quizFeedback"),
        progEl = $("#quizProgress"), nextBtn = $("#quizNext"), dotsEl = $("#quizDots"),
        stage = $("#quizStage"), result = $("#acResult");

  dotsEl.innerHTML = QUIZ.map(() => `<span class="ac-quiz-dot"></span>`).join("");
  const dots = $$(".ac-quiz-dot", dotsEl);

  function render() {
    answered = false;
    const item = QUIZ[i];
    progEl.textContent = `Vprašanje ${i + 1} od ${QUIZ.length}`;
    qEl.textContent = item.q;
    fbEl.classList.remove("is-show"); fbEl.innerHTML = "";
    nextBtn.disabled = true;
    nextBtn.textContent = i === QUIZ.length - 1 ? "Zaključi test" : "Naprej";
    optsEl.innerHTML = item.options.map((o, idx) => `
      <button class="ac-quiz-opt" data-idx="${idx}" type="button">
        <span class="mark">${String.fromCharCode(65 + idx)}</span><span>${o}</span>
      </button>`).join("");
    $$(".ac-quiz-opt", optsEl).forEach((b) => b.addEventListener("click", () => choose(b)));
    dots.forEach((d, k) => { d.classList.toggle("is-current", k === i); d.classList.toggle("is-done", k < i); });
  }

  function choose(btn) {
    if (answered) return;
    answered = true;
    const item = QUIZ[i];
    const chosen = Number(btn.dataset.idx);
    const opts = $$(".ac-quiz-opt", optsEl);
    opts.forEach((o) => { o.disabled = true; });
    opts[item.correct].classList.add("is-correct");
    if (chosen === item.correct) score++; else btn.classList.add("is-wrong");
    dots[i].classList.add("is-done");
    fbEl.innerHTML = (chosen === item.correct ? "<b>Pravilno! </b>" : "<b>Ni pravilno. </b>") + item.explain;
    fbEl.classList.add("is-show");
    nextBtn.disabled = false;
  }

  nextBtn.addEventListener("click", () => { if (i < QUIZ.length - 1) { i++; render(); } else finish(); });

  function finish() {
    stage.style.display = "none";
    const pct = Math.round((score / QUIZ.length) * 100);
    const pass = pct >= 80;
    const ring = $("#resultRing");
    const C = 2 * Math.PI * 64;
    ring.style.strokeDasharray = `${C}`;
    ring.style.strokeDashoffset = `${C}`;
    ring.style.stroke = pass ? "#16a34a" : "var(--red-600)";
    $("#resultPct").textContent = `${pct}%`;
    $("#resultTitle").textContent = pass ? "Odlično! Test uspešno opravljen 🎉" : "Skoraj! Še malo ponovi.";
    $("#resultMsg").textContent = pass
      ? `Pravilno si odgovoril na ${score} od ${QUIZ.length} vprašanj. Pripravljen si za delo na terenu.`
      : `Pravilnih odgovorov: ${score} od ${QUIZ.length}. Za uspešno opravljen test potrebuješ vsaj 80 %. Ponovi poglavja in poskusi znova.`;
    result.classList.add("is-show");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ring.style.transition = "stroke-dashoffset 1s ease";
      ring.style.strokeDashoffset = `${C * (1 - pct / 100)}`;
    }));
  }

  $("#quizRetry").addEventListener("click", () => {
    i = 0; score = 0;
    result.classList.remove("is-show");
    $("#resultRing").style.transition = "none";
    stage.style.display = "";
    render();
  });

  render();
}

function init() {
  document.body.classList.add("ac-body");
  initScrollProgress();
  initVideos();
  initQuiz();
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
