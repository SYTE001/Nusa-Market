import { products } from '../data/products';
import type { Product } from '../types';

/**
 * Case-insensitive partial match across product name, brand and category.
 * Single source of truth for search matching (used by the search modal,
 * the shop catalog filters and the service layer).
 *
 * Every word in the query has to appear, but the order does not matter: a
 * shopper typing "canvas tote" still finds the Heavy Canvas Market Tote, and
 * "lokal hoodie" narrows to that brand's hoodies.
 */
export function matchesSearchQuery(product: Product, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

/** Filter any product list by a search query. */
export function filterBySearch(list: Product[], query: string): Product[] {
  const q = query.trim();
  if (!q) return [...list];
  return list.filter((p) => matchesSearchQuery(p, q));
}

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
  return filterBySearch(products, query);
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
