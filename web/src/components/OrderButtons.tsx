import s from "./OrderButtons.module.css";
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  deliveryTextBody,
  smsHref,
} from "@/lib/contact";

/**
 * The delivery call to action: TEXT first, CALL second.
 *
 * Orders reach the shop as a text or a phone call — there is no checkout and
 * the online shelf is a snapshot, so the shop confirms stock in that reply.
 * Plain links, no script: works with JavaScript off, and the GA4 listener in
 * GoogleAnalytics.tsx counts the taps (`data-hotel` rides along as a param).
 */
export default function OrderButtons({
  hotel,
  item,
  note = true,
  align = "start",
}: {
  /** Hotel display name, written into the text when the page knows it. */
  hotel?: string;
  /** Product name, for "do you have …" texts from a product page. */
  item?: string;
  /** The one-line "we confirm stock first" promise under the buttons. */
  note?: boolean;
  align?: "start" | "center";
}) {
  return (
    <div className={s.wrap} data-align={align}>
      <div className={s.row}>
        <a
          className={s.text}
          href={smsHref(deliveryTextBody({ hotel, item }))}
          data-hotel={hotel}
        >
          Text your order
        </a>
        <a className={s.call} href={PHONE_HREF} data-hotel={hotel}>
          Call {PHONE_DISPLAY}
        </a>
      </div>
      {note ? (
        <p className={s.note}>
          Tell us {hotel ? "what you want" : "your hotel and what you want"}.
          We confirm it&rsquo;s on the shelf and the total before a runner
          leaves.
        </p>
      ) : null}
    </div>
  );
}
