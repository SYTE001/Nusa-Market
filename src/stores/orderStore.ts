import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order } from '../types';

type OrderStore = {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order) => void;
  clearCurrentOrder: () => void;
};

/**
 * Holds the most recently placed order so the success page can render its
 * receipt. Persisted to sessionStorage rather than localStorage: a refresh or a
 * back-navigation keeps the receipt, but it does not survive the tab closing —
 * which matches how a real confirmation page behaves without a backend.
 */
export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      currentOrder: null,
      setCurrentOrder: (order) => set({ currentOrder: order }),
      clearCurrentOrder: () => set({ currentOrder: null }),
    }),
    {
      name: 'nusa-order',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
