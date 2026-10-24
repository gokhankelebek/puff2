import Script from "next/script";
import { SITE_INDEXABLE } from "@/lib/shop";

/* GA4 for puffvegas.us (property "Puff Vegas", stream G-NZK3T04QH4).

   The old site sent page views to this property; the move to this build on
   2026-09-29 dropped the tag and the property went silent the next day.
   Search, Maps and AI answers are the only channels this business has (see
   BRIEF.md), so knowing which pages bring visits and calls matters.

   Gated on SITE_INDEXABLE so preview deployments never report into the
   production property. Loaded afterInteractive: nothing on the page waits on
   it, and with scripting off the site works exactly as before.

   One delegated listener counts the two actions that turn a visit into a
   customer: tapping the phone number and opening directions. Listening on the
   document covers links React renders later; it never prevents navigation. */
const GA_ID = "G-NZK3T04QH4";

const EVENTS = `
document.addEventListener('click', function (e) {
  if (!(e.target instanceof Element) || typeof window.gtag !== 'function') return;
  var a = e.target.closest('a[href]');
  if (!a) return;
  var url = new URL(a.href, location.href);
  if (url.protocol === 'tel:') {
    gtag('event', 'click_to_call', { link_url: a.href });
  } else if ((url.hostname === 'www.google.com' || url.hostname === 'google.com') &&
             url.pathname.indexOf('/maps') === 0) {
    gtag('event', 'get_directions', { link_url: a.href });
  }
}, { capture: true, passive: true });
`;

export default function GoogleAnalytics() {
  if (!SITE_INDEXABLE) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');
${EVENTS}`}
      </Script>
    </>
  );
}
