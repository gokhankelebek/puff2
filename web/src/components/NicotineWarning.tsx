import s from "./NicotineWarning.module.css";
import type { RegulatoryClass } from "@/lib/commerce";

/**
 * The exact statutory text. 21 CFR 1143.3(a)(1) requires it "capitalized and
 * punctuated exactly as" written — so this string is not editorial copy and
 * must not be reworded, shortened, or sentence-cased.
 */
const NICOTINE_WARNING =
  "WARNING: This product contains nicotine. Nicotine is an addictive chemical.";

/**
 * Cigarettes are governed by the Federal Cigarette Labeling and Advertising
 * Act and enforced by the FTC, not by the FDA nicotine statement. One of the
 * four rotating Surgeon General's warnings is used here.
 *
 * 🔴 Which warning rotates when, and whether a retailer's own website
 * advertising triggers the rotation plan at all, is a question for counsel —
 * this renders a placeholder that is visibly correct in form.
 */
const SURGEON_GENERAL =
  "SURGEON GENERAL'S WARNING: Smoking Causes Lung Cancer, Heart Disease, Emphysema, And May Complicate Pregnancy.";

export default function NicotineWarning({
  regulatoryClass,
}: {
  regulatoryClass: RegulatoryClass;
}) {
  // Cigars and pipe tobacco: the requirement was VACATED in
  // Cigar Ass'n of Am. v. FDA. Rendering it anyway would be wrong, and would
  // put a stark white plate on the one page that most needs to feel like a
  // humidor. Accessories carry no nicotine.
  if (regulatoryClass === "cigar" || regulatoryClass === "accessory") {
    return null;
  }

  if (regulatoryClass === "cigarette") {
    return (
      <aside className={s.plate} role="note" aria-label="Health warning">
        <p className={`${s.text} ${s.surgeon}`}>{SURGEON_GENERAL}</p>
      </aside>
    );
  }

  // ENDS, hookah tobacco and oral nicotine pouches.
  return (
    <aside className={s.plate} role="note" aria-label="Health warning">
      <p className={s.text}>{NICOTINE_WARNING}</p>
    </aside>
  );
}
