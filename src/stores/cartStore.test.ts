import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cartStore';
import { makeProduct } from '../test/factories';

const shirt = makeProduct({ id: 'p-shirt', price: 250000, stock: 5 });
const scarf = makeProduct({ id: 'p-scarf', price: 100000, stock: 3 });

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds a product with clamped quantity', () => {
    const { addItem, totalItems } = useCartStore.getState();
    addItem(shirt, 2);
    addItem(scarf, 99); // stock is 3
    expect(totalItems()).toBe(5);
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('merges duplicate adds of the same variant instead of duplicating rows', () => {
    const { addItem } = useCartStore.getState();
    addItem(shirt, 1, 'M', 'Ink');
    addItem(shirt, 2, 'M', 'Ink');
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('treats different size or color as separate rows', () => {
    const { addItem } = useCartStore.getState();
    addItem(shirt, 1, 'M', 'Ink');
    addItem(shirt, 1, 'L', 'Ink');
    addItem(shirt, 1, 'M', 'Clay');
    expect(useCartStore.getState().items).toHaveLength(3);
  });

  it('updateQuantity clamps to stock and removes at zero', () => {
    const { addItem, updateQuantity, removeItem, totalItems } = useCartStore.getState();
    addItem(shirt, 2);
    updateQuantity('p-shirt', 99); // clamped to stock 5
    expect(useCartStore.getState().items[0].quantity).toBe(5);
    updateQuantity('p-shirt', 0); // zero removes the row
    expect(useCartStore.getState().items).toHaveLength(0);
    addItem(shirt, 1);
    removeItem('p-shirt');
    expect(totalItems()).toBe(0);
  });

  it('decreaseQuantity removes the row when it reaches zero', () => {
    const { addItem, decreaseQuantity } = useCartStore.getState();
    addItem(scarf, 1);
    decreaseQuantity('p-scarf');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('subtotal is price × quantity summed across rows', () => {
    const { addItem, updateQuantity, subtotal } = useCartStore.getState();
    addItem(shirt, 2); // 500000
    addItem(scarf, 1); // 100000
    updateQuantity('p-scarf', 3); // 300000
    expect(subtotal()).toBe(800000);
  });

  it('clearCart empties the bag', () => {
    const { addItem, clearCart, totalItems } = useCartStore.getState();
    addItem(shirt, 2);
    addItem(scarf, 1);
    clearCart();
    expect(totalItems()).toBe(0);
  });
});
