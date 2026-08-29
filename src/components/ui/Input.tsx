
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-stone-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          'h-10 w-full rounded-none border px-3 text-sm text-stone-900 placeholder:text-stone-400',
          'focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-0',
          'transition-colors duration-150',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-stone-300 focus:border-stone-900',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

