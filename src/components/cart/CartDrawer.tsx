import { useNavigate } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';

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

  return (
    <Drawer open={cartDrawerOpen} onClose={closeCartDrawer} title="Your Bag" side="right">
      {items.length === 0 ? (
        <EmptyState
          type="cart"
          action={{ label: 'Continue Shopping', onClick: () => { closeCartDrawer(); navigate('/shop'); } }}
        />
      ) : (
        <div className="flex flex-col h-full">
          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 divide-y divide-stone-100">
            {items.map((item, i) => (
              <CartItem key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${i}`} item={item} />
            ))}
          </div>

          {/* Summary + actions */}
          <div className="border-t border-stone-100 px-5 py-4 flex flex-col gap-3">
            <CartSummary subtotal={subtotal} />
            <Button fullWidth onClick={goToCheckout}>
              Proceed to Checkout
            </Button>
            <Button variant="ghost" fullWidth onClick={goToCart} className="text-xs uppercase tracking-wider">
              View Full Bag
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

