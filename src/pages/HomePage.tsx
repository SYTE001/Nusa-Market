import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import { getNewArrivals, getBestSellers } from '../services/productService';
import { products } from '../data/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { NewsletterForm } from '../components/sections/NewsletterForm';
import { Button } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// Category tile images live in public/images/categories/.
// Drop a <category>.webp file there and refresh — no code change needed.
// The tile container has a bg-stone-100 background, so a missing file
// shows a neutral grey square rather than a broken-image icon.
const CATEGORY_IMAGES: Record<string, string> = {
  'T-Shirts':    '/images/categories/t-shirts.webp',
  Hoodies:       '/images/categories/hoodies.webp',
  Pants:         '/images/categories/pants.webp',
  Jackets:       '/images/categories/jackets.webp',
  Accessories:   '/images/categories/accessories.webp',
  Bags:          '/images/categories/bags.webp',
};

/**
 * Style counts are derived from the catalog so a tile can never advertise a
 * number the shop does not actually return.
 */
const CATEGORY_TILES = Object.entries(CATEGORY_IMAGES).map(([name, img]) => ({
  name,
  img,
  count: products.filter((p) => p.category === name).length,
}));

const CATALOG_SIZE = products.length;

export default function HomePage() {
  useDocumentTitle('NusaMarket — Modern Storefront for Local Brands');

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
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Editorial Hero */}
      <section className="relative bg-canvas-muted border-b border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Headline Copy */}
          <div className="lg:col-span-7 flex flex-col gap-5 lg:pr-4">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-stone-600">
              <Sparkles size={12} className="text-stone-900" />
              <span>Indonesian Independent Brands</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 leading-[1.08]">
              Made Local.<br />
              Made Better.
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg">
              Discover thoughtfully designed products from independent Indonesian brands. Built with heavyweight fabrics, artisanal motifs, and intentional streetwear silhouettes.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Button to="/shop" size="md" className="w-full sm:w-auto">
                Shop Collection
              </Button>
              <Button to="/shop?sort=newest" size="md" variant="secondary" className="w-full sm:w-auto">
                Explore New Arrivals
              </Button>
            </div>

            {/* Quick metrics ticker */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-stone-300/60 text-stone-900 mt-1">
              <div>
                <p className="text-base sm:text-lg font-bold tracking-tight">{CATALOG_SIZE}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Curated Styles</p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold tracking-tight">100%</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Domestic Craft</p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold tracking-tight">38</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Provinces Served</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Moment with controlled portrait scale */}
          <div className="lg:col-span-5 relative">
            {/* One ratio, capped by width. `max-h` on an aspect box caps the
                height while the width still fills the column, so the declared
                4:5 quietly flattened towards square on wide screens. */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[368px] overflow-hidden bg-stone-200 shadow-sm border border-stone-300/60">
              <img
                src="/images/editorial/hero.webp"
                alt="Model wearing the heavyweight boxy fleece from the NusaMarket lookbook"
                width={900}
                height={1125}
                fetchPriority="high"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-stone-300">Lookbook 01</p>
                  <p className="text-xs sm:text-sm font-semibold">Heavyweight Boxy Fleece in Bone</p>
                </div>
                <Link
                  to="/product/lokal-heavyweight-hoodie"
                  className="bg-white/95 backdrop-blur-xs text-stone-950 p-2 text-xs hover:bg-white transition-colors duration-150"
                  aria-label="View featured hoodie"
                >
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Discovery with compact, refined editorial proportions */}
      <section
        id="collections"
        className="mx-auto max-w-7xl scroll-mt-[calc(var(--nm-header-h)+1.5rem)] px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-baseline justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Curated Categories
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-stone-950 tracking-tight mt-0.5">
              Shop by Silhouette
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-500 transition-colors duration-150 flex items-center gap-1"
          >
            <span>All Silhouettes</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col overflow-hidden bg-white border border-stone-200/80 transition-colors duration-200 hover:border-stone-900 shadow-2xs"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={cat.img}
                  alt={cat.name}
                  width={600}
                  height={450}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-2.5 bg-white flex flex-col">
                <span className="text-xs font-bold text-stone-950 tracking-tight">{cat.name}</span>
                <span className="text-[10px] text-stone-500 font-medium">
                  {cat.count} {cat.count === 1 ? 'Style' : 'Styles'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Fresh Drops
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-stone-950 tracking-tight mt-0.5">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-500 transition-colors duration-150 flex items-center gap-1"
          >
            <span>View Full Drop</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <ProductGrid products={newArrivals.slice(0, 4)} loading={loading} skeletonCount={4} />
      </section>

      {/* Large Editorial Promotional Moment */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-stone-950 text-white grid grid-cols-1 lg:grid-cols-12 min-h-[380px] lg:min-h-[400px] items-center">
          {/* Image half */}
          <div className="lg:col-span-7 relative h-60 sm:h-72 lg:h-full overflow-hidden">
            <img
              src="/images/editorial/archival-series.webp"
              alt="Archival Series campaign photograph"
              width={1100}
              height={734}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="h-full w-full object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-950 via-stone-950/40 to-transparent" />
          </div>

          {/* Story half */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col gap-4 z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
              Archival Series 2026
            </span>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Crafted for the Tropics. Designed for Everywhere.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Every garment in our curation is produced in low-volume runs across West Java and Central Java. We prioritize premium dense weaves, durable double-needle stitching, and custom hardware.
            </p>
            <div className="pt-1">
              <Button
                to="/shop"
                size="sm"
                variant="secondary"
                className="border-white bg-transparent text-white hover:bg-white hover:text-stone-950 text-[11px] focus-visible:ring-white focus-visible:ring-offset-stone-950"
              >
                Explore The Archive
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Community Favorites
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-stone-950 tracking-tight mt-0.5">
              Bestselling Staples
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-500 transition-colors duration-150 flex items-center gap-1"
          >
            <span>View All Bestsellers</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <ProductGrid products={bestSellers.slice(0, 4)} loading={loading} skeletonCount={4} />
      </section>

      {/* Brand Story / Ethos Section */}
      <section
        id="about"
        className="scroll-mt-[calc(var(--nm-header-h)+1.5rem)] border-y border-stone-200/80 bg-canvas-muted px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center flex flex-col gap-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500">
            About NusaMarket
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-stone-950 tracking-tight leading-snug">
            A curated home for Indonesia's independent apparel ateliers.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            NusaMarket was established to bridge the gap between discerning consumers and Indonesia’s flourishing landscape of independent streetwear, casual tailoring, and artisanal accessories. We reject fast-fashion shortcuts in favor of enduring silhouettes, tangible garment weight, and honest domestic pricing.
          </p>
          <div className="pt-2 flex justify-center gap-6 text-xs font-semibold uppercase tracking-[0.14em] text-stone-800">
            <span>Small-Batch</span>
            <span>·</span>
            <span>Ethical Labor</span>
            <span>·</span>
            <span>Local Materials</span>
          </div>
        </div>
      </section>

      {/* Editorial Dispatch / Newsletter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <div className="border border-stone-300 bg-white p-7 sm:p-12 text-center max-w-2xl mx-auto flex flex-col items-center gap-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            Editorial Dispatch
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight">
            Stay in the loop
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-md">
            Receive private release dates, fabric development stories, and seasonal lookbooks directly in your inbox.
          </p>
          <NewsletterForm layout="inline" className="mt-1 max-w-md" />
        </div>
      </section>
    </div>
  );
}
