import s from "./ProductTiles.module.css";
import { formatMoney, stockLabel, type Product } from "@/lib/commerce";

/**
 * The product card, and there is only one of it.
 *
 * The previous design ran four different tile grammars, one per department,
 * on the argument that a cigar buyer and a vape buyer do not scan the same
 * way. Marquee Neon makes the opposite call and it is the simpler one: a
 * single 2-up card everywhere, with STOCK as the thing that varies. What
 * makes a department feel like itself is its filter set, not a bespoke card.
 *
 * Every card states one of three stock states, because stock is the product
 * here: in (green), low (magenta, "2 left"), out (dim, with a restock note
 * when there is one). An out-of-stock card never offers the add control —
 * a disabled-looking button that does nothing is worse than no button.
 */

function groundFor(index: number): string {
  return String((index % 4) + 1);
}

function stockTone(p: Product): "in" | "low" | "out" {
  if (p.stock.tier === "out") return "out";
  if (p.stock.tier === "low") return "low";
  return "in";
}

/**
 * The line under the price. Flavour breadth is the vape shopper's real
 * question ("does it come in the blue one"), so a multi-flavour model leads
 * with the count in cyan rather than repeating its stock tier.
 */
/**
 * Colour here is a SIGNAL, so it is spent only on exceptions.
 *
 * It used to paint the flavour count cyan, which put the reserved label colour
 * on 59 of 74 vape cards — the state that appears on four cards in five was
 * the loudest thing in the column, so nothing signalled. Now: the default is
 * quiet, magenta means "nearly gone", dim means "not here", and green is
 * reserved for stock someone actually counted.
 */
function stockNote(p: Product): { text: string; tone: "in" | "low" | "out" | "range" } {
  const flavors = p.flavors?.length ?? 0;
  if (p.stock.tier !== "out" && flavors > 1) {
    /* A flavour count is a fact about the model, not a stock state. */
    return { text: `${flavors} flavors in`, tone: "range" };
  }
  if (p.stock.tier === "low" && typeof p.stock.remaining === "number") {
    return {
      text: p.stock.remaining === 1 ? "One left" : `${p.stock.remaining} left`,
      tone: "low",
    };
  }
  if (p.stock.tier === "out") {
    return { text: p.stock.restockNote ?? "Out of stock", tone: "out" };
  }
  return { text: stockLabel(p.stock), tone: stockTone(p) };
}

export function ProductTiles({ items }: { items: Product[] }) {
  return (
    <ul className={s.grid}>
      {items.map((p, i) => {
        const note = stockNote(p);
        const out = p.stock.tier === "out";
        return (
          <li key={p.slug} className={s.cell}>
            <article className={s.card} data-ground={groundFor(i)} data-out={out || undefined}>
              <a className={s.hit} href={`/p/${p.slug}`}>
                <span className={s.shot}>
                  {p.images[0] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className={s.img}
                      src={p.images[0].src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className={s.shotNote}>Photo</span>
                  )}
                </span>
                {p.brand ? <span className={s.brand}>{p.brand}</span> : null}
                <span className={s.name}>{p.title}</span>
                <span className={s.price}>{formatMoney(p.price)}</span>
                <span className={s.stock} data-tone={note.tone}>
                  {note.text}
                </span>
              </a>

              {/* Out-of-stock is never quick-addable.

                  A form POST rather than a link: adding to the draft changes
                  state, and a GET that mutates gets fetched by every crawler
                  and link-prefetcher that touches the page. */}
              {out ? null : (
                <form className={s.addForm} action="/api/draft" method="POST">
                  <input type="hidden" name="action" value="add" />
                  <input type="hidden" name="slug" value={p.slug} />
                  <input type="hidden" name="next" value="/delivery/order" />
                  <button className={s.add} type="submit">
                    Add to delivery
                  </button>
                </form>
              )}
            </article>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The empty shelf.
 *
 * `filtered` matters: offering "clear filters" when no filter is set sends
 * the customer to the page they are already on and implies they did something
 * wrong. An empty department is a different fact from an over-filtered one,
 * and it says so.
 */
export function EmptyResults({
  clearHref,
  filtered = false,
}: {
  clearHref: string;
  filtered?: boolean;
}) {
  return (
    <div className={s.empty}>
      <p className={s.emptyTitle}>Nothing on this shelf</p>
      <p className={s.emptyBody}>
        {filtered
          ? "Nothing matches that combination right now. We order twice a week and the floor turns over fast — widen the filters, or text the shop and we'll tell you what came in."
          : "Nothing here is listed yet. We order twice a week — text the shop and we'll tell you what's actually in the case."}
      </p>
      {filtered ? (
        <a className={s.emptyLink} href={clearHref}>
          Clear filters →
        </a>
      ) : null}
    </div>
  );
}
