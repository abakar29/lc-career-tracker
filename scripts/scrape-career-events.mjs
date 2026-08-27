// Scrapes the L&C Career Center's "News and Events" page (LiveWhale CMS) for
// upcoming events and writes them to public/data/career-events.json, which
// the Career Center tab fetches at runtime. LiveWhale doesn't expose a public
// feed for this widget, so we parse the same server-rendered markup a
// browser gets.
import * as cheerio from "cheerio";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SOURCE_URL = "https://college.lclark.edu/student_life/career_development/news_and_events/";
const SITE_ORIGIN = "https://college.lclark.edu";
const OUTPUT_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/data/career-events.json"
);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toAbsoluteUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${SITE_ORIGIN}${url}`;
}

// LiveWhale renders event dates as "August 26: 3:30pm" or "August 26: All Day",
// with no year. Since the widget only ever shows upcoming events, assume the
// current year, rolling over to next year if that would land in the past.
function parseEventDate(metaText, now = new Date()) {
  const match = metaText.match(/([A-Z][a-z]+)\s+(\d{1,2}):\s*(.+)/);
  if (!match) return { iso: null, display: metaText };

  const [, monthName, day, timePart] = match;
  const monthIndex = MONTHS.findIndex((m) => m === monthName);
  if (monthIndex === -1) return { iso: null, display: metaText };

  let year = now.getFullYear();
  let candidate = new Date(year, monthIndex, Number(day));
  const staleCutoff = new Date(now);
  staleCutoff.setDate(staleCutoff.getDate() - 3);
  if (candidate < staleCutoff) {
    year += 1;
    candidate = new Date(year, monthIndex, Number(day));
  }

  const isAllDay = /all day/i.test(timePart);
  const display = isAllDay
    ? `${monthName} ${day}, ${year} · All Day`
    : `${monthName} ${day}, ${year} · ${timePart.trim()}`;

  return { iso: candidate.toISOString(), display };
}

async function main() {
  const res = await fetch(SOURCE_URL, {
    headers: { "User-Agent": "PioneerPathBot/1.0 (+career tracker events sync)" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${SOURCE_URL}: ${res.status} ${res.statusText}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);

  const widget = $(".lw_widget_global_2021_events_list").first();
  if (widget.length === 0) {
    throw new Error("Events widget not found on page — L&C may have changed the page layout.");
  }

  const now = new Date();
  const events = widget
    .find(".bulletin-list_item")
    .map((_, el) => {
      const item = $(el);
      const metaText = item.find(".bulletin-list_meta").first().text().trim();
      const headline = item.find(".bulletin-list_headline a").first();
      const title = headline.text().trim();
      const href = toAbsoluteUrl(headline.attr("href"));
      const image = toAbsoluteUrl(item.find("img").first().attr("src"));
      const description = item.find(".bulletin-list_summary").first().text().trim();
      const { iso, display } = parseEventDate(metaText, now);

      if (!title || !href) return null;
      return { title, date: display, dateISO: iso, description, image, link: href };
    })
    .get()
    .filter(Boolean);

  const payload = {
    source: SOURCE_URL,
    scrapedAt: now.toISOString(),
    events,
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${events.length} event(s) to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
