// ============================================================
// TEMBA AI Club — page logic
// Content lives in meetings.js (schedule) and news-data.js
// (generated from news-source.md). You shouldn't need to edit
// this file.
// ============================================================

(function () {
  // Parse "YYYY-MM-DD" as a local date (avoids UTC off-by-one).
  function parseDate(str) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function fmt(date, opts) {
    return date.toLocaleDateString(undefined, opts);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const meetings = MEETINGS.map((m) => ({ ...m, dateObj: parseDate(m.date) }))
    .sort((a, b) => a.dateObj - b.dateObj);

  const next = meetings.filter((m) => m.dateObj >= today && !m.cancelled)[0] || null;

  // ---------- Hero ----------
  document.getElementById("hero-tagline").textContent = CLUB_INFO.tagline;
  document.getElementById("hero-standing").textContent =
    [CLUB_INFO.meetingDay, CLUB_INFO.meetingTime, CLUB_INFO.meetingRoom].join("  ·  ");

  // ---------- Next meeting ----------
  const nmTopic = document.getElementById("nm-topic");
  if (next) {
    document.getElementById("nm-month").textContent = fmt(next.dateObj, { month: "short" });
    document.getElementById("nm-daynum").textContent = next.dateObj.getDate();
    document.getElementById("nm-weekday").textContent = fmt(next.dateObj, { weekday: "long" });
    nmTopic.textContent = next.topic;
    document.getElementById("nm-time").textContent = next.time;
    document.getElementById("nm-room").textContent = next.room;

    const days = Math.round((next.dateObj - today) / 86400000);
    document.getElementById("nm-countdown").textContent =
      days === 0 ? "Today" : days === 1 ? "Tomorrow" : "In " + days + " days";

  } else {
    document.getElementById("next-meeting").classList.add("is-empty");
    nmTopic.textContent = "No meetings scheduled yet";
    document.getElementById("nm-time").textContent = CLUB_INFO.meetingTime;
    document.getElementById("nm-room").textContent = CLUB_INFO.meetingRoom;
  }

  // ---------- Calendar ----------
  const calRoot = document.getElementById("calendar");
  if (calRoot) {
    const CAL_YEAR = 2026;
    const CAL_MONTHS = [8, 9, 10]; // September–November
    const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

    const pad = (n) => String(n).padStart(2, "0");
    const byDate = {};
    meetings.forEach((m) => { byDate[m.date] = m; });

    CAL_MONTHS.forEach((mo) => {
      const month = document.createElement("div");
      month.className = "cal-month";

      const name = document.createElement("div");
      name.className = "cal-month-name";
      name.textContent = fmt(new Date(CAL_YEAR, mo, 1), { month: "long" });
      month.appendChild(name);

      const wds = document.createElement("div");
      wds.className = "cal-wds";
      WEEKDAYS.forEach((w) => {
        const s = document.createElement("span");
        s.className = "cal-wd";
        s.textContent = w;
        wds.appendChild(s);
      });
      month.appendChild(wds);

      const days = document.createElement("div");
      days.className = "cal-days";

      const firstDay = new Date(CAL_YEAR, mo, 1).getDay();
      const daysInMonth = new Date(CAL_YEAR, mo + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("span");
        blank.className = "cal-day empty";
        days.appendChild(blank);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement("span");
        cell.className = "cal-day";
        cell.textContent = d;

        const mtg = byDate[CAL_YEAR + "-" + pad(mo + 1) + "-" + pad(d)];
        if (mtg) {
          const state = mtg.cancelled ? "is-break"
            : mtg === next ? "is-next"
            : mtg.dateObj < today ? "is-past"
            : "is-upcoming";
          cell.classList.add("marked", state);

          // No `title` here — native tooltips are slow, unstyled, and
          // never appear on touch. Custom popover instead.
          cell.tabIndex = 0;
          cell.setAttribute("role", "button");
          cell.setAttribute("aria-label",
            fmt(mtg.dateObj, { month: "long", day: "numeric" }) + ": " + mtg.topic +
            (mtg.cancelled ? "" : ", " + mtg.time + ", " + mtg.room));
          cell._meeting = mtg;
        }

        if (new Date(CAL_YEAR, mo, d).getTime() === today.getTime()) {
          cell.classList.add("is-today");
        }

        days.appendChild(cell);
      }

      month.appendChild(days);
      calRoot.appendChild(month);
    });

    // ----- Day popover -----
    // Hover and keyboard focus preview it; a click pins it open so it
    // also works on touch, where there is no hover at all.
    const pop = document.createElement("div");
    pop.className = "cal-pop";
    pop.hidden = true;
    pop.innerHTML = '<p class="pop-topic"></p><p class="pop-meta"></p>';
    calRoot.appendChild(pop);

    let pinned = null;

    function place(cell, mtg) {
      pop.querySelector(".pop-topic").textContent = mtg.topic;
      const meta = pop.querySelector(".pop-meta");
      meta.hidden = !!mtg.cancelled;
      if (!mtg.cancelled) meta.textContent = mtg.time + " · " + mtg.room;

      pop.hidden = false;
      const calRect = calRoot.getBoundingClientRect();
      const cellRect = cell.getBoundingClientRect();
      const half = pop.offsetWidth / 2;
      const x = cellRect.left - calRect.left + cellRect.width / 2;

      pop.style.left = Math.max(half + 2, Math.min(x, calRect.width - half - 2)) + "px";
      pop.style.top = cellRect.top - calRect.top - 9 + "px";
    }

    function hide() {
      pop.hidden = true;
      if (pinned) pinned.classList.remove("is-pinned");
      pinned = null;
    }

    calRoot.querySelectorAll(".cal-day.marked").forEach((cell) => {
      const mtg = cell._meeting;

      cell.addEventListener("mouseenter", () => { if (!pinned) place(cell, mtg); });
      cell.addEventListener("mouseleave", () => { if (!pinned) pop.hidden = true; });
      cell.addEventListener("focus", () => { if (!pinned) place(cell, mtg); });
      cell.addEventListener("blur", () => { if (!pinned) pop.hidden = true; });

      cell.addEventListener("click", (e) => {
        e.stopPropagation();
        if (pinned === cell) { hide(); return; }
        if (pinned) pinned.classList.remove("is-pinned");
        pinned = cell;
        cell.classList.add("is-pinned");
        place(cell, mtg);
      });

      cell.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cell.click(); }
      });
    });

    document.addEventListener("click", hide);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
    window.addEventListener("resize", hide);
  }

  // ---------- Speakers ----------
  // Any meeting carrying a `bio` shows up here, so a speaker is
  // readable well before their session comes up.
  const speakersRoot = document.getElementById("speakers");
  if (speakersRoot) {
    const withBios = meetings.filter((m) => m.bio && m.bio.length);

    if (withBios.length) {
      document.getElementById("speakers-block").hidden = false;

      withBios.forEach((m) => {
        const row = document.createElement("details");
        row.className = "speaker";

        const summary = document.createElement("summary");
        summary.innerHTML =
          '<span class="sp-name">' + (m.speaker || m.topic) + "</span>" +
          '<span class="sp-date">' +
          fmt(m.dateObj, { month: "short", day: "numeric" }) +
          "</span>";
        row.appendChild(summary);

        const prose = document.createElement("div");
        prose.className = "sp-bio";
        m.bio.forEach((para) => {
          const p = document.createElement("p");
          p.textContent = para;
          prose.appendChild(p);
        });
        row.appendChild(prose);

        speakersRoot.appendChild(row);
      });
    }
  }

  // ---------- AI news ----------
  const newsList = document.getElementById("news-list");
  if (newsList) {
    const weeks = (typeof NEWS_WEEKS !== "undefined" ? NEWS_WEEKS : [])
      .map((n) => ({ ...n, dateObj: parseDate(n.date) }))
      .sort((a, b) => b.dateObj - a.dateObj);

    if (weeks.length === 0) {
      newsList.innerHTML = '<p class="empty-note">The first roundup lands Monday.</p>';
    } else {
      weeks.forEach((n, i) => {
        const week = document.createElement("div");
        week.className = "news-week" + (i === 0 ? " open" : "");

        const header = document.createElement("div");
        header.className = "news-week-header";
        header.innerHTML =
          '<span class="news-date">' +
          fmt(n.dateObj, { month: "long", day: "numeric" }) +
          (i === 0 ? '<span class="tag-latest">Latest</span>' : "") +
          "</span>" +
          '<span class="news-toggle">' + (i === 0 ? "–" : "+") + "</span>";

        header.addEventListener("click", () => {
          week.classList.toggle("open");
          header.querySelector(".news-toggle").textContent =
            week.classList.contains("open") ? "–" : "+";
        });

        const body = document.createElement("div");
        body.className = "news-week-body";
        body.innerHTML = n.html;

        week.appendChild(header);
        week.appendChild(body);
        newsList.appendChild(week);
      });
    }
  }

  // ---------- Resources ----------
  const resourcesList = document.getElementById("resources-list");
  const allResources = [];
  meetings.forEach((m) => {
    m.resources.forEach((r) => allResources.push({ ...r, meeting: m }));
  });

  if (allResources.length === 0) {
    resourcesList.innerHTML = '<p class="empty-note">Slides and links will appear here after each meeting.</p>';
  } else {
    allResources
      .sort((a, b) => b.meeting.dateObj - a.meeting.dateObj)
      .forEach((r) => {
        const a = document.createElement("a");
        a.className = "resource";
        a.href = r.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML =
          '<span class="rc-label">' + r.label + '<span class="ext">↗</span></span>' +
          '<span class="rc-meta">' + fmt(r.meeting.dateObj, { month: "short", day: "numeric", year: "numeric" }) + "</span>";
        resourcesList.appendChild(a);
      });
  }

  // ---------- Footer ----------
  document.getElementById("footer-year").textContent = new Date().getFullYear();
})();
