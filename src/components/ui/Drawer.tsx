import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: 'right' | 'left';
  children: React.ReactNode;
};

export function Drawer({ open, onClose, title, side = 'right', children }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => drawerRef.current?.focus(), 40);
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-200 ease-out',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />
      {/* Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Drawer'}
        tabIndex={-1}
        className={[
          'fixed top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl',
          'transition-transform duration-200 ease-out focus:outline-none',
          side === 'right' ? 'right-0' : 'left-0',
          open
            ? 'translate-x-0'
            : side === 'right'
            ? 'translate-x-full'
            : '-translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-4.5 bg-[#fdfcfb]">
          {title && (
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="ml-auto flex h-8 w-8 items-center justify-center text-stone-400 hover:text-stone-900 transition-colors cursor-pointer active:scale-95"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
