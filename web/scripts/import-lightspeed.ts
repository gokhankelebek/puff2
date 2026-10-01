/**
 * Lightspeed X-Series → Puff Vegas catalogue importer.
 *
 *   npx tsx scripts/import-lightspeed.ts ../research/lightspeed-product-export.csv
 *
 * Reads the canonical product export, groups 6,305 SKU rows into ~1,415
 * product MODELS, classifies each one, and writes:
 *
 *   src/lib/commerce/catalog.generated.json   the catalogue the site reads
 *   ../research/import-review.md              everything a human must check
 *
 * Two principles run through the whole thing:
 *
 * 1. FAIL CLOSED. Anything the importer cannot confidently classify becomes
 *    `unknown` and is not publishable. An unclassified nicotine product is
 *    precisely the one that would ship without its legally required warning,
 *    so silence is never treated as permission.
 *
 * 2. NEVER INVENT. Where the source has no value — no category, no price, no
 *    photo — the output says so rather than guessing. Guesses in a compliance
 *    field are worse than gaps, because gaps get reviewed and guesses don't.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parse } from "csv-parse/sync";
import type { FlavorFamily, RegulatoryClass } from "../src/lib/commerce/types";

/* ---------------------------------------------------------------------------
   1. Category → regulatory class.

   This table is the most consequential thing in the repository: it decides
   which listings carry a federally mandated health warning. Every one of the
   34 categories present in the export is listed explicitly — there is no
   catch-all default to `accessory`, because a wrong default here is a missing
   warning.
   --------------------------------------------------------------------------- */

type Mapping = { cls: RegulatoryClass; review?: string };

const CATEGORY_MAP: Record<string, Mapping> = {
  // --- ENDS. FDA nicotine warning required. -------------------------------
  "Disposable Vape": { cls: "ends" },
  "Refillable Vape": { cls: "ends" },
  "Vape Mods": { cls: "ends" },
  "Vape-Juice": { cls: "ends" },
  Vuse: { cls: "ends" },
  Juul: { cls: "ends" },
  Njoy: { cls: "ends" },

  // --- Oral nicotine. Warning required. -----------------------------------
  "Nicotine Pouches": { cls: "pouch" },
  "Tobacco-Pouches": {
    cls: "pouch",
    review:
      'Ambiguous name. "Tobacco pouches" may mean oral pouches (→ pouch) or ' +
      "roll-your-own pouch tobacco (→ rollYourOwn). Different products; both " +
      "need a warning, but confirm which before publishing.",
  },

  // --- Combustible cigarettes. FCLAA, not the FDA statement. --------------
  Cigarettes: { cls: "cigarette" },

  // --- Cigars. Warning VACATED in Cigar Ass'n of Am. v. FDA. --------------
  Cigar: { cls: "cigar" },
  Cigarillos: {
    cls: "cigar",
    review:
      "Little filtered cigars are contested — ATF has taken the position that " +
      "they can fall within the definition of a cigarette (26 U.S.C. 5702(a)). " +
      "If these are filtered, they may be `cigarette`, not `cigar`.",
  },

  // --- RYO and leaf. 1143.3 names cigarette tobacco and RYO explicitly. ---
  "Rolling Tobacco": { cls: "rollYourOwn" },
  Leaf: { cls: "rollYourOwn" },
  "Rolling Papers, Cigarillos, Leaf & Wraps": {
    cls: "unknown",
    review:
      "MIXED CATEGORY — cannot be classified as a unit. It contains papers " +
      "(accessory, no warning), cigarillos (cigar, exempt) and leaf/wraps " +
      "(rollYourOwn, warning REQUIRED). 196 SKUs must be split before any of " +
      "them publish.",
  },

  // --- Smokeless. Its own statutory warnings, not built yet. --------------
  "Dipping Chewing Tobacco": {
    cls: "smokeless",
    review:
      "Governed by the Comprehensive Smokeless Tobacco Health Education Act — " +
      "a separate set of rotating warnings the site does not yet render. " +
      "Withheld from publication until that exists.",
  },

  // --- Hookah. -------------------------------------------------------------
  "Hookah & Shisha Accessories": {
    cls: "unknown",
    review:
      'Named "Accessories" but almost certainly mixed. Shisha TOBACCO requires ' +
      "the nicotine warning (FDA names hookah tobacco explicitly); bowls, hoses " +
      "and charcoal do not. Split before publishing.",
  },

  // --- Accessories. No nicotine warning. ----------------------------------
  Lighter: { cls: "accessory" },
  Torch: { cls: "accessory" },
  "Papper & Cons": { cls: "accessory" },
  "Glass Pipe & Bong": {
    cls: "accessory",
    review:
      "Describe strictly as tobacco accessories. No cannabis imagery or slang " +
      "— 21 U.S.C. 863 turns paraphernalia marketing into a separate problem.",
  },
  "Smoke Part": { cls: "accessory" },
  "Part of WD": { cls: "accessory" },
  Parfum: { cls: "accessory" },
  Jewelry: { cls: "accessory" },
  Snacks: { cls: "accessory" },
  Drinks: { cls: "accessory" },

  // --- Grey inventory. Firewalled. ----------------------------------------
  /* ── Do not "fix" the CBD FX rows into `hemp`. ─────────────────────────
     Eight SKUs whose NAMES read as ordinary CBD — "Cbd Fx Gummies", "Cbd Fx
     Cream", "Hemp Trailz 7g Flower" — carry `product_category: THCA` in the
     POS. Category beats name inference here and they land in `restricted`.

     That is the right outcome, not a bug. CBDfx and Hemp Trailz both sell a
     hemp line AND an intoxicating line, the shop labelled these THCA, and
     reclassifying them into a lawful-hemp bucket on the strength of a brand
     name is guessing in the one direction that carries licence risk. If the
     shop says a given SKU is non-intoxicating, the evidence is a COA — attach
     it and the model moves, with proof, rather than by inference. */
  THCA: {
    cls: "restricted",
    review:
      "Nevada SB 356 (2025) is reported to have moved THCA to CCB-licensed " +
      "dispensaries only. Largest single legal exposure in the catalogue and " +
      "the category Vegas tourists are most warned about. 🔴 COUNSEL.",
  },
  Kratom: { cls: "restricted", review: "Grey inventory — see THCA note. 🔴 COUNSEL." },
  Mushroom: { cls: "restricted", review: "Grey inventory — see THCA note. 🔴 COUNSEL." },
  Cream: {
    cls: "restricted",
    review:
      "Unclear what this is — plausibly CBD topicals. Treated as restricted " +
      "until identified. If it is ordinary skincare, reclassify to accessory.",
  },

  // --- Junk / unclassifiable. ---------------------------------------------
  xxx: { cls: "unknown", review: "Junk category name carried over from the old catalogue." },
  Deal: { cls: "unknown", review: "A merchandising bucket, not a product type. Needs real categories." },
};


/* ---------------------------------------------------------------------------
   1b. Per-model overrides.

   Two of Lightspeed's categories mix products with DIFFERENT legal outcomes,
   so no category-level mapping can be correct for them. Rather than edit the
   POS — which is the shop's operational system and not ours to reorganise —
   the split lives here, keyed by product name.

   This is data we own. It survives leaving Lightspeed, it is reviewable in a
   diff, and it is the only place a human decision about a specific product is
   recorded. Anything in a mixed category WITHOUT an entry here stays `unknown`
   and does not publish.
   --------------------------------------------------------------------------- */

const MIXED_CATEGORIES = new Set([
  "Hookah & Shisha Accessories",
  "Rolling Papers, Cigarillos, Leaf & Wraps",
]);

const MODEL_OVERRIDES: Record<string, Mapping> = {
  // --- Shisha tobacco. Warning REQUIRED — FDA's retailer chart names hookah
  //     tobacco explicitly, alongside ENDS and cigarette tobacco. -----------
  "Al Fakher 250g": { cls: "hookah" },
  "Al Fakher 50g": { cls: "hookah" },
  "Eternal Smoke 250g": { cls: "hookah" },
  "Eternal Smoke 50Mg": {
    cls: "hookah",
    review: '"50Mg" is almost certainly a typo for 50g. Confirm the pack size.',
  },
  "Fumari 100g Tobacco": { cls: "hookah" },
  "Serbetli 50 gr": { cls: "hookah" },
  "Starbuzz Tobacco": { cls: "hookah" },
  "Starbuzz Tabacco": {
    cls: "hookah",
    review:
      'Misspelling of "Tobacco", and a DUPLICATE of "Starbuzz Tobacco". Two ' +
      "models for one product splits its stock and would create two URLs. Merge.",
  },

  // --- Hookah hardware and fuel. No tobacco, no warning. ------------------
  "Al Fakher Charcoal": { cls: "accessory" },
  Hookah: { cls: "accessory" },

  // --- Not hookah at all. Miscategorised smokeless tobacco. ---------------
  Skoal: {
    cls: "smokeless",
    review:
      "Filed under hookah but it is dipping tobacco. Needs the Smokeless " +
      "Tobacco Health Education Act warnings, which are not built yet.",
  },
  "Copenhagen Nicotine Pouches": {
    cls: "smokeless",
    review:
      "Copenhagen pouches are moist snuff in pouch form — SMOKELESS TOBACCO, " +
      "not an oral nicotine product like Zyn. Different statute, different " +
      "warnings. Withheld deliberately; do not reclassify to `pouch`.",
  },
  "Super Value Pipe Tobacco": {
    cls: "rollYourOwn",
    review:
      "Pipe/roll-your-own tobacco that fell into the Tobacco-Pouches category " +
      "and inherited its `pouch` class, so it surfaced in the Pouches " +
      "department next to Zyn. It is loose tobacco, not oral nicotine.",
  },

  // --- Cigarillos. FDA nicotine warning vacated for cigars. ---------------
  "Al Capone": { cls: "cigar" },
  "BLK Swisher Sweets": { cls: "cigar" },
  "Black  & Mild Single": {
    cls: "cigar",
    review: "Double space in the name — will produce an ugly slug. Worth fixing.",
  },
  Dutch: { cls: "cigar" },
  Game: { cls: "cigar" },
  "Good Times Woods": { cls: "cigar" },
  "Swisher Sweets": { cls: "cigar" },
  "White Owl": { cls: "cigar" },
  "Zig-Zag Cigarillos": { cls: "cigar" },

  // --- Tobacco leaf and wraps. Warning REQUIRED — 1143.3 covers RYO. ------
  "Al Capone Leaf": { cls: "rollYourOwn" },
  "Grabba Leaf": { cls: "rollYourOwn" },
  "Grabba Leaf Green": { cls: "rollYourOwn" },
  "Loose Leaf": { cls: "rollYourOwn" },
  "Zig-Zag Wraps": { cls: "rollYourOwn" },

  // --- Papers and cones. No tobacco. --------------------------------------
  "Raw Cones": { cls: "accessory" },
  "ZigZag Papers": { cls: "accessory" },
  "High Hemp": {
    cls: "accessory",
    review:
      "Hemp wraps contain no tobacco and no nicotine, so no warning — but " +
      "confirm they are the tobacco-free line and not a CBD product. Held " +
      "off-site by the cannabinoid firewall until confirmed.",
  },
  "High Hemp Papers": { cls: "accessory" },

  "NEXA 50 Ultra 2": {
    cls: "ends",
    review:
      "Disposable vape with 13 flavours. Named \"50\" rather than \"50K\", so " +
      "the puff-count pattern in inferFromName does not fire. Handled here " +
      "rather than by loosening that regex — a bare two-digit number is far " +
      "too weak a signal to classify a nicotine product on.",
  },

  "Hot Skull": {
    cls: "rollYourOwn",
    review:
      "Identified from the brand's own site (hotskull.com): Hot Skull is a " +
      "FRONTO LEAF brand — organic tobacco leaf from the Dominican Republic, " +
      "sold as cigar wrappers and binders. That makes it roll-your-own " +
      "tobacco, so the nicotine warning applies.\n\n" +
      "They also sell hemp papers and cigar tips, which would be `accessory`. " +
      "This single $9.99 SKU has no variant data to tell them apart, so it is " +
      "classified as leaf: over-warning is the safe direction of error, since " +
      "the alternative is a tobacco product shipping with no warning at all. " +
      "If this SKU turns out to be the hemp paper line, reclassify.",
  },
};


/* ---------------------------------------------------------------------------
   1c. Name inference — ONLY for products with no category at all.

   1,653 SKUs (602 models) have an empty `product_category` in Lightspeed. They
   cannot be left unclassified forever, but they also must not be guessed at
   loosely, so this runs a short list of high-confidence patterns and gives up
   otherwise.

   Order matters, and it is ordered by DANGER rather than by frequency:
   restricted goods are tested first so nothing slips into a publishable class,
   and the vape test runs before the hookah test because a disposable e-hookah
   ("Pop Salt Onyx Cloud 25k Hookah") is an ENDS product, not hardware.
   --------------------------------------------------------------------------- */

function inferFromName(title: string, flavorCount: number): Mapping | null {
  const t = title.toLowerCase();

  // --- Restricted first, always. -----------------------------------------
  if (/\bspace\s?gas\b|nitrous|galaxy\s?gas|\bn2o\b|whip.?it/.test(t)) {
    return {
      cls: "restricted",
      review:
        "Nitrous oxide. Not a tobacco product at all — it is a food-grade gas " +
        "being sold for inhalation, and a growing number of states now restrict " +
        "or ban its retail sale. Firewalled with the rest of the grey inventory. " +
        "🔴 COUNSEL before this ever appears on the site.",
    };
  }
  if (/thca|kratom|delta.?[89]|\b7-?oh\b|mushroom|amanita|\bhhc\b/.test(t)) {
    return { cls: "restricted", review: "Grey inventory matched by name. 🔴 COUNSEL." };
  }

  /* Non-intoxicating hemp and CBD. This runs AFTER the intoxicant test on
     purpose: "CBD Delta-8 Gummies" must land in `restricted`, and it only does
     so because the line above already claimed it.

     Two traps this has to avoid, both real rows in the export:

       - "Hemper Las Vegas Bong" is glass. `\bhemp\b` does not match it —
         the 'p' is followed by 'e', so there is no word boundary. Do NOT
         loosen this to a bare substring.
       - "Billionaire Hemp Wraps", "Graba Leaf Hemp Paper", "High Hemp" are
         rolling material, not consumables. They arrive with a real category
         ("Rolling Papers, Cigarillos, Leaf & Wraps", "Leaf") and so never
         reach name inference at all — but if one ever does, the wrap/paper
         test below sends it to rollYourOwn rather than to the hemp shelf.

     Landing in `hemp` is not the same as publishing: PUBLISHABLE_CLASSES
     requires a batch COA on top of the class. See Product.coa. */
  if (/\bhemp\b|\bcbd\b/.test(t)) {
    /* Consumable FORMS are tested before rolling material, and the order is
       load-bearing: "CBD Roll on Cream" is a topical, and a bare /roll/ test
       claimed it as rolling paper. Match the dose form first, then the
       material. */
    const consumable =
      /cream|balm|lotion|salve|roll[\s-]?on|tincture|dropper|drops?\b|gummies|gummy|\boil\b|capsule|softgel|edible|\bflower\b|\bsmokes?\b/.test(
        t,
      );
    if (!consumable && /\bwraps?\b|\bpapers?\b|\bcones?\b|\brolls?\b|\bleaf\b|\bblunts?\b|\btips?\b/.test(t)) {
      return {
        cls: "rollYourOwn",
        review: "Hemp rolling material, not a consumable. Warning required.",
      };
    }
    return {
      cls: "hemp",
      review:
        "Non-intoxicating hemp/CBD by name. Does NOT publish until a batch " +
        "COA is attached and delta-9 is confirmed at or below 0.3%. " +
        "🔴 COUNSEL on Nevada consumable-hemp rules.",
    };
  }

  // --- ENDS. A puff-count plus a flavour range is a disposable. ----------
  const puffish = /\b\d{1,3}\s?k\b|\b\d{4,6}\s*puff/.test(t);
  if (/disposable|\bvape\b|e-?liquid|\bnic\b|\bpod\b|\bpuff/.test(t) || (puffish && flavorCount >= 2)) {
    return { cls: "ends" };
  }

  // --- Cigars. ------------------------------------------------------------
  if (/\bcigar\b/.test(t) && !/cigarette/.test(t)) return { cls: "cigar" };

  // --- Tobacco leaf and wraps. Warning required. -------------------------
  if (/\bleaf\b|fronto|grabba|graba\b|\bwrap/.test(t)) return { cls: "rollYourOwn" };

  // --- Hookah HARDWARE. Only reached if the vape test above did not fire. -
  if (/hookah|shisha|charcoal|\bbowl\b|\bhose\b|burner/.test(t)) {
    return { cls: "accessory" };
  }

  // Everything else stays unknown. Deliberately.
  return null;
}

/* ---------------------------------------------------------------------------
   2. Flavour → family.

   Order matters. A fruit term wins over an ice/mint term, because
   "Watermelon Ice" is a melon flavour that happens to be chilled, not a mint.
   Dessert is checked before fruit only for compound confectionery terms.
   --------------------------------------------------------------------------- */

const FLAVOR_RULES: [FlavorFamily, RegExp][] = [
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

function classifyFlavor(value: string): FlavorFamily | null {
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
type VariantKind =
  | { kind: "flavor"; family: FlavorFamily | null }
  | { kind: "strength"; mg: number }
  | { kind: "hardware" }
  | { kind: "packSize" }
  | { kind: "other" };

function classifyVariant(raw: string): VariantKind {
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

/* ---------------------------------------------------------------------------
   3. Load, group, classify.
   --------------------------------------------------------------------------- */

type Row = Record<string, string>;

const csvPath = resolve(process.argv[2] ?? "../research/lightspeed-product-export.csv");
const rows: Row[] = parse(readFileSync(csvPath), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
});

const inventoryCol =
  Object.keys(rows[0]).find((c) => c.startsWith("inventory_")) ?? "inventory";

const num = (v: string | undefined) => {
  const n = Number.parseFloat(v ?? "");
  return Number.isFinite(n) ? n : 0;
};
const truthy = (v: string | undefined) =>
  ["1", "true", "yes"].includes((v ?? "").trim().toLowerCase());

/** Our slug, authored once and owned by us. Never derived from the vendor. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    // "30.000 Puff" is a European thousands separator, not thirty puffs.
    .replace(/(\d)[.,](\d{3})\b/g, "$1$2")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

/** Puff count is usually buried in the title: "30.000 Puff", "80K", "5000". */
function parsePuffCount(name: string): number | undefined {
  const k = name.match(/(\d{1,3})\s?k\b/i);
  if (k) return Number(k[1]) * 1000;
  const euro = name.match(/(\d{1,3})[.,](\d{3})\s*puff/i);
  if (euro) return Number(euro[1] + euro[2]);
  const plain = name.match(/(\d{4,6})\s*puff/i);
  if (plain) return Number(plain[1]);
  return undefined;
}

type Model = {
  slug: string;
  vendorHandle: string;
  title: string;
  category: string | null;
  regulatoryClass: RegulatoryClass;
  publishable: boolean;
  brand?: string;
  onlineSkus: number;
  skuCount: number;
  stock: number;
  priceCents: number | null;
  puffCount?: number;
  flavors: { value: string; family: FlavorFamily | null }[];
  /** Harvested from variant values that were really strengths, not flavours. */
  nicotineMg: number[];
  /** Counts of variant values that were not flavours at all. */
  nonFlavorVariants: { hardware: number; packSize: number; other: number };
  imageUrl: string | null;
  /**
   * Batch certificate of analysis. `hemp` does not publish without one.
   *
   * Lightspeed has nowhere to put this, and per the standing rule we do not
   * add fields to the POS. It will arrive from a separate shop-owned source
   * (a sheet, or the lab's portal) and be joined here by batch. Until that
   * source exists this is always undefined, which is the correct behaviour:
   * hemp classifies, reports, and stays off the site.
   */
  coa?: {
    batch: string;
    url: string;
    testedAt: string;
    thcDelta9Percent: number;
    lab?: string;
  };
};

const overridesFired = new Set<string>();
const grouped = new Map<string, Model>();
const slugSeen = new Map<string, number>();

for (const r of rows) {
  const title = (r.name ?? "").trim();
  if (!title) continue;

  if (!grouped.has(title)) {
    let slug = slugify(title);
    // Collisions are possible once punctuation is stripped; disambiguate
    // deterministically so the slug is stable across re-runs.
    const seen = slugSeen.get(slug) ?? 0;
    slugSeen.set(slug, seen + 1);
    if (seen > 0) slug = `${slug}-${seen + 1}`;

    const category = (r.product_category ?? "").trim() || null;
    let mapping: Mapping = category
      ? (CATEGORY_MAP[category] ?? { cls: "unknown", review: `Unmapped category "${category}".` })
      : { cls: "unknown", review: "No product_category set in Lightspeed." };

    // A per-model override always wins — it is the more specific decision.
    const override = MODEL_OVERRIDES[title];
    if (override) {
      mapping = override;
      overridesFired.add(title);
    } else if (category && MIXED_CATEGORIES.has(category)) {
      // In a mixed category with no override, fail closed rather than
      // inheriting a class that is only right for some of its siblings.
      mapping = {
        cls: "unknown",
        review: `In mixed category "${category}" with no per-model override. Add one to MODEL_OVERRIDES.`,
      };
    }

    grouped.set(title, {
      slug,
      vendorHandle: r.handle ?? "",
      title,
      category,
      regulatoryClass: mapping.cls,
      publishable: false,
      onlineSkus: 0,
      skuCount: 0,
      stock: 0,
      priceCents: null,
      puffCount: parsePuffCount(title),
      flavors: [],
      nicotineMg: [],
      nonFlavorVariants: { hardware: 0, packSize: 0, other: 0 },
      imageUrl: null,
    });
  }

  const m = grouped.get(title)!;
  m.skuCount++;
  m.stock += num(r[inventoryCol]);
  if (truthy(r.active_online)) m.onlineSkus++;

  const price = Math.round(num(r.retail_price) * 100);
  if (price > 0 && (m.priceCents === null || price < m.priceCents)) m.priceCents = price;

  for (const i of ["one", "two", "three"] as const) {
    if (/^flavou?r/i.test((r[`variant_option_${i}_name`] ?? "").trim())) {
      const value = (r[`variant_option_${i}_value`] ?? "").trim();
      if (!value) continue;
      const c = classifyVariant(value);
      if (c.kind === "flavor") {
        if (!m.flavors.some((f) => f.value === value)) {
          m.flavors.push({ value, family: c.family });
        }
      } else if (c.kind === "strength") {
        if (!m.nicotineMg.includes(c.mg)) m.nicotineMg.push(c.mg);
      } else {
        m.nonFlavorVariants[c.kind] += 1;
      }
    }
  }
}

const models = [...grouped.values()];

/**
 * Second pass: infer a class for products that have no category.
 *
 * This runs AFTER grouping because the strongest vape signal is "a puff-count
 * in the name plus a real flavour range", and the flavour range is only known
 * once every SKU row for the model has been seen.
 *
 * Only ever applied where the category was genuinely absent — never to
 * override a category that exists, and never to rescue a mixed category.
 */
const inferred = new Set<string>();
for (const m of models) {
  if (m.category || m.regulatoryClass !== "unknown") continue;
  const guess = inferFromName(m.title, m.flavors.length);
  if (guess) {
    m.regulatoryClass = guess.cls;
    inferred.add(m.title);
  }
}

/**
 * Third pass: the cannabinoid firewall. Owner decision (2026-09-29): no THC
 * or CBD product appears on the site.
 *
 * This runs LAST and beats category, override and inference alike, because
 * the POS files some of these under ordinary categories — "Geek THCX 3 gram
 * disposable" and "Torch 1 Gram THC-A Disposable" arrived as vapes, and the
 * `thca` name test above never saw them (it only runs on uncategorised rows,
 * and it does not match "thc-a", "thcx" or "thcp" anyway).
 *
 *  - THC in any spelling, cannabis, HHC, delta-8/9/10 → `restricted`.
 *  - CBD → `hemp`, which never publishes (see the publish rule below).
 *
 *  - Hemp wraps and rolls → `unknown`. Owner decision, same day: hidden
 *    until the shop confirms they are the tobacco-free line and not a CBD
 *    one. "High Hemp" is a wrap brand, so it is named outright. Plain hemp
 *    PAPERS ("Pure Hemp Papers", "High Hemp Papers") are ordinary rolling
 *    papers and are deliberately not matched.
 */
const THC_NAME = /\bthc|cannabi|\bhhc\b|delta.?(8|9|10)\b/;
const CBD_NAME = /\bcbd\b/;
const HEMP_WRAP_NAME = /\bhemp\b.*\b(wraps?|rolls?)\b|\bhemparillo\b|^high hemp$/;
const firewalled = new Set<string>();
for (const m of models) {
  const t = m.title.toLowerCase();
  if (THC_NAME.test(t) && m.regulatoryClass !== "restricted") {
    m.regulatoryClass = "restricted";
    firewalled.add(m.title);
  } else if (CBD_NAME.test(t) && m.regulatoryClass !== "restricted" && m.regulatoryClass !== "hemp") {
    m.regulatoryClass = "hemp";
    firewalled.add(m.title);
  } else if (HEMP_WRAP_NAME.test(t) && m.regulatoryClass !== "restricted" && m.regulatoryClass !== "hemp") {
    m.regulatoryClass = "unknown";
    firewalled.add(m.title);
  }
}

/**
 * Brands, for the homepage wall and the product page byline.
 *
 * `brand` has been a declared-but-never-populated field: the product page has
 * always rendered `{product.brand && ...}` and never shown one. Deriving it
 * from the first word of the title gets "Al" out of "Al Fakher" and "Geek" out
 * of both Geek Bar and Geek Vape, which are different manufacturers, so the
 * list is curated instead.
 *
 * Matched longest-first on a word boundary, not as a prefix — "BLK Swisher
 * Sweets" is a Swisher Sweets product with a line name in front of it. A title
 * that matches nothing simply has no brand, which is the right outcome for
 * "Butane" and "Glass Bong – Size 3".
 */
const BRANDS: [pattern: string, display: string][] = [
  // Multi-word first; the sort below enforces it, this order is for reading.
  ["Al Fakher", "Al Fakher"], ["Al Capone", "Al Capone"],
  ["American Spirit", "American Spirit"], ["Benson & Hedges", "Benson & Hedges"],
  ["Black & Mild", "Black & Mild"], ["Geek Bar", "Geek Bar"],
  ["Geek Vape", "Geek Vape"], ["Lost Mary", "Lost Mary"],
  ["Lost Vape", "Lost Vape"], ["Lucky Strike", "Lucky Strike"],
  ["Lucy Breakers", "Lucy"], ["Grabba Leaf", "Grabba Leaf"],
  ["Graba Leaf", "Grabba Leaf"], ["Leather Rose", "Leather Rose"],
  ["MJ Arsenal", "MJ Arsenal"], ["Off Stamp", "Off Stamp"],
  ["Pall Mall", "Pall Mall"], ["Pillow Talk", "Pillow Talk"],
  ["Pyne Pod", "Pyne Pod"], ["Romeo y Juliet", "Romeo y Julieta"],
  ["Swisher Sweets", "Swisher Sweets"], ["Virginia Slims", "Virginia Slims"],
  ["White Owl", "White Owl"], ["High Hemp", "High Hemp"],
  ["Good Times", "Good Times"], ["Super Value", "Super Value"],
  ["Zig-Zag", "Zig-Zag"], ["ZigZag", "Zig-Zag"],
  // Single word.
  ["Vaporesso", "Vaporesso"], ["Montecristo", "Montecristo"],
  ["Macanudo", "Macanudo"], ["Starbuzz", "Starbuzz"], ["Serbetli", "Serbetli"],
  ["Spaceman", "Spaceman"], ["Syntrix", "Syntrix"], ["Cookies", "Cookies"],
  ["Ebcreate", "EB Create"], ["Backwoods", "Backwoods"], ["Marlboro", "Marlboro"],
  ["Newport", "Newport"], ["Camel", "Camel"], ["Winston", "Winston"],
  ["Salem", "Salem"], ["Seneca", "Seneca"], ["Montego", "Montego"],
  ["Pyramid", "Pyramid"], ["Capri", "Capri"], ["Djarum", "Djarum"],
  ["Dutch", "Dutch"], ["Drum", "Drum"], ["Juul", "Juul"], ["Hyppe", "Hyppe"],
  ["Oxbar", "Oxbar"], ["Flonq", "Flonq"], ["Flum", "Flum"], ["Foger", "Foger"],
  ["Adjust", "Adjust"], ["Airis", "Airis"], ["Alp", "Alp"], ["Acid", "Acid"],
  ["Rogue", "Rogue"], ["Velo", "Velo"], ["Zyn", "Zyn"], ["Zone", "Zone"],
  ["Fre", "Fre"], ["Lucy", "Lucy"], ["Raw", "RAW"], ["Raz", "RAZ"],
  ["MNKE", "MNKE"], ["Nexa", "Nexa"], ["Olit", "Olit"], ["Pixi", "Pixi"],
  ["SWFT", "SWFT"], ["Smok", "Smok"], ["Fumari", "Fumari"],
  ["Tatiana", "Tatiana"], ["Cohiba", "Cohiba"], ["Woyu", "Woyu"],
  ["Cocous", "Cocous"], ["Bali Shag", "Bali Shag"], ["DKHAAN", "DKHAAN"],
  ["Meloso", "Meloso"], ["Fifty Bar", "Fifty Bar"], ["Empire", "Empire"],
  ["Loose Leaf", "Loose Leaf"], ["Drew Estate", "Drew Estate"],
  ["Fasta Drop", "Fasta Drop"], ["Hot Skull", "Hot Skull"], ["Eve", "Eve"],
  ["Game", "Game"], ["LM", "L&M"], ["North", "North"], ["Pop Salt", "Pop Salt"],
  // "On" alone would match half the catalogue; only the full product name is
  // safe. R&J is Romeo y Julieta under its initials.
  ["On Nicotine Pouches", "On!"], ["R&J", "Romeo y Julieta"],
]
  // Longest pattern wins, so "Geek Vape" is never shadowed by a shorter entry.
  .sort((a, b) => b[0].length - a[0].length) as [string, string][];

function brandOf(rawTitle: string): string | undefined {
  // POS titles carry stray double spaces ("Black  & Mild Single"), which a
  // literal pattern will not match.
  const title = rawTitle.replace(/\s+/g, " ").trim();
  for (const [pattern, display] of BRANDS) {
    const re = new RegExp(`(^|\\s)${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "i");
    if (re.test(title)) return display;
  }
  return undefined;
}

// Publishable = classifiable, not grey, online, and priced. All four, or it
// does not go out.
const PUBLISHABLE_CLASSES = new Set<RegulatoryClass>([
  "ends", "hookah", "cigar", "cigarette", "pouch", "rollYourOwn", "accessory",
]);

/* `hemp` is deliberately NOT in the set above, and there is no longer a way in.
   It used to publish once a batch COA was attached; the owner has since
   decided (2026-09-29) that no CBD or THC product is listed online at all, COA
   or not. Hemp still imports and classifies so the report can count it — it
   just never goes out. Reopening it is a decision, not a data fix. */
/**
 * Shop edits — corrections the shop hands us that the POS does not (yet)
 * reflect. Keyed by POS title, exactly as MODEL_OVERRIDES is. We never write
 * these back to Lightspeed; they live here until the shop fixes the source.
 *
 *  - `priceCents` replaces the lowest SKU price.
 *  - `retired`    takes a discontinued product off the site.
 *  - `title`      corrects the display name. The slug is left alone on
 *                 purpose: images and inbound links are keyed on it.
 *  - `inStock`    the shop says it is on the shelf although the POS count is
 *                 zero or negative (sales rung up without receiving). Lifts the
 *                 count just past the "low" tier so it reads "usually here".
 *
 * Source of each block is noted so a later list can be checked against it.
 */
type ShopEdit = { priceCents?: number; retired?: true; title?: string; inStock?: true };
const SHOP_EDITS: Record<string, ShopEdit> = {
  // --- Owner's handwritten vape list, 2026-10-01 ("kalktı" = discontinued).
  "Spaceman 10K Pro": { retired: true },
  "Spaceman Sp40000 Puff": { retired: true },
  "SWFT Meta Disposable Vape 30000 Puffs": { retired: true },
  "Syntrix Ghost It 40K": { retired: true },
  "Al Fakher Crown Bar 12k": { retired: true },
  "Ebcreate BC PRO 40k": { retired: true },
  "Geek Bar Hookah X DTL 25K": { retired: true },
  "Lost Mary E-Hookah 26.000 Puff": { retired: true },
  "Lost Mary Mo 20000 Puff Pro": { retired: true },
  "Lost Mary Mt 15K": { retired: true },
  "Lost Vape Orion Bar 50.000 Puff": { retired: true },
  "Meloso 30k": { retired: true },
  "MNKE 25k": { retired: true },
  "North 5k": { retired: true },
  "Oxbar 50K": { retired: true },
  "Pyne Pod 20K": { retired: true },

  "Vaporesso Armour Ultra": { priceCents: 11995 },
  "Vaporesso XRos 3": { priceCents: 6920 },
  "Vaporesso Xros 3 Mini": { priceCents: 4997 },
  "Vaporesso Xros 4": { priceCents: 6920 },
  "Vaporesso Xros 4 Mini": { priceCents: 4997 },
  "Vaporesso Xros 5": { priceCents: 6920 },
  "Vaporesso XROS 5 Mini": { priceCents: 4997 },
  "Vaporesso Xros Pro": { priceCents: 6920 },
  "Airis Neo 40K": { priceCents: 3399 },
  "Cookies 30K": { priceCents: 3594 },
  "Fifty Bar 20.000 Puff": { inStock: true }, // "out of stock değil"
  "Fifty Bar %2 Nicotine": { priceCents: 3497 },
  "Geek Bar Pulse 15000 Puffs Disposable": { priceCents: 3691 },
  "Geek Bar Pulse X 25K": { priceCents: 3991 },
  "Geek Vape Aegis Legend 5 Kit": { priceCents: 11995 },
  "Lost Mary MT35000 Turbo": { priceCents: 3991 },
  "MNKE Bars 25k Zero Nic": { priceCents: 3497 },
  "Off Stamp Kit": { priceCents: 3594 },
  "Off Stamp Pod": { priceCents: 2699 },
  "Pillow Talk Ice Control 40000 Puffs": { priceCents: 3594 },
  "Pillow Talk 40.000 Puff Sweet Control": { priceCents: 3594 },
  "Pillow Talk Nicotine Level Control": { priceCents: 3594 },
  // "40k olacak, 66k değil" — it is the 40K device; the POS name is wrong.
  "Pyne Pod Click Bogo 66k": { title: "Pyne Pod Click Bogo 40K", priceCents: 3594 },
};

const editsFired = new Set<string>();
for (const m of models) {
  const e = SHOP_EDITS[m.title];
  if (!e) continue;
  editsFired.add(m.title);
  if (e.priceCents !== undefined) m.priceCents = e.priceCents;
  if (e.inStock && m.stock <= 2) m.stock = 3;
  if (e.title) m.title = e.title;
}

for (const m of models) {
  m.brand = brandOf(m.title);
  const classOk = PUBLISHABLE_CLASSES.has(m.regulatoryClass);
  m.publishable = classOk && m.onlineSkus > 0 && m.priceCents !== null;
}

// After the publish rule, so nothing upstream can put a retired product back.
for (const [title, e] of Object.entries(SHOP_EDITS)) {
  if (!e.retired) continue;
  const m = models.find((x) => x.title === title);
  if (m) m.publishable = false;
}

/* ---------------------------------------------------------------------------
   4. Emit.
   --------------------------------------------------------------------------- */

const outCatalog = resolve("src/lib/commerce/catalog.generated.json");
mkdirSync(dirname(outCatalog), { recursive: true });
writeFileSync(outCatalog, JSON.stringify(models, null, 1));

const byClass = new Map<RegulatoryClass, number>();
for (const m of models) byClass.set(m.regulatoryClass, (byClass.get(m.regulatoryClass) ?? 0) + 1);

/**
 * Only report unbucketed flavours for products where a flavour family means
 * something — the ones that get the swatch grid.
 *
 * Lighters vary by finish ("Antique Brass"), perfumes by note
 * ("Ambery & Saffron"), THCA by strain ("Alien Kush"). Those are real variant
 * values, but they are not flavours, and listing them as unclassified flavours
 * would bury the handful that actually need a human.
 */
const FLAVOR_RELEVANT = new Set<RegulatoryClass>(["ends", "pouch", "hookah"]);
const unmappedFlavors = [
  ...new Set(
    models
      .filter((m) => FLAVOR_RELEVANT.has(m.regulatoryClass))
      .flatMap((m) => m.flavors.filter((f) => !f.family).map((f) => f.value)),
  ),
].sort();
const flavorRelevantTotal = new Set(
  models.filter((m) => FLAVOR_RELEVANT.has(m.regulatoryClass)).flatMap((m) => m.flavors.map((f) => f.value)),
).size;

const reviewCats = [...new Set(models.map((m) => m.category ?? "(none)"))]
  .map((c) => ({ c, note: (c === "(none)" ? undefined : CATEGORY_MAP[c])?.review }))
  .filter((x) => x.note);

const needClassifying = models.filter((m) => m.regulatoryClass === "unknown");
const restricted = models.filter((m) => m.regulatoryClass === "restricted");
const publishable = models.filter((m) => m.publishable);

const md = `# Lightspeed import — review required

Generated by \`scripts/import-lightspeed.ts\`. Re-run after any fix; it is deterministic.

## Result

| | |
|---|---|
| SKU rows read | ${rows.length} |
| Product models | ${models.length} |
| **Publishable today** | **${publishable.length}** |
| Blocked as \`unknown\` | ${needClassifying.length} |
| Firewalled as \`restricted\` | ${restricted.length} |
| Models with a photograph | ${models.filter((m) => m.imageUrl).length} |

### By regulatory class
${[...byClass.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `- \`${k}\` — ${v}`).join("\n")}

## 1. Categories that cannot ship as-is

${reviewCats.map((x) => `### ${x.c}\n${x.note}`).join("\n\n")}

## 2. Models with no category (${models.filter((m) => !m.category).length})

These have no \`product_category\` in Lightspeed, so they cannot be classified
and will not publish. Fixing them in Lightspeed and re-running is the cheapest
path — the field already exists, it is just empty.

${models.filter((m) => !m.category).slice(0, 40).map((m) => `- ${m.title}`).join("\n")}
${models.filter((m) => !m.category).length > 40 ? `\n…and ${models.filter((m) => !m.category).length - 40} more.` : ""}

## 3. Flavours the classifier could not bucket (${unmappedFlavors.length} of ${flavorRelevantTotal})

Scoped to vape, pouch and hookah — the products where a flavour family drives a
swatch. Lighter finishes, perfume notes and THCA strain names also live in the
"Flavor" variant slot but are excluded here, because they are not flavours.

These render with a neutral swatch and cannot be filtered to.

${unmappedFlavors.slice(0, 60).map((f) => `- ${f}`).join("\n")}
${unmappedFlavors.length > 60 ? `\n…and ${unmappedFlavors.length - 60} more.` : ""}

## 4. Inferred from name (${inferred.size})

These had no \`product_category\` in Lightspeed and were classified from their
names by \`inferFromName\`. Conservative patterns only — anything that did not
match a high-confidence rule was left unclassified.

${models.filter((m) => inferred.has(m.title) && m.onlineSkus > 0)
  .sort((a, b) => a.regulatoryClass.localeCompare(b.regulatoryClass) || a.title.localeCompare(b.title))
  .map((m) => `- \`${m.regulatoryClass}\` — ${m.title}`)
  .join("\n") || "- none are flagged for online sale"}

Still unclassified with no category, and flagged online:
${models.filter((m) => !m.category && m.regulatoryClass === "unknown" && m.onlineSkus > 0)
  .map((m) => `- **${m.title}**`).join("\n") || "- none"}

## 4a. Cannabinoid firewall (${firewalled.size})

THC, CBD or hemp wraps in the name, reclassified regardless of category or
override so it cannot publish. Owner decision, 2026-09-29.

${models.filter((m) => firewalled.has(m.title))
  .sort((a, b) => a.title.localeCompare(b.title))
  .map((m) => `- \`${m.regulatoryClass}\` — ${m.title}${m.category ? ` (was in "${m.category}")` : ""}`)
  .join("\n") || "- none"}

## 5. Per-model overrides

${overridesFired.size} of ${Object.keys(MODEL_OVERRIDES).length} overrides matched a product in this export.
${Object.keys(MODEL_OVERRIDES).filter((k) => !overridesFired.has(k)).length === 0
  ? "All overrides are live — none are stale."
  : "**Stale overrides (no matching product — the name may have changed):**\n" +
    Object.keys(MODEL_OVERRIDES).filter((k) => !overridesFired.has(k)).map((k) => `- ${k}`).join("\n")}

Models still unclassified inside a mixed category:
${models.filter((m) => m.category && MIXED_CATEGORIES.has(m.category) && m.regulatoryClass === "unknown").map((m) => `- **${m.title}** (${m.category})`).join("\n") || "- none"}

## 5a. Shop edits

${editsFired.size} of ${Object.keys(SHOP_EDITS).length} shop edits matched a product.
${Object.keys(SHOP_EDITS).filter((k) => !editsFired.has(k)).length === 0
  ? "None are stale."
  : "**Stale edits (no matching product — renamed in the POS, or fixed there?):**\n" +
    Object.keys(SHOP_EDITS).filter((k) => !editsFired.has(k)).map((k) => `- ${k}`).join("\n")}

Retired: ${Object.entries(SHOP_EDITS).filter(([, e]) => e.retired).map(([k]) => k).join(", ") || "none"}.

## 6. Restricted inventory withheld (${restricted.length})

Firewalled pending counsel. Not published, not linked, not in the sitemap.

${[...new Set(restricted.map((m) => m.category))].map((c) => `- ${c}: ${restricted.filter((m) => m.category === c).length} models`).join("\n")}
`;

const outReview = resolve("../research/import-review.md");
writeFileSync(outReview, md);

console.log(`rows            ${rows.length}`);
console.log(`models          ${models.length}`);
console.log(`publishable     ${publishable.length}`);
console.log(`unknown         ${needClassifying.length}`);
console.log(`inferred        ${inferred.size}`);
console.log(`firewalled      ${firewalled.size}`);
console.log(`shop edits      ${editsFired.size} of ${Object.keys(SHOP_EDITS).length} matched`);
console.log(`restricted      ${restricted.length}`);
console.log(`unmapped flavs  ${unmappedFlavors.length} of ${flavorRelevantTotal} (vape/pouch/hookah only)`);
console.log(`\n→ ${outCatalog}`);
console.log(`→ ${outReview}`);
