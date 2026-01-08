import { TRAINING_META, buildTrainingEvents, getMondayOfWeek, parseISODate, toISODate } from "./trainingPlan.js";

const STORAGE_KEY_START = "hm_training_week1_monday";
const RACE_INFO = {
  dateISO: "2026-04-26",
  label: "Donot Stop Half Marathon · Fort Worth",
  description: "Race week is Week 15 – keep the taper smooth."
};
const RACE_WEEK = 15;
const WEEKS_BEFORE_RACE = RACE_WEEK - 1;

const el = {
  startDate: document.getElementById("startDate"),
  calendar: document.getElementById("calendar"),
  monthTitle: document.getElementById("monthTitle"),
  raceDate: document.getElementById("raceDate"),
  alignRace: document.getElementById("alignRace"),

  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  todayBtn: document.getElementById("todayBtn"),
  aboutBtn: document.getElementById("aboutBtn"),

  detailsMeta: document.getElementById("detailsMeta"),
  detailsBody: document.getElementById("detailsBody"),

  modalBackdrop: document.getElementById("modalBackdrop"),
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalSubtitle: document.getElementById("modalSubtitle"),
  modalBody: document.getElementById("modalBody"),
  modalClose: document.getElementById("modalClose"),
  modalOk: document.getElementById("modalOk"),
  modalSelect: document.getElementById("modalSelect"),

  aboutBackdrop: document.getElementById("aboutBackdrop"),
  about: document.getElementById("about"),
  aboutBody: document.getElementById("aboutBody"),
  aboutClose: document.getElementById("aboutClose"),
  aboutOk: document.getElementById("aboutOk")
};

function isMobileLayout(){
  return window.matchMedia?.("(max-width: 640px)")?.matches ?? false;
}

function abbreviateForVerticalLabel(text){
  const cleaned = String(text || "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";

  // Prefer short, readable labels that fit vertically.
  const map = {
    FOUNDATION: "FOUND",
    RECOVERY: "RECOV",
    TEMPO: "TEMPO",
    SPEED: "SPEED",
    LONG: "LONG",
    INTERVAL: "INT",
    INTERVALS: "INT",
    OPTIONAL: "OPT",
    CROSS: "XTR",
    TRAINING: "TRN",
    REST: "REST",
    RACE: "RACE",
    SHAKEOUT: "SHAK",
    TUNE: "TUNE",
    HIGH: "HIGH",
    MIXED: "MIX"
  };

  const first = cleaned.split(" ")[0];
  const mapped = map[first];
  const base = mapped || first;

  // Hard limit to keep within a 72px tile with upright letters.
  return base.slice(0, 5);
}

function splitTitleForMobile(title){
  const cleaned = String(title || "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return { side: "", main: "" };

  const lc = cleaned.toLowerCase();

  if (lc.includes("play")){
    const side = cleaned.replace(/\bplay\b/i, "").trim();
    return { side, main: "PLAY" };
  }

  if (lc.includes("rest")){
    return { side: "REST", main: "REST" };
  }

  if (lc.startsWith("race day")){
    const side = cleaned.replace(/^race day\s*:?/i, "").trim();
    return { side, main: "RACE" };
  }

  if (lc.includes("run")){
    const side = cleaned.replace(/\brun\b/i, "").trim();
    return { side, main: "RUN" };
  }

  // Fallback: treat as a run workout.
  return { side: cleaned, main: "RUN" };
}

function formatLongDate(iso){
  const [y,m,d] = iso.split("-").map(Number);
  const dt = new Date(y, m-1, d);
  return dt.toLocaleDateString(undefined, { weekday:"long", year:"numeric", month:"short", day:"numeric" });
}

function formatRaceBadge(iso){
  const [y,m,d] = iso.split("-").map(Number);
  const dt = new Date(y, m-1, d);
  const weekday = dt.toLocaleDateString(undefined, { weekday:"long" });
  const monthDay = dt.toLocaleDateString(undefined, { month:"short", day:"numeric" });
  return `${weekday} · ${monthDay} ${dt.getFullYear()}`;
}

function shiftDays(base, delta){
  const d = new Date(base);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + delta);
  return d;
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function renderDetails(event){
  if (!event){
    el.detailsMeta.textContent = "Select a workout";
    el.detailsBody.innerHTML = `
      <div class="emptyState">
        <div class="emptyTitle">Pick a workout</div>
        <div class="emptyText">Your selected workout’s structure, zone, and notes show up here.</div>
      </div>
    `;
    return;
  }

  const p = event.extendedProps || {};
  const dateIso = event.startStr;

  el.detailsMeta.textContent = `${p.phaseName} · Week ${p.week} · ${p.dayName}`;

  const details = (p.details || []).map(line => `<li>${escapeHtml(line)}</li>`).join("");

  el.detailsBody.innerHTML = `
    <div class="detailTitle">${escapeHtml(p.workoutTitle || event.title)}</div>
    <div class="detailSub">${escapeHtml(formatLongDate(dateIso))}</div>

    <div class="detailGrid">
      <div class="kv"><div class="k">Zone</div><div class="v">${escapeHtml(p.zone || "—")}</div></div>
      <div class="kv"><div class="k">Phase</div><div class="v">${escapeHtml((p.phaseName || "").replace("Phase ",""))}</div></div>
      <div class="kv"><div class="k">Week</div><div class="v">${escapeHtml(String(p.week ?? "—"))}</div></div>
    </div>

    <ul class="detailList">${details || "<li>No additional notes.</li>"}</ul>
  `;
}

function openModalForEvent(event){
  const p = event.extendedProps || {};
  const dateIso = event.startStr;

  el.modalTitle.textContent = p.workoutTitle || event.title;
  el.modalSubtitle.textContent = `${p.phaseName} · Week ${p.week} · ${formatLongDate(dateIso)}`;

  const details = (p.details || []).map(line => `<li>${escapeHtml(line)}</li>`).join("");

  el.modalBody.innerHTML = `
    <div class="detailGrid">
      <div class="kv"><div class="k">Zone</div><div class="v">${escapeHtml(p.zone || "—")}</div></div>
      <div class="kv"><div class="k">Day</div><div class="v">${escapeHtml(p.dayName || "—")}</div></div>
      <div class="kv"><div class="k">Week</div><div class="v">${escapeHtml(String(p.week ?? "—"))}</div></div>
    </div>

    <ul class="detailList">${details || "<li>No additional notes.</li>"}</ul>
  `;

  el.modal.dataset.eventId = event.id;
  showModal(el.modalBackdrop, el.modal);
}

function showModal(backdrop, modal){
  backdrop.hidden = false;
  modal.hidden = false;
  requestAnimationFrame(() => {
    modal.querySelector("button")?.focus?.();
  });
}

function hideModal(backdrop, modal){
  backdrop.hidden = true;
  modal.hidden = true;
}

function setSelectedViewButton(viewName){
  document.querySelectorAll(".segBtn").forEach(btn => {
    const selected = btn.dataset.view === viewName;
    btn.setAttribute("aria-selected", selected ? "true" : "false");
  });
}

function buildAboutHtml(){
  const phaseHtml = TRAINING_META.phases.map(p => `
    <div class="kv" style="grid-column: 1 / -1">
      <div class="k">${escapeHtml(p.name)} (${escapeHtml(p.weeks)})</div>
      <div class="v" style="font-weight:700; margin-top:8px">${escapeHtml(p.goal)}</div>
    </div>
  `).join("");

  const notesHtml = TRAINING_META.notes.map(n => `<li>${escapeHtml(n)}</li>`).join("");

  return `
    <div class="detailTitle">${escapeHtml(TRAINING_META.subtitle)}</div>
    <div class="detailSub">${escapeHtml(RACE_INFO.label)} · ${escapeHtml(formatRaceBadge(RACE_INFO.dateISO))}</div>
    <div class="detailSub">Tip: set “Week 1 start” to the Monday you want.</div>

    <div class="detailGrid" style="margin-top:14px">
      ${phaseHtml}
    </div>

    <div class="detailSub" style="margin-top:16px">How to use</div>
    <ul class="detailList">
      <li><b>Tap/click</b> a workout to load it in the side panel.</li>
      <li><b>Long-press</b> a workout to open a popup (great on mobile).</li>
      <li>Use Month/Week/Day to change views, or keep 4 weeks visible.</li>
    </ul>

    <div class="detailSub" style="margin-top:16px">Notes</div>
    <ul class="detailList">${notesHtml}</ul>
  `;
}

function getDefaultWeek1Monday(){
  const stored = localStorage.getItem(STORAGE_KEY_START);
  const storedDate = stored ? parseISODate(stored) : null;
  if (storedDate) return getMondayOfWeek(storedDate);

  return getWeek1FromRace();
}

let calendar;
let suppressClickUntil = 0;
let selectedEvent = null;

function getRaceDate(){
  return parseISODate(RACE_INFO.dateISO);
}

function getWeek1FromRace(){
  const raceDay = getRaceDate();
  const raceMonday = getMondayOfWeek(raceDay);
  return shiftDays(raceMonday, -WEEKS_BEFORE_RACE * 7);
}

function rebuildEvents(week1Monday){
  const events = buildTrainingEvents(week1Monday);
  calendar.removeAllEvents();
  calendar.addEventSource(events);
}

function initCalendar(week1Monday){
  const events = buildTrainingEvents(week1Monday);

  calendar = new FullCalendar.Calendar(el.calendar, {
    initialView: "fourWeek",
    firstDay: 1,
    height: "auto",
    fixedWeekCount: false,
    nowIndicator: true,

    views: {
      fourWeek: { type: "dayGrid", duration: { weeks: 4 } }
    },

    headerToolbar: false,

    datesSet: () => {
      if (el.monthTitle) el.monthTitle.textContent = calendar?.view?.title ?? "";
    },

    dayMaxEvents: true,

    events,

    dayCellContent: (arg) => {
      // Mobile-only: remove the month name inside the grid (show day number only).
      if (!isMobileLayout()) return;
      return { html: `<span class="dayNum">${arg.date.getDate()}</span>` };
    },

    eventContent: (arg) => {
      // Mobile-only: match the sketch layout.
      if (!isMobileLayout()) return;

      const { side, main } = splitTitleForMobile(arg.event.title);
      const sideShort = abbreviateForVerticalLabel(side);

      const wrap = document.createElement("div");
      wrap.className = "mEvent";

      const sideEl = document.createElement("div");
      sideEl.className = "mEventSide";
      sideEl.textContent = sideShort;

      const mainEl = document.createElement("div");
      mainEl.className = "mEventMain";
      mainEl.textContent = main.toUpperCase();

      wrap.append(sideEl, mainEl);
      return { domNodes: [wrap] };
    },

    windowResize: () => {
      // Re-render so eventContent can switch between mobile and desktop.
      calendar?.rerenderEvents?.();
    },

    eventClick: (info) => {
      if (Date.now() < suppressClickUntil) return;
      selectedEvent = info.event;
      renderDetails(selectedEvent);
    },

    eventDidMount: (arg) => {
      // Long-press handling (mobile + desktop): open popup.
      const node = arg.el;
      let timer = null;
      let started = false;

      const clear = () => {
        if (timer) window.clearTimeout(timer);
        timer = null;
        started = false;
      };

      const start = (ev) => {
        // Ignore right-click.
        if (ev?.button === 2) return;
        started = true;
        timer = window.setTimeout(() => {
          if (!started) return;
          suppressClickUntil = Date.now() + 450;
          openModalForEvent(arg.event);
        }, 560);
      };

      node.addEventListener("pointerdown", start);
      node.addEventListener("pointerup", clear);
      node.addEventListener("pointercancel", clear);
      node.addEventListener("pointerleave", clear);
    }
  });

  calendar.render();
  calendar.gotoDate(toISODate(week1Monday));
  renderDetails(null);

  if (el.monthTitle) el.monthTitle.textContent = calendar?.view?.title ?? "";
}

function wireUI(){
  // View switching
  document.querySelectorAll(".segBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const viewName = btn.dataset.view;
      setSelectedViewButton(viewName);
      calendar.changeView(viewName);
    });
  });

  // Nav buttons
  el.prevBtn.addEventListener("click", () => calendar.prev());
  el.nextBtn.addEventListener("click", () => calendar.next());
  el.todayBtn.addEventListener("click", () => calendar.today());

  // Start date (Week 1 Monday)
  el.startDate.addEventListener("change", () => {
    const d = parseISODate(el.startDate.value);
    if (!d) return;
    const monday = getMondayOfWeek(d);
    el.startDate.value = toISODate(monday);
    localStorage.setItem(STORAGE_KEY_START, el.startDate.value);

    rebuildEvents(monday);
    calendar.gotoDate(el.startDate.value);
    selectedEvent = null;
    renderDetails(null);
  });

  const alignWithRace = () => {
    const monday = getWeek1FromRace();
    el.startDate.value = toISODate(monday);
    localStorage.setItem(STORAGE_KEY_START, el.startDate.value);
    rebuildEvents(monday);
    calendar.gotoDate(el.startDate.value);
    selectedEvent = null;
    renderDetails(null);
  };
  el.alignRace.addEventListener("click", alignWithRace);

  // Workout modal
  const closeWorkoutModal = () => hideModal(el.modalBackdrop, el.modal);
  el.modalBackdrop.addEventListener("click", closeWorkoutModal);
  el.modalClose.addEventListener("click", closeWorkoutModal);
  el.modalOk.addEventListener("click", closeWorkoutModal);

  el.modalSelect.addEventListener("click", () => {
    const eventId = el.modal.dataset.eventId;
    const ev = calendar.getEventById(eventId);
    if (ev) {
      selectedEvent = ev;
      renderDetails(ev);
    }
    closeWorkoutModal();
  });

  // About modal
  const openAbout = () => {
    el.aboutBody.innerHTML = buildAboutHtml();
    showModal(el.aboutBackdrop, el.about);
  };
  const closeAbout = () => hideModal(el.aboutBackdrop, el.about);
  el.aboutBtn.addEventListener("click", openAbout);
  el.aboutBackdrop.addEventListener("click", closeAbout);
  el.aboutClose.addEventListener("click", closeAbout);
  el.aboutOk.addEventListener("click", closeAbout);

  // ESC to close any modal
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!el.modal.hidden) closeWorkoutModal();
    if (!el.about.hidden) closeAbout();
  });
}

// Boot
const week1Monday = getDefaultWeek1Monday();
el.startDate.value = toISODate(week1Monday);
localStorage.setItem(STORAGE_KEY_START, el.startDate.value);

el.raceDate.textContent = formatRaceBadge(RACE_INFO.dateISO);

initCalendar(week1Monday);
wireUI();
