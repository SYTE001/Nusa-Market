import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import { getNewArrivals, getBestSellers } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';

const CATEGORY_TILES = [
  {
    name: 'T-Shirts',
    count: '4 Styles',
    img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hoodies',
    count: '3 Styles',
    img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Pants',
    count: '4 Styles',
    img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Jackets',
    count: '4 Styles',
    img: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Accessories',
    count: '4 Styles',
    img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bags',
    count: '4 Styles',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  },
];

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
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* Editorial Hero */}
      <section className="relative bg-[#f5f3ef] border-b border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Headline Copy */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-600">
              <Sparkles size={13} className="text-stone-900" />
              <span>Independent Indonesian Brands</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-950 leading-[1.05]">
              Made Local.<br />
              Made Better.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg">
              Discover thoughtfully designed products from independent Indonesian brands. Built with heavyweight fabrics, artisanal motifs, and modern streetwear cuts.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link to="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Collection
                </Button>
              </Link>
              <Link to="/shop?sort=newest">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Explore New Arrivals
                </Button>
              </Link>
            </div>

            {/* Quick metrics ticker */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-300/60 text-stone-900 mt-2">
              <div>
                <p className="text-lg sm:text-xl font-bold tracking-tight">24+</p>
                <p className="text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-wider">Curated Styles</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold tracking-tight">100%</p>
                <p className="text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-wider">Domestic Craft</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold tracking-tight">38</p>
                <p className="text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-wider">Provinces Served</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Moment */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-stone-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85"
                alt="NusaMarket Editorial Lookbook"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-300">Lookbook 01</p>
                  <p className="text-sm font-semibold">Heavyweight Boxy Fleece in Bone</p>
                </div>
                <Link
                  to="/product/lokal-heavyweight-hoodie"
                  className="bg-white/90 backdrop-blur-xs text-stone-950 p-2 text-xs hover:bg-white transition-colors"
                  aria-label="View featured hoodie"
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Discovery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Curated Categories
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight mt-1">
              Shop by Silhouette
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-500 transition-colors flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col overflow-hidden bg-stone-100 border border-stone-200/80 transition-all duration-300 hover:border-stone-900"
            >
              <div className="aspect-[4/5] overflow-hidden bg-stone-200">
                <img
                  src={cat.img}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-3 bg-white flex flex-col">
                <span className="text-xs font-bold text-stone-950 tracking-tight">{cat.name}</span>
                <span className="text-[10px] text-stone-400 font-medium">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-baseline justify-between border-b border-stone-200/80 pb-4">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Fresh Drops
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight mt-1">
              New Arrivals
            </p>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-500 transition-colors flex items-center gap-1"
          >
            <span>View Full Drop</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <ProductGrid products={newArrivals.slice(0, 4)} loading={loading} skeletonCount={4} />
      </section>

      {/* Large Editorial Promotional Moment */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-stone-950 text-white grid grid-cols-1 lg:grid-cols-12 min-h-[460px] items-center">
          {/* Image half */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85"
              alt="Archival Series Campaign"
              className="h-full w-full object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-950 via-stone-950/40 to-transparent" />
          </div>

          {/* Story half */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col gap-5 z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
              Archival Series 2026
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Crafted for the Tropics. Designed for Everywhere.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Every garment in our curation is produced in low-volume runs across West Java and Central Java. We prioritize premium dense weaves, durable double-needle stitching, and custom hardware.
            </p>
            <div className="pt-2">
              <Link to="/shop">
                <Button
                  size="md"
                  variant="secondary"
                  className="border-white text-white hover:bg-white hover:text-stone-950"
                >
                  Explore The Archive
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-baseline justify-between border-b border-stone-200/80 pb-4">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Community Favorites
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight mt-1">
              Bestselling Staples
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-500 transition-colors flex items-center gap-1"
          >
            <span>View All Bestsellers</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <ProductGrid products={bestSellers.slice(0, 4)} loading={loading} skeletonCount={4} />
      </section>

      {/* Brand Story / Ethos Section */}
      <section id="about" className="bg-[#f5f3ef] border-y border-stone-200/80 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center flex flex-col gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500">
            About NusaMarket
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-950 tracking-tight leading-snug">
            A curated home for Indonesia's independent apparel ateliers.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            NusaMarket was established to bridge the gap between discerning consumers and Indonesia’s flourishing landscape of independent streetwear, casual tailoring, and artisanal accessories. We reject fast-fashion shortcuts in favor of enduring silhouettes, tangible garment weight, and honest domestic pricing.
          </p>
          <div className="pt-4 flex justify-center gap-8 text-xs font-semibold uppercase tracking-[0.14em] text-stone-800">
            <span>Small-Batch</span>
            <span>·</span>
            <span>Ethical Labor</span>
            <span>·</span>
            <span>Local Materials</span>
          </div>
        </div>
      </section>

      {/* Editorial Dispatch / Newsletter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="border border-stone-300 bg-white p-8 sm:p-14 text-center max-w-2xl mx-auto flex flex-col items-center gap-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
            Editorial Dispatch
          </span>
          <h2 className="text-2xl font-bold text-stone-950 tracking-tight">
            Stay in the loop
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-md">
            Receive private release dates, fabric development stories, and seasonal lookbooks directly in your inbox.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-2 flex w-full max-w-md flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-11 border border-stone-300 bg-[#fdfcfb] px-3.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950"
              aria-label="Email address for subscription"
              required
            />
            <Button size="md" type="submit" className="sm:w-auto shrink-0">
              Join Dispatch
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
