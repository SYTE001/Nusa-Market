import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';

type NewsletterFormProps = {
  /** 'stacked' fits the narrow footer column, 'inline' the wide homepage band. */
  layout?: 'stacked' | 'inline';
  /** Visible label text for screen reader users. */
  label?: string;
  className?: string;
};

/**
 * The single newsletter form, shared by the footer and the homepage dispatch
 * band. There is no backend, so submitting resolves locally and the confirmation
 * says exactly that instead of implying an address was stored somewhere.
 */
export function NewsletterForm({
  layout = 'stacked',
  label = 'Email address for editorial updates',
  className = '',
}: NewsletterFormProps) {
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  }

  const stacked = layout === 'stacked';

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-2 ${className}`}
      aria-describedby={`${inputId}-status`}
    >
      <div className={stacked ? 'flex flex-col gap-2' : 'flex flex-col gap-2 sm:flex-row'}>
        <input
          id={inputId}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSubscribed(false);
          }}
          placeholder="Enter your email address"
          aria-label={label}
          autoComplete="email"
          required
          className="h-10 w-full flex-1 border border-stone-300 bg-white px-3 text-xs text-stone-900 transition-colors duration-150 placeholder:text-stone-500 focus:border-stone-950 focus:outline-none"
        />
        <Button
          type="submit"
          size="sm"
          fullWidth={stacked}
          className={stacked ? 'h-9' : 'h-10 shrink-0 px-5'}
        >
          {subscribed ? (
            <>
              <Check size={14} strokeWidth={2} aria-hidden="true" className="text-emerald-400" />
              Noted
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
            </>
          )}
        </Button>
      </div>

      <p
        id={`${inputId}-status`}
        role="status"
        aria-live="polite"
        className={`min-h-[15px] text-[11px] leading-tight text-stone-500 ${stacked ? '' : 'text-center'}`}
      >
        {subscribed ? 'Thanks — this demo keeps the address in the page and sends nothing.' : ''}
      </p>
    </form>
  );
}
