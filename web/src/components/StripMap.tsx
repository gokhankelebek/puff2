import s from "./StripMap.module.css";

/**
 * The locator on /pickup.
 *
 * This band used to be a labelled grey rectangle waiting on a map tile. A
 * real tile is the wrong thing to wait for: Google's "Grand Bazaar Shops" pin
 * is 85 m from the suite and lands outside the mall's own OSM footprint
 * (docs/LOCATION.md), which is the entire reason the address links here
 * instead of straight to a maps app. A tile would reproduce the error we
 * route around. The Directions button hands off the driving leg; what this
 * page owes the customer is the last hundred metres.
 *
 * Every fact drawn here is one the repo already establishes:
 *   - the mall sits east of the Boulevard  (hotels.ts marks Horseshoe side: "east")
 *   - Ole Red is suite 700 at the north-west end, the most visible thing from
 *     the Strip, and the whole walk stays inside the mall  (LOCATION.md)
 *   - the 600 row runs along the mall's southern edge, and we are 611-613
 *     between 610 and 614  (LOCATION.md, from the mall's own directory map)
 *   - second level  (the page copy beneath this)
 * Nothing is invented to fill the picture. No cross streets, because the repo
 * does not assert any.
 *
 * Schematic, and it says so. It is oriented — north is up — but it is not
 * survey-accurate, and a diagram that implied otherwise would be worse than
 * the grey box it replaces.
 *
 * aria-hidden: the prose directly beneath states all of this. Announcing it
 * twice serves nobody.
 */
export default function StripMap() {
  return (
    <svg
      className={s.map}
      viewBox="0 0 960 420"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="pinGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* --- The Boulevard, leaning the way the Strip actually runs -------- */}
      <polygon className={s.road} points="150,0 270,0 215,420 95,420" />
      <path className={s.roadLine} d="M210 0 L155 420" />
      <text
        className={`${s.label} ${s.roadLabel}`}
        x="176"
        y="250"
        transform="rotate(-84.6 176 250)"
      >
        S Las Vegas Blvd
      </text>

      {/* --- Grand Bazaar Shops ------------------------------------------- */}
      <rect className={s.mall} x="330" y="80" width="520" height="250" rx="14" />
      <text className={`${s.label} ${s.mallLabel}`} x="356" y="118">
        Grand Bazaar Shops
      </text>

      {/* The 600 row, along the southern edge. */}
      <rect className={s.row} x="352" y="258" width="476" height="50" rx="11" />
      <text className={`${s.label} ${s.minor}`} x="372" y="289">
        600s
      </text>

      {/* --- Ole Red: the landmark you can see from the street ------------- */}
      <circle className={s.landmark} cx="386" cy="168" r="9" />
      <text className={`${s.label} ${s.minor}`} x="418" y="175">
        Ole Red
      </text>

      {/* --- The walk ------------------------------------------------------ */}
      <path
        className={s.route}
        d="M252 152 L376 168 C470 186, 500 214, 528 252 L616 282"
      />
      <text className={`${s.label} ${s.minor}`} x="546" y="228">
        Escalator · Level 2
      </text>

      {/* --- Us ------------------------------------------------------------ */}
      <circle
        className={s.pinGlow}
        cx="640"
        cy="283"
        r="17"
        filter="url(#pinGlow)"
      />
      <circle className={s.pin} cx="640" cy="283" r="10.5" />
      <circle className={s.pinCore} cx="640" cy="283" r="3.5" />
      <text className={`${s.label} ${s.pinLabel}`} x="666" y="290">
        Puff · 611–613
      </text>

      {/* --- North -------------------------------------------------------- */}
      <g className={s.compass}>
        <path d="M898 48 L906 68 L898 63 L890 68 Z" />
        <text className={`${s.label} ${s.minor}`} x="898" y="90">
          N
        </text>
      </g>
    </svg>
  );
}
