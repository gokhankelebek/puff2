import type { Metadata } from "next";
import { headers } from "next/headers";
import s from "../Home.module.css";
import g from "./Pickup.module.css";
import { AgeBanner, Header, StatusModule, BottomNav, PHONE_DISPLAY, PHONE_HREF } from "@/components/Chrome";
import { AGE_HEADER } from "@/lib/age-shared";
import { hourBand, pacificHour } from "@/lib/time";
import { WALKS, mapsWalkingUrl } from "@/lib/walks";

export const metadata: Metadata = {
  title: "Pick-Up — Grand Bazaar Shops, next to Ole Red | Puff Vegas",
  description:
    "Walk in to Puff Vegas at Grand Bazaar Shops, Las Vegas Blvd at Flamingo, next to Ole Red. Suite 611-613. Open 24 hours.",
  alternates: { canonical: "/pickup" },
};

type Origin = "west" | "east" | "mall";

function parseOrigin(raw?: string): Origin | undefined {
  if (raw === "west" || raw === "east" || raw === "mall") return raw;
  return undefined;
}

/**
 * Walk-in. Not delivery.
 *
 * Landmarks before the street number. The Flamingo pedestrian bridge is the
 * whole problem for anyone west of the Blvd. `?from=west|east|mall` is a
 * link, not a script.
 */
export default async function PickupPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from: fromRaw } = await searchParams;
  const origin = parseOrigin(fromRaw);
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  const now = new Date();
  const band = hourBand(pacificHour(now));
  const maps = mapsWalkingUrl();

  const order: Array<"addr" | "bridge" | "mall" | "walks"> =
    origin === "west"
      ? ["bridge", "mall", "walks", "addr"]
      : ["mall", "walks", "bridge", "addr"];

  const blocks = {
    addr: <Address />,
    bridge: <Bridge />,
    mall: <MallDiagram />,
    walks: <Walks />,
  };

  return (
    <div data-band={band === "late" ? "late" : undefined}>
      <AgeBanner affirmed={affirmed} />
      <Header />
      <StatusModule />

      <main className={s.main}>
        <section className={s.shelfHead}>
          <div>
            <span className={s.shelfIndex}>Pick-Up</span>
            <h1 className={s.shelfTitle}>Next to Ole Red</h1>
            <p className={s.shelfNote}>Ole Red, Grand Bazaar. Suite 611–613.</p>
          </div>
          <div className={s.shelfActions}>
            <a className={s.cta} href={maps} target="_blank" rel="noreferrer">
              Open in Maps
            </a>
            <a className={s.ctaGhost} href="/delivery">
              Delivery instead
            </a>
          </div>
        </section>

        <OriginPicker current={origin} />

        {order.map((key) => (
          <div key={key}>{blocks[key]}</div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}

function OriginPicker({ current }: { current?: Origin }) {
  const origins: { id: Origin; lead: string; note: string }[] = [
    { id: "west", lead: "West of Blvd", note: "Use the Flamingo bridge" },
    { id: "east", lead: "This side", note: "Horseshoe, Paris, Flamingo" },
    { id: "mall", lead: "In the mall", note: "Past Ole Red → 600s" },
  ];

  return (
    <nav className={g.origins} aria-label="Where are you walking from?">
      {origins.map((o) => (
        <a
          key={o.id}
          className={g.origin}
          href={`/pickup?from=${o.id}`}
          aria-current={current === o.id ? "page" : undefined}
        >
          <span className={g.originLead}>{o.lead}</span>
          <span className={g.originNote}>{o.note}</span>
        </a>
      ))}
    </nav>
  );
}

function Address() {
  return (
    <section className={g.addr} aria-label="Address">
      <div className={g.addrBlock}>
        <span className={g.addrLabel}>Address</span>
        <p className={g.addrLine}>3649 S Las Vegas Blvd, Ste 611-613</p>
        <p className={g.addrLine}>Las Vegas, NV 89109</p>
        <p className={g.addrNote}>Grand Bazaar Shops, at Flamingo.</p>
      </div>
      <div className={g.addrBlock}>
        <span className={g.addrLabel}>Lost?</span>
        <p className={g.addrLine}>
          <a className={g.phone} href={PHONE_HREF}>
            {PHONE_DISPLAY}
          </a>
        </p>
        <p className={g.addrNote}>Call. We&rsquo;ll talk you in.</p>
      </div>
    </section>
  );
}

function Bridge() {
  return (
    <section className={g.bridge} aria-label="Crossing Las Vegas Boulevard">
      <h2 className={g.h2}>West side?</h2>
      <p className={g.bridgeBody}>
        You can&rsquo;t cross the Blvd here. Take the{" "}
        <strong>Flamingo pedestrian bridge.</strong>
      </p>
    </section>
  );
}

function MallDiagram() {
  return (
    <section className={g.mall} aria-label="Inside Grand Bazaar Shops">
      <h2 className={g.h2}>Inside the mall</h2>
      <svg
        className={g.mallSvg}
        viewBox="0 0 320 280"
        role="img"
        aria-labelledby="mall-title"
        aria-describedby="mall-desc"
      >
        <title id="mall-title">Grand Bazaar Shops, schematic</title>
        <desc id="mall-desc">
          Las Vegas Boulevard on the west. Ole Red at the north-west corner.
          Suites 600 along the south edge. Puff Vegas at 611-613.
        </desc>
        <rect className={g.mallBlvd} x="0" y="0" width="52" height="280" rx="4" />
        <text className={g.mallType} x="26" y="140" textAnchor="middle" transform="rotate(-90 26 140)">
          Las Vegas Blvd
        </text>
        <rect className={g.mallCell} x="64" y="12" width="120" height="64" rx="6" />
        <text className={g.mallType} x="124" y="42" textAnchor="middle">
          Ole Red
        </text>
        <text className={g.mallHint} x="124" y="60" textAnchor="middle">
          neon guitar
        </text>
        <rect className={g.mallCell} x="64" y="88" width="244" height="124" rx="6" />
        <text className={g.mallHint} x="186" y="152" textAnchor="middle">
          Grand Bazaar Shops
        </text>
        <rect className={g.mallCell} x="64" y="224" width="244" height="44" rx="6" />
        <text className={g.mallHint} x="130" y="250" textAnchor="middle">
          600s
        </text>
        <rect className={g.mallUs} x="176" y="224" width="132" height="44" rx="6" />
        <text className={g.mallType} x="242" y="244" textAnchor="middle">
          611–613
        </text>
        <text className={g.mallHint} x="242" y="258" textAnchor="middle">
          us
        </text>
      </svg>
    </section>
  );
}

function Walks() {
  return (
    <section className={g.walks} id="walks" aria-label="Walking times">
      <h2 className={g.h2}>On foot from</h2>
      <ul className={g.walkList}>
        {WALKS.map((w) => (
          <li key={w.place}>
            <a
              className={g.walk}
              href={mapsWalkingUrl(w.place)}
              target="_blank"
              rel="noreferrer"
            >
              <span className={g.walkMin}>{w.minutes} min</span>
              <span className={g.walkPlace}>{w.place}</span>
              {w.bridge && <span className={g.walkTag}>via the bridge</span>}
              <span className={g.walkMaps}>Maps</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
