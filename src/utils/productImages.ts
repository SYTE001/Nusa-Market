/**
 * Central resolver for local product photography.
 *
 * Images live at:
 *   public/images/products/<slug>/01.webp
 *   public/images/products/<slug>/02.webp
 *   ...
 *
 * To replace a product's photos:
 *   1. Prepare your images as 01.webp, 02.webp, 03.webp …
 *   2. Drop them into  public/images/products/<product-slug>/
 *   3. Refresh the browser — no TypeScript changes needed.
 *
 * `count` defaults to 3 (primary + two gallery shots). Raise it to add more
 * gallery frames without touching product data:
 *   getProductImages('lokal-classic-tee', 5)
 *
 * Missing files resolve to a 404 in the browser, which the existing `onError`
 * handlers on every image surface catch and convert to the brand monogram /
 * neutral fallback tile — no broken-image icons appear.
 */
export function getProductImages(slug: string, count = 3): string[] {
  const base = `/images/products/${slug}`;
  return Array.from(
    { length: count },
    (_, i) => `${base}/${String(i + 1).padStart(2, '0')}.webp`,
  );
}
