import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { makeProduct } from '../../test/factories';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useCartStore } from '../../stores/cartStore';

const product = makeProduct({ price: 385000, originalPrice: 429000 });

function renderCard() {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    useWishlistStore.setState({ ids: [], items: [] });
    useCartStore.setState({ items: [] });
  });

  it('renders name, brand, formatted price and the sale badge', () => {
    renderCard();
    expect(screen.getByRole('link', { name: product.name })).toBeInTheDocument();
    expect(screen.getByText(product.brand)).toBeInTheDocument();
    expect(screen.getByText('Rp 385.000')).toBeInTheDocument();
    expect(screen.getByText('-10%')).toBeInTheDocument();
  });

  it('toggles the wishlist on click and labels the current state', async () => {
    const user = userEvent.setup();
    renderCard();

    const button = screen.getByRole('button', { name: 'Add to wishlist' });
    await user.click(button);

    expect(useWishlistStore.getState().ids).toContain(product.id);
    expect(screen.getByRole('button', { name: 'Remove from wishlist' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove from wishlist' }));
    expect(useWishlistStore.getState().ids).not.toContain(product.id);
  });

  it('quick add puts the first size/color variant in the bag', async () => {
    const user = userEvent.setup();
    const sized = makeProduct({ sizes: ['S', 'M', 'L'], colors: ['Ink'] });
    render(
      <MemoryRouter>
        <ProductCard product={sized} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: `Quick add ${sized.name} to bag` }));

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
    expect(items[0].selectedSize).toBe('S');
    expect(items[0].selectedColor).toBe('Ink');
  });
});
