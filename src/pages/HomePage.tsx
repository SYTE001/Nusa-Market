import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { getNewArrivals, getBestSellers } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';
import { categories } from '../data/products';

// Category icons / colors mapping
const categoryMeta: Record<string, { bg: string; label: string }> = {
  'T-Shirts': { bg: 'bg-stone-50', label: 'T-Shirts' },
  'Hoodies': { bg: 'bg-amber-50', label: 'Hoodies' },
  'Pants': { bg: 'bg-slate-50', label: 'Pants' },
  'Jackets': { bg: 'bg-emerald-50', label: 'Jackets' },
  'Accessories': { bg: 'bg-rose-50', label: 'Accessories' },
  'Bags': { bg: 'bg-sky-50', label: 'Bags' },
};

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getNewArrivals(), getBestSellers()])
      .then(([na, bs]) => {
        setNewArrivals(na);
        setBestSellers(bs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center bg-stone-50 px-4 py-20 text-center lg:min-h-[80vh]">
        <div className="max-w-2xl">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            Indonesian Independent Brands
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Made Local.<br />Made Better.
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-stone-600 sm:text-base">
            Discover thoughtfully designed products from independent Indonesian brands.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/shop">
              <Button size="lg">Shop Collection</Button>
            </Link>
            <Link to="/shop?filter=new">
              <Button size="lg" variant="secondary">Explore New Arrivals</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="mb-8 text-xs font-semibold uppercase tracking-widest text-stone-500">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {(categories.slice(1) as string[]).map((cat) => {
            const meta = categoryMeta[cat] ?? { bg: 'bg-stone-50', label: cat };
            return (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className={`${meta.bg} flex flex-col items-center justify-center gap-2 py-6 text-center transition-opacity hover:opacity-80`}
              >
                <span className="text-xs font-semibold text-stone-700">{meta.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500">New Arrivals</h2>
          <Link to="/shop?filter=new" className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-4">
            View all
          </Link>
        </div>
        <ProductGrid products={newArrivals} loading={loading} skeletonCount={4} />
      </section>

      {/* Promo Banner */}
      <section className="bg-stone-900 py-16 px-4 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400 mb-3">
          Free Shipping
        </p>
        <p className="text-xl font-bold text-white mb-2">On orders above Rp500.000</p>
        <p className="text-sm text-stone-400 mb-6">Regular shipping across Indonesia.</p>
        <Link to="/shop">
          <Button variant="secondary" size="md" className="border-white text-white hover:bg-white hover:text-stone-900">
            Shop Now
          </Button>
        </Link>
      </section>

      {/* Best Sellers */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500">Best Sellers</h2>
          <Link to="/shop" className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-4">
            View all
          </Link>
        </div>
        <ProductGrid products={bestSellers} loading={loading} skeletonCount={4} />
      </section>

      {/* Brand Story */}
      <section id="about" className="bg-stone-50 px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">About NusaMarket</h2>
          <p className="text-2xl font-bold leading-snug text-stone-900 mb-6">
            A curated platform for Indonesia's independent makers.
          </p>
          <p className="text-sm leading-relaxed text-stone-600">
            NusaMarket was built to give independent Indonesian brands a direct channel to people who care about where things come from and how they're made. Every brand on this platform is local, small-batch, and focused on quality over volume.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="border border-stone-200 p-10 text-center">
          <h2 className="mb-2 text-lg font-bold text-stone-900">Stay in the loop</h2>
          <p className="mb-6 text-sm text-stone-500">New arrivals and brand stories, direct to your inbox.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto flex max-w-sm"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 min-w-0 h-10 border border-stone-200 px-3 text-sm focus:outline-none focus:border-stone-900"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              className="h-10 shrink-0 bg-stone-900 px-4 text-xs font-semibold uppercase tracking-widest text-white hover:bg-stone-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

