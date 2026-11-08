import type { NextConfig } from "next";
/* The old Ecwid storefront's URLs, 301'd to their nearest page here.
   Regenerate with `npx tsx scripts/build-ecwid-redirects.ts`; never hand-edit. */
import ecwidRedirects from "./src/lib/ecwid-redirects.generated.json";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/store/directions",
        destination: "/pickup",
        permanent: true,
      },
      // The Mirage closed in July 2024; its old delivery page was indexed.
      // Treasure Island is the next property along on the same kerb.
      {
        source: "/delivery/mirage",
        destination: "/delivery/treasure-island",
        permanent: true,
      },
      ...ecwidRedirects.map((r) => ({ ...r, permanent: true })),
      // Anything under the old /products/ the crawl did not see. Must stay
      // after the exact map above: redirects match first-listed-first.
      {
        source: "/products/:path*",
        destination: "/floor",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
