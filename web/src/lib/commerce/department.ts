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
  /cigarillo|\bleaf\b|\bwraps?\b|swisher|\bdutch\b|white owl|black\s*&\s*mild|backwoods|al capone|good times|grabba|graba|grab a|hot skull|talon/i;

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
  /* Cigarillos, leaf and wraps get their own shelf (Kemal, 2026-11-18): the
     Cigars shelf had Swishers and Dutches between the Montecristos, and
     Accessories had Backwoods and Grabba between the cones. Papers and cones
     stay in Accessories. Tested before the category rules below, because the
     POS files these under both "Cigarillos" and "Leaf". */
  if (
    (m.regulatoryClass === "cigar" || m.regulatoryClass === "rollYourOwn") &&
    !/paper|cones?\b|cons\b/i.test(m.title) &&
    (CIGARILLO_TITLE.test(m.title) || /cigarillo|^leaf$/i.test(c))
  )
    return "cigarillos";
  // Papers and cones, wherever the POS filed them ("Rolling Papers,
  // Cigarillos, Leaf & Wraps" would otherwise send them to Cigars).
  if (m.regulatoryClass === "accessory" && /paper|cones?\b|cons\b/i.test(m.title))
    return "accessories";
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
