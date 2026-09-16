import React, { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordFieldProps = {
  label: string;
  error?: string;
  autoComplete?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'>;

/**
 * Password input with a show/hide toggle, visually identical to the shared
 * Input component (same label, border, error row and spacing) so the auth
 * forms sit in the same design language as checkout.
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, error, id, autoComplete = 'current-password', ...rest }, ref) {
    const reactId = useId();
    const inputId = id ?? reactId;
    const errorId = `${inputId}-error`;
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-700"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            autoComplete={autoComplete}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`h-10 w-full border bg-white px-3.5 pr-10 text-sm text-ink placeholder:text-stone-400 outline-none transition-colors duration-150 focus:border-ink ${
              error ? 'border-red-400' : 'border-stone-300'
            }`}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center text-stone-500 transition-colors duration-150 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            {visible ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
          </button>
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-[11px] font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
