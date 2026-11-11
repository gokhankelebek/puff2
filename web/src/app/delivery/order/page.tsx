import type { Metadata } from "next";
import { cookies } from "next/headers";
import o from "./Order.module.css";
import Bulbs from "@/components/Bulbs";
import { Wordmark, PHONE_DISPLAY, PHONE_HREF } from "@/components/Chrome";
import { commerce, formatMoney } from "@/lib/commerce";
import {
  DRAFT_COOKIE,
  MEET_LABEL,
  parseDraft,
  priceDraft,
  draftToSms,
  type MeetPoint,
  type OrderMode,
  type PricedLine,
} from "@/lib/draft";
import {
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_TERMS_LABEL,
  HOTELS,
  hotelBySlug,
} from "@/lib/hotels";
import { SHOP_STREET } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Your order | Puff Vegas",
  robots: { index: false, follow: false },
};

const MEETS: MeetPoint[] = ["valet", "rideshare"];
const MODES: { id: OrderMode; label: string }[] = [
  { id: "delivery", label: "Hotel delivery" },
  { id: "pickup", label: "Pick up" },
];

/**
 * The order list. Customers add items from product pages, then text the whole
 * list to the shop in one message.
 *
 * No card entry and no payment fields anywhere: money changes hands at the
 * handover or the counter. Every control is a form POST against /api/draft,
 * so the steppers, the mode switch and the meet point all work with
 * scripting off.
 *
 * There is no room number and no tower. The shop does not deliver to hotel
 * rooms — the guest comes down to their property's valet stand or rideshare
 * zone — so asking for a room would be collecting data we have no use for and
 * implying a service we do not run.
 *
 * Sending hands off to SMS rather than creating an order record, because
 * there is no order store behind this site. That is stated on the button and
 * again underneath, rather than implied away — see docs/OPEN-DECISIONS.md.
 */
export default async function OrderSheet() {
  const jar = await cookies();
  const draft = parseDraft(jar.get(DRAFT_COOKIE)?.value);
  const catalog = await commerce.getProducts();
  const totals = priceDraft(draft, catalog);
  const pickup = totals.mode === "pickup";

  const hotel = draft.hotel ? hotelBySlug(draft.hotel) : undefined;
  const ready = totals.lines.length > 0 && (pickup || Boolean(hotel));
  const sms = `${PHONE_HREF.replace("tel:", "sms:")}?&body=${encodeURIComponent(
    draftToSms(totals, draft, hotel?.name),
  )}`;

  return (
    <main className={o.sheet}>
      <header className={o.head}>
        <a className={o.back} href="/floor" aria-label="Back to the floor">
          ←
        </a>
        <span className={o.headTitle}>Your order</span>
        <a className={o.close} href="/" aria-label="Close">
          ✕
        </a>
      </header>

      <Bulbs />

      {/* --- How ------------------------------------------------------------ */}
      <form className={o.modeRow} action="/api/draft" method="POST">
        <input type="hidden" name="action" value="mode" />
        <input type="hidden" name="next" value="/delivery/order" />
        {MODES.map((m) => (
          <button
            key={m.id}
            className={o.modeBtn}
            type="submit"
            name="mode"
            value={m.id}
            aria-pressed={totals.mode === m.id}
          >
            {m.label}
          </button>
        ))}
      </form>

      {totals.lines.length > 0 ? (
        <section className={o.eta} data-island="lit">
          <p className={o.etaTime}>
            {pickup
              ? `Ready at ${SHOP_STREET}`
              : `25–40 min${hotel ? ` to ${hotel.name}` : ""}`}
          </p>
          <p className={o.etaTerms}>
            {pickup
              ? "Open 24 hours · cash or card at the counter"
              : `${DELIVERY_TERMS_LABEL} · cash or card when we hand it over`}
          </p>
        </section>
      ) : null}

      {/* --- 1. Where (delivery only) --------------------------------------- */}
      {!pickup && (
        <form className={o.step} action="/api/draft" method="POST">
          <input type="hidden" name="action" value="where" />
          <input type="hidden" name="next" value="/delivery/order" />

          <h2 className={o.stepTitle}>
            <span className={o.stepNum} data-done={hotel ? "true" : undefined}>
              1
            </span>
            Where do we meet you?
          </h2>

          <label className={o.field}>
            <span className={o.fieldLabel}>Hotel</span>
            <select className={o.select} name="hotel" defaultValue={draft.hotel ?? ""}>
              <option value="">Choose your hotel</option>
              {HOTELS.map((x) => (
                <option key={x.slug} value={x.slug}>
                  {x.name}
                </option>
              ))}
            </select>
          </label>

          <fieldset className={o.meets}>
            <legend className={o.fieldLabel}>Meet point</legend>
            <div className={o.meetRow}>
              {MEETS.map((m) => (
                <label key={m} className={o.meet}>
                  <input
                    className={o.meetInput}
                    type="radio"
                    name="meet"
                    value={m}
                    /* Valet is the default because every property on the list
                       has one; rideshare zones are not universal. */
                    defaultChecked={(draft.meet ?? "valet") === m}
                  />
                  <span className={o.meetFace}>{MEET_LABEL[m]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className={o.meetNote}>
            We don&rsquo;t come up to rooms — resorts don&rsquo;t allow it. Come
            down and we&rsquo;ll be at whichever of these your hotel uses.
          </p>

          <button className={o.save} type="submit">
            Save where
          </button>
        </form>
      )}

      <Bulbs />

      {/* --- 2. Items ------------------------------------------------------ */}
      <section className={o.step}>
        <h2 className={o.stepTitle}>
          <span
            className={o.stepNum}
            data-done={totals.lines.length > 0 ? "true" : undefined}
          >
            {pickup ? 1 : 2}
          </span>
          Your items
        </h2>

        {totals.lines.length === 0 && totals.pickupOnly.length === 0 ? (
          <p className={o.empty}>
            Nothing in your order yet.{" "}
            <a className={o.emptyLink} href="/floor">
              Pick something off the floor →
            </a>
          </p>
        ) : (
          <ul className={o.lines}>
            {totals.lines.map((l) => (
              <Line key={`${l.product.slug}|${l.flavor ?? ""}`} line={l} />
            ))}
          </ul>
        )}

        {totals.pickupOnly.length > 0 && (
          <div className={o.held}>
            <p className={o.heldNote}>
              Cigarettes are pickup only — we can&rsquo;t deliver them. Switch to
              pick up, or remove them to send the rest.
            </p>
            <ul className={o.lines}>
              {totals.pickupOnly.map((l) => (
                <Line key={`${l.product.slug}|${l.flavor ?? ""}`} line={l} held />
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* --- 3. Totals ----------------------------------------------------- */}
      {totals.lines.length > 0 ? (
        <>
          <Bulbs />
          <section className={o.step}>
            <h2 className={o.stepTitle}>
              <span className={o.stepNum}>{pickup ? 2 : 3}</span>
              What you owe
            </h2>
            <dl className={o.totals}>
              <dt>Products</dt>
              <dd>
                {formatMoney({ cents: totals.subtotalCents, currency: "USD" })}
              </dd>
              {!pickup && (
                <>
                  <dt>Strip hotel delivery</dt>
                  <dd>
                    {formatMoney({ cents: totals.feeCents, currency: "USD" })}
                  </dd>
                </>
              )}
              <dt className={o.dueLabel}>{pickup ? "Due at the counter" : "Due at handoff"}</dt>
              <dd className={o.dueValue}>
                {formatMoney({ cents: totals.totalCents, currency: "USD" })}
              </dd>
            </dl>
            <p className={o.taxNote}>
              Tax is added at the counter. Nothing else is.
            </p>
          </section>
        </>
      ) : null}

      <div className={o.footer}>
        {ready ? (
          <a className={o.send} href={sms}>
            Text us this order
          </a>
        ) : (
          <span className={o.sendOff} aria-disabled="true">
            {totals.lines.length === 0 ? "Add something first" : "Choose your hotel"}
          </span>
        )}
        <p className={o.sendNote}>
          {/* Said plainly rather than implied: this opens a text. There is no
              order store behind the site, so nothing here creates a record on
              its own. */}
          Opens a text to {PHONE_DISPLAY} with your list in it. We reply to
          confirm it&rsquo;s on the shelf and the total.{" "}
          {pickup
            ? "21+ only, ID at the counter."
            : `The runner checks ID at handoff. ${DELIVERY_STRIP_FEE_LABEL} flat, 21+ only.`}
        </p>
        {totals.lines.length + totals.pickupOnly.length > 0 && (
          <form action="/api/draft" method="POST">
            <input type="hidden" name="action" value="clear" />
            <input type="hidden" name="next" value="/delivery/order" />
            <button className={o.clear} type="submit">
              Clear the list
            </button>
          </form>
        )}
      </div>

      <div className={o.brand} aria-hidden="true">
        <Wordmark />
      </div>
    </main>
  );
}

function Line({ line: l, held = false }: { line: PricedLine; held?: boolean }) {
  const hasFlavors = (l.product.flavors?.length ?? 0) > 1;
  const href = `/p/${l.product.slug}${l.flavor ? `?flavor=${encodeURIComponent(l.flavor)}` : ""}`;
  return (
    <li className={o.line} data-held={held || undefined}>
      <a className={o.lineName} href={href}>
        {l.product.title}
      </a>
      <span className={o.lineUnit}>
        {l.flavor ? (
          <span className={o.lineFlavor}>{l.flavor} · </span>
        ) : hasFlavors ? (
          <span className={o.lineFlavor}>Any flavour — say in the text · </span>
        ) : null}
        {formatMoney(l.product.price)} each
      </span>
      <div className={o.stepper}>
        {held ? (
          <Step slug={l.product.slug} flavor={l.flavor} action="remove" label="Remove" />
        ) : (
          <>
            <Step slug={l.product.slug} flavor={l.flavor} action="dec" label="−" />
            <span className={o.qty}>{l.qty}</span>
            <Step slug={l.product.slug} flavor={l.flavor} action="inc" label="+" />
          </>
        )}
      </div>
      <span className={o.lineTotal}>
        {formatMoney({ cents: l.lineCents, currency: "USD" })}
      </span>
    </li>
  );
}

/** One stepper button. A form each, because each is its own POST. */
function Step({
  slug,
  flavor,
  action,
  label,
}: {
  slug: string;
  flavor?: string;
  action: "inc" | "dec" | "remove";
  label: string;
}) {
  return (
    <form action="/api/draft" method="POST">
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="slug" value={slug} />
      {flavor && <input type="hidden" name="flavor" value={flavor} />}
      <input type="hidden" name="next" value="/delivery/order" />
      <button
        className={action === "remove" ? o.removeBtn : o.stepBtn}
        type="submit"
        aria-label={
          action === "inc" ? "One more" : action === "dec" ? "One fewer" : "Remove from order"
        }
      >
        {label}
      </button>
    </form>
  );
}
