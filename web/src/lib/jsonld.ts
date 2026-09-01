/**
 * Safe serializer for JSON-LD embedded in a <script type="application/ld+json">.
 *
 * A bare JSON.stringify is unsafe the moment any catalog-derived string (a
 * product title, a brand, a description) reaches the graph: a literal
 * `</script>` in the data closes the tag early, and `<`, `>`, `&` can break
 * parsing or open an injection. The Unicode line/paragraph separators
 * (U+2028/U+2029) are valid in JSON but not in a JS string context and trip
 * some parsers. Escaping all five as \\uXXXX keeps the payload valid and inert
 * while remaining valid JSON-LD.
 *
 * Returns the shape dangerouslySetInnerHTML expects, so call sites read as
 * `<script {...jsonLd(node)} />`.
 */
export function jsonLd(data: unknown): { __html: string } {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return { __html: json };
}

/**
 * BreadcrumbList from a trail of {name, path}. Paths are made absolute against
 * `origin` (SITE_ORIGIN) so they match the page's own canonical. Names should be
 * the human labels (DEPARTMENT_LABELS), not raw slugs.
 */
export function breadcrumbLd(
  origin: string,
  trail: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${origin}${t.path}`,
    })),
  };
}
