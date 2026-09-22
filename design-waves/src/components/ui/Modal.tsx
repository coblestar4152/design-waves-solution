import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative dw-glass w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 dw-scroll-x">
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="font-bold text-lg">{title}</h3>}
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-white/10">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
