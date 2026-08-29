import NicotineWarning from "./NicotineWarning";
import s from "./NicotineWarning.module.css";
import type { Product, RegulatoryClass } from "@/lib/commerce";

/**
 * The warning for a page that advertises a *set* of products rather than one.
 *
 * 21 CFR 1143.3(a) attaches to the advertisement, and a browse grid showing
 * covered products with prices is advertising. Until now only the product
 * detail page carried a warning, which left every category page — 73 priced
 * ENDS listings on /vape alone — carrying none. Putting merchandise on the
 * homepage would have extended that gap to the front door.
 *
 * 🔴 What it cannot settle is the 20% area test in 1143.3(b)(2). On a single
 * listing "the advertisement" is obvious; on a wall of ninety products it is
 * not, and reading it as 20% of the whole page would put a white slab over a
 * fifth of the site. This renders one correctly-worded plate at the top of the
 * grid, which is strictly better than the nothing that was there before, and
 * the area question is one for counsel.
 *
 * Cigarettes are a different statute (FCLAA, FTC-enforced) and cigars were
 * vacated, so a mixed page can need two plates or none. Order is deliberate:
 * the nicotine statement first, because vape is what most of these pages sell.
 */
const ORDER: RegulatoryClass[] = ["ends", "cigarette"];

export default function PageNicotineWarning({
  products,
}: {
  products: Pick<Product, "regulatoryClass">[];
}) {
  const present = new Set(products.map((p) => p.regulatoryClass));

  /* hookah tobacco and oral pouches take the same statement as ENDS, so they
     collapse onto one plate rather than repeating it. */
  const needsNicotine = ["ends", "hookah", "pouch", "rollYourOwn"].some((c) =>
    present.has(c as RegulatoryClass),
  );

  const shown: RegulatoryClass[] = [];
  if (needsNicotine) shown.push("ends");
  if (present.has("cigarette")) shown.push("cigarette");

  if (!shown.length) return null;

  return (
    <div className={s.mat}>
      {ORDER.filter((c) => shown.includes(c)).map((c) => (
        <NicotineWarning key={c} regulatoryClass={c} />
      ))}
    </div>
  );
}
