import { useNavigate } from 'react-router-dom';
import { Truck, Check } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { CartItemRow } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatRupiah, FREE_SHIPPING_THRESHOLD } from '../utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function CartPage() {
  useDocumentTitle('Shopping Bag — NusaMarket');

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);

  if (items.length === 0) {
    return (
      <div className="pt-10">
        <EmptyState
          type="cart"
          action={{ label: 'Explore the Collection', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-baseline justify-between border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            Checkout Preparation
          </span>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            Shopping Bag ({items.length})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="cursor-pointer text-xs font-medium text-stone-500 transition-colors duration-150 hover:text-red-600"
        >
          Clear bag
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Items */}
        <div className="flex flex-col lg:col-span-8">
          {/* Free shipping banner */}
          <div className="mb-6 flex items-center gap-2.5 border border-stone-200 bg-canvas-muted px-4 py-3 text-xs">
            <Truck size={15} className="shrink-0 text-ink" aria-hidden="true" />
            {remaining <= 0 ? (
              <span className="flex items-center gap-1 font-semibold text-jade-700">
                <Check size={13} aria-hidden="true" /> this order ships with complimentary domestic delivery
              </span>
            ) : (
              <span className="text-stone-600">
                <strong className="text-ink">{formatRupiah(remaining)}</strong> more to unlock Free Domestic Shipping.
              </span>
            )}
          </div>

          {/* Item rows */}
          <div className="flex flex-col divide-y divide-stone-100 border-y border-stone-200/80">
            {items.map((item, i) => (
              <CartItemRow
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${i}`}
                item={item}
              />
            ))}
          </div>
        </div>

        {/* Summary rail */}
        <div className="lg:col-span-4">
          <div className="sticky top-[calc(var(--nm-header-h)+1.5rem)] flex flex-col gap-4 border border-stone-200 bg-white p-6 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              Order Breakdown
            </h2>
            <CartSummary subtotal={subtotal} />
            <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
            <Button
              variant="ghost"
              fullWidth
              size="sm"
              onClick={() => {
                openCartDrawer();
              }}
              className="text-[11px] tracking-[0.14em]"
            >
              Keep Browsing
            </Button>
            <p className="border-t border-stone-100 pt-3 text-center text-[10px] leading-relaxed text-stone-400">
              All domestic taxes included.
              <br />
              Bank transfer, e-wallet and cash on delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
