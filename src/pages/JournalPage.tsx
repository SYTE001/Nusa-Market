import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { journal } from '../data/journal';
import { artisans } from '../data/artisans';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/ui/Button';

export default function JournalPage() {
  useDocumentTitle('The Craft — Journal — NusaMarket');
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-stone-200/80 pb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-clay-600">
          The Craft
        </span>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Field notes from the archipelago.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
          Short reads on how Indonesian craft actually works — the wax, the vat, the
          loom, the weight — written to be useful, not to sell.
        </p>
      </div>

      {/* Entries */}
      <div className="flex flex-col divide-y divide-stone-200/80">
        {journal.map((entry) => (
          <article key={entry.slug} className="group py-8 first:pt-0">
            <div className="mb-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
              <span className="text-clay-600">{entry.eyebrow}</span>
              <span aria-hidden="true" className="h-px w-6 bg-stone-300" />
              <span className="flex items-center gap-1">
                <Clock size={10} aria-hidden="true" />
                {entry.minutes} min
              </span>
              <span>
                {new Date(entry.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h2 className="font-serif-editorial text-xl font-semibold leading-snug text-ink transition-colors duration-150 group-hover:text-clay-700 sm:text-2xl">
              {entry.title}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-stone-600 sm:text-sm">{entry.excerpt}</p>

            {/* Full body rendered inline: a journal this short needs no detail routes */}
            <div className="mt-4 flex flex-col gap-3 border-l-2 border-clay-200 pl-4 text-xs leading-[1.85] text-stone-700 sm:text-[13px]">
              {entry.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Artisan index footer */}
      <div className="mt-12 border-t border-stone-200/80 pt-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
          The makers referenced
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {artisans.map((a) => (
            <button
              key={a.id}
              onClick={() => navigate(`/shop?region=${encodeURIComponent(a.region)}`)}
              className="cursor-pointer border border-stone-200 px-3 py-1.5 text-[11px] font-medium text-stone-700 transition-colors duration-150 hover:border-clay-400 hover:text-clay-700"
            >
              {a.name} · {a.place}
            </button>
          ))}
        </div>
        <div className="mt-8">
          <Button to="/shop" variant="secondary" size="md">
            Shop the pieces
            <ArrowRight size={13} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
