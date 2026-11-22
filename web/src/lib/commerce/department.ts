import type { Department, RegulatoryClass } from "./types";

/* Pure and dependency-free so scripts/build-search-index.ts can import it.
   The search index used to keep a hand-mirrored copy of these rules, and the
   copy drifted (it still filed pouches under accessories). One function now. */
export type DepartmentInput = {
  title: string;
  category: string | null;
  regulatoryClass: RegulatoryClass;
};

/**
 * Department is a BROWSE decision, not a legal one, so it keys off the source
 * category first and falls back to regulatory class. The two are related but
 * not the same: a hookah bowl and shisha tobacco belong on the same shelf and
 * in different regulatory buckets.
 */
const CIGARILLO_TITLE =
  /cigarillo|\bleaf\b|\bwraps?\b|swisher|\bdutch\b|white owl|black\s*&\s*mild|backwoods|al capone|good times|grabba|graba|grab a|hot skull/i;

export function departmentFor(m: DepartmentInput): Department {
  const c = m.category ?? "";
  /* Pouch first, and out of the accessories catch-all it used to share. Oral
     nicotine (ZYN, Velo, Alp, Lucy) is the #4-selling category by volume and
     was landing in "accessories" next to lighters with no browse path of its
     own. Keyed on the class as well as the category text, because some pouch
     SKUs import with a blank Lightspeed category. "Tobacco-Pouches" (dip:
     Copenhagen, Skoal) is deliberately NOT caught here — that is smokeless and
     stays unpublished until its own warning text exists. */
  if (m.regulatoryClass === "pouch" || /nicotine pouch/i.test(c)) return "pouch";
  /* Kemal, 2026-11-19: Talon is shelved with the cigarettes. Department only;
     its regulatory class (and so its delivery rules) is unchanged. */
  if (/^talon$/i.test(m.title.trim())) return "cigarettes";
  /* Hookahs and bowls on the Hookah shelf even when the POS filed them as
     accessories (Kemal, 2026-11-19). Charcoal stays in Accessories. */
  if (
    m.regulatoryClass === "accessory" &&
    /\bhookah\b/i.test(m.title) &&
    !/charcoal|coal|burner/i.test(m.title)
  )
    return "hookah";
  /* Cigarillos & Wraps (Kemal, 2026-11-18, widened 2026-11-19): cigarillos,
     leaf and wraps, and also papers, cones and rolling tobacco. Accessories
     keeps only what is left: charcoal, butane and the like. Tested before the
     category rules below, because the POS files these under "Cigarillos",
     "Leaf", "Rolling Papers…" and "Rolling Tobacco" alike. */
  // Nectar collectors are glass, whatever the POS filed them under
  // (Kemal, 2026-11-20: "pipe yada bong lara ekleyelim").
  if (m.regulatoryClass === "accessory" && /nectar collector/i.test(m.title)) return "glass";
  if (m.regulatoryClass === "rollYourOwn") return "cigarillos";
  if (m.regulatoryClass === "accessory" && /paper|cones?\b|cons\b/i.test(m.title))
    return "cigarillos";
  if (
    m.regulatoryClass === "cigar" &&
    (CIGARILLO_TITLE.test(m.title) || /cigarillo|^leaf$/i.test(c))
  )
    return "cigarillos";
  if (/glass|bong|pipe/i.test(c)) return "glass";
  if (/hookah|shisha/i.test(c)) return "hookah";
  if (/^cigar$|cigarillo/i.test(c)) return "cigars";
  if (/cigarette/i.test(c)) return "cigarettes";
  if (/vape|juul|vuse|njoy|juice/i.test(c)) return "vape";
  if (/lighter|torch|papper|paper|leaf|rolling|smoke part|part of wd/i.test(c))
    return "accessories";

  switch (m.regulatoryClass) {
    case "ends":
      return "vape";
    case "cigar":
      return "cigars";
    case "cigarette":
      return "cigarettes";
    case "hookah":
      return "hookah";
    /* The one class whose department is decided by the class rather than the
       category, because Lightspeed has no hemp category to read: these arrive
       classified by name inference and there is nothing else to go on. */
    case "hemp":
      return "hemp";
    default:
      return "accessories";
  }
}
