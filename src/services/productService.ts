import { products } from '../data/products';
import type { Product } from '../types';

// Simulate async API call
function delay(ms = 80) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

export async function getProducts(): Promise<Product[]> {
  await delay();
  return [...products];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay();
  const q = query.toLowerCase().trim();
  if (!q) return [...products];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await delay();
  return products.filter((p) => p.featured);
}

export async function getNewArrivals(): Promise<Product[]> {
  await delay();
  return products.filter((p) => p.isNew);
}

export async function getBestSellers(): Promise<Product[]> {
  await delay();
  return products.filter((p) => p.isBestSeller);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  await delay();
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
