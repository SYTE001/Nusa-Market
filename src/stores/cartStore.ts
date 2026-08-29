import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';
import { clamp } from '../utils';

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, qty?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  increaseQuantity: (productId: string, size?: string, color?: string) => void;
  decreaseQuantity: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, qty: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

function itemKey(productId: string, size?: string, color?: string) {
  return `${productId}|${size ?? ''}|${color ?? ''}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(product, qty = 1, size, color) {
        set((state) => {
          const key = itemKey(product.id, size, color);
          const existing = state.items.find(
            (i) => itemKey(i.product.id, i.selectedSize, i.selectedColor) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.product.id, i.selectedSize, i.selectedColor) === key
                  ? { ...i, quantity: clamp(i.quantity + qty, 1, i.product.stock) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { product, quantity: clamp(qty, 1, product.stock), selectedSize: size, selectedColor: color },
            ],
          };
        });
      },

      removeItem(productId, size, color) {
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.product.id, i.selectedSize, i.selectedColor) !== itemKey(productId, size, color)
          ),
        }));
      },

      increaseQuantity(productId, size, color) {
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.product.id, i.selectedSize, i.selectedColor) === itemKey(productId, size, color)
              ? { ...i, quantity: clamp(i.quantity + 1, 1, i.product.stock) }
              : i
          ),
        }));
      },

      decreaseQuantity(productId, size, color) {
        const key = itemKey(productId, size, color);
        set((state) => {
          const item = state.items.find(
            (i) => itemKey(i.product.id, i.selectedSize, i.selectedColor) === key
          );
          if (item && item.quantity <= 1) {
            return { items: state.items.filter((i) => itemKey(i.product.id, i.selectedSize, i.selectedColor) !== key) };
          }
          return {
            items: state.items.map((i) =>
              itemKey(i.product.id, i.selectedSize, i.selectedColor) === key
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          };
        });
      },

      updateQuantity(productId, qty, size, color) {
        const key = itemKey(productId, size, color);
        if (qty <= 0) {
          set((state) => ({
            items: state.items.filter((i) => itemKey(i.product.id, i.selectedSize, i.selectedColor) !== key),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.product.id, i.selectedSize, i.selectedColor) === key
              ? { ...i, quantity: clamp(qty, 1, i.product.stock) }
              : i
          ),
        }));
      },

      clearCart() {
        set({ items: [] });
      },

      totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      subtotal() {
        return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },
    }),
    { name: 'nusa-cart' }
  )
);
