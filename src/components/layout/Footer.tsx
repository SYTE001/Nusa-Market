import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-stone-900">NusaMarket</span>
            <p className="mt-2 text-xs text-stone-500 leading-relaxed">
              Thoughtfully designed products from independent Indonesian brands.
            </p>
          </div>
          {/* Shop */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-900 mb-3">Shop</h3>
            <ul className="flex flex-col gap-2">
              {['T-Shirts', 'Hoodies', 'Pants', 'Jackets', 'Accessories', 'Bags'].map((cat) => (
                <li key={cat}>
                  <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="text-xs text-stone-500 hover:text-stone-900 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-900 mb-3">Support</h3>
            <ul className="flex flex-col gap-2">
              {['Shipping & Returns', 'Size Guide', 'FAQ', 'Contact Us'].map((item) => (
                <li key={item}>
                  <span className="text-xs text-stone-500 cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-900 mb-3">Stay Updated</h3>
            <p className="text-xs text-stone-500 mb-3 leading-relaxed">
              New arrivals and brand stories, direct to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 h-9 border border-stone-200 px-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="h-9 shrink-0 bg-stone-900 px-3 text-[10px] font-semibold uppercase tracking-widest text-white hover:bg-stone-700 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-stone-100 pt-6 sm:flex-row">
          <p className="text-[10px] text-stone-400">
            © {new Date().getFullYear()} NusaMarket. All rights reserved.
          </p>
          <p className="text-[10px] text-stone-400">Made in Indonesia 🇮🇩</p>
        </div>
      </div>
    </footer>
  );
}

