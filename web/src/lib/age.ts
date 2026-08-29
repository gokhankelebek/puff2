import { AGE_MAX_AGE } from "./age-shared";

export { AGE_COOKIE, AGE_HEADER, AGE_MAX_AGE } from "./age-shared";

/**
 * Affirmation cookie signing.
 *
 * Deliberately built on Web Crypto rather than `node:crypto` so the SAME
 * implementation runs in middleware (Edge runtime) and in route handlers
 * (Node). That matters for correctness, not just tidiness: the signature has
 * to be checked in middleware, because middleware is what collapses the cookie
 * to the single bit the CDN caches on. If the page verified instead, two
 * visitors — one with a valid cookie, one with a forged one — would normalise
 * to the same cache key while expecting different HTML.
 */

const enc = new TextEncoder();

function secret(): string {
  return process.env.AGE_COOKIE_SECRET ?? "dev-only-insecure-secret";
}

function b64url(bytes: ArrayBuffer): string {
  const b = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(b).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

/** Value is `<issuedAtMs>.<hmac>` — an affirmation record we can audit. */
export async function signAffirmation(
  nowMs: number = Date.now(),
): Promise<string> {
  const payload = String(nowMs);
  const mac = await crypto.subtle.sign("HMAC", await key(), enc.encode(payload));
  return `${payload}.${b64url(mac)}`;
}

export async function verifyAffirmation(
  value: string | undefined,
): Promise<boolean> {
  if (!value) return false;

  const idx = value.lastIndexOf(".");
  if (idx <= 0) return false;

  const payload = value.slice(0, idx);
  const given = value.slice(idx + 1);

  const issued = Number(payload);
  if (!Number.isFinite(issued)) return false;
  if (Date.now() - issued > AGE_MAX_AGE * 1000) return false;
  // Reject cookies stamped in the future — a clock-skew / tampering signal.
  if (issued - Date.now() > 60_000) return false;

  const mac = await crypto.subtle.sign("HMAC", await key(), enc.encode(payload));
  const expected = b64url(mac);

  // Constant-time compare. Length is public, so an early length check is fine.
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < given.length; i++) {
    diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
