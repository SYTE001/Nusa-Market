import { describe, expect, it } from 'vitest';
import {
  clamp,
  discountPercent,
  formatRupiah,
  imageSource,
  shippingCostFor,
  thumbSource,
  FREE_SHIPPING_THRESHOLD,
} from './index';

describe('formatRupiah', () => {
  it('formats IDR with no decimals and a Rp prefix', () => {
    expect(formatRupiah(385000)).toBe('Rp 385.000');
  });

  it('formats zero without decimals', () => {
    expect(formatRupiah(0)).toBe('Rp 0');
  });
});

describe('shippingCostFor', () => {
  it('charges the method rate below the free-shipping threshold', () => {
    expect(shippingCostFor('regular', 100000)).toBe(25000);
    expect(shippingCostFor('express', 499999)).toBe(55000);
  });

  it('charges nothing at or above the threshold', () => {
    expect(shippingCostFor('express', FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(shippingCostFor('regular', 1250000)).toBe(0);
  });

  it('falls back to the regular rate for an unknown method', () => {
    expect(shippingCostFor('teleport' as never, 100000)).toBe(25000);
  });
});

describe('discountPercent', () => {
  it('rounds the percentage off', () => {
    expect(discountPercent(250000, 500000)).toBe(50);
    expect(discountPercent(385000, 429000)).toBe(10);
  });
});

describe('clamp', () => {
  it('keeps values inside the bounds', () => {
    expect(clamp(7, 1, 5)).toBe(5);
    expect(clamp(0, 1, 5)).toBe(1);
    expect(clamp(3, 1, 5)).toBe(3);
  });
});

describe('image variants', () => {
  it('thumbSource derives the -480 mobile variant of a local webp', () => {
    expect(thumbSource('/images/products/p/01.webp')).toBe('/images/products/p/01-480.webp');
  });

  it('thumbSource passes through paths without a numbered webp', () => {
    expect(thumbSource('https://cdn.example.com/hero.jpg')).toBe('https://cdn.example.com/hero.jpg');
  });

  it('imageSource rewrites width params and caps at 900', () => {
    expect(imageSource('https://images.example.com/x?w=200', 100)).toContain('w=200');
    expect(imageSource('https://images.example.com/x?w=100', 800)).toContain('w=900');
  });
});
