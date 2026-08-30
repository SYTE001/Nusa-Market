import type { Product } from '../types';
import { getProductImages } from '../utils/productImages';

export const products: Product[] = [
  // T-Shirts
  {
    id: '1',
    slug: 'lokal-classic-tee',
    brand: 'LOKAL',
    name: 'Classic Heavyweight Tee',
    category: 'T-Shirts',
    price: 149000,
    originalPrice: 199000,
    rating: 4.8,
    reviewCount: 128,
    images: getProductImages('lokal-classic-tee'),
    description:
      'Our bestselling everyday tee crafted from 230gsm ring-spun combed cotton. Pre-shrunk with a relaxed boxy cut, ribbed collar, and blind-stitched hem.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Obsidian Black', 'Chalk White', 'Raw Stone'],
    stock: 45,
    featured: true,
    isNew: true,
    isBestSeller: true,
  },
];

export const categories = [
  'All',
  'T-Shirts',
] as const;

export type Category = (typeof categories)[number];
