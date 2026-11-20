import type { Metadata } from "next";
import { headers } from "next/headers";
import g from "./Pickup.module.css";
import Bulbs from "@/components/Bulbs";
import StripMap from "@/components/StripMap";
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
  SHOP_ADDRESS_FULL,
  SHOP_GEO,
  SHOP_MALL,
  SHOP_STREET,
  SHOP_SUITE,
} from "@/lib/shop";

export const metadata: Metadata = {
  title: "Visit us — open 24 hours on the Strip | Puff Vegas",
  description:
    "Walk in 24 hours a day at 3649 S Las Vegas Blvd, suite 611-613, inside Grand Bazaar Shops next to Ole Red. Walk-in humidor and glass gallery.",
  alternates: { canonical: "/pickup" },
};

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${SHOP_GEO.lat},${SHOP_GEO.lng}`;

/**
 * 4i — Visit us. The walk-in half.
 *
 * The old page carried a walking-times table to a dozen hotels and a
 * schematic of the mall drawn as a transit diagram. Both were "The 24" — and
 * the times were stale on purpose, which is not a thing to keep. What
 * survives is the part a customer actually needs at 3 a.m.: where the door
 * is, that it is open, and how to get walking directions to it.
 */
export default async function PickupPage() {
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  return (
    <>
      <UtilityBar />
      <AgeBanner affirmed={affirmed} />
      <Header />
      <Bulbs />

      <main className={g.main}>
        {/* data-island="lit" so the map stays a night map in day mode; it is
            the same sign language as the delivery band. See StripMap.tsx. */}
        <div className={g.mapBand} data-island="lit">
          <StripMap />
          <span className={g.mapNote}>Schematic · not to scale</span>
        </div>

        <section className={g.head}>
          <p className={g.openNow}>
            <span className={g.pulse} aria-hidden="true" />
            Open now — and always
          </p>
          <h1 className={g.address}>
            {SHOP_STREET}
            <br />
            {SHOP_SUITE}
          </h1>
          <p className={g.where}>
            Inside {SHOP_MALL}, next to Ole Red, on the ground level — no
            stairs. Follow the 600 numbers along the south side; we are between
            610 and 614.
          </p>

          <div className={g.actions}>
            <a
              className={g.directions}
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
            <a className={g.call} href={PHONE_HREF}>
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </section>

        {/* The real storefront, in the Grand Bazaar arcade. This is the
            findability payoff: the red awning, the blade signs down the
            arcade, the 21+ notice board, and the Vegas-sign "next to
            Horseshoe" poster — everything someone scans for on approach. It
            is why /pickup exists, and until now the page had a schematic and
            an interior but never the face of the building. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={g.storefront}
          src="/shop/storefront-1448.webp"
          srcSet="/shop/storefront-720.webp 720w, /shop/storefront-1448.webp 1448w"
          sizes="(min-width: 1200px) 1120px, 100vw"
          width={1448}
          height={1086}
          alt="The Puff Vegas storefront inside Grand Bazaar Shops: red puff VEGAS awning, VAPE and SHOP neon, the 21+ notice board, and a Welcome to Puff Vegas poster."
          loading="lazy"
          decoding="async"
        />

        <Bulbs />

        <section className={g.hoursCard}>
          <p className={g.hoursLabel}>Hours</p>
          <p className={g.hoursValue}>24 hours · 7 days</p>
          <p className={g.hoursNote}>
            Every day of the year, including the ones everything else is shut.
          </p>
        </section>

        <section className={g.inside}>
          <h2 className={g.sectionTitle}>What&rsquo;s inside</h2>
          {/* The view up the aisle as you walk in, not the wide shot the
              homepage uses. This page's job is findability, and this frame
              carries what you navigate by: the Zippo and Wegacell stands at
              the door, the glass cases on the right, the vape wall, and the
              hexagon lights down the ceiling.

              Shot 2026-11-16 by the shop (research/photos/aisle-2026-11-16.jpg).
              It replaced an older aisle photo taken before the hexagon lights
              went in, which showed a ceiling the shop no longer has. No scrim
              — on this page the shop is the content, not a backdrop. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={g.insideShot}
            src="/shop/aisle-2026-1280.webp"
            srcSet="/shop/aisle-2026-640.webp 640w, /shop/aisle-2026-1280.webp 1280w"
            sizes="(min-width: 1200px) 620px, 100vw"
            width={1280}
            height={960}
            alt="Inside Puff Vegas from the door: hexagon lights down the ceiling, glass cases of pipes and glass on the right, the vape wall behind them, Zippo and Wegacell stands by the entrance."
            loading="lazy"
            decoding="async"
          />
          <ul className={g.insideList}>
            <li className={g.insideRow}>
              <span className={g.insideName}>Walk-in humidor</span>
              <span className={g.insideNote}>
                Singles and boxes, kept at 70°F and 69% RH.
              </span>
            </li>
            <li className={g.insideRow}>
              <span className={g.insideName}>Glass gallery</span>
              <span className={g.insideNote}>
                Blown in Vegas, one-offs included. Ask to handle anything.
              </span>
            </li>
          </ul>
        </section>

        {/* The storefront as it reads from the promenade — the shop's own
            window marketing and the OPEN 24 HOURS call, a brand close to the
            page. Added at the owner's direction. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={g.poster}
          src="/shop/poster-933.webp"
          srcSet="/shop/poster-640.webp 640w, /shop/poster-933.webp 933w"
          sizes="(min-width: 1200px) 720px, 100vw"
          width={933}
          height={879}
          alt="The Puff Vegas storefront from the Grand Bazaar promenade: red puff VEGAS awning, the shop window and its 24-hour marketing."
          loading="lazy"
          decoding="async"
        />

        <section className={g.legal}>
          <p className={g.legalBody}>
            21+ with valid ID at the counter, every time. {SHOP_ADDRESS_FULL}.
          </p>
        </section>
      </main>

      <Bulbs />
      <Footer />
      <BottomNav />
    </>
  );
}
