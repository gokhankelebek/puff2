import s from "./BoulevardSpine.module.css";
import {
  STRIP_SPINE,
  hotelBySlug,
  deliveryFeeForHotel,
  formatDeliveryFee,
} from "@/lib/hotels";

/**
 * Las Vegas Boulevard as a transit diagram: north at the top, west names
 * left of the rail, east names right. Every hotel is a GET link. The shop
 * node is a walk, not a delivery.
 *
 * Native page scroll — no nested map, no Leaflet.
 */
export default function BoulevardSpine({ selected }: { selected?: string }) {
  return (
    <section className={s.wrap} aria-label="Las Vegas Boulevard, north to south">
      <div className={s.caption} aria-hidden="true">
        <span>West</span>
        <span className={s.captionRail} />
        <span>East</span>
      </div>
      <ol className={s.list}>
        {STRIP_SPINE.map((stop) => {
          if (stop.kind === "pole") {
            return (
              <li key={stop.label} className={s.pole}>
                {stop.label}
              </li>
            );
          }

          if (stop.kind === "shop") {
            return (
              <li
                key="shop"
                className={s.row}
                data-center={stop.center ? "true" : undefined}
                data-here="true"
              >
                <span className={s.cellWest} />
                <span className={s.rail}>
                  <span className={s.dot} />
                </span>
                <span className={s.cellEast}>
                  <a className={`${s.stop} ${s.here}`} href="/pickup">
                    <span className={s.stopName}>Us · Grand Bazaar</span>
                    <span className={s.stopFee}>Walk in</span>
                  </a>
                </span>
              </li>
            );
          }

          const hotel = hotelBySlug(stop.slug);
          if (!hotel) return null;

          const current = selected === hotel.slug;
          const fee = formatDeliveryFee(deliveryFeeForHotel(hotel.slug));
          const stopEl = (
            <a
              className={s.stop}
              href={`/delivery?hotel=${hotel.slug}#chosen`}
              aria-current={current ? "true" : undefined}
            >
              <span className={s.stopName}>{hotel.name}</span>
              <span className={s.stopFee}>{fee}</span>
            </a>
          );

          return (
            <li
              key={hotel.slug}
              className={s.row}
              data-center={stop.center ? "true" : undefined}
              data-current={current ? "true" : undefined}
            >
              <span className={s.cellWest}>{stop.side === "west" ? stopEl : null}</span>
              <span className={s.rail}>
                <span className={s.dot} />
              </span>
              <span className={s.cellEast}>{stop.side === "east" ? stopEl : null}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
