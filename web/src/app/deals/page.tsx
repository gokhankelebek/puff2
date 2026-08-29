import type { Metadata } from "next";
import { headers } from "next/headers";
import j from "./Deals.module.css";
import Bulbs from "@/components/Bulbs";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import {
  AgeBanner,
  BottomNav,
  Footer,
  Header,
  UtilityBar,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "@/components/Chrome";
import { AGE_HEADER } from "@/lib/age-shared";
import { commerce, formatMoney, type Product } from "@/lib/commerce";
import {
  GRAVEYARD_FROM,
  GRAVEYARD_TO,
  graveyardMinutesLeft,
  isGraveyard,
} from "@/lib/time";

export const metadata: Metadata = {
  title: "Deals — graveyard shift and this week | Puff Vegas",
  description:
    "Overnight deals at Puff Vegas on the Las Vegas Strip. Graveyard shift discount between 2 and 6 AM, plus what we are moving this week.",
  alternates: { canonical: "/deals" },
};

const GRAVEYARD_PERCENT = 15;

function hhmm(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h} h ${m} m` : `${m} m`;
}

/**
 * 4j — Deals. Move inventory at 3 AM.
 *
 * The graveyard panel does not exist outside 2–6 AM local. It is decided on
 * the server from Vegas time, not from the visitor's device: a traveller who
 * has not changed timezones would otherwise see a deal they cannot use, or
 * miss one they can.
 */
export default async function DealsPage() {
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  const now = new Date();
  const graveyard = isGraveyard();
  const minsLeft = graveyardMinutesLeft(now);

  const all = await commerce.getProducts();
  /* Real products, cheapest-first among things actually on the shelf — a
     deal row pointing at something we do not have is worse than no row. */
  const deals = all
    .filter((p) => p.stock.tier !== "out" && p.price.cents > 0)
    .sort((a, b) => a.price.cents - b.price.cents)
    .slice(0, 3);

  return (
    <>
      <UtilityBar />
      <AgeBanner affirmed={affirmed} />
      <Header />
      <Bulbs />

      <main className={j.main}>
        <h1 className={j.pageTitle}>Deals</h1>

        {graveyard ? (
          <section className={j.feature} aria-labelledby="gy">
            <p className={j.featureEyebrow}>Right now</p>
            <h2 className={j.featureTitle} id="gy">
              Graveyard shift
              <br />
              {GRAVEYARD_PERCENT}% off
            </h2>
            <p className={j.featureBody}>
              Everything on the floor, {GRAVEYARD_FROM} AM to {GRAVEYARD_TO} AM,
              in the shop or delivered. No code — we take it off at the counter
              and on delivery.
            </p>
            <p className={j.countdown} data-countdown={minsLeft}>
              {hhmm(minsLeft)} left tonight
            </p>
          </section>
        ) : (
          <section className={j.featureOff} aria-labelledby="gy">
            <p className={j.featureEyebrow}>Back tonight</p>
            <h2 className={j.featureTitleOff} id="gy">
              Graveyard shift
              <br />
              {GRAVEYARD_PERCENT}% off
            </h2>
            <p className={j.featureBody}>
              Every night between {GRAVEYARD_FROM} AM and {GRAVEYARD_TO} AM,
              Vegas time. Everything on the floor, in the shop or delivered.
            </p>
          </section>
        )}

        <Bulbs />

        <PageNicotineWarning products={deals} />

        <section className={j.list} aria-labelledby="moving">
          <h2 className={j.sectionTitle} id="moving">
            Moving this week
          </h2>
          <ul className={j.rows}>
            {deals.map((p, i) => (
              <DealRow key={p.slug} product={p} index={i} />
            ))}
          </ul>
        </section>

        <Bulbs />

        <section className={j.signup} data-island="lit">
          <h2 className={j.signupTitle}>Text list</h2>
          <p className={j.signupBody}>
            One message a week, and the graveyard reminder if you want it. No
            app, no account. Text us to join — we will not add you otherwise.
          </p>
          <a className={j.join} href={PHONE_HREF}>
            Text {PHONE_DISPLAY}
          </a>
          <p className={j.signupLegal}>
            21+ only. Message and data rates may apply. Reply STOP to leave.
          </p>
        </section>
      </main>

      <Bulbs />
      <Footer />
      <BottomNav />
    </>
  );
}

function DealRow({ product: p, index }: { product: Product; index: number }) {
  return (
    <li className={j.row}>
      <a className={j.rowLink} href={`/p/${p.slug}`}>
        <span className={j.rowShot} data-ground={(index % 4) + 1}>
          {p.images[0] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              className={j.rowImg}
              src={p.images[0].src}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className={j.rowShotNote}>Photo</span>
          )}
        </span>
        <span className={j.rowBody}>
          <span className={j.rowHeadline}>{formatMoney(p.price)}</span>
          <span className={j.rowName}>{p.title}</span>
          <span className={j.rowNote}>
            {p.brand ? `${p.brand} · ` : ""}In the shop or delivered
          </span>
        </span>
      </a>
    </li>
  );
}
