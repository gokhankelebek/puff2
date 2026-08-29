import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { INIT_SCRIPT } from "@/lib/theme";
import InlineScript from "@/components/InlineScript";

/* Marquee Neon uses three faces and each one has exactly one job.

   Bebas Neue is the sign: condensed caps, 400 only, no lowercase. Everything
   it does is size and tracking, which is why the ladder lives in globals.css
   as named steps rather than ad-hoc font-size overrides.

   There is no script face. The handoff set the logo as type and used
   Yellowtail for the word "Puff"; the shop's real logo replaced that, so
   carrying the font would be a download that renders nothing.

   Instrument Sans carries every piece of body copy. It has real tabular
   figures, which the clock, the countdowns and the price columns all need:
   a proportional face reflows the header once a second and fails CLS on its
   own. That is why `.numeric` is a utility and not a per-component decision. */
const display = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-bebas",
});

const bodyFace = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://puffvegas.us"),
  title: "Smoke Shop on the Las Vegas Strip — Open 24 Hours | Puff Vegas",
  description:
    "Open 24 hours on the Las Vegas Strip, inside Grand Bazaar Shops next to Ole Red. Disposables, cigarettes, premium cigars, hookah and glass. 24/7 delivery, $20 flat to any Strip hotel, no minimum, meet us downstairs, cash on handover.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  /* Was a single cool #08090A, which matched neither palette — every neutral
     in this design is warm-shifted. Two entries cover the system preference;
     an explicit day/night choice rewrites the tag at runtime, because a static
     value cannot know about it. See src/lib/theme.ts. */
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0714" },
    { media: "(prefers-color-scheme: light)", color: "#f7f2e8" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * The live site ships ZERO structured data and a contact block claiming
 * 10:00 AM – 7:00 PM while its own copy says open 24 hours. This is the fix.
 *
 * `Store` is the most specific valid type — there is no `TobaccoShop` in
 * schema.org, and `LiquorStore` would be factually wrong. We deliberately do
 * NOT mark up our own AggregateRating; Google restricts that to sites
 * reviewing other businesses.
 */
const STORE_JSONLD = {
  "@context": "https://schema.org",
  "@type": ["Store", "LocalBusiness"],
  "@id": "https://puffvegas.us/#store",
  name: "Puff Vegas Smoke & Vape Shop",
  alternateName: "Puff Vegas",
  url: "https://puffvegas.us/",
  telephone: "+1-702-613-7799",
  priceRange: "$$",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Debit Card",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3649 S Las Vegas Blvd Ste 611-613",
    addressLocality: "Las Vegas",
    addressRegion: "NV",
    postalCode: "89109",
    addressCountry: "US",
  },
  /* Suite 611-613 itself, not the mall.
     Grand Bazaar Shops publishes a directory map; suites 612 and 613 sit in the
     600-series row along the mall's southern edge, between 610 and 614. The row
     is georeferenced from two suites OSM has surveyed with unit numbers on it —
     Subway (601) and Ben & Jerry's (606) — which are 13.0 m apart in exactly the
     direction and at exactly the spacing the map draws. The same fit puts the
     map's Ole Red block within 16 m of Ole Red's own OSM node, which is the
     check that it is not self-confirming.
     Google's "Grand Bazaar Shops" pin is 85 m from here and falls outside the
     mall's own footprint: it is the mall's Boulevard-frontage marker, not us. */
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.113777,
    longitude: -115.172005,
  },
  containedInPlace: {
    "@type": "ShoppingCenter",
    name: "Grand Bazaar Shops",
  },
  // Open 24/7 is expressed as 00:00 → 23:59 per Google's guidance.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  areaServed: {
    "@type": "GeoCircle",
    name: "Puff Vegas 24/7 delivery zone",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 36.113777,
      longitude: -115.172005,
    },
    geoRadius: "32187",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* suppressHydrationWarning: the head script below sets data-theme on this
       element before React hydrates, so the DOM deliberately disagrees with
       the server HTML. */
    /* The font variables go on <html>, not <body>.
       globals.css declares --font-body as `var(--font-instrument), ...` on
       :root, and a var() reference resolves against the element where the
       custom property is DECLARED. With the classes on <body>, :root could not
       see --font-instrument, the whole chain fell back, and every face on the
       site rendered as Times. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${bodyFace.variable}`}
    >
      <head>
        <InlineScript html={INIT_SCRIPT} />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STORE_JSONLD) }}
        />
      </body>
    </html>
  );
}
