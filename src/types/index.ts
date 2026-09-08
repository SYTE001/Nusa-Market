export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  /** Origin: where this piece is made — powers the region filter and Origin tab. */
  region: Region;
  /** Craft & provenance: material, process, and the artisan story behind it. */
  craft: {
    /** One line of material truth — fabric weight, weave, hardware. */
    material: string;
    /** How it is actually made — process, run size, technique. */
    process: string;
    /** Named atelier or workshop behind the piece. */
    atelier: string;
    /** Provenance note: origin context used by the Craft Story tab. */
    story?: string;
  };
};

export type Region =
  | 'Sumatra'
  | 'Java'
  | 'Bali'
  | 'Nusa Tenggara'
  | 'Kalimantan'
  | 'Sulawesi';

export const REGIONS: Region[] = [
  'Sumatra',
  'Java',
  'Bali',
  'Nusa Tenggara',
  'Kalimantan',
  'Sulawesi',
];

export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};

export type WishlistItem = {
  product: Product;
};

export type ShippingMethod = 'regular' | 'express';
export type PaymentMethod = 'bank-transfer' | 'e-wallet' | 'cod';

export type CheckoutFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
};

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
};

export type FilterState = {
  category: string;
  priceRange: string;
  rating: string;
  sort: string;
  search: string;
  region: string;
};
