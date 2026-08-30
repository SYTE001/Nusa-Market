import type { ShippingMethod } from '../types';

/**
 * Format a price in Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate discount percentage
 */
export function discountPercent(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Generate a dummy order ID based on date
 */
export function generateOrderId(): string {
  const now = new Date();
  const ymd =
    `${now.getFullYear()}` +
    `${String(now.getMonth() + 1).padStart(2, '0')}` +
    `${String(now.getDate()).padStart(2, '0')}`;
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `#NM-${ymd}-${suffix}`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Shipping cost by method (IDR)
 */
export const SHIPPING_COSTS: Record<ShippingMethod, number> = {
  regular: 25000,
  express: 55000,
};

/** Subtotal (IDR) at which domestic shipping is complimentary. */
export const FREE_SHIPPING_THRESHOLD = 500000;

/**
 * Single source of truth for what shipping actually costs. Every surface that
 * promises complimentary shipping above the threshold - announcement bar, cart
 * drawer progress, cart banner - resolves through here, so the promise and the
 * charged total can never drift apart.
 */
export function shippingCostFor(method: ShippingMethod, subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_COSTS[method] ?? SHIPPING_COSTS.regular;
}

/**
 * The catalog stores a gallery-sized 900px rendition of every image and
 * Unsplash serves whatever width the URL asks for, so a 150px thumbnail asks
 * for a thumbnail and a 300px card asks for a card. `width` is the CSS width
 * the image occupies; the request doubles it for high-density screens and never
 * exceeds the stored rendition. URLs without a `w=` parameter are returned
 * untouched, so local assets pass through unharmed.
 */
export function imageSource(src: string, width: number): string {
  return src.replace(/([?&]w=)\d+/, `$1${Math.min(900, width * 2)}`);
}
