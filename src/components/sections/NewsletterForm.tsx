import { useState, type FormEvent } from 'react';
import { Check, ArrowRight } from 'lucide-react';

type NewsletterFormProps = {
  layout?: 'inline' | 'stacked';
  className?: string;
};

/**
 * Demo-honest newsletter form: it says the address goes nowhere, and it does.
 */
export function NewsletterForm({ layout = 'stacked', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setDone(true);
  }

  if (done) {
    return (
      <p
        role="status"
        className={`flex items-center gap-2 text-xs font-medium text-jade-700 ${className}`}
      >
        <Check size={14} aria-hidden="true" />
        Noted. (In this demo the address goes nowhere.)
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={layout === 'inline' ? `flex flex-col gap-2 sm:flex-row ${className}` : `flex flex-col gap-2 ${className}`}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="h-10 flex-1 border border-stone-300 bg-white px-3.5 text-sm text-ink placeholder:text-stone-400 outline-none transition-colors duration-150 focus:border-ink"
      />
      <button
        type="submit"
        className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 bg-ink px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-canvas transition-colors duration-150 hover:bg-ink-soft"
      >
        Subscribe
        <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
      </button>
    </form>
  );
}
