import { X } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { formatRupiah } from '../../utils';
import { useCartStore } from '../../stores/cartStore';
import { QuantitySelector } from '../ui/QuantitySelector';

type CartItemProps = {
  item: CartItemType;
  compact?: boolean;
};

export function CartItem({ item, compact = false }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();
  const { product, quantity, selectedSize, selectedColor } = item;

  function handleIncrease() {
    increaseQuantity(product.id, selectedSize, selectedColor);
  }
  function handleDecrease() {
    decreaseQuantity(product.id, selectedSize, selectedColor);
  }
  function handleRemove() {
    removeItem(product.id, selectedSize, selectedColor);
  }

  return (
    <div className={`flex gap-3 ${compact ? 'py-3' : 'py-4'}`}>
      {/* Image */}
      <div className={`shrink-0 overflow-hidden bg-stone-50 ${compact ? 'h-16 w-12' : 'h-20 w-16'}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
          onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">{product.brand}</p>
            <p className="truncate text-sm font-medium text-stone-900">{product.name}</p>
            {(selectedSize || selectedColor) && (
              <p className="text-xs text-stone-500">
                {[selectedSize, selectedColor].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            aria-label={`Remove ${product.name}`}
            className="shrink-0 text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {compact ? (
            <p className="text-xs text-stone-500">Qty {quantity}</p>
          ) : (
            <QuantitySelector
              value={quantity}
              max={product.stock}
              onChange={(val) => {
                if (val > quantity) handleIncrease();
                else handleDecrease();
              }}
              size="sm"
            />
          )}
          <span className="text-sm font-semibold text-stone-900">
            {formatRupiah(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

