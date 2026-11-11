/**
 * Rebuild the catalogue from the committed snapshot, without a POS export.
 *
 *   npx tsx scripts/apply-shop-catalog.ts
 *
 * `catalog.generated.json` is the last Lightspeed import. This re-applies the
 * shop's own decisions (scripts/shop-catalog.ts) on top of it and writes it
 * back. It is the normal way to change the catalogue now that the shop is
 * moving off Lightspeed; import-lightspeed.ts is only needed to pull a fresh
 * POS export in, and it applies the same rules.
 *
 * Safe to run repeatedly — applyShop sets absolute values. Then, as after the
 * importer: fetch-images, build-search-index, build-ecwid-redirects, and
 * restart the dev server.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { applyShop, SHOP_EDITS, type ShopModel } from "./shop-catalog";
import { SHOP_FLAVORS } from "./shop-flavors";

const path = resolve("src/lib/commerce/catalog.generated.json");
const models = JSON.parse(readFileSync(path, "utf8")) as ShopModel[];
const before = new Map(models.map((m) => [m.title, { ...m }]));

const { editsFired, flavorsSet } = applyShop(models);
const flavorMisses = Object.keys(SHOP_FLAVORS).filter((t) => !flavorsSet.has(t));

// Same layout the importer writes, so diffs stay readable.
writeFileSync(path, JSON.stringify(models, null, 1));

const published = models.filter((m) => m.publishable);
const added = published.filter((m) => !before.get(m.title)?.publishable);
const removed = models.filter((m) => before.get(m.title)?.publishable && !m.publishable);
const repriced = models.filter((m) => {
  const b = before.get(m.title);
  return b && m.publishable && b.priceCents !== m.priceCents;
});
// Titles already renamed by an earlier run no longer match their POS key;
// that is expected, so only report keys that match nothing at all.
const known = new Set([...models.map((m) => m.title)]);
const unmatched = Object.keys(SHOP_EDITS).filter(
  (k) => !editsFired.has(k) && !known.has(SHOP_EDITS[k].title ?? ""),
);

console.log(`published       ${published.length}`);
console.log(`newly published ${added.length}${added.map((m) => `\n  + ${m.title}`).join("")}`);
console.log(`unpublished     ${removed.length}${removed.map((m) => `\n  - ${m.title}`).join("")}`);
console.log(`repriced        ${repriced.length}`);
console.log(`flavour lists   ${flavorsSet.size} applied`);
if (flavorMisses.length) console.log(`flavour lists matching nothing:\n  ${flavorMisses.join("\n  ")}`);
if (unmatched.length) console.log(`shop edits matching nothing:\n  ${unmatched.join("\n  ")}`);
