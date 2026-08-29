import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DRAFT_COOKIE,
  DRAFT_MAX_AGE,
  addLine,
  parseDraft,
  removeLine,
  serializeDraft,
  stepLine,
  type Draft,
  type MeetPoint,
} from "@/lib/draft";

/**
 * Every mutation of the delivery draft, as a plain form POST.
 *
 * One route rather than several because the actions share all their plumbing
 * and differ only in one switch. A 303 sends the browser back with a GET, so
 * the back button stays sane and a refresh never re-submits.
 */
function safeNext(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw : "";
  if (!value.startsWith("/") || value.startsWith("//")) return "/delivery/order";
  return value;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const slug = String(form.get("slug") ?? "");
  const next = safeNext(form.get("next"));

  const jar = await cookies();
  let draft: Draft = parseDraft(jar.get(DRAFT_COOKIE)?.value);

  switch (action) {
    case "add":
      if (slug) draft = addLine(draft, slug);
      break;
    case "inc":
      if (slug) draft = stepLine(draft, slug, 1);
      break;
    case "dec":
      // Stepping below 1 removes the line: the minus button is also the bin.
      if (slug) draft = stepLine(draft, slug, -1);
      break;
    case "remove":
      if (slug) draft = removeLine(draft, slug);
      break;
    case "where": {
      const meet = String(form.get("meet") ?? "");
      draft = {
        ...draft,
        hotel: String(form.get("hotel") ?? "") || undefined,
        meet:
          meet === "valet" || meet === "rideshare"
            ? (meet as MeetPoint)
            : draft.meet,
      };
      break;
    }
    case "clear":
      draft = { lines: [] };
      break;
    default:
      // Unknown action: leave the draft alone rather than guessing.
      break;
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set({
    name: DRAFT_COOKIE,
    value: serializeDraft(draft),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DRAFT_MAX_AGE,
  });
  return response;
}
