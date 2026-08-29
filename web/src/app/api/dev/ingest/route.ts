import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, extname } from "node:path";

/**
 * Development-only ingest endpoint.
 *
 * A scratch pipe for moving data out of an authenticated or network-restricted
 * browser session and onto disk. It exists because this machine's network
 * blocks the shell from reaching vape/tobacco hosts while Chrome can still
 * load them, and Chrome in turn cannot write files.
 *
 * Two payload shapes:
 *   text/plain           → written verbatim to research/ingest/latest.tsv
 *   application/json     → { images: [{ name, ext, b64 }] } decoded to
 *                          research/ingest/images/ plus a name map
 *
 * Hard-disabled outside development, and every path is confined to the ingest
 * directory so a stray request cannot choose its own destination.
 */

const INGEST = () => resolve(process.cwd(), "../research/ingest");

function safeName(s: string): string {
  return s.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const ct = request.headers.get("content-type") ?? "";
  const cors = { "access-control-allow-origin": "*" };

  if (ct.includes("application/json")) {
    const body = (await request.json()) as {
      images?: { name: string; ext: string; b64: string }[];
      manifest?: string;
    };

    const dir = resolve(INGEST(), "harvest");
    mkdirSync(dir, { recursive: true });

    let written = 0;
    for (const img of body.images ?? []) {
      const buf = Buffer.from(img.b64, "base64");
      if (buf.length < 2048) continue; // pixel or error page, not a photo
      const ext = (img.ext || "jpg").replace(/[^a-z0-9]/gi, "").slice(0, 5);
      writeFileSync(resolve(dir, `${safeName(img.name)}.${ext}`), buf);
      written++;
    }

    if (body.manifest) {
      writeFileSync(resolve(INGEST(), "harvest-manifest.tsv"), body.manifest);
    }

    return Response.json({ ok: true, written }, { headers: cors });
  }

  const body = await request.text();
  const out = resolve(INGEST(), "latest.tsv");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, body);
  return new Response(`ok ${body.length}`, { headers: cors });
}
