import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

type WishlistStore = {
  ids: string[];
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      items: [],

      toggleWishlist(product) {
        set((state) => {
          const exists = state.ids.includes(product.id);
          return {
            ids: exists ? state.ids.filter((id) => id !== product.id) : [...state.ids, product.id],
            items: exists
              ? state.items.filter((i) => i.id !== product.id)
              : [...state.items, product],
          };
        });
      },

      isWishlisted(productId) {
        return get().ids.includes(productId);
      },

      clearWishlist() {
        set({ ids: [], items: [] });
      },
    }),
    { name: 'nusa-wishlist' }
  )
);
