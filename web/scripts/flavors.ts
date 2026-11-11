/**
 * What a variant value IS (flavour, strength, hardware, pack size) and, for a
 * flavour, which swatch family it belongs to. Shared by the Lightspeed
 * importer and the shop's own flavour lists in shop-catalog.ts, so a flavour
 * the shop adds by hand is bucketed exactly like one read from the POS.
 */
import type { FlavorFamily } from "../src/lib/commerce/types";

/* ---------------------------------------------------------------------------
   2. Flavour → family.

   Order matters. A fruit term wins over an ice/mint term, because
   "Watermelon Ice" is a melon flavour that happens to be chilled, not a mint.
   Dessert is checked before fruit only for compound confectionery terms.
   --------------------------------------------------------------------------- */

export const FLAVOR_RULES: [FlavorFamily, RegExp][] = [
  ["dessert", /cotton candy|ice cream|cupcake|custard|cheesecake|caramel|chocolate|cookie|gummy|rancher|skittle|b-?pop|marshmallow|vanilla|sundae|cake|donut|waffle/i],
  ["grape", /grape/i],
  ["melon", /watermelon|honeydew|cantaloupe|melon/i],
  ["orchard", /apple|cherry|pear\b|plum|cider/i],
  ["berry", /berry|razz|raspberr|blueberr|strawberr|blackberr|cranberr|acai|currant/i],
  ["tropical", /mango|pineapple|coconut|banana|guava|passion|kiwi|dragon|lychee|papaya|hawaiian|tropical|peach|apricot/i],
  ["citrus", /lemon|lime|orange|citrus|grapefruit|tangerine|yuzu/i],
  ["tobacco", /tobacco|cuban|classic/i],
  ["mint", /mint|menthol|\bice\b|icy|iced|cool|frozen|freeze|arctic|polar|spearmint|frost/i],
  ["unflavored", /^clear$|unflavou?red|zero|plain|no flavou?r|original/i],
];

export function classifyFlavor(value: string): FlavorFamily | null {
  for (const [family, re] of FLAVOR_RULES) if (re.test(value)) return family;
  return null;
}

/**
 * Lightspeed's variant slot is literally named "Flavor", but staff have used
 * it for whatever varies on a given product — coil resistance, nicotine
 * strength, pack size, weight. Roughly 40% of the values in that column are
 * not flavours at all.
 *
 * So before classifying, work out what a value actually IS. Treating
 * "0.15A Quadra 85-100W" as an unbucketed flavour would be a false negative;
 * treating it as a flavour with no swatch would be worse — it would put
 * hardware specs in the flavour filter.
 */
export type VariantKind =
  | { kind: "flavor"; family: FlavorFamily | null }
  | { kind: "strength"; mg: number }
  | { kind: "hardware" }
  | { kind: "packSize" }
  | { kind: "other" };

export function classifyVariant(raw: string): VariantKind {
  const v = raw.trim();

  // Coil specs: "0.2A Mesh 50-58W", "0.6", "1.2A Mesh 8-12W"
  if (/^\d+(\.\d+)?\s*(a\b|ohm|Ω)/i.test(v) || /\d+\s*-\s*\d+\s*w\b/i.test(v)) {
    return { kind: "hardware" };
  }
  if (/^\d+(\.\d+)?$/.test(v)) return { kind: "hardware" };

  // Nicotine strength: "30mg", "0 Mg", "5*15mg", "10*15 Mg"
  const mg = v.match(/(?:^|\D)(\d{1,3})\s*mg\b/i);
  if (mg && !/\d{3,}\s*mg/i.test(v)) {
    return { kind: "strength", mg: Number(mg[1]) };
  }

  // Pack sizes and weights: '3" Pack', "20\" Softgels", "3.5g", "30mg 7pk"
  if (/\bpack\b|\bpk\b|softgel|\d+\s*g\b|\d+\s*ct\b|count/i.test(v)) {
    return { kind: "packSize" };
  }

  const family = classifyFlavor(v);
  if (family) return { kind: "flavor", family };

  // Text with no numbers is very likely a genuine flavour we simply have no
  // rule for yet — worth surfacing. Anything else is noise.
  return /^[A-Za-z][A-Za-z \-'&+.]{2,}$/.test(v)
    ? { kind: "flavor", family: null }
    : { kind: "other" };
}
