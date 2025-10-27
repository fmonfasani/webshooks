"use client";
import React, { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';
type ToastItem = { id: string; type: ToastType; message: string };

type Listener = (t: ToastItem) => void;
const listeners = new Set<Listener>();

function emit(t: ToastItem) { listeners.forEach(l => l(t)); }

function show(type: ToastType, message: string) {
  emit({ id: Math.random().toString(36).slice(2), type, message });
}

export const toast = {
  success: (msg: string) => show('success', msg),
  error: (msg: string) => show('error', msg),
  info: (msg: string) => show('info', msg),
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => {
    const onToast: Listener = (t) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => {
        setItems((prev) => prev.filter(i => i.id !== t.id));
      }, 3000);
    };
    listeners.add(onToast);
    return () => { listeners.delete(onToast); };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {items.map(i => (
        <div key={i.id} className={[
          'rounded-md px-3 py-2 shadow text-sm',
          i.type === 'success' ? 'bg-green-600 text-white' : i.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'
        ].join(' ')}>
          {i.message}
        </div>
      ))}
    </div>
  );
}

