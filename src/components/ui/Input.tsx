import React, { forwardRef, useId } from 'react';

type InputProps = {
  label: string;
  error?: string;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    className?: string;
  };

/**
 * Labelled text input with the error message rendered beside its field.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className = '', id, ...rest },
  ref
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-700">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined}
        className={`h-10 w-full border bg-white px-3.5 text-sm text-ink placeholder:text-stone-400 outline-none transition-colors duration-150 focus:border-ink ${
          error ? 'border-red-400' : 'border-stone-300'
        }`}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-[11px] text-stone-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
