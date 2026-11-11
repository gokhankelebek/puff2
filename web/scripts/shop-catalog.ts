/**
 * The shop's own catalogue decisions — everything we decide rather than read
 * from the POS. Shared by both ways of building the catalogue:
 *
 *   scripts/import-lightspeed.ts   from a fresh Lightspeed export (the CSV)
 *   scripts/apply-shop-catalog.ts  from the committed catalogue, no CSV
 *
 * The shop is leaving Lightspeed. Decisions made here survive that; anything
 * written into the POS would not.
 */
import type { FlavorFamily, RegulatoryClass } from "../src/lib/commerce/types";
import { classifyVariant } from "./flavors";
import { SHOP_FLAVORS } from "./shop-flavors";

/** The fields these rules read and write. The importer's Model is a superset. */
export type ShopModel = {
  title: string;
  category: string | null;
  regulatoryClass: RegulatoryClass;
  publishable: boolean;
  brand?: string;
  onlineSkus: number;
  stock: number;
  priceCents: number | null;
  flavors: { value: string; family: FlavorFamily | null }[];
  nonFlavorVariants: { hardware: number; packSize: number; other: number };
};

/**
 * Classes the shop assigns to products the POS left uncategorised. Applied
 * BEFORE the firewall, so nothing here can carry a cannabinoid product past it.
 */
export const SHOP_CLASS: Record<string, RegulatoryClass> = {
  // --- Kemal's product list, 2026-11-10. Each identified by its line there.
  "Geek Bar Clio Platinum Kit": "ends", // "CLIO PLATINUM KIT"
  "Rodman Playoffs": "ends", // "RODMAN", disposable vape page
  "Rogue 12Mg Nicotine Pouches": "pouch", // "Rogue 12Mg MAX"
  "Rogue 15Mg Nicotine Pouches": "pouch", // "Rogue 15MG MAX"
  "On Plus Nicotine Pouches": "pouch", // "ON! PLUS"
  "Zig-Zag Cones": "accessory", // "ZigZag Cigar Cones"
  "OCB BAMBOO CONES": "accessory", // "OCB Cones … bamboo"
};

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
export function applyFirewall(models: ShopModel[]): Set<string> {
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
  return firewalled;
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
export const BRANDS: [pattern: string, display: string][] = [
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
  ["On Nicotine Pouches", "On!"], ["On Plus Nicotine Pouches", "On!"],
  ["R&J", "Romeo y Julieta"],
  // Added with Kemal's list, 2026-11-10.
  ["Kool", "Kool"], ["Parliament", "Parliament"], ["Dunhill", "Dunhill"],
  ["Talon", "Talon"], ["Vuse", "Vuse"], ["Horizon Tech", "Horizon Tech"],
  ["Rodman", "Rodman"], ["Zaza", "Zaza"], ["Loud Leaf", "Loud Leaf"],
  ["Swisher", "Swisher Sweets"], ["Zigzag", "Zig-Zag"], ["OCB", "OCB"],
  ["Elements", "Elements"], ["Blazy Susan", "Blazy Susan"],
  ["Bob Marley", "Bob Marley"],
]
  // Longest pattern wins, so "Geek Vape" is never shadowed by a shorter entry.
  .sort((a, b) => b[0].length - a[0].length) as [string, string][];

export function brandOf(rawTitle: string): string | undefined {
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
export const PUBLISHABLE_CLASSES = new Set<RegulatoryClass>([
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
 *  - `publish`    the shop wants it online although no SKU carries the POS
 *                 "sell online" flag. Stands in for that flag ONLY — the class
 *                 must still be publishable and the price set, so this cannot
 *                 put an `unknown`, `smokeless` or `hemp` model on the site.
 *
 * Source of each block is noted so a later list can be checked against it.
 */
export type ShopEdit = {
  priceCents?: number;
  retired?: true;
  title?: string;
  inStock?: true;
  publish?: true;
};
export const SHOP_EDITS: Record<string, ShopEdit> = {
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
  // Airis Neo 40K ($33.99) and Fifty Bar 20.000 Puff ("out of stock değil")
  // were here; both are re-stated in Kemal's list below with new prices.
  "Cookies 30K": { priceCents: 3594 },
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

  // --- Owner's handwritten tobacco list, 2026-10-02. The odd cents are
  //     pre-tax prices that land on a round total at Las Vegas's 8.375%
  //     ($23.07 → $25.00, $4.61 → $5.00, $18.45 → $19.99). Do not "tidy" them.
  "Game": { retired: true }, // "kalktı 2.99" — every Game SKU was $2.99
  "Graba Leaf Crushed": { priceCents: 392 }, // "Grabba leaf small"
  "Hot Skull": { priceCents: 461 },
  "Hot Skull Spliffarillos Cones": { priceCents: 461 },
  "Macanudo Cafe Montego Y OIA": { title: "Macanudo Cafe Montego Y Cia 8 Pack", priceCents: 3998 },
  "Raw Cones": { priceCents: 692 },
  "Bali Shag": { priceCents: 2307 },
  "Drum": { priceCents: 2307 },
  "Super Value Pipe Tobacco": { priceCents: 2307 },
  "American Spirit": { priceCents: 1845 }, // the cigarettes, $16.61 before

  // --- Kemal's product list (PDF, 2026-11-10). Pre-tax prices again; same
  //     rule, do not round them.
  //
  //     Repriced, already on the site:
  "Foger Kit + Pod 30.000 Puff": { priceCents: 3691 },
  "Foger Bit 35K": { priceCents: 3991 },
  "Lost Mary 70K Nera Kits": { priceCents: 4498 },
  "Float X 10K": { priceCents: 3594 },
  "Raz RL Classic 35k": { priceCents: 3991 },
  "Hyppe Infiniti 50k": { priceCents: 3594 },
  "Fifty Bar 20.000 Puff": { priceCents: 3400, inStock: true },
  "Flum UT Bar 50K": { priceCents: 3691 },
  "Airis Neo 40K": { priceCents: 3400 },
  "Fasta Drop 50K Nicotine Vape": { priceCents: 3594 },
  "Adjust MyFlavor 40k": { priceCents: 3594 },
  "Pixi 50K": { priceCents: 3594 },
  "Geek Bar Mate Kit 60K": { priceCents: 4498 },
  "Geek Bar CLR 50K Disposable": { priceCents: 4498 },
  "Geek Bar Burj 80K Hookah Vape": { priceCents: 5699 },
  "Al Fakher Crown 60K": { priceCents: 4498 },
  "Olit Pro 60k Hookahlit": { priceCents: 4498 },
  "Swisher Sweets": { priceCents: 300 },
  "BLK Swisher Sweets": { priceCents: 300 },
  "White Owl": { priceCents: 300 },
  "Dutch": { priceCents: 300 },
  "Zig-Zag Cigarillos": { priceCents: 300 },
  "Black  & Mild Single": { priceCents: 300 },
  "Al Capone Leaf": { priceCents: 300 },
  "Zig-Zag Wraps": { priceCents: 300 },
  "Black & Mild 5 Pack": { priceCents: 997 },
  "Backwoods 5pk": { priceCents: 997 }, // "Backwoods Leaf Wraps"
  "Grabba Leaf": { priceCents: 997 },
  "Grabba Leaf Green": { priceCents: 997 },
  "Loose Leaf": { priceCents: 1292 },

  //     New to the site — in the POS, never flagged for online sale:
  "Lost Mary 70K Nera Pod": { publish: true, priceCents: 2999 },
  "Lost Mary VIZ 55K Nicotine Vape": { publish: true, priceCents: 4198 },
  "Geek Bar Pulse 2 15K": { publish: true, priceCents: 3991 },
  "Geek Bar Clio Platinum Kit": { publish: true, priceCents: 4498 },
  "Geek Bar Clio Pod": { publish: true, priceCents: 2999 },
  "Horizon Tech 100K Disposable Vape": { publish: true, priceCents: 4998 },
  "Raz Rx 50K Dew Edition": { publish: true, priceCents: 3991 },
  "Flum 3000 Puffs": { publish: true, priceCents: 2499 },
  "Rodman Playoffs": { publish: true, priceCents: 3594 },
  "Velo 3mg": { publish: true },
  "Velo 6mg": { publish: true },
  "Fre 6mg Nicotine Pouches": { publish: true },
  "Rogue 12Mg Nicotine Pouches": { publish: true },
  "Rogue 15Mg Nicotine Pouches": { publish: true },
  "On Plus Nicotine Pouches": { publish: true },
  "Kool": { publish: true, priceCents: 1569 },
  "Parliament": { publish: true, priceCents: 1569 },
  "Dunhill": { publish: true, priceCents: 1845 },
  "Talon": { publish: true, priceCents: 1845 },
  "Zaza Large Leaf Cigar Wraps": { publish: true, priceCents: 997 },
  "Zaza Small Leaf Cigar Wraps": { publish: true, priceCents: 392 },
  "Loud Leaf 2 Pack": { publish: true, priceCents: 300 },
  "Swisher Sweets Leaf": { publish: true, priceCents: 600 },
  "Swisher Sweets Leaf Wraps": { publish: true, priceCents: 997 },
  "Swisher 5 Pack": { publish: true, priceCents: 997 },
  "Zigzag Leaf": { publish: true, priceCents: 300 },
  "Zig-Zag Cones": { publish: true, priceCents: 300 }, // cigar cones
  "ZigZag Cones": { publish: true, priceCents: 692 },
  "OCB BAMBOO CONES": { publish: true, priceCents: 692 },
  "OCB UNBLEACHED CONES 6pck": { publish: true, priceCents: 692 },
  // Two POS models for one cone ("Elements Cone" / "Elements Cons"); the
  // larger stock is published so the site does not show it twice.
  "Elements Cone": { publish: true, priceCents: 692 },
  "Blazy Susan Cons": { publish: true, priceCents: 692 },
  "Bob Marley Cons": { publish: true, priceCents: 692 },
  "Backwoods True Wraps": { publish: true, priceCents: 997, inStock: true },
};

/* "Pouches Ultra ve Alp hariç hepsi 10.99" — every nicotine pouch is $10.99
   except Zyn Ultra and Alp. A class-wide rule rather than a list, so a pouch
   the shop adds later gets the house price too. A per-title SHOP_EDITS price
   still wins over it. */
const POUCH_PRICE_CENTS = 1099;
const POUCH_PRICE_EXCEPT = /\bultra\b|\balp\b/i;

/**
 * Apply the shop's own decisions on top of whatever the catalogue came from:
 * shop classes, the cannabinoid firewall (last word on class), the house
 * pouch price, SHOP_EDITS, brands, the publish rule and retirements.
 *
 * Idempotent — every step sets an absolute value — so it is safe to run on a
 * catalogue it has already been applied to. That is what lets
 * apply-shop-catalog.ts work from the committed snapshot without a POS export.
 */
export function applyShop(models: ShopModel[]) {
  for (const m of models) {
    const cls = SHOP_CLASS[m.title];
    if (cls) m.regulatoryClass = cls;
  }
  const firewalled = applyFirewall(models);

  // The shop's own flavour lists replace the POS ones outright. Each value is
  // classified the same way the importer classifies a POS variant, so a
  // cigarette style like `Gold 100"` lands in nonFlavorVariants, not the
  // flavour filter. Keyed by POS title, so this runs before title edits.
  const flavorsSet = new Set<string>();
  for (const m of models) {
    const list = SHOP_FLAVORS[m.title];
    if (!list) continue;
    flavorsSet.add(m.title);
    const flavors: ShopModel["flavors"] = [];
    const nf = { hardware: 0, packSize: 0, other: 0 };
    for (const value of list) {
      const c = classifyVariant(value);
      if (c.kind === "flavor") flavors.push({ value, family: c.family });
      else if (c.kind !== "strength") nf[c.kind]++;
    }
    m.flavors = flavors;
    m.nonFlavorVariants = nf;
  }

  for (const m of models) {
    if (m.regulatoryClass === "pouch" && !POUCH_PRICE_EXCEPT.test(m.title)) {
      m.priceCents = POUCH_PRICE_CENTS;
    }
  }

  const editsFired = new Set<string>();
  const shopPublished = new Set<ShopModel>();
  for (const m of models) {
    const e = SHOP_EDITS[m.title];
    if (!e) continue;
    editsFired.add(m.title);
    if (e.priceCents !== undefined) m.priceCents = e.priceCents;
    if (e.inStock && m.stock <= 2) m.stock = 3;
    if (e.publish) shopPublished.add(m);
    if (e.title) m.title = e.title;
  }

  for (const m of models) {
    m.brand = brandOf(m.title);
    const classOk = PUBLISHABLE_CLASSES.has(m.regulatoryClass);
    const online = m.onlineSkus > 0 || shopPublished.has(m);
    m.publishable = classOk && online && m.priceCents !== null;
  }

  // A `publish` edit that did not publish means the class failed closed — say so
  // rather than let the shop's request vanish silently.
  const publishBlocked = [...shopPublished].filter((m) => !m.publishable);
  if (publishBlocked.length) {
    console.warn(
      "shop asked to publish, held back:\n" +
        publishBlocked.map((m) => `  ${m.title} (${m.regulatoryClass})`).join("\n"),
    );
  }

  // After the publish rule, so nothing upstream can put a retired product back.
  for (const [title, e] of Object.entries(SHOP_EDITS)) {
    if (!e.retired) continue;
    const m = models.find((x) => x.title === title);
    if (m) m.publishable = false;
  }
  return { editsFired, firewalled, publishBlocked, flavorsSet };
}
