/**
 * 301 map from the old Ecwid storefront's URLs to this site.
 *
 *   npx tsx scripts/build-ecwid-redirects.ts
 *
 * Reads the storefront crawl (research/ingest/ecwid-crawl.json — every URL in
 * the live Ecwid sitemap, with the product name on each page) and writes
 * src/lib/ecwid-redirects.generated.json, which next.config.ts serves.
 *
 * Resolution, most specific first:
 *   1. The same product is published here → /p/<slug>. Matched on the Ecwid
 *      URL slug or the exact normalised product name — never fuzzily. A
 *      redirect to the wrong product is worse than one to its department.
 *   2. Otherwise the department it would live in, by name.
 *   3. Grey inventory (THC, CBD, hemp, kratom, nitrous…) goes to /floor, never
 *      to a department page that implies we sell it online.
 *
 * Re-run after the importer: a product that starts publishing should start
 * receiving its old URL's traffic.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Crawled = { url: string; name: string | null; seo_title: string | null };
type Model = { slug: string; title: string; publishable: boolean };

const CRAWL = resolve("../research/ingest/ecwid-crawl.json");
const CATALOG = resolve("src/lib/commerce/catalog.generated.json");
const OUT = resolve("src/lib/ecwid-redirects.generated.json");

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const published = (JSON.parse(readFileSync(CATALOG, "utf8")) as Model[]).filter(
  (m) => m.publishable && m.slug,
);
const bySlug = new Map(published.map((m) => [m.slug, m.slug]));
const byName = new Map(published.map((m) => [norm(m.title), m.slug]));

/* Order matters: grey first, then the more specific departments before vape,
   because "Backwoods" and "Zyn" pages also say "flavor" and "pack". */
const DEPARTMENT_RULES: [RegExp, string][] = [
  [/thc|cbd|hemp|delta|kratom|7.?h(ydroxy|oh)|mushroom|amanita|whip|nitrous|galaxy|space gas|n2o/, "/floor"],
  [/pouch|\bzyn\b|\bvelo\b|\bzone\b|\bfre\b|\bon!?\b|rogue|snus/, "/pouch"],
  [/cigarette|marlboro|camel|newport|american spirit|parliament/, "/cigarettes"],
  [/cigar|backwoods|swisher|\bacid\b|cohiba|montecristo|black ?(&|and)? ?mild|white owl|dutch/, "/cigars"],
  [/hookah|shisha|serbetli|fakher|coal|tangiers/, "/hookah"],
  [/bong|pipe|glass|water ?pipe|rig\b/, "/glass"],
  [/lighter|torch|paper|cone|grinder|tray|wrap|butane|clipper|zippo/, "/accessories"],
  [/vape|puff|disposable|\bbar\b|geek|lost mary|flum|raz|juice|e ?liquid|pod|mod|salt|smok|vaporesso/, "/vape"],
];

function department(text: string): string {
  const t = text.toLowerCase();
  for (const [re, to] of DEPARTMENT_RULES) if (re.test(t)) return to;
  return "/floor";
}

/** Non-product pages on the old site, mapped by hand. */
const PAGES: Record<string, string> = {
  "/products": "/floor",
  "/about-us": "/pickup",
  "/contact-us": "/pickup",
  "/join-our-team": "/pickup",
  "/cigars-las-vegas": "/cigars",
  "/whip-cream-charger": "/floor", // nitrous is grey inventory — not listed
  "/flum-pebble-near-me": "/vape",
  "/brands": "/vape/brands",
  "/blogs": "/",
  "/about-vape-use": "/vape",
  "/best-disposable-vapes-2025": "/vape",
  "/what-is-the-top-selling-vape": "/vape",
  "/top-disposable-vape-brands-2025": "/vape",
  "/most-popular-disposable-vape-2025": "/vape",
  "/is-raz-or-geek-bar-better": "/vape",
  "/buy-vape-products-online-best-vapes-eliquids-accessories": "/vape",
};

const crawl = JSON.parse(readFileSync(CRAWL, "utf8")) as Crawled[];
const redirects: { source: string; destination: string }[] = [];
const tally = { product: 0, department: 0, floor: 0 };

for (const c of crawl) {
  const path = new URL(c.url).pathname.replace(/\/$/, "");
  const oldSlug = path.replace(/^\/products\//, "");
  const name = c.name ?? c.seo_title ?? oldSlug.replace(/-/g, " ");

  const exact = bySlug.get(oldSlug) ?? byName.get(norm(name));
  // Only published models are in the maps, and the importer's cannabinoid
  // firewall keeps grey inventory unpublished, so `exact` is never grey.
  const destination = exact ? `/p/${exact}` : department(`${name} ${oldSlug}`);

  if (destination.startsWith("/p/")) tally.product++;
  else if (destination === "/floor") tally.floor++;
  else tally.department++;
  redirects.push({ source: path, destination });
}

for (const [source, destination] of Object.entries(PAGES)) {
  if (!redirects.some((r) => r.source === source)) redirects.push({ source, destination });
}

redirects.sort((a, b) => a.source.localeCompare(b.source));
writeFileSync(OUT, JSON.stringify(redirects, null, 1) + "\n");

console.log(`${redirects.length} redirects -> ${OUT}`);
console.log(`  product pages  ${tally.product}`);
console.log(`  departments    ${tally.department}`);
console.log(`  /floor         ${tally.floor}`);
console.log(`  site pages     ${Object.keys(PAGES).length}`);
