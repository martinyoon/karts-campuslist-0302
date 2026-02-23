'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

interface ToastItem {
  id: number;
  message: string;
}

interface ToastContextValue {
  toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2">
        {toasts.map(t => (
          <ToastMessage key={t.id} item={t} onDone={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastMessage({ item, onDone }: { item: ToastItem; onDone: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone(item.id), 200);
    }, 2500);
    return () => clearTimeout(timer);
  }, [item.id, onDone]);

  return (
    <div
      className={`rounded-lg bg-foreground px-4 py-2.5 text-sm text-background shadow-lg transition-all duration-200 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      {item.message}
    </div>
  );
}
