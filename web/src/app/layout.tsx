import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { INIT_SCRIPT } from "@/lib/theme";
import InlineScript from "@/components/InlineScript";

/* Inter, per the Neon Haze design system.
   It replaces both Barlow Semi Condensed and IBM Plex Mono — the mockup uses
   one family for everything, headings at weight 500.

   Losing the mono is the one thing to watch: the clock is the reason it was
   there, because a proportional face reflows the header every second and fails
   CLS on its own. Inter carries real tabular figures, so the existing
   `font-variant-numeric: tabular-nums` on the clock and the price columns
   keeps them fixed-width without a second family. */
const display = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

/* Same family. The variable is kept because ~100 rules reference it for the
   small letterspaced labels; it no longer means "monospace", it means "the UI
   label face". Renaming it is a mechanical follow-up, not a behaviour change. */
const mono = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

const humidor = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-humidor",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://puffvegas.us"),
  title: "Smoke Shop on the Las Vegas Strip — Open 24 Hours | Puff Vegas",
  description:
    "Open 24 hours on the Las Vegas Strip, inside Grand Bazaar Shops next to Ole Red. Disposables, cigarettes, premium cigars, hookah and glass. 24/7 delivery, $10 to Strip hotels, $30 minimum, cash at your door.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  /* Was a single cool #08090A, which matched neither palette — every neutral
     in this design is warm-shifted. Two entries cover the system preference;
     an explicit day/night choice rewrites the tag at runtime, because a static
     value cannot know about it. See src/lib/theme.ts. */
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#100d0b" },
    { media: "(prefers-color-scheme: light)", color: "#ede8de" },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <InlineScript html={INIT_SCRIPT} />
      </head>
      <body
        className={`${display.variable} ${mono.variable} ${humidor.variable}`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STORE_JSONLD) }}
        />
      </body>
    </html>
  );
}
