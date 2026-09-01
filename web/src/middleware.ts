import { NextResponse, type NextRequest } from "next/server";
import { AGE_COOKIE, AGE_HEADER, PATH_HEADER } from "@/lib/age-shared";
import { verifyAffirmation } from "@/lib/age";

/**
 * The bit that makes the age gate shippable.
 *
 * Varying HTML by cookie normally destroys edge caching — you get one cached
 * variant per user, which would be fatal for a business whose only acquisition
 * channel is organic search.
 *
 * So: verify the cookie, DO NOT redirect, and collapse the result to a single
 * bit on a request header. The response then varies on that one normalised
 * value, which yields exactly two cached variants per URL instead of one per
 * visitor. Both serve from edge cache and LCP is untouched.
 *
 * Verification happens HERE rather than in the page on purpose. The bit is the
 * cache key; if the page decided validity independently, a valid and a forged
 * cookie would share a cache entry while expecting different HTML.
 */
export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get(AGE_COOKIE)?.value;
  const affirmed = await verifyAffirmation(cookie);

  const headers = new Headers(request.headers);
  headers.set(AGE_HEADER, affirmed ? "1" : "0");
  headers.set(PATH_HEADER, request.nextUrl.pathname);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    // Everything except static assets and the affirm endpoint itself.
    "/((?!_next/static|_next/image|favicon.ico|api/age|sitemap.xml|robots.txt).*)",
  ],
};
