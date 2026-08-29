import type { Metadata } from "next";
import { cookies } from "next/headers";
import t from "./Track.module.css";
import Bulbs from "@/components/Bulbs";
import { PHONE_DISPLAY, PHONE_HREF, Wordmark } from "@/components/Chrome";
import { commerce, formatMoney } from "@/lib/commerce";
import { DRAFT_COOKIE, MEET_LABEL, parseDraft, priceDraft } from "@/lib/draft";
import { hotelBySlug } from "@/lib/hotels";

export const metadata: Metadata = {
  title: "Your delivery | Puff Vegas",
  robots: { index: false, follow: false },
};

/**
 * 4h — Order tracking, built against what actually exists.
 *
 * The design specifies a live screen: a Bebas 74 arrival time, a status list
 * advancing received → packed → en route → delivered, and a named runner with
 * a tenure and a Text button.
 *
 * None of that has a source. There is no order store, no dispatch system and
 * no runner roster behind this site — an order is a text message to the shop.
 * A page that rendered "ARRIVING 4:52 AM" and "Marco, 3 years" from nothing
 * would be a convincing lie, and the customer standing in a hotel corridor is
 * exactly the wrong person to lie to.
 *
 * So this shows what is genuinely known — the order that was sent, and where
 * it is going — marks only the step that has actually happened, and says
 * plainly that the rest arrives by text. The layout is the design's; the four
 * steps and the runner card are here and will light up as soon as there is a
 * feed. See docs/OPEN-DECISIONS.md.
 */
const STEPS = [
  { id: "sent", label: "Order sent", note: "We have your text." },
  { id: "packed", label: "Packed", note: "Bagged and checked at the counter." },
  { id: "route", label: "On the way", note: "A runner is walking it over." },
  { id: "meet", label: "At the meet point", note: "ID out — we check every time." },
] as const;

export default async function TrackPage() {
  const jar = await cookies();
  const draft = parseDraft(jar.get(DRAFT_COOKIE)?.value);
  const catalog = await commerce.getProducts();
  const totals = priceDraft(draft, catalog);
  const hotel = draft.hotel ? hotelBySlug(draft.hotel) : undefined;

  const has = totals.lines.length > 0;

  return (
    <main className={t.main}>
      <header className={t.head}>
        <a className={t.back} href="/delivery/order" aria-label="Back to your order">
          ←
        </a>
        <span className={t.headTitle}>Your delivery</span>
        <span className={t.spacer} aria-hidden="true" />
      </header>

      <Bulbs />

      {!has ? (
        <section className={t.none}>
          <h1 className={t.noneTitle}>Nothing on the way</h1>
          <p className={t.noneBody}>
            You haven&rsquo;t sent an order yet.{" "}
            <a className={t.link} href="/vape">
              Pick something off the floor →
            </a>
          </p>
        </section>
      ) : (
        <>
          <section className={t.hero}>
            <p className={t.eyebrow}>Sent to the shop</p>
            {/* Deliberately not a clock time. We do not have one, and a
                number here would be believed. */}
            <p className={t.window}>25–35 min</p>
            <p className={t.where}>
              {hotel?.name ?? "Your hotel"}
              {draft.meet ? ` · ${MEET_LABEL[draft.meet]}` : ""}
            </p>
          </section>

          <ol className={t.steps}>
            {STEPS.map((step, i) => (
              <li
                key={step.id}
                className={t.step}
                /* Only the first step is real. The rest are pending, not
                   "current" — nothing is telling us which one is true. */
                data-state={i === 0 ? "done" : "pending"}
              >
                <span className={t.dot} aria-hidden="true" />
                <span className={t.stepBody}>
                  <span className={t.stepLabel}>{step.label}</span>
                  <span className={t.stepNote}>{step.note}</span>
                </span>
              </li>
            ))}
          </ol>

          <section className={t.runner}>
            <p className={t.runnerTitle}>Where&rsquo;s my runner?</p>
            <p className={t.runnerBody}>
              We reply to your text with the runner&rsquo;s name and an arrival
              window, and again when they set off. Status lives in that thread,
              not on this page — so you get it whether or not you have this
              open.
            </p>
            <a className={t.runnerCta} href={PHONE_HREF}>
              Text {PHONE_DISPLAY}
            </a>
          </section>

          <Bulbs />

          <section className={t.totals}>
            <h2 className={t.totalsTitle}>What you owe on handover</h2>
            <dl className={t.list}>
              {totals.lines.map((l) => (
                <div className={t.row} key={l.product.slug}>
                  <dt>
                    {l.qty}× {l.product.title}
                  </dt>
                  <dd>{formatMoney({ cents: l.lineCents, currency: "USD" })}</dd>
                </div>
              ))}
              <div className={t.row}>
                <dt>Strip hotel delivery</dt>
                <dd>{formatMoney({ cents: totals.feeCents, currency: "USD" })}</dd>
              </div>
              <div className={`${t.row} ${t.due}`}>
                <dt>Due at handoff</dt>
                <dd>{formatMoney({ cents: totals.totalCents, currency: "USD" })}</dd>
              </div>
            </dl>
            <p className={t.fine}>
              Cash or card on the runner&rsquo;s reader. Cancel free by text
              until the runner leaves the shop. 21+ with valid ID.
            </p>
          </section>
        </>
      )}

      <div className={t.brand} aria-hidden="true">
        <Wordmark />
      </div>
    </main>
  );
}
