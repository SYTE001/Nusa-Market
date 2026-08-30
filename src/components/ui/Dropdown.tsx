import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/** Printable single characters drive type-ahead; space is reserved for select. */
const isPrintableKey = (e: React.KeyboardEvent) =>
  e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey;

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  options: DropdownOption[] | string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  error?: string;
  className?: string;
  align?: 'left' | 'right';
  size?: 'sm' | 'md';
  /**
   * Forwarded to the trigger button so form libraries can focus the control -
   * React Hook Form needs it to move focus to an invalid field on submit.
   */
  ref?: React.Ref<HTMLButtonElement>;
};

export function Dropdown({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option...',
  ariaLabel,
  id,
  error,
  className = '',
  align = 'left',
  size = 'sm',
  ref,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const dropdownId = id || generatedId;

  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const selectedIndex = normalizedOptions.findIndex((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Type-ahead, matching how a native select behaves: printable keys jump to the
  // next option starting with what was typed, and the buffer clears after a
  // short pause so the next word starts a fresh search.
  const typeahead = useRef({ buffer: '', timer: 0 });
  /** Which input last moved the highlight, so only the keyboard auto-scrolls. */
  const interaction = useRef<'keyboard' | 'mouse'>('keyboard');

  useEffect(() => {
    const state = typeahead.current;
    return () => window.clearTimeout(state.timer);
  }, []);

  function indexForTypedKey(key: string, fromIndex: number) {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.buffer += key.toLowerCase();
    state.timer = window.setTimeout(() => {
      state.buffer = '';
    }, 500);

    // Repeating one character cycles through the options sharing that initial.
    const repeated = state.buffer.length > 1 && /^(.)\1*$/.test(state.buffer);
    const prefix = repeated ? state.buffer[0] : state.buffer;
    const start = prefix.length === 1 ? fromIndex + 1 : 0;

    for (let step = 0; step < normalizedOptions.length; step += 1) {
      const index = (start + step + normalizedOptions.length) % normalizedOptions.length;
      if (normalizedOptions[index].label.toLowerCase().startsWith(prefix)) return index;
    }
    return -1;
  }

  // Opening always starts on the current selection (or the first option). Done
  // in the handlers rather than an effect so a `value` change from outside
  // cannot clobber the user's keyboard position while the menu is open.
  function openMenu(index = selectedIndex >= 0 ? selectedIndex : 0) {
    setHighlightedIndex(index);
    setIsOpen(true);
  }

  function toggleMenu() {
    if (isOpen) setIsOpen(false);
    else openMenu();
  }

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    interaction.current = 'keyboard';
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        openMenu(selectedIndex >= 0 ? selectedIndex : normalizedOptions.length - 1);
      } else if (isPrintableKey(e)) {
        e.preventDefault();
        const match = indexForTypedKey(e.key, selectedIndex);
        if (match >= 0) openMenu(match);
        else openMenu();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
        break;
      }
      case 'Home': {
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        setHighlightedIndex(normalizedOptions.length - 1);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
          selectOption(normalizedOptions[highlightedIndex].value);
        }
        break;
      }
      case 'Tab': {
        setIsOpen(false);
        break;
      }
      default: {
        if (isPrintableKey(e)) {
          e.preventDefault();
          const match = indexForTypedKey(e.key, highlightedIndex);
          if (match >= 0) setHighlightedIndex(match);
        }
      }
    }
  }

  function selectOption(optValue: string) {
    onChange(optValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  // Scroll the active option into view when navigating via keyboard. Hover
  // writes the same highlight, and scrolling a list the pointer rests on slides
  // the row out from under the cursor.
  useEffect(() => {
    if (interaction.current === 'mouse') return;
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const activeElement = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const heightClasses = size === 'md' ? 'h-10.5 text-sm px-3.5' : 'h-10 text-xs px-3 sm:h-9';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={dropdownId}
          className="text-[11px] font-semibold text-stone-600 uppercase tracking-[0.12em]"
        >
          {label}
        </label>
      )}

      {/* Trigger and panel get their own positioning context. `absolute
          top-full` resolves against the nearest positioned ancestor, so
          without this the menu would hang below the label/error column
          instead of below the trigger whenever an error is rendered. */}
      <div className="relative">
        {/* Dropdown Trigger Button */}
        <button
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.RefObject<HTMLButtonElement | null>).current = node;
          }}
          id={dropdownId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${dropdownId}-listbox`}
          aria-activedescendant={
            isOpen && highlightedIndex >= 0 ? `${dropdownId}-opt-${highlightedIndex}` : undefined
          }
          aria-label={ariaLabel || label || 'Select option'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${dropdownId}-error` : undefined}
          onClick={toggleMenu}
          onKeyDown={handleKeyDown}
          className={`group flex w-full items-center justify-between gap-2 border bg-white font-medium text-stone-900 transition-all duration-150 cursor-pointer select-none focus:outline-none ${heightClasses} ${
            error
              ? 'border-red-500 ring-1 ring-red-500'
              : isOpen
              ? 'border-stone-950 ring-1 ring-stone-950'
              : 'border-stone-300/85 hover:border-stone-900 shadow-2xs'
          }`}
        >
          <span className={`truncate ${!selectedOption ? 'text-stone-500' : 'text-stone-900'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={14}
            strokeWidth={1.75}
            className={`shrink-0 text-stone-500 transition-transform duration-150 ease-out group-hover:text-stone-950 ${
              isOpen ? 'rotate-180 text-stone-950' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu Panel */}
        {isOpen && (
          <div
            className={`absolute top-full z-40 mt-1 w-full min-w-[160px] sm:min-w-[190px] border border-stone-200 bg-white shadow-xl max-h-60 overflow-y-auto animate-dropdown-enter ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <ul
              ref={listboxRef}
              id={`${dropdownId}-listbox`}
              role="listbox"
              tabIndex={-1}
              className="py-1 focus:outline-none"
            >
              {normalizedOptions.map((option, idx) => {
                const isSelected = option.value === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={option.value}
                    id={`${dropdownId}-opt-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectOption(option.value)}
                    onMouseEnter={() => {
                      interaction.current = 'mouse';
                      setHighlightedIndex(idx);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 text-xs transition-colors duration-150 cursor-pointer ${
                      isHighlighted
                        ? 'bg-stone-100 text-stone-950 shadow-[inset_2px_0_0_0_var(--color-ink)]'
                        : 'text-stone-800'
                    } ${isSelected ? 'font-semibold bg-stone-50/80 text-stone-950' : 'font-normal'}`}
                  >
                    <span className="truncate pr-2">{option.label}</span>
                    {isSelected && (
                      <Check size={13} strokeWidth={2.5} className="shrink-0 text-stone-950" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p id={`${dropdownId}-error`} className="text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
