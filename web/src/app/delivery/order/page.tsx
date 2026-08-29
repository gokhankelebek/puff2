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
} from "@/lib/draft";
import {
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_TERMS_LABEL,
  HOTELS,
  hotelBySlug,
} from "@/lib/hotels";

export const metadata: Metadata = {
  title: "Your delivery | Puff Vegas",
  robots: { index: false, follow: false },
};

const MEETS: MeetPoint[] = ["valet", "rideshare"];

/**
 * 3b — Delivery sheet. Build and send an order.
 *
 * No cart page, no card entry, and no payment fields anywhere: money changes
 * hands at the handover. The whole sheet is form POSTs against /api/draft, so
 * the steppers and the meet-point control work with scripting off.
 *
 * There is no room number and no tower. The shop does not deliver to hotel
 * rooms — the guest comes down to their property's valet stand or rideshare
 * zone — so asking for a room would be collecting data we have no use for and
 * implying a service we do not run.
 *
 * Sending hands off to SMS rather than creating an order record, because
 * there is no order store behind this site yet. That is stated on the button
 * and again underneath, rather than implied away — see docs/OPEN-DECISIONS.md.
 */
export default async function OrderSheet() {
  const jar = await cookies();
  const draft = parseDraft(jar.get(DRAFT_COOKIE)?.value);
  const catalog = await commerce.getProducts();
  const totals = priceDraft(draft, catalog);

  const hotel = draft.hotel ? hotelBySlug(draft.hotel) : undefined;
  const ready = totals.lines.length > 0 && Boolean(hotel);
  const sms = `${PHONE_HREF.replace("tel:", "sms:")}?&body=${encodeURIComponent(
    draftToSms(totals, draft, hotel?.name),
  )}`;

  return (
    <main className={o.sheet}>
      <header className={o.head}>
        <a className={o.back} href="/vape" aria-label="Back to the floor">
          ←
        </a>
        <span className={o.headTitle}>Hotel delivery</span>
        <a className={o.close} href="/" aria-label="Close">
          ✕
        </a>
      </header>

      <Bulbs />

      {totals.lines.length > 0 ? (
        <section className={o.eta} data-island="lit">
          <p className={o.etaTime}>
            25–35 min{hotel ? ` to ${hotel.name}` : ""}
          </p>
          <p className={o.etaTerms}>
            {DELIVERY_TERMS_LABEL} · cash or card when we hand it over
          </p>
        </section>
      ) : null}

      {/* --- 1. Where ------------------------------------------------------ */}
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

      <Bulbs />

      {/* --- 2. Items ------------------------------------------------------ */}
      <section className={o.step}>
        <h2 className={o.stepTitle}>
          <span
            className={o.stepNum}
            data-done={totals.lines.length > 0 ? "true" : undefined}
          >
            2
          </span>
          Your items
        </h2>

        {totals.lines.length === 0 ? (
          <p className={o.empty}>
            Nothing in the bag yet.{" "}
            <a className={o.emptyLink} href="/vape">
              Pick something off the floor →
            </a>
          </p>
        ) : (
          <ul className={o.lines}>
            {totals.lines.map((l) => (
              <li key={l.product.slug} className={o.line}>
                <a className={o.lineName} href={`/p/${l.product.slug}`}>
                  {l.product.title}
                </a>
                <span className={o.lineUnit}>
                  {formatMoney(l.product.price)} each
                </span>
                <div className={o.stepper}>
                  <Step slug={l.product.slug} action="dec" label="−" />
                  <span className={o.qty}>{l.qty}</span>
                  <Step slug={l.product.slug} action="inc" label="+" />
                </div>
                <span className={o.lineTotal}>
                  {formatMoney({ cents: l.lineCents, currency: "USD" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --- 3. Totals ----------------------------------------------------- */}
      {totals.lines.length > 0 ? (
        <>
          <Bulbs />
          <section className={o.step}>
            <h2 className={o.stepTitle}>
              <span className={o.stepNum}>3</span>
              What you owe
            </h2>
            <dl className={o.totals}>
              <dt>Products</dt>
              <dd>
                {formatMoney({ cents: totals.subtotalCents, currency: "USD" })}
              </dd>
              <dt>Strip hotel delivery</dt>
              <dd>
                {formatMoney({ cents: totals.feeCents, currency: "USD" })}
              </dd>
              <dt className={o.dueLabel}>Due at the door</dt>
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
            Send the runner
          </a>
        ) : (
          <span className={o.sendOff} aria-disabled="true">
            {totals.lines.length === 0 ? "Add something first" : "Choose your hotel"}
          </span>
        )}
        {ready ? (
          <a className={o.trackLink} href="/delivery/track">
            Already sent it? Track your delivery →
          </a>
        ) : null}
        <p className={o.sendNote}>
          {/* Said plainly rather than implied: this opens a text. There is no
              order store behind the site yet, so nothing here creates a
              record on its own. */}
          Opens a text to {PHONE_DISPLAY} with your order in it. We reply to
          confirm, and the runner checks ID at the door.{" "}
          {DELIVERY_STRIP_FEE_LABEL} flat, 21+ only.
        </p>
      </div>

      <div className={o.brand} aria-hidden="true">
        <Wordmark />
      </div>
    </main>
  );
}

/** One stepper button. A form each, because each is its own POST. */
function Step({
  slug,
  action,
  label,
}: {
  slug: string;
  action: "inc" | "dec";
  label: string;
}) {
  return (
    <form action="/api/draft" method="POST">
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="next" value="/delivery/order" />
      <button
        className={o.stepBtn}
        type="submit"
        aria-label={action === "inc" ? "One more" : "One fewer"}
      >
        {label}
      </button>
    </form>
  );
}
