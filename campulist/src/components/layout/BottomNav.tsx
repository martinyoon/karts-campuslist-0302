'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { getMyUnreadTotal } from '@/lib/camtalk';
import { useAuth } from '@/contexts/AuthContext';
import { getWriteUrl } from '@/lib/writeUrl';

const navItems = [
  { href: '/', label: '홈', icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
  { href: '/search', label: '검색', icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> },
  { href: '/write', label: '글쓰기', icon: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg> },
  { href: '/camtalk', label: '캠톡', icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
  { href: '/my', label: 'MY', icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg> },
];

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const writeHref = getWriteUrl(pathname, searchParams.toString());
  const [chatUnread, setChatUnread] = useState(0);

  useEffect(() => {
    setChatUnread(user ? getMyUnreadTotal(user.id) : 0);
    const update = () => setChatUnread(user ? getMyUnreadTotal(user.id) : 0);
    window.addEventListener('camtalkUpdate', update);
    return () => window.removeEventListener('camtalkUpdate', update);
  }, [user]);

  return (
    <nav aria-label="하단 메뉴" className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-around">
        {navItems.map(item => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href === '/write' ? writeHref : item.href}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center gap-0.5 ${isActive ? 'text-blue-500' : 'text-muted-foreground'}`}
            >
              {item.icon(isActive)}
              {item.href === '/camtalk' && chatUnread > 0 && (
                <span className="absolute -right-1.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {chatUnread > 99 ? '99+' : chatUnread}
                </span>
              )}
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
