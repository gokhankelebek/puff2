/**
 * An inline script that runs while the browser parses the HTML — before the
 * first paint, and long before React is involved.
 *
 * The `type` switch is the documented way to keep React quiet: it warns when a
 * component renders a `<script>`, because a script inserted through a DOM
 * update never executes. Serving `text/plain` on the client makes that
 * explicit and true, while the server still emits a real executable tag.
 * `suppressHydrationWarning` covers the deliberate mismatch between the two.
 *
 * See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
