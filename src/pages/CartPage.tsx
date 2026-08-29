import { Link, useNavigate } from 'react-router-dom';
import { Truck, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatRupiah } from '../utils';

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const FREE_SHIPPING_THRESHOLD = 500000;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-4 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
            Checkout Preparation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 mt-1">
            Shopping Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
          </h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            Empty Bag
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          type="cart"
          action={{ label: 'Explore the Collection', onClick: () => navigate('/shop') }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Item List Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Free shipping banner */}
            <div className="bg-[#f5f3ef] border border-stone-200 px-4 py-3 text-xs text-stone-700 flex items-center gap-2">
              <Truck size={16} className="text-stone-950 shrink-0" />
              {remaining <= 0 ? (
                <span>
                  🎉 You qualify for <strong>Complimentary Domestic Shipping</strong>!
                </span>
              ) : (
                <span>
                  Add <strong>{formatRupiah(remaining)}</strong> more to unlock Free Domestic Shipping.
                </span>
              )}
            </div>

            <div className="divide-y divide-stone-200/80 border-y border-stone-200/80">
              {items.map((item, i) => (
                <CartItem
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${i}`}
                  item={item}
                />
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors"
              >
                <ArrowLeft size={13} />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Sticky Summary Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 border border-stone-200 bg-white p-6 shadow-xs flex flex-col gap-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-950">
                Order Breakdown
              </h2>

              <CartSummary subtotal={subtotal} />

              <div className="pt-2">
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </div>

              <div className="border-t border-stone-200/60 pt-4 text-[11px] text-stone-500 flex flex-col gap-1.5">
                <p>✓ All domestic taxes included</p>
                <p>✓ Secure bank transfer, e-wallet, & COD</p>
                <p>✓ 14-day exchange guarantee</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
