import type { Order } from '../types';

type OrderStore = {
  currentOrder: Order | null;
};

let _store: OrderStore = { currentOrder: null };

export function setCurrentOrder(order: Order) {
  _store = { currentOrder: order };
}

export function getCurrentOrder(): Order | null {
  return _store.currentOrder;
}
