import { NextResponse } from "next/server";
import { AGE_COOKIE, AGE_MAX_AGE, signAffirmation } from "@/lib/age";

/**
 * Age affirmation, as a plain form POST.
 *
 * No JSON, no fetch, no client JS. The banner's button is a real submit
 * button inside a real <form>, so the whole flow works with scripting
 * disabled — which is the floor this site is held to.
 *
 * We 303 back to where the user was so the browser turns the POST into a GET
 * and the back button stays sane.
 */
export async function POST(request: Request) {
  const referer = request.headers.get("referer");
  let destination = "/";

  if (referer) {
    try {
      const url = new URL(referer);
      // Only ever redirect within our own origin.
      if (url.origin === new URL(request.url).origin) {
        destination = url.pathname + url.search;
      }
    } catch {
      /* fall through to "/" */
    }
  }

  const response = NextResponse.redirect(new URL(destination, request.url), 303);

  response.cookies.set({
    name: AGE_COOKIE,
    value: await signAffirmation(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AGE_MAX_AGE,
  });

  return response;
}
