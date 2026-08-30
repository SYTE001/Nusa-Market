import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: 'right' | 'left';
  children: React.ReactNode;
};

export function Drawer({ open, onClose, title, side = 'right', children }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useFocusTrap(open, drawerRef);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <div data-print-hide>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-200 ease-out',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />
      {/* Panel: stays mounted so it can animate out, and is made inert while
          closed so its controls never appear in the tab order. */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Drawer'}
        aria-hidden={!open}
        inert={!open}
        tabIndex={-1}
        className={[
          // h-dvh, not h-full: a fixed element's height resolves against the large
          // viewport, which puts the drawer footer under a mobile browser toolbar.
          'fixed top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white shadow-2xl',
          'transition-transform duration-200 ease-out focus:outline-none',
          side === 'right' ? 'right-0' : 'left-0',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 bg-canvas-raised px-6 py-4.5">
          {title && (
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="-mr-1.5 ml-auto flex h-9 w-9 items-center justify-center rounded-xs text-stone-500 transition-colors duration-150 hover:text-stone-900 active:scale-95 cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
