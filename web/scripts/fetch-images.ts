/**
 * Product image pipeline.
 *
 *   npx tsx scripts/fetch-images.ts
 *
 * Collects product photography from every source the shop has rights to,
 * normalises where it lands, and writes an image map the catalogue merges in.
 *
 * ── Sources, in priority order ─────────────────────────────────────────────
 *
 *   1. own         `research/ingest/images/<slug>.<ext>`
 *                  The commissioned shoot. Wins over everything.
 *
 *   2. supplier    `research/ingest/supplier.tsv`  —  `Product Name ~~ URL`
 *                  Brand and distributor assets. The shop has confirmed
 *                  permission from its vendors to use these.
 *
 *   3. lightspeed  `research/ingest/latest.tsv`    —  `Product Name ~~ path`
 *                  Images already in the shop's own POS.
 *
 * A higher-priority source always replaces a lower one, so dropping a real
 * shoot into `images/` quietly retires the interim art without anyone having
 * to delete anything.
 *
 * Every entry records its `provenance`, so at any point you can answer "where
 * did this picture come from and on what basis are we using it" — which is the
 * question that matters if it is ever asked.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { extname, basename, resolve } from "node:path";

type Provenance = "own" | "supplier" | "ecwid" | "lightspeed";

/* Ecwid outranks Lightspeed: those images were chosen for a storefront, while
   the POS ones were uploaded for staff to recognise at a register. */
const PRIORITY: Record<Provenance, number> = { own: 4, supplier: 3, ecwid: 2, lightspeed: 1 };

const INGEST = resolve("../research/ingest");
const DROP_DIR = resolve(INGEST, "images");
const HARVEST_DIR = resolve(INGEST, "harvest");
const SUPPLIER_TSV = resolve(INGEST, "supplier.tsv");
const ECWID_TSV = resolve(INGEST, "ecwid-scrape.tsv");
/* Same storefront, but keyed to our product names instead of Ecwid's SEO page
   titles — see scripts/match-ecwid-titles.ts. Kept separate so re-harvesting
   never clobbers the reconciliation. */
const ECWID_MATCHED_TSV = resolve(INGEST, "ecwid-matched.tsv");
/* The full sitemap crawl — every product page, keyed on the JSON-LD
   `Product.name`, which is the name the POS actually pushed up rather than the
   SEO title. See research/ingest/crawl-storefront.py. This is the source of
   record for storefront imagery; the two files above are the earlier
   browser-era harvest, kept because they still cover a handful of pages the
   sitemap omits. */
const ECWID_CRAWL_TSV = resolve(INGEST, "ecwid-crawl.tsv");
const LIGHTSPEED_TSV = resolve(INGEST, "latest.tsv");
const OUT_DIR = resolve("public/p");
/* Untouched downloads. `public/p` is a build output that the cutout stage
   rewrites in place, so the unprocessed bytes have to survive somewhere or
   background removal could never be retuned without re-fetching everything. */
const ORIGINALS = resolve(INGEST, "originals");
const OUT_MAP = resolve("src/lib/commerce/images.generated.json");
const WORKLIST = resolve(INGEST, "missing-images.tsv");

/**
 * Lightspeed's CDN encodes a resize in the path. It only serves preset widths —
 * probing found 350 and 800 valid, while 640, 1024 and 1200 all 404. Ask for
 * 800, fall back to 350 rather than dropping the image.
 */
const LS_PREFIX = "https://vendimageuploadcdn.global.ssl.fastly.net";
const LS_SIZES = [800, 350];
const lightspeedUrl = (p: string, px: number) =>
  `${LS_PREFIX}/${px},fit,q90/vend-images/product/original/${p}`;

/**
 * Identify an image by its leading bytes, and refuse anything that is not one.
 *
 * Content-Type cannot be trusted here and neither can the byte count. Ecwid
 * serves a 150KB HTML product page for a product that has no photograph, and
 * its JSON-LD helpfully lists that page as the product's `image`. Seven of
 * those were saved as `.jpg`, passed the size check, and displaced real images
 * from the POS — invisible on disk, invisible to a HEAD request, and visible
 * only as a broken image on the page.
 */
const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "avif", "gif"];

function sniff(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 6).toString("latin1").match(/^GIF8[79]a$/)) return "gif";
  if (buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP") return "webp";
  const brand = buf.subarray(4, 12).toString("latin1");
  if (brand.startsWith("ftyp") && /avif|avis|heic|mif1/.test(brand)) return "avif";
  return null;
}

type Candidate = { title?: string; slug?: string; source: string; provenance: Provenance };
type Result = { slug: string; file: string; provenance: Provenance; bytes: number };
/** A record as it is written to images.generated.json and read back next run.
    `cutout` and `plate` are added by scripts/cutout-images.py. */
type Stored = {
  src: string;
  provenance: Provenance;
  bytes: number;
  cutout?: boolean;
  plate?: "light" | "dark";
};

function readTsv(path: string): { title: string; source: string }[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("~~");
      return i < 0
        ? { title: "", source: "" }
        : { title: l.slice(0, i).trim(), source: l.slice(i + 2).trim() };
    })
    // Blank source = a worklist row nobody has filled in yet. Not an error.
    .filter((r) => r.title && r.source && !/^<.*>$/.test(r.source));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(DROP_DIR, { recursive: true });
  mkdirSync(ORIGINALS, { recursive: true });

  const catalog: { title: string; slug: string; publishable: boolean }[] = JSON.parse(
    readFileSync(resolve("src/lib/commerce/catalog.generated.json"), "utf8"),
  );
  const live = catalog.filter((m) => m.publishable);
  const byTitle = new Map(live.map((m) => [m.title, m.slug]));
  const liveSlugs = new Set(live.map((m) => m.slug));

  const candidates: Candidate[] = [];

  // 1. The drop folder — files named by slug. This is how vendor asset packs
  //    actually arrive: a zip, not a list of URLs.
  for (const f of existsSync(DROP_DIR) ? readdirSync(DROP_DIR) : []) {
    const ext = extname(f).slice(1).toLowerCase();
    if (!IMAGE_EXT.includes(ext)) continue;
    candidates.push({ slug: basename(f, extname(f)), source: resolve(DROP_DIR, f), provenance: "own" });
  }

  // 1b. The browser harvest folder — images pulled off vendor sites through
  //     the console snippet, because this machine's network blocks the shell
  //     from reaching them directly. Same shape, supplier provenance.
  for (const f of existsSync(HARVEST_DIR) ? readdirSync(HARVEST_DIR) : []) {
    const ext = extname(f).slice(1).toLowerCase();
    if (!IMAGE_EXT.includes(ext)) continue;
    candidates.push({ slug: basename(f, extname(f)), source: resolve(HARVEST_DIR, f), provenance: "supplier" });
  }

  // 2 & 3. URL / path manifests.
  for (const r of readTsv(SUPPLIER_TSV)) candidates.push({ ...r, provenance: "supplier" });
  // The shop's own Ecwid storefront — its images, already published by it.
  for (const r of readTsv(ECWID_TSV)) candidates.push({ ...r, provenance: "ecwid" });
  for (const r of readTsv(ECWID_MATCHED_TSV)) candidates.push({ ...r, provenance: "ecwid" });
  for (const r of readTsv(ECWID_CRAWL_TSV)) candidates.push({ ...r, provenance: "ecwid" });
  for (const r of readTsv(LIGHTSPEED_TSV)) candidates.push({ ...r, provenance: "lightspeed" });

  /* What the previous run produced. Downloads that come back byte-identical
     are carried forward untouched, which keeps the cutout stage incremental:
     without this, every fetch resets `public/p` to raw photographs and clears
     the cutout flags, so re-running the pair meant re-segmenting all 172
     images to change one. */
  const prev: Record<string, Stored> = existsSync(OUT_MAP)
    ? JSON.parse(readFileSync(OUT_MAP, "utf8"))
    : {};
  const carried = new Map<string, Stored>();

  const results = new Map<string, Result>();
  const failed: string[] = [];
  const stale: string[] = [];
  let unmatched = 0;

  for (const c of candidates) {
    const slug = c.slug ?? (c.title ? byTitle.get(c.title) : undefined);
    if (!slug || !liveSlugs.has(slug)) {
      unmatched++;
      continue;
    }

    // Skip if a higher-priority source already claimed this product.
    const held = results.get(slug);
    if (held && PRIORITY[held.provenance] >= PRIORITY[c.provenance]) continue;

    try {
      let buf: Buffer;
      let ext: string;

      if (!/^https?:/i.test(c.source) && existsSync(c.source)) {
        buf = readFileSync(c.source);
        ext = extname(c.source).slice(1).toLowerCase();
      } else {
        const urls = /^https?:/i.test(c.source)
          ? [c.source]
          : LS_SIZES.map((px) => lightspeedUrl(c.source, px));
        let res: Response | null = null;
        for (const u of urls) {
          const r = await fetch(u, { headers: { "user-agent": "PuffVegas-ImagePipeline/1.0" } });
          if (r.ok) { res = r; break; }
        }
        if (!res) { failed.push(`${c.title ?? slug} — no reachable source`); continue; }
        buf = Buffer.from(await res.arrayBuffer());
        ext = "";
      }

      // Under ~2KB is a tracking pixel or an error page, not a photograph.
      if (buf.length < 2048) {
        failed.push(`${c.title ?? slug} — ${buf.length} bytes, not a photo`);
        continue;
      }

      // Trust the bytes, not the URL, the extension or the Content-Type.
      const sniffed = sniff(buf);
      if (!sniffed) {
        const head = buf.subarray(0, 24).toString("latin1").replace(/[^ -~]/g, ".");
        failed.push(`${c.title ?? slug} — not an image (${head})`);
        continue;
      }
      ext = sniffed;

      const file = `${slug}.${ext}`;
      const cachedOriginal = resolve(ORIGINALS, file);
      const held = prev[slug];

      // Unchanged bytes: leave the processed output and its record alone.
      if (
        held &&
        existsSync(cachedOriginal) &&
        readFileSync(cachedOriginal).equals(buf) &&
        existsSync(resolve(OUT_DIR, held.src.slice(3)))
      ) {
        carried.set(slug, held);
        results.set(slug, { slug, file: held.src, provenance: c.provenance, bytes: held.bytes });
        process.stdout.write("=");
        continue;
      }

      writeFileSync(resolve(OUT_DIR, file), buf);
      writeFileSync(cachedOriginal, buf);

      /* A product whose source moves to a different format leaves its old
         original behind, and whichever the cutout stage happens to list first
         wins. That is how a watermarked Element Vape PNG kept shipping after it
         had been replaced by a clean WebP. One original per slug. */
      for (const other of readdirSync(ORIGINALS)) {
        if (other !== file && basename(other, extname(other)) === slug) {
          rmSync(resolve(ORIGINALS, other));
        }
      }
      results.set(slug, { slug, file: `/p/${file}`, provenance: c.provenance, bytes: buf.length });
      process.stdout.write(c.provenance === "own" ? "O" : c.provenance === "supplier" ? "s" : c.provenance === "ecwid" ? "e" : ".");
    } catch (e) {
      /* A vendor host being briefly unreachable must not delete a picture we
         already downloaded once. The originals cache is the durable copy, so
         fall back to it and say so — silently dropping the product would look
         identical to the image never having existed. */
      const cached = existsSync(ORIGINALS)
        ? readdirSync(ORIGINALS).find((f) => basename(f, extname(f)) === slug)
        : undefined;
      if (cached) {
        const held = prev[slug];
        const buf = readFileSync(resolve(ORIGINALS, cached));
        if (held && existsSync(resolve(OUT_DIR, held.src.slice(3)))) {
          carried.set(slug, held);
          results.set(slug, { slug, file: held.src, provenance: held.provenance, bytes: held.bytes });
        } else {
          writeFileSync(resolve(OUT_DIR, cached), buf);
          results.set(slug, { slug, file: `/p/${cached}`, provenance: c.provenance, bytes: buf.length });
        }
        stale.push(`${c.title ?? slug} — unreachable, kept the cached copy`);
      } else {
        failed.push(`${c.title ?? slug} — ${String(e).slice(0, 60)}`);
      }
    }
  }

  process.stdout.write("\n");

  writeFileSync(
    OUT_MAP,
    JSON.stringify(
      Object.fromEntries(
        [...results.values()].map((r) => {
          const held = carried.get(r.slug);
          return held
            ? [r.slug, { ...held, provenance: r.provenance }]
            : [r.slug, { src: r.file, provenance: r.provenance, bytes: r.bytes }];
        }),
      ),
      null,
      1,
    ),
  );

  // Regenerate the worklist: every live product still without a picture,
  // grouped by brand so it can be worked one vendor at a time.
  const missing = live.filter((m) => !results.has(m.slug));
  const brandOf = (t: string) => t.split(/[\s\-–]/)[0];
  const grouped = new Map<string, typeof missing>();
  for (const m of missing) {
    const b = brandOf(m.title);
    grouped.set(b, [...(grouped.get(b) ?? []), m]);
  }
  const lines = [
    "# Products still without a photograph.",
    "#",
    "# Paste a vendor image URL after the ~~ on any line, then re-run:",
    "#   npx tsx scripts/fetch-images.ts",
    "#",
    "# Or skip the URLs entirely and drop files into research/ingest/images/",
    "# named <slug>.jpg — that path takes priority over everything else.",
    "#",
    `# ${missing.length} products, grouped by brand.`,
    "",
    ...[...grouped.entries()]
      .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
      .flatMap(([brand, items]) => [
        `# ── ${brand} (${items.length})`,
        ...items.map((m) => `${m.title} ~~ <url>`),
        "",
      ]),
  ];
  writeFileSync(WORKLIST, lines.join("\n"));

  /* `public/p` is entirely generated by this script, so anything in it that
     the run did not just write is an orphan — typically a product whose image
     moved to a better source with a different extension, leaving the old file
     to ship as dead weight. */
  const kept = new Set([...results.values()].map((r) => r.file.slice(3)));
  const keptSlugs = new Set([...results.values()].map((r) => r.slug));
  let pruned = 0;
  for (const f of readdirSync(OUT_DIR)) {
    /* Keyed on slug, not filename: the cutout stage rewrites `<slug>.jpg` as
       `<slug>.webp`, and a filename check would delete every cutout. */
    if (kept.has(f) || keptSlugs.has(basename(f, extname(f)))) continue;
    rmSync(resolve(OUT_DIR, f));
    pruned++;
  }

  const byProv: Record<string, number> = {};
  for (const r of results.values()) byProv[r.provenance] = (byProv[r.provenance] ?? 0) + 1;
  const kb = Math.round([...results.values()].reduce((n, r) => n + r.bytes, 0) / 1024);

  console.log(`\nlive products   ${live.length}`);
  console.log(`with an image   ${results.size}  (${Math.round((results.size / live.length) * 100)}%)`);
  for (const [p, n] of Object.entries(byProv)) console.log(`  ${p.padEnd(12)}${n}`);
  if (carried.size) console.log(`unchanged       ${carried.size}  (kept processed output)`);
  console.log(`still missing   ${missing.length}`);
  console.log(`failed          ${failed.length}`);
  if (stale.length) {
    console.log(`unreachable     ${stale.length}  (kept the copy already on disk)`);
    for (const s of stale) console.log(`  ~ ${s}`);
  }
  console.log(`disk            ${kb} KB${pruned ? `  (pruned ${pruned} orphan${pruned === 1 ? "" : "s"})` : ""}`);
  if (failed.length) for (const f of failed.slice(0, 10)) console.log(`  ! ${f}`);
  console.log(`\n→ ${OUT_MAP}`);
  console.log(`→ ${WORKLIST}`);
}

main();
