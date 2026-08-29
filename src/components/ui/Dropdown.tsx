import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

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

  // Sync highlighted index with selected when opening
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, selectedIndex]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
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
    }
  }

  function selectOption(optValue: string) {
    onChange(optValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  // Scroll active option into view when navigating via keyboard
  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const activeElement = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const heightClasses = size === 'md' ? 'h-10.5 text-sm px-3.5' : 'h-9 text-xs px-3';

  return (
    <div className={`relative flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={dropdownId}
          className="text-[11px] font-semibold text-stone-600 uppercase tracking-[0.12em]"
        >
          {label}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <button
        ref={triggerRef}
        id={dropdownId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${dropdownId}-listbox`}
        aria-label={ariaLabel || label || 'Select option'}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`group flex w-full items-center justify-between gap-2 border bg-white font-medium text-stone-900 transition-all duration-150 cursor-pointer select-none focus:outline-none ${heightClasses} ${
          error
            ? 'border-red-500 ring-1 ring-red-500'
            : isOpen
            ? 'border-stone-950 ring-1 ring-stone-950'
            : 'border-stone-300/85 hover:border-stone-900 shadow-2xs'
        }`}
      >
        <span className={`truncate ${!selectedOption ? 'text-stone-400' : 'text-stone-900'}`}>
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
            aria-activedescendant={
              highlightedIndex >= 0 ? `${dropdownId}-opt-${highlightedIndex}` : undefined
            }
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
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 text-xs transition-colors duration-100 cursor-pointer ${
                    isHighlighted ? 'bg-stone-100 text-stone-950' : 'text-stone-800'
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

      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}
