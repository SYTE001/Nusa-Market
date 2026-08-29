import { ShoppingBag, Heart, Search, AlertCircle } from 'lucide-react';
import { Button } from './Button';

type EmptyStateProps = {
  type: 'cart' | 'wishlist' | 'search' | 'filter' | 'error';
  message?: string;
  action?: { label: string; onClick: () => void };
};

const config = {
  cart: { icon: ShoppingBag, title: 'Your bag is empty.', subtitle: 'Add items to your bag to see them here.' },
  wishlist: { icon: Heart, title: 'Nothing saved yet.', subtitle: 'Tap the heart on any product to save it here.' },
  search: { icon: Search, title: 'No products found.', subtitle: 'Try a different keyword.' },
  filter: { icon: Search, title: 'No products match your filters.', subtitle: 'Try adjusting or clearing your filters.' },
  error: { icon: AlertCircle, title: 'Something went wrong.', subtitle: "We couldn't load the products." },
};

export function EmptyState({ type, message, action }: EmptyStateProps) {
  const { icon: Icon, title, subtitle } = config[type];
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
        <Icon size={24} className="text-stone-400" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-stone-900">{message ?? title}</p>
        <p className="text-sm text-stone-500">{subtitle}</p>
      </div>
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

