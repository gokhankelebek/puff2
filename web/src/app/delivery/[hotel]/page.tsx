import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import h from "./Hotel.module.css";
import {
  AgeBanner,
  BottomNav,
  Footer,
  Header,
  UtilityBar,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "@/components/Chrome";
import Bulbs from "@/components/Bulbs";
import { AGE_HEADER } from "@/lib/age-shared";
import {
  HOTELS,
  hotelBySlug,
  metersFromShop,
  formatMiles,
  directionFromShop,
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_MINIMUM_LABEL,
} from "@/lib/hotels";
import { SHOP_MALL, SHOP_STREET, SITE_ORIGIN } from "@/lib/shop";
import { jsonLd, breadcrumbLd } from "@/lib/jsonld";

/**
 * Per-hotel delivery landing pages — the local moat.
 *
 * The $20-flat, 24/7, no-minimum Strip delivery is the shop's biggest
 * differentiator and the lowest-competition local intent ("vape delivery
 * {hotel}", "smoke shop near {hotel}"), but it used to collapse to one
 * /delivery?hotel= query URL with nothing indexable behind it.
 *
 * These are NOT name-swapped doorway pages. Each carries at least three facts
 * derived from the hotel's own data — distance and compass direction from the
 * shop (from geo), the tower list, and the meet point — so every page says
 * something true and specific that no other hotel's page says. Where the shop
 * has not filled in a real meet point, the page states the honest fallback
 * rather than inventing "the north valet" (see hotels.ts).
 */
export function generateStaticParams() {
  return HOTELS.map((x) => ({ hotel: x.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hotel: string }>;
}): Promise<Metadata> {
  const { hotel: slug } = await params;
  const hotel = hotelBySlug(slug);
  if (!hotel) return { title: "Not found | Puff Vegas" };
  return {
    title: `Vape & Smoke Delivery to ${hotel.name} — $20 Flat, 24 Hours | Puff Vegas`,
    description: `24-hour vape, cigarette, cigar and nicotine-pouch delivery to ${hotel.name} on the Las Vegas Strip. $20 flat, no minimum, about 25–40 minutes. Meet the runner at valet or rideshare pickup, ID checked at handoff.`,
    alternates: { canonical: `/delivery/${hotel.slug}` },
  };
}

export default async function HotelDeliveryPage({
  params,
}: {
  params: Promise<{ hotel: string }>;
}) {
  const { hotel: slug } = await params;
  const hotel = hotelBySlug(slug);
  if (!hotel) notFound();

  const hdr = await headers();
  const affirmed = hdr.get(AGE_HEADER) === "1";

  const distance = formatMiles(metersFromShop(hotel.geo));
  const direction = directionFromShop(hotel.geo);
  const meet =
    hotel.meet ??
    "Valet or rideshare pickup — we'll confirm which when you text.";

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `Vape & smoke delivery to ${hotel.name}`,
        serviceType: "Tobacco and vape delivery",
        provider: { "@id": `${SITE_ORIGIN}/#store` },
        areaServed: { "@type": "Hotel", name: hotel.name },
        url: `${SITE_ORIGIN}/delivery/${hotel.slug}`,
        offers: {
          "@type": "Offer",
          price: "20.00",
          priceCurrency: "USD",
          description: "$20 flat, no minimum",
        },
      },
      breadcrumbLd(SITE_ORIGIN, [
        { name: "Puff Vegas", path: "/" },
        { name: "Delivery", path: "/delivery" },
        { name: hotel.name, path: `/delivery/${hotel.slug}` },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(graph)}
      />
      <UtilityBar hotel={hotel.name} />
      <AgeBanner affirmed={affirmed} />
      <Header />
      <Bulbs />

      <main className={h.main}>
        <nav className={h.crumbs} aria-label="Breadcrumb">
          <a href="/">Puff</a>
          <span aria-hidden="true">/</span>
          <a href="/delivery">Delivery</a>
          <span aria-hidden="true">/</span>
          <span>{hotel.name}</span>
        </nav>

        <section className={h.hero} aria-labelledby="hotel-title">
          <p className={h.eyebrow}>24-hour Strip delivery</p>
          <h1 className={h.title} id="hotel-title">
            Delivery to
            <br />
            {hotel.name}
          </h1>
          <p className={h.terms}>
            {DELIVERY_STRIP_FEE_LABEL} flat · {DELIVERY_MINIMUM_LABEL}
          </p>
          <p className={h.sub}>
            Vapes, cigarettes, cigars, hookah and nicotine pouches, run from our
            counter at {SHOP_STREET} inside {SHOP_MALL} straight to{" "}
            {hotel.name} — about 25–40 minutes, any hour of the night.
          </p>
          <a className={h.cta} href={PHONE_HREF}>
            Call to order · {PHONE_DISPLAY}
          </a>
        </section>

        <section className={h.facts} aria-label={`Delivery to ${hotel.name}`}>
          <div className={h.fact} data-island="lit">
            <span className={h.fk}>From the shop</span>
            <span className={h.fv}>
              {distance} {direction}
            </span>
          </div>
          <div className={h.fact} data-island="lit">
            <span className={h.fk}>Typical run</span>
            <span className={h.fv}>25–40 min</span>
          </div>
          <div className={h.fact} data-island="lit">
            <span className={h.fk}>Fee</span>
            <span className={h.fv}>
              {DELIVERY_STRIP_FEE_LABEL} flat, {DELIVERY_MINIMUM_LABEL}
            </span>
          </div>
          <div className={h.fact} data-island="lit">
            <span className={h.fk}>Pay</span>
            <span className={h.fv}>Cash or card at handoff</span>
          </div>
          <div className={`${h.fact} ${h.factWide}`} data-island="lit">
            <span className={h.fk}>Meet point</span>
            <span className={h.fv}>{meet}</span>
          </div>
          {hotel.towers && (
            <div className={`${h.fact} ${h.factWide}`} data-island="lit">
              <span className={h.fk}>Towers we run to</span>
              <span className={h.fv}>{hotel.towers.join(" · ")}</span>
            </div>
          )}
        </section>

        <p className={h.legal}>
          21+ with valid ID, checked at handoff on every order. We don&rsquo;t
          ship — local delivery only, across the Strip. We don&rsquo;t come up to
          rooms; you meet the runner at {hotel.name}&rsquo;s valet stand or
          rideshare pickup.
        </p>

        <a className={h.back} href="/delivery">
          All {HOTELS.length} Strip hotels →
        </a>
      </main>

      <Bulbs />
      <Footer />
      <BottomNav />
    </>
  );
}
