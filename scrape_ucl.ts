/* bun run scrape_matches.ts [urlsOrIds...]
 *   --from-json=path.json   (JSON array of strings with linkrules or match URLs/IDs)
 *   --from-csv=path.csv     (CSV with header "url"; reads the url column)
 * Output: matches.csv  (semicolon-delimited)
 */

import { chromium } from "playwright";
import { readFile, writeFile } from "fs/promises";
import * as path from "path";

const OUT_CSV = "matches.csv";
const HEADLESS = process.env.HEADLESS === "0" ? false : true;

// ---------- helpers ----------
function csvEscape(val: unknown): string {
  const s = String(val ?? "");
  const escaped = s.replace(/"/g, '""'); // double quotes for CSV
  // quote if contains delimiter/quote/newline
  return /[;"\r\n]/.test(s) ? `"${escaped}"` : escaped;
}

function extractMatchId(input: string): string | null {
  // Accept: plain ID "2045913", .../match/2045913/, .../uefachampionsleague/match/2045913-.../
  const idFromUrl = input.match(/\/match\/(\d+)\b/)?.[1]
                 || input.match(/\b(\d{6,})\b/)?.[1];
  return idFromUrl ?? null;
}

function toDetailUrl(anyUrlOrId: string): string | null {
  // Normalize to human-readable detail page on the German site
  const id = extractMatchId(anyUrlOrId);
  if (!id) return null;
  return `https://de.uefa.com/uefachampionsleague/match/${id}/`;
}

async function textOrEmpty(locator: any): Promise<string> {
  try {
    const t = await locator.first().textContent();
    return (t ?? "").trim();
  } catch {
    return "";
  }
}

async function valueByLabel(container: any, labels: string[]): Promise<string> {
  const dts = container.locator("dt");
  const n = await dts.count();
  const lowered = labels.map(l => l.toLowerCase());
  for (let i = 0; i < n; i++) {
    const labRaw = await dts.nth(i).textContent();
    const lab = (labRaw ?? "").trim().toLowerCase().replace(/\s+/g, " ");
    if (lowered.some(c => lab.includes(c))) {
      const dd = dts.nth(i).locator("xpath=following-sibling::dd[1]");
      return (await textOrEmpty(dd)) || "";
    }
  }
  return "";
}

async function readInputUrls(): Promise<string[]> {
  const args = process.argv.slice(2);
  let fromJson = "";
  let fromCsv = "";
  const free: string[] = [];

  for (const a of args) {
    if (a.startsWith("--from-json=")) fromJson = a.split("=")[1];
    else if (a.startsWith("--from-csv=")) fromCsv = a.split("=")[1];
    else free.push(a);
  }

  let raw: string[] = [];

  if (fromJson) {
    const jsonPath = path.resolve(fromJson);
    const data = JSON.parse(await readFile(jsonPath, "utf8"));
    if (Array.isArray(data)) raw.push(...data.map(String));
  }

  if (fromCsv) {
    const csvPath = path.resolve(fromCsv);
    const data = await readFile(csvPath, "utf8");
    const lines = data.split(/\r?\n/).filter(Boolean);
    // find "url" column if present
    const header = lines[0].split(/[;,]/).map(s => s.trim().replace(/^"|"$/g, ""));
    const idx = header.findIndex(h => /^url$/i.test(h));
    if (idx >= 0) {
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(/[;,]/);
        if (cols[idx]) raw.push(cols[idx].replace(/^"|"$/g, ""));
      }
    } else {
      // single-column CSV: treat whole line as URL
      for (const line of lines) raw.push(line.replace(/^"|"$/g, ""));
    }
  }

  // leftover args may be URLs or IDs
  if (free.length) raw.push(...free);

  // De-duplicate and keep only those we can convert to detail URLs
  const detailUrls = Array.from(
    new Set(
      raw.map(toDetailUrl).filter((x): x is string => !!x)
    )
  );

  return detailUrls;
}

// ---------- scraper per match ----------
async function scrapeMatch(context: any, url: string) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // dismiss cookie/app prompts (best effort)
    try {
      const acceptLabels = [/Alle akzeptieren/i, /Akzeptieren/i, /Zustimmen/i, /Accept all/i];
      for (const r of acceptLabels) {
        const b = page.getByRole("button", { name: r });
        if (await b.count()) { await b.first().click().catch(() => {}); break; }
      }
    } catch {}

    await page.waitForTimeout(800);

    // Teams
    let home = "", away = "";
    const h1 = await textOrEmpty(page.locator("h1"));
    if (h1.includes("vs")) {
      const parts = h1.split("vs").map((p: string) => p.trim());
      if (parts.length === 2) [home, away] = parts;
    }
    if (!home || !away) {
      // Common data-testids on UEFA pages
      home = home || await textOrEmpty(page.locator('[data-testid="team-home-name"]'));
      away = away || await textOrEmpty(page.locator('[data-testid="team-away-name"]'));
    }

    // Stadium info (several resilient selectors)
    let stadiumInfo = "";
    stadiumInfo =
      stadiumInfo ||
      await textOrEmpty(page.locator(".stadium-info")) ||
      await textOrEmpty(page.locator('[data-testid*="stadium"]')) ||
      await textOrEmpty(
        page
          .locator("section, div")
          .filter({ hasText: /(Stadion|Arena|Ort|Venue|Location)/i })
          .first()
      );

    // Match date: prefer .match-info__date, then fallbacks (labels)
    let matchDate = "";
    matchDate =
      (await textOrEmpty(page.locator(".match-info__date, [class*='match-info__date']"))) ||
      (await (async () => {
        const infoContainer = page
          .locator("section, div")
          .filter({ hasText: /(Datum|Date|Anstoß|Anstoss|Kick-off)/i })
          .first();
        const val = await valueByLabel(infoContainer, ["datum", "date", "anstoss", "anstoß", "kick-off"]);
        return val;
      })());

    // Normalize whitespace
    stadiumInfo = stadiumInfo.replace(/\s+/g, " ").trim();
    matchDate = matchDate.replace(/\s+/g, " ").replace(/,\s*/g, ", ").trim();
    home = home.trim();
    away = away.trim();

    return { home, away, stadium_info: stadiumInfo, match_date: matchDate, url };
  } catch (e: any) {
    return { home: "", away: "", stadium_info: "", match_date: "", url, error: String(e) };
  } finally {
    await page.close();
  }
}

// ---------- main ----------
async function main() {
  const urls = await readInputUrls();
  if (!urls.length) {
    console.error("No match inputs provided. Pass --from-json=file.json, --from-csv=file.csv, or URLs/IDs as args.");
    process.exit(2);
  }

  const browser = await chromium.launch({ headless: HEADLESS, args: ["--no-sandbox"] });
  const context = await browser.newContext({ locale: "de-DE" });

  const rows: Array<Record<string, string>> = [];
  for (const url of urls) {
    const rec = await scrapeMatch(context, url);
    rows.push(rec);
  }

  await context.close();
  await browser.close();

  // Write CSV
  const header = ["home", "away", "stadium_info", "match_date", "url"];
  const lines = [
    header.map(csvEscape).join(";"),
    ...rows.map(r =>
      [r.home, r.away, r.stadium_info, r.match_date, r.url].map(csvEscape).join(";")
    )
  ];
  await writeFile(OUT_CSV, lines.join("\n"), { encoding: "utf8" });

  console.log(`Wrote ${rows.length} rows to ${OUT_CSV}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});