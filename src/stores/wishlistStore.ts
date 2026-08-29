import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

type WishlistStore = {
  ids: string[];
  toggleWishlist: (product: Product) => void;
  addWishlist: (product: Product) => void;
  removeWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],

      toggleWishlist(product) {
        set((state) =>
          state.ids.includes(product.id)
            ? { ids: state.ids.filter((id) => id !== product.id) }
            : { ids: [...state.ids, product.id] }
        );
      },

      addWishlist(product) {
        set((state) =>
          state.ids.includes(product.id)
            ? state
            : { ids: [...state.ids, product.id] }
        );
      },

      removeWishlist(productId) {
        set((state) => ({ ids: state.ids.filter((id) => id !== productId) }));
      },

      isWishlisted(productId) {
        return get().ids.includes(productId);
      },
    }),
    { name: 'nusa-wishlist' }
  )
);
