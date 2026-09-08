/**
 * Central resolver for local product photography.
 *
 * Images live at:
 *   public/images/products/<slug>/01.webp …
 *   public/images/artisans/<id>.webp
 *   public/images/editorial/<name>.webp
 *
 * Missing files resolve to a 404 in the browser, which the `onError`
 * handlers on every image surface catch and convert to a neutral fallback
 * tile — no broken-image icons appear.
 */
export function getProductImages(slug: string, count = 3): string[] {
  const base = `/images/products/${slug}`;
  return Array.from(
    { length: count },
    (_, i) => `${base}/${String(i + 1).padStart(2, '0')}.webp`,
  );
}
