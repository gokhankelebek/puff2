import { NextResponse } from "next/server";
import {
  AGE_COOKIE,
  AGE_MAX_AGE,
  LEGAL_AGE,
  ageFromDob,
  signAffirmation,
} from "@/lib/age";

/**
 * Age verification, as a plain form POST.
 *
 * No JSON, no fetch, no client JS: the gate is a real <form> and this is its
 * action, so the whole flow works with scripting disabled. That is the floor
 * this site is held to.
 *
 * The date of birth is checked HERE rather than in the browser. A client-side
 * check is worth nothing for the purpose the gate serves — the shop needs to
 * be able to say it asked and evaluated the answer.
 *
 * Three outcomes, and they are deliberately different:
 *   - 21+          set the cookie, 303 on to wherever they were going
 *   - impossible   back to the gate with an error; it is a correction
 *   - under 21     a dead end, with no retry loop to walk back through
 */
function backTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

/** Only ever redirect within our own origin, and never back to the gate. */
function safeNext(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw : "";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith("/age")) return "/";
  return value;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNext(form.get("next"));

  const month = Number(form.get("month"));
  const day = Number(form.get("day"));
  const year = Number(form.get("year"));

  const age = ageFromDob(month, day, year);

  if (age === null) {
    return backTo(
      request,
      `/age?error=invalid&next=${encodeURIComponent(next)}`,
    );
  }

  if (age < LEGAL_AGE) {
    // No `next`: there is nowhere to go on from here, and carrying the
    // destination would invite another attempt with a different year.
    return backTo(request, "/age?denied=1");
  }

  const response = backTo(request, next);
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
