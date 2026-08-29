import { useNavigate } from 'react-router-dom';
import { Truck, Check } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { formatRupiah } from '../../utils';

export function CartDrawer() {
  const { cartDrawerOpen, closeCartDrawer } = useUIStore();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const navigate = useNavigate();

  function goToCart() {
    closeCartDrawer();
    navigate('/cart');
  }

  function goToCheckout() {
    closeCartDrawer();
    navigate('/checkout');
  }

  const FREE_SHIPPING_THRESHOLD = 500000;
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <Drawer open={cartDrawerOpen} onClose={closeCartDrawer} title="Shopping Bag" side="right">
      {items.length === 0 ? (
        <EmptyState
          type="cart"
          action={{
            label: 'Explore Catalog',
            onClick: () => {
              closeCartDrawer();
              navigate('/shop');
            },
          }}
        />
      ) : (
        <div className="flex flex-col h-full justify-between">
          {/* Free Shipping Progress Indicator */}
          <div className="bg-stone-50 border-b border-stone-200/80 px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-stone-700 mb-1.5 font-medium">
              <Truck size={14} className="text-stone-950" />
              {remaining <= 0 ? (
                <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                  <Check size={13} /> You've unlocked Complimentary Domestic Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-stone-950">{formatRupiah(remaining)}</strong> for Free Shipping
                </span>
              )}
            </div>
            <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-950 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-6 divide-y divide-stone-100">
            {items.map((item, i) => (
              <CartItem
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${i}`}
                item={item}
              />
            ))}
          </div>

          {/* Bottom Action Summary */}
          <div className="border-t border-stone-200/80 bg-[#fdfcfb] px-6 py-5 flex flex-col gap-3 shadow-md">
            <CartSummary subtotal={subtotal} />
            <Button fullWidth size="lg" onClick={goToCheckout}>
              Checkout — {formatRupiah(subtotal)}
            </Button>
            <Button
              variant="ghost"
              fullWidth
              size="sm"
              onClick={goToCart}
              className="text-[11px] tracking-[0.14em]"
            >
              View Full Bag Details
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
