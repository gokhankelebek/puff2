/**
 * Reconcile Ecwid page titles against catalogue product names.
 *
 *   npx tsx scripts/match-ecwid-titles.ts          # propose, change nothing
 *   npx tsx scripts/match-ecwid-titles.ts --apply  # write the accepted matches
 *
 * The storefront harvest keys on `og:title`, which on Ecwid is an SEO string
 * rather than a product name:
 *
 *   "Flum UT Bar 50K Disposable Vape $36.99 &mdash; Puff Vegas"
 *
 * So 85 of 207 harvested images failed a literal match while their products sat
 * in the catalogue with no picture. This strips the marketing furniture off the
 * title and scores what remains against the missing products.
 *
 * A wrong image is a quality problem rather than a legal one, so the threshold
 * here is about being unembarrassing rather than fail-closed — but it still
 * requires a decisive win over the runner-up, because the catalogue is full of
 * near-identical names ("Lost Mary MT 15K" vs "Lost Mary MO 20000") where a
 * confident-looking near-miss is exactly the wrong outcome.
 */

import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ECWID_TSV = resolve("../research/ingest/ecwid-scrape.tsv");
const MATCHED_TSV = resolve("../research/ingest/ecwid-matched.tsv");
const CATALOG = resolve("src/lib/commerce/catalog.generated.json");
const IMAGES = resolve("src/lib/commerce/images.generated.json");

const apply = process.argv.includes("--apply");

/** Marketing furniture that appears in Ecwid titles but never in a POS name. */
const NOISE =
  /\b(disposable|vape|vapes|device|kit|pod|pods|puff|puffs|rechargeable|discover|shop|buy|best|new|online|pack|pk|the|and|with|for|by|of|in|at|a|an)\b/g;

function clean(s: string): string {
  return s
    // HTML entities that survive og:title.
    .replace(/&mdash;|&ndash;|&#8212;|&#8211;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/g, " ")
    // Store branding and price tails.
    .replace(/[—–-]\s*puff\s*vegas.*$/i, " ")
    .replace(/\$\s?\d+(?:[.,]\d{2})?/g, " ")
    .toLowerCase()
    // "20,000" and "30.000" are one number, not two.
    .replace(/(\d)[.,](\d{3})\b/g, "$1$2")
    // "50k" -> "50000" so it matches a spelled-out count.
    .replace(/\b(\d{1,3})\s?k\b/g, (_, n) => String(Number(n) * 1000))
    .replace(/[^a-z0-9]+/g, " ")
    .replace(NOISE, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const tokens = (s: string) => new Set(clean(s).split(" ").filter(Boolean));

/** Jaccard, but weighted so a shared number counts more than a shared word. */
function score(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  let weight = 0;
  let total = 0;
  for (const t of new Set([...a, ...b])) {
    const w = /^\d+$/.test(t) ? 2.5 : 1;
    total += w;
    if (a.has(t) && b.has(t)) {
      inter += w;
      weight += w;
    }
  }
  return total ? inter / total : 0;
}

type Row = { title: string; url: string };

const rows: Row[] = readFileSync(ECWID_TSV, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((l) => {
    const i = l.indexOf("~~");
    return { title: l.slice(0, i).trim(), url: l.slice(i + 2).trim() };
  });

const catalog: { title: string; slug: string; publishable: boolean }[] = JSON.parse(
  readFileSync(CATALOG, "utf8"),
);
const imageMap: Record<string, unknown> = existsSync(IMAGES)
  ? JSON.parse(readFileSync(IMAGES, "utf8"))
  : {};

const live = catalog.filter((m) => m.publishable);
const exact = new Set(live.map((m) => m.title));
const missing = live.filter((m) => !imageMap[m.slug]);

const candidates = rows.filter((r) => !exact.has(r.title));
const targets = missing.map((m) => ({ ...m, tok: tokens(m.title) }));

const ACCEPT = 0.5; // minimum similarity
const MARGIN = 0.12; // and it must beat the runner-up by this much

const accepted: { product: string; url: string; s: number; from: string }[] = [];
const rejected: { title: string; best?: string; s: number; why: string }[] = [];
const claimed = new Set<string>();

for (const c of candidates) {
  const ct = tokens(c.title);
  const ranked = targets
    .map((t) => ({ t, s: score(ct, t.tok) }))
    .sort((a, b) => b.s - a.s);
  const [top, second] = ranked;
  if (!top || top.s < ACCEPT) {
    rejected.push({ title: c.title.slice(0, 60), best: top?.t.title, s: +(top?.s ?? 0).toFixed(2), why: "below threshold" });
    continue;
  }
  if (second && top.s - second.s < MARGIN) {
    rejected.push({ title: c.title.slice(0, 60), best: `${top.t.title} vs ${second.t.title}`, s: +top.s.toFixed(2), why: "ambiguous" });
    continue;
  }
  if (claimed.has(top.t.title)) continue;
  claimed.add(top.t.title);
  accepted.push({ product: top.t.title, url: c.url, s: +top.s.toFixed(2), from: c.title });
}

console.log(`ecwid rows          ${rows.length}`);
console.log(`unmatched by name   ${candidates.length}`);
console.log(`products missing    ${missing.length}`);
console.log(`\nACCEPTED ${accepted.length}`);
for (const a of accepted.sort((x, y) => y.s - x.s)) {
  console.log(`  ${a.s.toFixed(2)}  ${a.product.padEnd(38)} <- ${a.from.slice(0, 62)}`);
}
console.log(`\nrejected ${rejected.length} (ambiguous: ${rejected.filter((r) => r.why === "ambiguous").length})`);
for (const r of rejected.filter((x) => x.why === "ambiguous").slice(0, 6)) {
  console.log(`  ${r.s.toFixed(2)}  ${r.best}`);
}

if (apply && accepted.length) {
  const prior = existsSync(MATCHED_TSV) ? readFileSync(MATCHED_TSV, "utf8") : "";
  const already = new Set(
    prior.split("\n").filter(Boolean).map((l) => l.slice(0, l.indexOf("~~")).trim()),
  );
  const fresh = accepted.filter((a) => !already.has(a.product));
  const lines = fresh.map((a) => `${a.product} ~~ ${a.url}`).join("\n") + "\n";
  appendFileSync(MATCHED_TSV, lines);
  console.log(`\n→ appended ${fresh.length} rows to ecwid-matched.tsv`);
  console.log("  run: npx tsx scripts/fetch-images.ts");
} else if (!apply) {
  console.log("\n(dry run — pass --apply to write them)");
}
