import React, { useId } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const showHint = !error && Boolean(hint);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-600">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || showHint ? messageId : undefined}
        {...props}
        className={[
          'h-10.5 w-full border bg-white px-3.5 text-sm text-stone-900 placeholder:text-stone-500',
          'focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900',
          'transition-all duration-150',
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-stone-200/90 hover:border-stone-400',
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {error && (
        <p id={messageId} className="text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
      {showHint && (
        <p id={messageId} className="text-[11px] text-stone-500">
          {hint}
        </p>
      )}
    </div>
  );
}
