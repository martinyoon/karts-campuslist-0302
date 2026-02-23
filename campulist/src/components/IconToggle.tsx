'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { STORAGE_KEYS } from '@/lib/constants';

export default function IconToggle() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOW_ICONS);
    const val = saved === 'true';
    setShow(val);
    if (val) document.documentElement.classList.add('show-cat-icons');
    setMounted(true);
  }, []);

  if (!mounted) return <Button variant="ghost" size="icon" className="h-9 w-9" />;

  const toggle = () => {
    const next = !show;
    setShow(next);
    localStorage.setItem(STORAGE_KEYS.SHOW_ICONS, String(next));
    if (next) document.documentElement.classList.add('show-cat-icons');
    else document.documentElement.classList.remove('show-cat-icons');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={toggle}
      title={show ? '아이콘 숨기기' : '아이콘 표시'}
    >
      {show ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
      )}
    </Button>
  );
}
