import { ShoppingBag, Heart, Search, AlertCircle } from 'lucide-react';
import { Button } from './Button';

type EmptyStateProps = {
  type: 'cart' | 'wishlist' | 'search' | 'filter' | 'error';
  message?: string;
  action?: { label: string; onClick: () => void };
};

const config = {
  cart: {
    icon: ShoppingBag,
    title: 'Your bag is currently empty.',
    subtitle: 'Explore our latest arrivals and archival collections.',
  },
  wishlist: {
    icon: Heart,
    title: 'No saved items yet.',
    subtitle: 'Tap the heart on any product to curate your personal wishlist.',
  },
  search: {
    icon: Search,
    title: 'No matching products found.',
    subtitle: 'Try checking your spelling or using broader search terms.',
  },
  filter: {
    icon: Search,
    title: 'No products match your selected filters.',
    subtitle: 'Try refining or clearing your category and price selections.',
  },
  error: {
    icon: AlertCircle,
    title: 'Unable to load products.',
    subtitle: 'A network disruption occurred. Please try reloading the page.',
  },
};

export function EmptyState({ type, message, action }: EmptyStateProps) {
  const { icon: Icon, title, subtitle } = config[type];
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 px-6 text-center max-w-md mx-auto">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-700">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold text-stone-900 tracking-tight">{message ?? title}</p>
        <p className="text-xs leading-relaxed text-stone-500">{subtitle}</p>
      </div>
      {action && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
