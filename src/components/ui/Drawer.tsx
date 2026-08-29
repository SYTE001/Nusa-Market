import { useEffect, useRef } from 'react';
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
    if (open) drawerRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={[
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
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
          'transition-transform duration-300 ease-in-out focus:outline-none',
          side === 'right' ? 'right-0' : 'left-0',
          open
            ? 'translate-x-0'
            : side === 'right'
            ? 'translate-x-full'
            : '-translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          {title && <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-900">{title}</h2>}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-none text-stone-500 hover:bg-stone-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}

