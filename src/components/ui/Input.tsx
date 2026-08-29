import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[11px] font-semibold text-stone-600 uppercase tracking-[0.12em]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          'h-10.5 w-full border bg-white px-3.5 text-sm text-stone-900 placeholder:text-stone-400',
          'focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900',
          'transition-all duration-150',
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-stone-200/90 hover:border-stone-400',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
      {!error && hint && <p className="text-[11px] text-stone-500">{hint}</p>}
    </div>
  );
}
