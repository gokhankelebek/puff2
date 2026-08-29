# Puff Vegas — agent context

Read [START-HERE.md](START-HERE.md) first; it indexes everything.

Working in `web/`? Also read `web/AGENTS.md` — this is **Next.js 16.3.1** with
breaking changes from older App Router versions, and framework code should be
checked against `web/node_modules/next/dist/docs/` rather than memory.

## Non-negotiables

1. **Never change anything in Lightspeed (the POS).** Catalogue problems get
   fixed in `web/scripts/import-lightspeed.ts`, never upstream.
2. **We own slugs and images.** The shop is leaving Lightspeed. Nothing may key
   on a vendor ID.
3. **Vendor image rights are settled.** Permission granted — don't re-raise it.
4. **Progressive enhancement is a hard rule**, not a preference. Age gate, facets,
   search and the hotel picker all work with scripting off. Keep it that way.
5. **CSS Modules, not Tailwind.** Tokens in `web/src/app/globals.css`; never a raw
   colour in a component.
6. **Regulatory classification fails closed.** `unknown` is not publishable.
   Don't "fix" that by widening a rule without a decision behind it.
7. **Don't remove a compliance component** without reading
   [docs/COMPLIANCE.md](docs/COMPLIANCE.md) — several exist because a specific
   requirement was being missed.

## Verify, don't assume

Never edit the `*.generated.json` files — fix the importer and re-run
(see [docs/DATA-PIPELINE.md](docs/DATA-PIPELINE.md)).

`npx tsc --noEmit` in `web/` before calling anything done.
