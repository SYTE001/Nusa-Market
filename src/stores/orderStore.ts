import { create } from 'zustand';
import type { Order } from '../types';

type OrderStore = {
  order: Order | null;
  setOrder: (order: Order) => void;
  clearOrder: () => void;
};

/**
 * The completed order lives in sessionStorage: a receipt survives a refresh
 * in the same tab but never leaks into a new one.
 */
export const useOrderStore = create<OrderStore>()(
  (set) => ({
    order: null,
    setOrder: (order) => {
      set({ order });
      try {
        sessionStorage.setItem('nusa-order', JSON.stringify(order));
      } catch {
        /* storage unavailable — the session simply loses the receipt */
      }
    },
    clearOrder: () => {
      set({ order: null });
      try {
        sessionStorage.removeItem('nusa-order');
      } catch {
        /* ignore */
      }
    },
  })
);

/** Rehydrate on first import so a refresh restores the receipt. */
try {
  const raw = sessionStorage.getItem('nusa-order');
  if (raw) {
    const parsed = JSON.parse(raw) as Order;
    useOrderStore.setState({ order: parsed });
  }
} catch {
  /* ignore */
}
