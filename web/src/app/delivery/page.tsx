import type { Metadata } from "next";
import { headers } from "next/headers";
import s from "../Home.module.css";
import d from "./Delivery.module.css";
import { AgeBanner, Header, StatusModule, BottomNav, PHONE_DISPLAY, PHONE_HREF } from "@/components/Chrome";
import BoulevardSpine from "@/components/BoulevardSpine";
import { AGE_HEADER } from "@/lib/age-shared";
import { hourBand, pacificHour } from "@/lib/time";
import {
  HOTELS,
  HOTEL_SEARCH_HINTS,
  hotelByQuery,
  STRIP_LANDMARKS,
  formatMiles,
  metersFromShop,
  deliveryFeeCents,
  deliveryFeeForHotel,
  formatDeliveryFee,
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_TERMS_LABEL,
  DELIVERY_MINIMUM_LABEL,
  type Hotel,
} from "@/lib/hotels";
import { WALKS, walkForHotelSlug, mapsWalkingUrl } from "@/lib/walks";

export const metadata: Metadata = {
  title: "Delivery to Strip hotels — 24 hours | Puff Vegas",
  description:
    "Delivery to Las Vegas Strip hotels, $20 flat with no minimum, about 14 minutes. Cash at your door or card on the driver's reader. ID checked on every order, 24 hours a day.",
  alternates: { canonical: "/delivery" },
};

/**
 * The page the primary call to action points at.
 *
 * Every "Deliver to me" button on the site linked here and got a 404, which
 * made the whole design a shop window with a locked door.
 *
 * ── Why there is no cart ───────────────────────────────────────────────────
 *
 * Not an omission. Under the PACT Act, USPS will not carry ENDS at all and UPS,
 * FedEx and DHL have each stopped accepting them, so shipping this catalogue is
 * closed off to a small retailer. What the shop actually does is drive it over
 * and take cash or card at the door — which needs no checkout, and works today.
 * A web checkout waits on Square's written position on web-originated,
 * door-paid orders, which is still open.
 *
 * So the order is placed by text or phone, with the message pre-filled from
 * whatever the customer picked here. That is one tap on the device every one of
 * these visitors is holding, and it puts a person on the other end — which for
 * a shop that answers in minutes is a feature rather than a fallback.
 *
 * ── Why the picker is a spine and a name field, not a map ──────────────────
 *
 * `/delivery?hotel=bellagio` is server-rendered, works with scripting off,
 * survives a slow hydration, and can be sent to someone. Same reasoning as the
 * category facets and the age gate's form POST. The Boulevard spine is the
 * view; the stops are still those links. A typed name hits the same query
 * through a GET form — aliases like Bally's resolve on the server.
 */
export default async function DeliveryPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string; tower?: string }>;
}) {
  const { hotel: hotelQuery, tower } = await searchParams;
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  const now = new Date();
  const band = hourBand(pacificHour(now));
  const hotel = hotelByQuery(hotelQuery);
  const unknown = Boolean(hotelQuery?.trim() && !hotel);

  return (
    <div data-band={band === "late" ? "late" : undefined}>
      <AgeBanner affirmed={affirmed} />
      <Header />
      <StatusModule />

      <main className={s.main}>
        <section className={s.shelfHead}>
          <div>
            <span className={s.shelfIndex}>Delivery</span>
            <h1 className={s.shelfTitle}>We drive to you</h1>
            <p className={s.shelfNote}>
              {DELIVERY_TERMS_LABEL} · about 14 min. Cash or card.
              24 hours.
            </p>
          </div>
          <div className={s.shelfActions}>
            <a className={s.ctaGhost} href="/pickup">
              Pick-Up instead
            </a>
          </div>
        </section>

        <ul className={d.facts}>
          <li className={d.fact}>
            <span className={d.factFigure}>{DELIVERY_STRIP_FEE_LABEL}</span>
            <span className={d.factLabel}>Strip hotels</span>
          </li>
          <li className={d.fact}>
            <span className={d.factFigure}>None</span>
            <span className={d.factLabel}>Minimum</span>
          </li>
          <li className={d.fact}>
            <span className={d.factFigure}>24/7</span>
            <span className={d.factLabel}>Every hour</span>
          </li>
        </ul>
        <HotelSearch value={hotel?.name ?? (unknown ? hotelQuery : undefined)} />

        {unknown ? (
          <p className={d.miss} role="status">
            We don&rsquo;t have that name. Pick below or{" "}
            <a className={d.inline} href={PHONE_HREF}>
              call {PHONE_DISPLAY}.
            </a>
          </p>
        ) : null}

        {hotel ? <Chosen hotel={hotel} tower={tower} /> : null}

        <BoulevardSpine selected={hotel?.slug} />

        <HotelList />

        {/* Said before an order is built. Cigarettes stay pickup-only —
            NRS 370.585 is unsettled on delivery. See docs/COMPLIANCE.md. */}
        <section className={d.cant} aria-label="What we cannot deliver">
          <h2 className={d.h2}>Before you text</h2>
          <p className={d.cantBody}>
            <strong>Cigarettes:</strong> pickup only —{" "}
            <a className={d.inline} href="/cigarettes">
              hold at the counter.
            </a>
          </p>
          <p className={d.cantBody}>
            <strong>21+ with ID</strong> at the door. Have it out.
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function stopFacts(stop: (typeof STRIP_LANDMARKS)[number]): {
  primary: string;
  secondary: string;
} {
  if (stop.here) {
    return { primary: "Here", secondary: "Walk in · Grand Bazaar" };
  }
  const miles = stop.geo ? formatMiles(metersFromShop(stop.geo)) : null;
  /* Every stop prices the same now. The mile figure stays because the diagram
     is telling you where you are relative to the shop, not what it costs. */
  const fee = DELIVERY_STRIP_FEE_LABEL;
  const walk = stop.walkPlace
    ? WALKS.find((w) => w.place === stop.walkPlace)
    : undefined;
  if (walk) {
    return {
      primary: `${walk.minutes} min walk`,
      secondary: [miles, walk.bridge ? "over the bridge" : null, `${fee} delivered`]
        .filter(Boolean)
        .join(" · "),
    };
  }
  return {
    primary: fee,
    secondary: [miles, DELIVERY_MINIMUM_LABEL].filter(Boolean).join(" · "),
  };
}

function HotelSearch({ value }: { value?: string }) {
  return (
    <form className={d.find} method="get" action="/delivery" role="search">
      <label className={d.findLabel} htmlFor="hotel-query">
        Where are you staying?
      </label>
      <div className={d.findRow}>
        <input
          id="hotel-query"
          className={d.findInput}
          type="text"
          name="hotel"
          list="hotel-names"
          autoComplete="off"
          spellCheck={false}
          defaultValue={value}
          placeholder="Bellagio, Bally's, Cosmo…"
        />
        <button className={d.findGo} type="submit">
          Find
        </button>
      </div>
      <datalist id="hotel-names">
        {HOTELS.map((h) => (
          <option key={h.slug} value={h.name} />
        ))}
        {HOTEL_SEARCH_HINTS.map((hint) => (
          <option key={hint} value={hint} />
        ))}
      </datalist>
    </form>
  );
}

function HotelList() {
  return (
    <section className={d.pick} aria-label="All Strip hotels">
      <details className={d.allHotels}>
        <summary className={d.allSummary}>All Strip hotels</summary>
        <ul className={d.hotels}>
          {HOTELS.map((hotel) => (
            <li key={hotel.slug}>
              <a className={d.hotel} href={`/delivery?hotel=${hotel.slug}`}>
                <span>{hotel.name}</span>
                <span className={d.hotelFee}>
                  {formatDeliveryFee(deliveryFeeForHotel(hotel.slug))} · {DELIVERY_MINIMUM_LABEL}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </details>
      <p className={d.pickNote}>
        Somewhere else?{" "}
        <a className={d.inline} href={PHONE_HREF}>Call {PHONE_DISPLAY}</a>. Same meter.
      </p>
    </section>
  );
}

function Chosen({
  hotel,
  tower,
}: {
  hotel: Hotel;
  tower?: string;
}) {
  const where = tower ? `${hotel.name}, ${tower}` : hotel.name;
  const stop = STRIP_LANDMARKS.find((n) => n.hotel === hotel.slug);
  const facts = stop ? stopFacts(stop) : null;
  const fee = formatDeliveryFee(deliveryFeeForHotel(hotel.slug));
  const miles = formatMiles(metersFromShop(hotel.geo));
  const factLine = facts
    ? stop?.walkPlace
      ? `${facts.primary} · ${facts.secondary} · ${DELIVERY_MINIMUM_LABEL}`
      : `${facts.primary} · ${facts.secondary}`
    : `${fee} · ${miles} · ${DELIVERY_MINIMUM_LABEL}`;

  const walk = walkForHotelSlug(hotel.slug);

  /* iOS wants `sms:number&body=`, Android wants `sms:number?body=`. The
     `?&` form is the one both accept. */
  const sms = `sms:+17026137799?&body=${encodeURIComponent(
    `Delivery to ${where}. ${fee} fee, ${DELIVERY_MINIMUM_LABEL}. I'd like: `,
  )}`;

  return (
    <section className={d.chosen} id="chosen" aria-label={`Delivery to ${hotel.name}`}>
      <div className={d.chosenHead}>
        <span className={d.chosenLabel}>Delivering to</span>
        <h2 className={d.chosenName}>{where}</h2>
        <a className={d.change} href="/delivery">
          Change hotel
        </a>
      </div>
      <p className={d.chosenFacts}>{factLine}</p>

      {hotel.towers && !tower && (
        <div className={d.towers}>
          <p className={d.towerAsk}>Which tower?</p>
          <ul className={d.towerList}>
            {hotel.towers.map((t) => (
              <li key={t}>
                <a
                  className={d.tower}
                  href={`/delivery?hotel=${hotel.slug}&tower=${encodeURIComponent(t)}`}
                >
                  {t}
                </a>
              </li>
            ))}
            <li>
              <a className={d.tower} href={`/delivery?hotel=${hotel.slug}&tower=${encodeURIComponent("Not sure")}`}>
                Not sure
              </a>
            </li>
          </ul>
        </div>
      )}

      <p className={d.meet}>
        {hotel.meet
          ? hotel.meet
          : "Driver texts when close. Usually lobby or valet."}
      </p>

      <div className={d.actions}>
        <a className={s.cta} href={sms}>
          Text us the order
        </a>
        {walk ? (
          <a
            className={d.walkLink}
            href={mapsWalkingUrl(walk.place)}
            target="_blank"
            rel="noreferrer"
          >
            Walk from here · {walk.minutes} min
          </a>
        ) : (
          <a className={d.walkLink} href="/pickup">
            Pick-Up instead
          </a>
        )}
        <a className={d.callLink} href={PHONE_HREF}>
          or call {PHONE_DISPLAY}
        </a>
      </div>

      <p className={d.priceNote}>
        {fee} flat · no minimum. Tax extra. Nothing added at the door.
      </p>
    </section>
  );
}
