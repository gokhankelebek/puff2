import type { Metadata } from "next";
import { headers } from "next/headers";
import d from "./Delivery.module.css";
import Bulbs from "@/components/Bulbs";
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
import {
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_TERMS_LABEL,
  HOTELS,
  hotelByQuery,
} from "@/lib/hotels";
import { SHOP_STREET } from "@/lib/shop";
import { jsonLd } from "@/lib/jsonld";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Hotel delivery, 24 hours | Puff Vegas",
  description:
    "Delivery to Las Vegas Strip hotels, $20 flat with no minimum, about 25–40 minutes. Meet the runner at your valet or rideshare pickup. Cash or card on handover, ID checked every time.",
  alternates: { canonical: "/delivery" },
};

type Search = { hotel?: string };

/**
 * 4g — Delivery, explained.
 *
 * Answers every delivery question without a phone call. It is not the order
 * sheet: the sheet is a separate step, and this page's job is to make the
 * terms plain enough that starting one feels safe.
 *
 * The hotel choice is a link, not client state, so a chosen hotel is a
 * shareable URL and the page works with scripting off.
 */
export default async function DeliveryPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  /* Legacy ?hotel=X (and aliases like ballys → horseshoe) permanently redirect
     to the canonical /delivery/{slug} page, consolidating link signals onto the
     indexable per-hotel URL instead of a query string. */
  if (sp.hotel) {
    const target = hotelByQuery(sp.hotel);
    if (target) permanentRedirect(`/delivery/${target.slug}`);
  }
  const featured = HOTELS.slice(0, 8);
  const more = Math.max(0, HOTELS.length - featured.length);

  /* FAQPage from facts stated on this page — the fee, window, meet point,
     payment, ID check and no-ship policy. Every answer is on-page copy, not
     invented, so the markup is honest. (Google has narrowed FAQ rich results,
     but the markup stays valid and aids understanding.) */
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is delivery to a Las Vegas Strip hotel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "$20 flat to any Strip hotel, with no minimum order.",
        },
      },
      {
        "@type": "Question",
        name: "How long does delivery take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "About 25\u201340 minutes, 24 hours a day.",
        },
      },
      {
        "@type": "Question",
        name: "Where do I meet the driver?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We don\u2019t come up to rooms \u2014 you meet the runner at your hotel\u2019s valet stand or rideshare pickup.",
        },
      },
      {
        "@type": "Question",
        name: "How do I pay?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cash or card at handoff. We never take card details on the site.",
        },
      },
      {
        "@type": "Question",
        name: "Do you check ID?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes \u2014 valid ID is checked at handoff on every order, no exceptions.",
        },
      },
      {
        "@type": "Question",
        name: "Do you ship orders?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Local delivery only, across the Las Vegas Strip.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqLd)} />
      <UtilityBar />
      <AgeBanner affirmed={affirmed} />
      <Header />
      <Bulbs />

      <main className={d.main}>
        <section className={d.hero}>
          <h1 className={d.heroTitle}>
            {DELIVERY_STRIP_FEE_LABEL} flat.
            <br />
            No minimum.
            <br />
            Any hour.
          </h1>
          <p className={d.heroSub}>
            We run to Strip hotels around the clock from {SHOP_STREET}. One
            price, whatever you order and wherever you are on the Boulevard.
            You pay the runner at handoff.
          </p>
        </section>

        <ul className={d.stats}>
          <li className={d.stat}>
            <span className={d.statFigure}>25–40</span>
            <span className={d.statLabel}>Minutes, typical</span>
          </li>
          <li className={d.stat}>
            <span className={d.statFigure}>{HOTELS.length}</span>
            <span className={d.statLabel}>Strip hotels served</span>
          </li>
        </ul>

        <Bulbs />

        <section className={d.how}>
          <h2 className={d.sectionTitle}>How it works</h2>
          <ol className={d.steps}>
            <li className={d.step}>
              <span className={d.stepNum}>1</span>
              <span className={d.stepBody}>
                <span className={d.stepTitle}>Tell us which hotel</span>
                <span className={d.stepNote}>
                  That&rsquo;s all we need. We don&rsquo;t come up to rooms —
                  the resorts don&rsquo;t allow outside delivery upstairs — so
                  you meet the runner at your valet stand or rideshare pickup.
                </span>
              </span>
            </li>
            <li className={d.step}>
              <span className={d.stepNum}>2</span>
              <span className={d.stepBody}>
                <span className={d.stepTitle}>Pick your items</span>
                <span className={d.stepNote}>
                  Anything on the floor that can leave the building. Some items
                  are in-store only and say so on their page.
                </span>
              </span>
            </li>
            <li className={d.step}>
              <span className={d.stepNum}>3</span>
              <span className={d.stepBody}>
                <span className={d.stepTitle}>Pay on handover</span>
                <span className={d.stepNote}>
                  Cash or card on the runner&rsquo;s reader. No card details on
                  this site, ever. Have your ID out — we check every time.
                </span>
              </span>
            </li>
          </ol>
        </section>

        <Bulbs />

        <section className={d.hotels} data-island="lit">
          <h2 className={d.sectionTitle}>Hotels we run to</h2>
          <ul className={d.chipRow}>
            {featured.map((x) => (
              <li key={x.slug}>
                <a className={d.chip} href={`/delivery/${x.slug}`}>
                  {x.name}
                </a>
              </li>
            ))}
            <li>
              <span className={d.chipMore}>+ {more} more</span>
            </li>
          </ul>

          {/* Each hotel links to its own /delivery/{slug} page, which shows
              the meet point, distance and run time. */}
          <p className={d.pickedNote}>
            Pick your hotel for its meet point, distance from the shop and
            typical run time.
          </p>

          <a className={d.cta} href={PHONE_HREF}>
            Start a delivery
          </a>
          <p className={d.ctaNote}>
            Text or call {PHONE_DISPLAY}. No account, no card on file.
          </p>
        </section>

        <Bulbs />

        <section className={d.legal}>
          <h2 className={d.legalTitle}>We do not ship</h2>
          <p className={d.legalBody}>
            Local delivery only, inside Clark County, by our own runners. We do
            not mail tobacco, vapor or hemp products to any address — the PACT
            Act makes that a different business and we are not in it. 21+ with
            valid ID at handoff, every order, no exceptions.
          </p>
        </section>
      </main>

      <Bulbs />
      <Footer />
      <BottomNav />
    </>
  );
}
