// Converts news-source.md into news-data.js for the site.
// Usage: node tools/build-news.js
//
// news-source.md format: weeks separated by **M/D** headings,
// numbered items like "1\)", sub-bullets indented with "  - ".
// All dates are assumed to be in NEWS_YEAR.

const fs = require("fs");
const path = require("path");

const NEWS_YEAR = 2026;
const src = fs.readFileSync(path.join(__dirname, "..", "news-source.md"), "utf8");

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inline(text) {
  let t = escapeHtml(text.trim());
  // markdown links -> anchors
  t = t.replace(/\[([^\]]+)\]\(([^()\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // bold
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // unescape markdown backslash-escapes like \) \# \$
  t = t.replace(/\\([^a-zA-Z0-9\s])/g, "$1");
  return t;
}

const weeks = [];
let week = null;
let item = null;

function flushItem() {
  if (!week || !item) return;
  let html = '<div class="nw-item"><span class="nw-num">' + item.num + ")</span><div class=\"nw-body\">" + item.text;
  if (item.bullets.length) {
    html += "<ul>" + item.bullets.map((b) => "<li>" + b + "</li>").join("") + "</ul>";
  }
  html += "</div></div>";
  week.itemsHtml.push(html);
  item = null;
}

for (const rawLine of src.split(/\r?\n/)) {
  const line = rawLine.replace(/\s+$/, "");
  if (!line.trim()) continue;

  const weekMatch = line.match(/^\*\*(\d{1,2})\/(\d{1,2})\*\*$/);
  if (weekMatch) {
    flushItem();
    const mm = String(weekMatch[1]).padStart(2, "0");
    const dd = String(weekMatch[2]).padStart(2, "0");
    week = { date: NEWS_YEAR + "-" + mm + "-" + dd, label: weekMatch[1] + "/" + weekMatch[2], itemsHtml: [] };
    weeks.push(week);
    continue;
  }

  // Tolerate stray leading spaces and a missing backslash-escape —
  // Docs exports both "1\)" and the occasional " 7)".
  const itemMatch = line.match(/^\s*(\d+)\\?\)\s+(.*)$/);
  if (itemMatch) {
    flushItem();
    item = { num: itemMatch[1], text: inline(itemMatch[2]), bullets: [] };
    continue;
  }

  const bulletMatch = line.match(/^\s+-\s+(.*)$/);
  if (bulletMatch && item) {
    const b = inline(bulletMatch[1]);
    if (b) item.bullets.push(b);
    continue;
  }

  // Continuation line: append to current item text.
  if (item) item.text += " " + inline(line);
}
flushItem();

const out =
  "// GENERATED FILE — do not edit by hand.\n" +
  "// Rebuild with: node tools/build-news.js (reads news-source.md)\n" +
  "const NEWS_WEEKS = " +
  JSON.stringify(
    weeks.map((w) => ({ date: w.date, html: w.itemsHtml.join("") })),
    null,
    2
  ) +
  ";\n";

fs.writeFileSync(path.join(__dirname, "..", "news-data.js"), out, "utf8");
console.log("Wrote news-data.js with " + weeks.length + " weeks: " + weeks.map((w) => w.label).join(", "));
