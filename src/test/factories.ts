import type { Product } from '../types';

/** Minimal-but-complete Product for tests — every required field of the type. */
export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'test-product-1',
    slug: 'test-product',
    brand: 'NUSANTARA',
    name: 'Tenun Throw Blanket',
    category: 'Home',
    price: 385000,
    rating: 4.7,
    reviewCount: 32,
    images: ['/images/products/test-product/01.webp', '/images/products/test-product/02.webp'],
    description: 'Handwoven throw from a Sumba atelier.',
    stock: 12,
    region: 'Nusa Tenggara',
    craft: {
      material: 'Handspun cotton',
      process: 'Backstrap loom, natural indigo',
      atelier: 'Atelier Laila, Sumba',
    },
    ...overrides,
  };
}
