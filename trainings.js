// ============================================================
// TEMBA AI Club — Free AI Trainings page
// Courses live in a Google Sheet ("Live" tab, published to the web
// as CSV). To add a course, paste a row into that sheet — no code
// change or redeploy needed.
// ============================================================

(function () {
  // Published-to-web CSV link for the Live sheet. `?data=` overrides it
  // for local testing (e.g. trainings.html?data=sample.csv).
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1LOaHPOWs0XlF7-O4FD4LfL-CphbTyNfAK44r0mAFwh8/gviz/tq?tqx=out:csv";

  const ROLES = [
    "Everyone / AI Basics", "Sales", "Marketing", "Finance & Accounting",
    "Operations & Supply Chain", "Product", "Consulting & Strategy", "HR & People",
  ];
  const INDUSTRIES = [
    "Healthcare", "Energy", "Financial Services", "Tech",
    "Real Estate", "Legal", "Public Sector",
  ];
  const TASKS = [
    "Prompting basics", "Writing & communication", "Research & analysis",
    "Data & spreadsheets", "Automation & agents", "AI strategy & adoption",
  ];
  const BASICS = ROLES[0];

  const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const splitList = (s) => (s || "").split(";").map((x) => x.trim()).filter(Boolean);

  const $ = (id) => document.getElementById(id);
  const statusEl = $("tr-status");
  const resultsEl = $("tr-results");
  const qEl = $("tr-q"), taskEl = $("tr-task"), levelEl = $("tr-level"), timeEl = $("tr-time");

  $("footer-year").textContent = new Date().getFullYear();

  // ---------- CSV parsing (handles quoted fields, commas, newlines) ----------
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') inQuotes = false;
        else field += c;
      } else if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += c;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    const header = (rows.shift() || []).map((h) => h.trim().toLowerCase());
    return rows
      .filter((r) => r.some((v) => v.trim()))
      .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] || "").trim()])));
  }

  function toCourse(r) {
    const hours = parseFloat(r.hours);
    return {
      title: r.title,
      provider: r.provider,
      url: r.url,
      description: r.description,
      roles: splitList(r.roles),
      industries: splitList(r.industries),
      tasks: splitList(r.tasks),
      level: r.level,
      hours: isNaN(hours) ? null : hours,
      freeEvidence: r.free_evidence,
      dateAdded: r.date_added,
    };
  }

  // Only allow http(s) links from the sheet, never javascript: etc.
  function safeUrl(u) {
    try {
      const url = new URL(u);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
    } catch (e) { return null; }
  }

  // ---------- State (mirrored to the URL so views are shareable) ----------
  const params = new URLSearchParams(location.search);
  const state = {
    role: params.get("role") || "",
    industry: params.get("industry") || "",
    task: params.get("task") || "",
    level: params.get("level") || "",
    time: params.get("time") || "",
    q: params.get("q") || "",
  };

  function syncUrl() {
    const p = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => { if (v) p.set(k, v); });
    const dataParam = params.get("data");
    if (dataParam) p.set("data", dataParam);
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }

  // ---------- Controls ----------
  function buildChips(container, labels, key) {
    labels.forEach((label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tr-chip";
      b.textContent = label;
      b.dataset.value = slug(label);
      b.addEventListener("click", () => {
        // One audience at a time: picking a role clears industry and vice versa.
        const other = key === "role" ? "industry" : "role";
        state[key] = state[key] === b.dataset.value ? "" : b.dataset.value;
        if (state[key]) state[other] = "";
        render();
      });
      container.appendChild(b);
    });
  }

  buildChips($("role-chips"), ROLES, "role");
  buildChips($("industry-chips"), INDUSTRIES, "industry");
  TASKS.forEach((t) => taskEl.add(new Option(t, slug(t))));

  qEl.value = state.q;
  taskEl.value = state.task;
  levelEl.value = state.level;
  timeEl.value = state.time;

  let debounce;
  qEl.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.q = qEl.value.trim(); render(); }, 150);
  });
  taskEl.addEventListener("change", () => { state.task = taskEl.value; render(); });
  levelEl.addEventListener("change", () => { state.level = levelEl.value; render(); });
  timeEl.addEventListener("change", () => { state.time = timeEl.value; render(); });

  // ---------- Filtering ----------
  let courses = [];

  function matchesFilters(c) {
    if (state.task && !c.tasks.some((t) => slug(t) === state.task)) return false;
    if (state.level && slug(c.level || "") !== state.level) return false;
    if (state.time && c.hours != null) {
      if (state.time === "short" && c.hours >= 1) return false;
      if (state.time === "medium" && (c.hours < 1 || c.hours > 5)) return false;
      if (state.time === "long" && c.hours <= 5) return false;
    }
    if (state.q) {
      const hay = [c.title, c.provider, c.description, ...c.roles, ...c.industries, ...c.tasks].join(" ").toLowerCase();
      if (!state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }

  const byLevelThenTime = (a, b) => {
    const order = { beginner: 0, intermediate: 1, advanced: 2 };
    return (order[slug(a.level || "")] ?? 3) - (order[slug(b.level || "")] ?? 3) || (a.hours ?? 99) - (b.hours ?? 99);
  };

  // ---------- Rendering ----------
  function card(c) {
    const href = safeUrl(c.url);
    const el = document.createElement("article");
    el.className = "tr-card";

    const h = document.createElement("h3");
    if (href) {
      const a = document.createElement("a");
      a.href = href; a.target = "_blank"; a.rel = "noopener";
      a.textContent = c.title;
      const ext = document.createElement("span");
      ext.className = "ext"; ext.textContent = "↗";
      a.appendChild(ext);
      h.appendChild(a);
    } else {
      h.textContent = c.title;
    }

    const meta = document.createElement("p");
    meta.className = "tr-meta";
    meta.textContent = [c.provider, c.level, c.hours != null ? formatHours(c.hours) : null].filter(Boolean).join("  ·  ");

    const desc = document.createElement("p");
    desc.className = "tr-desc";
    desc.textContent = c.description;

    const tags = document.createElement("p");
    tags.className = "tr-tags";
    [...c.roles.filter((r) => r !== BASICS), ...c.industries, ...c.tasks].forEach((t) => {
      const s = document.createElement("span");
      s.textContent = t;
      tags.appendChild(s);
    });

    el.append(h, meta, desc);
    if (tags.childNodes.length) el.appendChild(tags);
    if (c.freeEvidence) {
      const free = document.createElement("p");
      free.className = "tr-free";
      free.textContent = "Why it's free: " + c.freeEvidence;
      el.appendChild(free);
    }
    return el;
  }

  function formatHours(h) {
    if (h < 1) return Math.round(h * 60) + " min";
    return (Number.isInteger(h) ? h : h.toFixed(1)) + (h === 1 ? " hr" : " hrs");
  }

  function group(title, list, note) {
    const wrap = document.createElement("section");
    wrap.className = "tr-group";
    const h = document.createElement("p");
    h.className = "tr-group-head";
    h.textContent = title + " (" + list.length + ")";
    wrap.appendChild(h);
    if (note) {
      const n = document.createElement("p");
      n.className = "tr-group-note";
      n.textContent = note;
      wrap.appendChild(n);
    }
    const grid = document.createElement("div");
    grid.className = "tr-grid";
    list.sort(byLevelThenTime).forEach((c) => grid.appendChild(card(c)));
    wrap.appendChild(grid);
    return wrap;
  }

  function render() {
    syncUrl();
    document.querySelectorAll("#role-chips .tr-chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.value === state.role));
    document.querySelectorAll("#industry-chips .tr-chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.value === state.industry));

    resultsEl.replaceChildren();
    const filtered = courses.filter(matchesFilters);
    const audience = state.role || state.industry;
    const audienceLabel = [...ROLES, ...INDUSTRIES].find((l) => slug(l) === audience);

    if (audienceLabel && audienceLabel !== BASICS) {
      const tagged = filtered.filter((c) => (state.role ? c.roles : c.industries).some((x) => slug(x) === audience));
      const basics = filtered.filter((c) => !tagged.includes(c) && c.roles.includes(BASICS));
      if (tagged.length) resultsEl.appendChild(group("For " + audienceLabel, tagged));
      if (basics.length) resultsEl.appendChild(group("New to AI? Start here", basics, "Foundations that are useful in any role."));
      statusEl.textContent = tagged.length
        ? ""
        : "No " + audienceLabel + " courses match yet. Here are general foundations. We add new courses weekly.";
      if (!tagged.length && !basics.length) statusEl.textContent = "No courses match these filters. Try clearing one.";
    } else {
      const list = audienceLabel === BASICS ? filtered.filter((c) => c.roles.includes(BASICS)) : filtered;
      if (list.length) resultsEl.appendChild(group(audienceLabel ? "AI Basics for everyone" : "All courses", list));
      statusEl.textContent = list.length ? "" : "No courses match these filters. Try clearing one.";
    }
  }

  // ---------- Load ----------
  const override = params.get("data");
  // Local test files only: a bare relative filename, never another site.
  const src = override && /^[\w.-]+\.csv$/.test(override) ? override : SHEET_CSV_URL;

  fetch(src, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status + " loading " + src);
      return res.text();
    })
    .then((text) => {
      courses = parseCSV(text).map(toCourse).filter((c) => c.title && c.url);
      if (!courses.length) throw new Error("Sheet loaded but contained no courses");
      render();
    })
    .catch((err) => {
      console.error("[trainings] Could not load course list:", err);
      statusEl.textContent = "We couldn't load the course list right now. Please refresh in a minute, or ask in the GroupMe.";
      statusEl.classList.add("is-error");
    });
})();
