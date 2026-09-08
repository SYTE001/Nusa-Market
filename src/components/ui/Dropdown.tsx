import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown } from 'lucide-react';

type Option = { label: string; value: string };

type DropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  align?: 'left' | 'right';
  className?: string;
};

/**
 * Custom listbox-style select. No native <select>: identical rendering on
 * every platform, and full keyboard support — click, Enter/Space, arrows,
 * Home/End, type-ahead, Escape, click-outside, visible focus ring, marked
 * selected option.
 */
export function Dropdown({ options, value, onChange, ariaLabel, align = 'left', className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [typeAhead, setTypeAhead] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();
  const selected = options.find((o) => o.value === value) ?? options[0];

  // Click-outside closes and restores focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Open positions the active option on the current selection.
  useEffect(() => {
    if (open) {
      setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    }
  }, [open, options, value]);

  function commit(index: number) {
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleTriggerKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handleListKey(e: KeyboardEvent<HTMLUListElement>) {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        commit(activeIndex);
        break;
      case ' ':
        e.preventDefault();
        break;
      default: {
        // Type-ahead: jump to the next option starting with the typed letters.
        if (e.key.length === 1) {
          const next = typeAhead + e.key.toLowerCase();
          const idx = options.findIndex((o) => o.label.toLowerCase().startsWith(next));
          if (idx >= 0) {
            setTypeAhead(next);
            setActiveIndex(idx);
          } else {
            setTypeAhead(e.key.toLowerCase());
            const retry = options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
            if (retry >= 0) setActiveIndex(retry);
          }
          window.clearTimeout((handleListKey as unknown as { t?: number }).t);
          (handleListKey as unknown as { t?: number }).t = window.setTimeout(() => setTypeAhead(''), 400);
        }
      }
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKey}
        className={`flex h-9 w-full cursor-pointer items-center justify-between gap-2 border bg-white px-3 text-xs font-medium text-stone-700 transition-colors duration-150 hover:border-stone-400 ${
          open ? 'border-ink' : 'border-stone-300'
        }`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          size={13}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 text-stone-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          onKeyDown={handleListKey}
          className={`animate-dropdown-enter absolute top-[calc(100%+4px)] z-30 max-h-64 w-full min-w-[180px] cursor-pointer overflow-y-auto border border-stone-200 bg-white py-1 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => commit(i)}
                className={`flex items-center justify-between gap-3 px-3 py-2 text-xs ${
                  isActive ? 'bg-stone-100 text-ink' : 'text-stone-600'
                } ${isSelected ? 'font-semibold text-ink' : ''}`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={13} strokeWidth={2.5} className="shrink-0 text-clay-600" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
