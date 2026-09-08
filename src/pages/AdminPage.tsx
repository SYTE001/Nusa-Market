import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogIn, Search } from 'lucide-react';
import { products } from '../data/products';
import { artisans } from '../data/artisans';
import { REGIONS } from '../types';
import { formatRupiah } from '../utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/**
 * Demo admin surface: a protected route pattern done honestly for a
 * front-end portfolio — a client-side passcode gate (documented as such),
 * session-scoped, with a read catalog table and in-memory edit affordances.
 * A real auth backend would replace `PASSCODE` with a server challenge.
 */
const PASSCODE = 'nusa2026';

export default function AdminPage() {
  useDocumentTitle('Admin — NusaMarket');

  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('nusa-admin') === 'yes'
  );
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  const rows = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = `${p.name} ${p.brand} ${p.slug}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesRegion = regionFilter === 'all' || p.region === regionFilter;
      return matchesQuery && matchesRegion;
    });
  }, [query, regionFilter]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passcode === PASSCODE) {
      sessionStorage.setItem('nusa-admin', 'yes');
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect passcode. (Demo hint: nusa2026)');
    }
  }

  function logout() {
    sessionStorage.removeItem('nusa-admin');
    setAuthed(false);
    setPasscode('');
  }

  /* ---------- Gate ---------- */
  if (!authed) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-24">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-700">
          <Lock size={22} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div className="text-center">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Admin surface
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-500">
            Protected route demo — client-side gate, session-scoped. In production this
            exchanges credentials with a server; here it is a documented passcode.
          </p>
        </div>
        <form onSubmit={handleLogin} className="flex w-full flex-col gap-3">
          <Input
            label="Passcode"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••••"
            error={error}
          />
          <Button type="submit" fullWidth size="lg">
            <LogIn size={14} aria-hidden="true" />
            Unlock dashboard
          </Button>
        </form>
      </div>
    );
  }

  /* ---------- Dashboard ---------- */
  const stockValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 20).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-stone-200/80 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay-600">
            Operations
          </span>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            Catalog Console
          </h1>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          Lock console
        </Button>
      </div>

      {/* Stat strip */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Products', value: String(products.length) },
          { label: 'Ateliers', value: String(new Set(products.map((p) => p.craft.atelier)).size) },
          { label: 'Regions', value: String(new Set(products.map((p) => p.region)).size) },
          { label: 'Inventory value', value: formatRupiah(stockValue) },
        ].map((s) => (
          <div key={s.label} className="border border-stone-200 bg-white p-4">
            <p className="font-display text-lg font-semibold tabular-nums text-ink">{s.value}</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {lowStock > 0 && (
        <p className="mb-6 border-l-2 border-amber-500 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          {lowStock} product{lowStock === 1 ? '' : 's'} under 20 units — the restock queue.
        </p>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand, slug…"
            aria-label="Search catalog"
            className="h-9 w-full border border-stone-300 bg-white pl-9 pr-3 text-xs text-ink outline-none transition-colors duration-150 focus:border-ink"
          />
        </div>
        <div role="group" aria-label="Filter by region" className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {['all', ...REGIONS].map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              aria-pressed={regionFilter === r}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 ${
                regionFilter === r
                  ? 'bg-ink text-canvas'
                  : 'border border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {r === 'all' ? 'All regions' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-stone-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-[10px] uppercase tracking-[0.14em] text-stone-500">
              <th scope="col" className="px-4 py-3 font-bold">Product</th>
              <th scope="col" className="px-4 py-3 font-bold">Atelier</th>
              <th scope="col" className="px-4 py-3 font-bold">Region</th>
              <th scope="col" className="px-4 py-3 font-bold">Price</th>
              <th scope="col" className="px-4 py-3 font-bold">Stock</th>
              <th scope="col" className="px-4 py-3 font-bold">Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((p) => (
              <tr key={p.id} className="transition-colors duration-100 hover:bg-stone-50/60">
                <td className="px-4 py-3">
                  <Link
                    to={`/product/${p.slug}`}
                    className="font-semibold text-ink underline-offset-4 hover:underline"
                  >
                    {p.name}
                  </Link>
                  <span className="block text-[10px] text-stone-400">{p.brand} · {p.slug}</span>
                </td>
                <td className="px-4 py-3 text-stone-600">{p.craft.atelier}</td>
                <td className="px-4 py-3 text-stone-600">{p.region}</td>
                <td className="px-4 py-3 font-semibold tabular-nums text-ink">{formatRupiah(p.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex min-w-8 items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
                      p.stock === 0
                        ? 'bg-red-50 text-red-700'
                        : p.stock < 20
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-jade-500/10 text-jade-700'
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-[10px] uppercase tracking-wider text-stone-500">
                  {[p.featured && 'Feat', p.isNew && 'New', p.isBestSeller && 'Best']
                    .filter(Boolean)
                    .join(' · ') || '—'}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-stone-500">
                  No products match the console filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Artisan ledger */}
      <div className="mt-10">
        <h2 className="font-display mb-4 text-lg font-semibold text-ink">Atelier ledger</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {artisans.map((a) => {
            const count = products.filter((p) => p.craft.atelier === a.signature || p.region === a.region).length;
            return (
              <div key={a.id} className="border border-stone-200 bg-white p-4">
                <p className="text-xs font-semibold text-ink">{a.name}</p>
                <p className="mt-0.5 text-[11px] text-stone-500">{a.place} · {a.craft}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-stone-400">
                  Region output: {count} catalog pieces
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-8 text-[11px] leading-relaxed text-stone-400">
        Console notes — the table reads the same typed catalog the storefront serves;
        editing is intentionally out of scope for a front-end demo and the seam for a
        real admin is <code className="font-mono-data">productService</code>.
      </p>
    </div>
  );
}
