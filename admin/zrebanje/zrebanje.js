/* ============================================================
   /admin/zrebanje/ — Win-Win giveaway draw
   - Login via Supabase auth (same project as /admin/applications/)
   - Loads all rows from public.giveaway_entries
   - Casino-style slot spin → reveals 3 winners sequentially
   - Confetti burst on each winner
   - Persists winners to public.giveaway_winners (zapisnik)
   - Demo toggle injects 30 fake entries so the UI is testable
     before real entries arrive
   ============================================================ */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  document.body.innerHTML =
    '<div style="padding:40px;font-family:system-ui;color:#fca5a5;background:#0a0a0d;min-height:100vh;">' +
    '<h2>Admin not configured</h2>' +
    '<p>VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are missing at build time. ' +
    'Set them on the deploy host (Vercel) and redeploy.</p></div>';
  throw new Error("Supabase env missing");
}

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = (id) => document.getElementById(id);

/* ---------------- AUTH ---------------- */
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    $("loginScreen").style.display = "none";
    $("appScreen").style.display = "block";
    loadEntries();
  } else {
    $("loginScreen").style.display = "flex";
    $("appScreen").style.display = "none";
  }
});

$("loginBtn").addEventListener("click", async () => {
  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;
  const btn = $("loginBtn");
  const err = $("loginError");

  err.textContent = "";
  btn.disabled = true;
  btn.textContent = "Prijavljam...";

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    err.textContent = error.message;
    btn.disabled = false;
    btn.textContent = "Prijava";
  }
});
$("loginPassword").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("loginBtn").click();
});
$("logoutBtn").addEventListener("click", async () => {
  await supabase.auth.signOut();
});

/* ---------------- STATE ---------------- */
let entries = []; // all loaded entries
let winners = []; // [{position, entry}] — fills as draws complete
let drawing = false;

/* ---------------- PRIZES ---------------- */
const PRIZES_BY_POSITION = {
  1: {
    img: "/assets/img/giveaway/tv-philips-65pus8560.jpg",
    name: "Philips 65PUS8560/12",
    desc: '65" 4K UHD LED TV · Ambilight, Smart TV',
  },
  2: {
    img: "/assets/img/giveaway/vacuum-xiaomi-g20-lite.jpg",
    name: "Xiaomi G20 Lite",
    desc: "Pokončni brezžični sesalnik · 18 000 Pa",
  },
  3: {
    img: "/assets/img/giveaway/airfryer-philips-na120.jpg",
    name: "Philips NA120/00 Airfryer L",
    desc: "Cvrtnik na vroč zrak · 4,2 L, 12 programov",
  },
};

/* ---------------- DEMO DATA ---------------- */
const DEMO_NAMES = [
  ["Maja", "Horvat"], ["Aleš", "Kovač"], ["Nina", "Zupan"], ["Tomaž", "Bregar"],
  ["Klemen", "Petrovič"], ["Anja", "Krajnc"], ["Matej", "Vidmar"], ["Eva", "Novak"],
  ["Žan", "Rozman"], ["Sara", "Mavrič"], ["Luka", "Jenko"], ["Tina", "Kos"],
  ["Boris", "Hribernik"], ["Petra", "Vidovič"], ["Andraž", "Černe"], ["Lara", "Bezjak"],
  ["Matic", "Krajnc"], ["Mojca", "Žvab"], ["Rok", "Štrukelj"], ["Katja", "Pirc"],
  ["Domen", "Skrt"], ["Špela", "Repar"], ["Jure", "Korošec"], ["Polona", "Vidic"],
  ["Gašper", "Šebenik"], ["Anže", "Mlinar"], ["Vesna", "Lipovec"], ["Erik", "Šuster"],
  ["Patricija", "Cerar"], ["Miha", "Černivec"],
];
const DEMO_LOCATIONS = [
  "BTC City Ljubljana", "Mercator Center Šiška", "Aleja Ljubljana",
  "Europark Maribor", "Citycenter Celje", "Qlandia Kranj",
];
function buildDemoEntries() {
  return DEMO_NAMES.map(([ime, priimek], i) => ({
    id: `demo-${i}`,
    ime, priimek,
    email: `${ime.toLowerCase()}.${priimek.toLowerCase().replace(/[čćšž]/g, (c) =>
      ({ č: "c", ć: "c", š: "s", ž: "z" }[c]))}@primer.si`,
    telefon: `041 ${String(100 + i).padStart(3, "0")} ${String(200 + i).padStart(3, "0")}`,
    consent_location_label: DEMO_LOCATIONS[i % DEMO_LOCATIONS.length],
    created_at: new Date(Date.now() - i * 3600_000).toISOString(),
    _source: "demo",
  }));
}

/* ---------------- LOAD ---------------- */
async function loadEntries() {
  const demoOn = $("demoToggle").checked;

  if (demoOn) {
    entries = buildDemoEntries();
    paintAll();
    return;
  }

  $("statEntries").textContent = "…";
  const { data, error } = await supabase
    .from("giveaway_entries")
    .select("id, ime, priimek, email, telefon, consent_location_label, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    entries = [];
    $("statEntries").textContent = "?";
    $("statEntriesSub").textContent = error.message;
    paintEntries();
    return;
  }

  entries = (data || []).map((e) => ({ ...e, _source: "live" }));
  paintAll();
}

$("reloadBtn").addEventListener("click", loadEntries);
$("demoToggle").addEventListener("change", () => {
  resetDraw();
  loadEntries();
});

/* ---------------- PAINTING ---------------- */
function paintAll() {
  paintStats();
  paintEntries();
  updateDrawButton();
}

function paintStats() {
  $("statEntries").textContent = String(entries.length);
  $("statEntriesSub").textContent = entries.length === 1 ? "v žrebanju" : "v žrebanju";

  const locs = new Set(entries.map((e) => (e.consent_location_label || "").trim()).filter(Boolean));
  $("statLocations").textContent = String(locs.size);

  const last = entries[0];
  if (last) {
    const d = new Date(last.created_at);
    $("statLast").textContent = d.toLocaleDateString("sl-SI", { day: "2-digit", month: "2-digit", year: "numeric" });
    $("statLastSub").textContent = `${last.ime} ${last.priimek} · ${d.toLocaleTimeString("sl-SI", { hour: "2-digit", minute: "2-digit" })}`;
  } else {
    $("statLast").textContent = "—";
    $("statLastSub").textContent = "še ni prijav";
  }

  $("statWinners").textContent = String(winners.length);
}

function paintEntries(filter = "") {
  const tbody = $("entriesBody");
  if (!entries.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Brez vnosov — vsi vnosi se pojavijo, ko ljudje izpolnijo obrazec na stojnici.</td></tr>`;
    return;
  }
  const winnerIds = new Set(winners.map((w) => w.entry.id));
  const f = filter.trim().toLowerCase();
  const rows = entries
    .filter((e) => {
      if (!f) return true;
      return [e.ime, e.priimek, e.email, e.telefon, e.consent_location_label]
        .filter(Boolean).join(" ").toLowerCase().includes(f);
    })
    .map((e, i) => {
      const isWinner = winnerIds.has(e.id);
      const d = new Date(e.created_at);
      return `
        <tr class="${isWinner ? "is-winner" : ""}">
          <td>${i + 1}</td>
          <td>${escapeHtml(e.ime)} ${escapeHtml(e.priimek)}</td>
          <td>${escapeHtml(e.email)}</td>
          <td>${escapeHtml(e.telefon || "—")}</td>
          <td>${escapeHtml(e.consent_location_label || "—")}</td>
          <td>${d.toLocaleString("sl-SI", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
          <td><span class="source-tag source-tag--${e._source === "demo" ? "demo" : "live"}">${e._source === "demo" ? "demo" : "live"}</span></td>
        </tr>`;
    }).join("");
  tbody.innerHTML = rows || `<tr><td colspan="7" class="empty-state">Brez zadetkov za »${escapeHtml(filter)}«.</td></tr>`;
}

$("entriesSearch").addEventListener("input", (e) => paintEntries(e.target.value));

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

/* ---------------- DRAW ---------------- */
function updateDrawButton() {
  const btn = $("drawBtn");
  const reset = $("resetBtn");
  reset.style.display = winners.length > 0 ? "" : "none";
  if (drawing) {
    btn.disabled = true;
    btn.classList.add("is-loading");
    btn.textContent = "🎰 Vrtim slot…";
    return;
  }
  btn.classList.remove("is-loading");
  if (winners.length >= 3) {
    btn.disabled = true;
    btn.textContent = "✅ Žrebanje zaključeno";
    return;
  }
  const remaining = entries.length - winners.length;
  btn.disabled = remaining < 1;
  const nextPos = winners.length + 1;
  btn.textContent = winners.length === 0
    ? `🎰 Začni žrebanje (${entries.length} sodelujočih)`
    : `🎰 Žrebaj ${nextPos}. nagrajenca`;
}

$("drawBtn").addEventListener("click", async () => {
  if (drawing || winners.length >= 3) return;
  drawing = true;
  updateDrawButton();

  const pool = entries.filter((e) => !winners.some((w) => w.entry.id === e.id));
  if (!pool.length) { drawing = false; updateDrawButton(); return; }

  const position = winners.length + 1;
  const winner = pool[Math.floor(Math.random() * pool.length)];

  await runSlotAnimation(pool, winner, position);

  winners.push({ position, entry: winner });
  paintWinner(position, winner);
  paintStats();
  paintEntries($("entriesSearch").value);

  // Persist winner (live only — demo mode skips writes)
  if (winner._source !== "demo") {
    try {
      const session = await supabase.auth.getSession();
      const drawnBy = session?.data?.session?.user?.email || "";
      await supabase.from("giveaway_winners").insert({
        position,
        entry_id: winner.id,
        ime: winner.ime || "",
        priimek: winner.priimek || "",
        email: winner.email || "",
        telefon: winner.telefon || "",
        drawn_by: drawnBy,
      });
    } catch (e) {
      console.warn("Could not persist winner:", e);
    }
  }

  drawing = false;
  updateDrawButton();
});

$("resetBtn").addEventListener("click", () => {
  if (!confirm("Resetiraj prikaz žrebanja? (Zapisnik v bazi se NE briše — to je samo UI reset za naslednje žrebanje.)")) return;
  resetDraw();
  paintAll();
});

function resetDraw() {
  winners = [];
  drawing = false;
  $("slotEmpty").style.display = "";
  $("slotContent").style.display = "none";
  $("slotDisplay").classList.remove("is-spinning", "is-winner");
  const prizeEl = $("slotPrize");
  if (prizeEl) {
    prizeEl.classList.remove("is-visible");
    prizeEl.style.display = "none";
  }
  [1, 2, 3].forEach((i) => {
    const el = $(`winner${i}`);
    el.classList.remove("is-filled");
    el.innerHTML = `
      <span class="winner-rank"><span class="num">${i}</span>nagrada</span>
      <span class="winner-empty">— čaka na žrebanje —</span>`;
  });
  $("slotEmpty").innerHTML = `Pripravljen za žrebanje. Pritisni <strong>Začni žrebanje</strong>.`;
}

function paintWinner(position, w) {
  const el = $(`winner${position}`);
  const prize = PRIZES_BY_POSITION[position];
  el.classList.add("is-filled");
  el.innerHTML = `
    <span class="winner-rank"><span class="num">${position}</span>nagrada</span>
    <span class="winner-name">${escapeHtml(w.ime)} ${escapeHtml(w.priimek)}</span>
    <span class="winner-email">${escapeHtml(w.email)}</span>
    <span class="winner-phone">${escapeHtml(w.telefon || "")}</span>
    ${prize ? `
      <div class="winner-prize">
        <img class="winner-prize-img" src="${prize.img}" alt="${escapeHtml(prize.name)}" />
        <span class="winner-prize-name">${escapeHtml(prize.name)}<span class="small">${escapeHtml(prize.desc)}</span></span>
      </div>` : ""}`;
}

/* ---------------- SLOT ANIMATION ----------------
 *
 * Ramps up fast, then decelerates with an ease-out, lands on the chosen
 * winner. We don't pretend each tick is "random with bias" — we just
 * cycle through random pool entries during the spin, and force the last
 * tick to be the actual winner so the visible stop matches the result.
 */
function runSlotAnimation(pool, winner, position) {
  return new Promise((resolve) => {
    const display = $("slotDisplay");
    const empty = $("slotEmpty");
    const content = $("slotContent");
    const nameEl = $("slotName");
    const emailEl = $("slotEmail");
    const metaEl = $("slotMeta");
    const posEl = $("slotPosition");

    empty.style.display = "none";
    content.style.display = "";
    display.classList.remove("is-winner");
    display.classList.add("is-spinning");
    posEl.textContent = `${position}. nagrada`;

    // Hide any prize reveal from the previous round
    const prizeEl = $("slotPrize");
    if (prizeEl) {
      prizeEl.classList.remove("is-visible");
      prizeEl.style.display = "none";
    }

    // Build a tick schedule: many fast frames at first, then progressively
    // longer intervals. Total ~5.5 s.
    const schedule = [];
    // 38 fast frames @ 55ms = ~2.1s
    for (let i = 0; i < 38; i++) schedule.push(55);
    // ramp slowdown
    [70, 90, 110, 140, 180, 230, 290, 360, 460, 580, 720, 880, 1100]
      .forEach((ms) => schedule.push(ms));

    let i = 0;
    let lastIdx = -1;
    function pickRandom() {
      if (pool.length < 2) return pool[0];
      let r;
      do { r = Math.floor(Math.random() * pool.length); } while (r === lastIdx);
      lastIdx = r;
      return pool[r];
    }

    function tick() {
      const isLast = i === schedule.length - 1;
      const entry = isLast ? winner : pickRandom();
      nameEl.textContent = `${entry.ime} ${entry.priimek}`;
      emailEl.textContent = entry.email || "";
      metaEl.textContent = entry.consent_location_label
        ? `📍 ${entry.consent_location_label}`
        : "";

      if (isLast) {
        display.classList.remove("is-spinning");
        display.classList.add("is-winner");
        winnerBurst();
        revealPrize(position);
        // Hold the winner + prize on screen for ~2.4s before resolving
        // so the observer can savor it.
        setTimeout(resolve, 2400);
        return;
      }
      setTimeout(tick, schedule[i++]);
    }
    tick();
  });
}

function revealPrize(position) {
  const prize = PRIZES_BY_POSITION[position];
  if (!prize) return;
  const wrap = $("slotPrize");
  if (!wrap) return;
  $("slotPrizeImg").src = prize.img;
  $("slotPrizeImg").alt = prize.name;
  $("slotPrizeName").textContent = prize.name;
  $("slotPrizeDesc").textContent = prize.desc;
  wrap.style.display = "";
  // Force layout, then add the visible class so the CSS transition fires
  // requestAnimationFrame ensures the browser sees the display change first.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => wrap.classList.add("is-visible"));
  });
}

/* ---------------- CONFETTI ---------------- */
function winnerBurst() {
  if (typeof window.confetti !== "function") return;
  const c = window.confetti;
  const end = Date.now() + 1500;

  // Left + right cannons, multiple bursts
  (function frame() {
    c({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: ["#dc2626", "#f59e0b", "#ffffff", "#fde047"],
    });
    c({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: ["#dc2626", "#f59e0b", "#ffffff", "#fde047"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  // Big celebratory burst in the center
  setTimeout(() => {
    c({
      particleCount: 160,
      spread: 100,
      origin: { x: 0.5, y: 0.55 },
      startVelocity: 45,
      colors: ["#dc2626", "#f59e0b", "#ffffff", "#fde047", "#fca5a5"],
    });
  }, 200);
}
