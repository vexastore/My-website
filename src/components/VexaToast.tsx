import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const VexaToast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type: type || 'info' }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
    window.addEventListener('vexa-toast', handler);
    return () => window.removeEventListener('vexa-toast', handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[99999] flex flex-col gap-2 sm:bottom-8 sm:right-6" dir="rtl">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-bold shadow-2xl backdrop-blur-sm animate-fade-in-up min-w-[220px] max-w-[320px] ${
            toast.type === 'error'
              ? 'border-red-500/30 bg-red-950/90 text-red-200'
              : toast.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-200'
              : 'border-white/15 bg-[#1a1a1a]/95 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={16} className="flex-shrink-0 text-red-400" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-400" />
          ) : null}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            aria-label="إغلاق"
            className="text-white/40 hover:text-white transition"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};