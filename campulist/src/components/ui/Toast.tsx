'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

type ToastVariant = 'default' | 'success' | 'error';

type ToastSize = 'sm' | 'lg';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
  size: ToastSize;
  dismissOnMove: boolean;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number, size?: ToastSize, dismissOnMove?: boolean) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = 'default', duration: number = 2500, size: ToastSize = 'sm', dismissOnMove: boolean = false) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, variant, duration, size, dismissOnMove }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div role="status" aria-live="polite" className="fixed bottom-20 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2 md:bottom-8">
        {toasts.map(t => (
          <ToastMessage key={t.id} item={t} onDone={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-foreground text-background',
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
};

function ToastMessage({ item, onDone }: { item: ToastItem; onDone: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onDone(item.id), 200);
  }, [item.id, onDone]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(dismiss, item.duration);

    if (item.dismissOnMove) {
      const handler = () => { clearTimeout(timer); dismiss(); };
      window.addEventListener('mousemove', handler, { once: true });
      window.addEventListener('touchstart', handler, { once: true });
      return () => { clearTimeout(timer); window.removeEventListener('mousemove', handler); window.removeEventListener('touchstart', handler); };
    }

    return () => clearTimeout(timer);
  }, [item.id, item.duration, item.dismissOnMove, onDone, dismiss]);

  return (
    <div
      className={`rounded-lg shadow-lg transition-all duration-200 ${item.size === 'lg' ? 'px-6 py-3 text-2xl font-bold' : 'px-4 py-2.5 text-sm'} ${variantStyles[item.variant]} ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      {item.message}
    </div>
  );
}
