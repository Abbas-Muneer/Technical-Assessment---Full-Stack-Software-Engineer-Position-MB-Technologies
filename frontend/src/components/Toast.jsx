import { useEffect } from 'react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast, onClose]);

  if (!toast) {
    return null;
  }

  const toneClasses =
    toast.variant === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50">
      <div className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm font-medium shadow-xl ${toneClasses}`}>
        {toast.message}
      </div>
    </div>
  );
}

