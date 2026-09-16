import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Full-bleed two-column auth composition: an editorial brand panel over
 * archive imagery on the left, the form on a quiet canvas field to the right.
 * The left panel is the marketing surface, not decoration — it collapses
 * below `lg` so the form is the only thing a phone has to focus on.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const { configured } = useAuth();

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      {/* Brand / value panel — desktop only */}
      <aside className="grain-overlay relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between">
        <img
          src="/images/editorial/hero.webp"
          alt="Hand-drawn batik cloth drying in a Pekalongan workshop"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          aria-hidden="true"
        />
        {/* Ink wash so type stays readable over imagery at any crop */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(24,24,27,0.55) 0%, rgba(24,24,27,0.25) 45%, rgba(24,24,27,0.85) 100%)',
          }}
        />
        <div aria-hidden="true" className="batik-weave absolute inset-0 opacity-[0.05]" />

        <div className="relative z-[2] px-12 pt-10">
          <Link
            to="/"
            className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-white transition-opacity duration-150 hover:opacity-80"
          >
            Nusa<span className="text-clay-300">Market</span>
          </Link>
        </div>

        <div className="relative z-[2] max-w-md px-12 pb-12">
          <div aria-hidden="true" className="motif-divider mb-8 opacity-70" />
          <p className="font-serif-editorial text-2xl italic leading-snug text-stone-100">
            &ldquo;A cloth remembers every hand that touched it.&rdquo;
          </p>
          <h1 className="font-display mt-8 text-4xl font-semibold leading-[1.1] tracking-tight text-white">
            Provenance you can wear.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-stone-300">
            Twenty-four pieces from seven independent ateliers across Sumatra, Java and Bali —
            each one carries its maker, its region and its process in the product itself.
          </p>
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
            7 ateliers · 4 labels · Est. in the archipelago
          </p>
        </div>
      </aside>

      {/* Form field */}
      <main className="relative flex flex-col bg-canvas">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500 transition-colors duration-150 hover:text-ink"
          >
            <ArrowLeft size={13} strokeWidth={2} aria-hidden="true" />
            Back to store
          </Link>
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-ink lg:hidden">
            Nusa<span className="text-clay-600">Market</span>
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 sm:py-14">
          <div className="w-full max-w-[400px]">
            {!configured && (
              <p
                role="status"
                className="mb-6 border border-stone-300 bg-canvas-muted px-4 py-3 text-xs leading-relaxed text-stone-600"
              >
                Authentication is not configured on this deployment — sign-in will report an
                error until the Supabase environment variables are set. See{' '}
                <span className="font-mono-data">.env.example</span>.
              </p>
            )}
            {children}
          </div>
        </div>

        <p className="px-6 pb-6 text-center text-[11px] text-stone-400 sm:px-10">
          No payment is processed and no data leaves your browser beyond Supabase. This is a
          portfolio storefront.
        </p>
      </main>
    </div>
  );
}
