import { Link } from 'react-router-dom';
import { NewsletterForm } from '../sections/NewsletterForm';

export function Footer() {
  return (
    <footer
      data-print-hide
      className="mt-auto border-t border-stone-200/80 bg-canvas-raised text-stone-900"
    >
      {/* Brand value pillars */}
      <div className="border-b border-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-900">
              01 · Independent Makers
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Curating direct small-batch collections from Indonesia’s most dedicated apparel ateliers.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-900">
              02 · Transparent Sourcing
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Heavyweight organic cottons, natural French linens, and hand-printed artisanal batiks.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-900">
              03 · Express Domestic Dispatch
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Reliable door-to-door delivery across all 38 Indonesian provinces with hassle-free returns.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link
              to="/"
              className="text-sm font-bold uppercase tracking-[0.24em] text-stone-950 inline-block"
            >
              NusaMarket
            </Link>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
              An editorial commerce platform dedicated to championing contemporary Indonesian craftsmanship, streetwear, and elevated everyday essentials.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-stone-500">
              <span>Jakarta</span>
              <span>·</span>
              <span>Bandung</span>
              <span>·</span>
              <span>Yogyakarta</span>
              <span>·</span>
              <span>Bali</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-950 mb-4">
              Catalog
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'T-Shirts & Tops', cat: 'T-Shirts' },
                { label: 'Heavyweight Hoodies', cat: 'Hoodies' },
                { label: 'Utility & Cargo Pants', cat: 'Pants' },
                { label: 'Outerwear & Jackets', cat: 'Jackets' },
                { label: 'Caps & Accessories', cat: 'Accessories' },
                { label: 'Totes & Bags', cat: 'Bags' },
              ].map((item) => (
                <li key={item.cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(item.cat)}`}
                    className="text-xs text-stone-600 hover:text-stone-950 transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover - every entry resolves to a route that exists */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-950 mb-4">
              Discover
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'New Arrivals', to: '/shop?sort=newest' },
                { label: 'Highest Rated', to: '/shop?sort=rating' },
                { label: 'Rp 100.000 – Rp 250.000', to: '/shop?price=100-250' },
                { label: 'Collections', to: '/#collections' },
                { label: 'Our Story', to: '/#about' },
                { label: 'Saved Pieces', to: '/wishlist' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-xs text-stone-600 hover:text-stone-950 transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-950">
              The Dispatch
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Early release access, archival restocks, and brand documentaries.
            </p>
            <NewsletterForm className="mt-1" />
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-stone-200/80 pt-8 sm:flex-row text-stone-500">
          <p className="text-[11px] tracking-wide">
            © {new Date().getFullYear()} NusaMarket. Built for contemporary Indonesian commerce.
          </p>
          <p className="text-[11px] uppercase tracking-wider text-stone-500">
            Portfolio demonstration · Nusantara 🇮🇩
          </p>
        </div>
      </div>
    </footer>
  );
}
