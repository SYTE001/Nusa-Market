import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  }

  return (
    <footer className="mt-auto border-t border-stone-200/80 bg-[#fbfaf8] text-stone-900">
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
            <div className="pt-2 flex items-center gap-4 text-xs text-stone-400">
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
                    className="text-xs text-stone-600 hover:text-stone-950 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-950 mb-4">
              Client Service
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-stone-600">
              <li>
                <span className="hover:text-stone-950 cursor-pointer">Shipping & Dispatch</span>
              </li>
              <li>
                <span className="hover:text-stone-950 cursor-pointer">Size & Fit Guidance</span>
              </li>
              <li>
                <span className="hover:text-stone-950 cursor-pointer">Artisan Directory</span>
              </li>
              <li>
                <span className="hover:text-stone-950 cursor-pointer">Returns & Exchanges</span>
              </li>
              <li>
                <span className="hover:text-stone-950 cursor-pointer">Wholesale Inquiry</span>
              </li>
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
            <form onSubmit={handleNewsletter} className="mt-1 flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-10 border border-stone-300 bg-white px-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950"
                  aria-label="Email for editorial updates"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-9 w-full bg-stone-950 text-stone-50 text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    Subscribed
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-stone-200/80 pt-8 sm:flex-row text-stone-500">
          <p className="text-[11px] tracking-wide">
            © {new Date().getFullYear()} NusaMarket. Built for contemporary Indonesian commerce.
          </p>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider text-stone-400">
            <span className="hover:text-stone-900 cursor-pointer">Privacy</span>
            <span className="hover:text-stone-900 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-900 cursor-pointer">Nusantara 🇮🇩</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
