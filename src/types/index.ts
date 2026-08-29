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
};

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
};
