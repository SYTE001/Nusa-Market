import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <h1 className="mb-8 text-xs font-semibold uppercase tracking-widest text-stone-500">
        Your Bag
        {items.length > 0 && <span className="ml-2 text-stone-400">({items.length} items)</span>}
      </h1>

      {items.length === 0 ? (
        <EmptyState
          type="cart"
          action={{ label: 'Continue Shopping', onClick: () => navigate('/shop') }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Items */}
          <div>
            <div className="divide-y divide-stone-100">
              {items.map((item, i) => (
                <CartItem
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${i}`}
                  item={item}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center border-t border-stone-100 pt-4">
              <Link to="/shop" className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-4">
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-red-600 transition-colors"
              >
                Clear bag
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="border border-stone-100 p-5 h-fit">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">Summary</h2>
            <CartSummary subtotal={subtotal} />
            <Button fullWidth size="lg" className="mt-4" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

