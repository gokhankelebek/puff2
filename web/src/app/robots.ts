import type { MetadataRoute } from "next";
import { SITE_ORIGIN, SITE_INDEXABLE } from "@/lib/shop";

/**
 * Crawl rules.
 *
 * While the site is being built (SITE_INDEXABLE off) the whole thing is
 * disallowed, belt-and-suspenders with the root noindex — nothing gets indexed
 * under the preview domain and then has to be migrated to puffvegas.us. At
 * launch, NEXT_PUBLIC_SITE_INDEXABLE=1 flips this to the real rules below.
 *
 * The allow/disallow set is deliberately narrow, per the SEO review:
 *  - /search is NOT disallowed. It powers the WebSite SearchAction (sitelinks
 *    search box); disallowing it would get the SearchAction ignored.
 *  - Faceted params (?flavor=, ?nic=) are NOT robots-blocked. A blocked URL's
 *    rel=canonical is never read, which STRANDS link signals instead of
 *    consolidating them — canonicalization is the right tool there, not robots.
 *  - No `host` directive: Google ignores it (Yandex-only), and the canonical
 *    tag already names the preferred host.
 * Only genuinely non-indexable surfaces are disallowed: the affirm endpoint,
 * the age gate, and the transactional delivery order/tracking pages.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/age", "/delivery/order", "/delivery/track"],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
