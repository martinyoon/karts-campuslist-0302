'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';
import IconToggle from '@/components/IconToggle';
import { universities } from '@/data/universities';
import { majorCategories } from '@/data/categories';
import { getMyUnreadTotal } from '@/lib/camtalk';
import { useAuth } from '@/contexts/AuthContext';
import { getWriteUrl } from '@/lib/writeUrl';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const animFrameRef = useRef<number | null>(null);
  const writeHref = getWriteUrl(pathname, searchParams.toString());
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHighlight, setMenuHighlight] = useState(false);

  const handleMenuClick = () => {
    setMenuHighlight(true);
    setTimeout(() => setMenuOpen(true), 30);
  };
  const handleSheetChange = (open: boolean) => {
    setMenuOpen(open);
    if (!open) setMenuHighlight(false);
  };

  useEffect(() => {
    const update = () => setUnreadCount(user ? getMyUnreadTotal(user.id) : 0);
    update();
    window.addEventListener('camtalkUpdate', update);
    return () => window.removeEventListener('camtalkUpdate', update);
  }, [user]);

  // animFrameRef cleanup (언마운트 시 애니메이션 취소)
  useEffect(() => {
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  // 현재 pathname에서 대학 slug, 카테고리 slug 추출
  const currentUniSlug = universities.find(u => pathname.startsWith(`/${u.slug}`))?.slug;
  const pathParts = pathname.split('/').filter(Boolean);
  const secondSegment = pathParts[1];
  const currentCatSlug = secondSegment && majorCategories.some(c => c.slug === secondSegment)
    ? secondSegment : null;
  const isHome = pathname === '/' || universities.some(u => pathname === `/${u.slug}`);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-1.5 px-4"> {/* 간격 압축: gap-3 → gap-1.5 */}
        {/* 모바일 메뉴 */}
            <button type="button" onClick={handleMenuClick} className={`flex h-auto flex-col items-center gap-0.5 px-2 py-1 transition-colors duration-100 ${menuHighlight ? 'text-orange-400' : 'text-muted-foreground'}`} aria-label="메뉴 열기">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              <span className="text-xs font-medium">메뉴</span>
            </button>
            <Sheet open={menuOpen} onOpenChange={handleSheetChange}>
              <SheetContent side="left" className="w-72">
                <SheetHeader className="sr-only"><SheetTitle>메뉴</SheetTitle></SheetHeader>
                <nav className="mt-4 flex flex-col gap-2"> {/* 간격 압축: mt-8 → mt-4, gap-4 → gap-2 */}
                  <p className="text-sm font-semibold text-muted-foreground">대학교</p>
                  {universities.map(uni => {
                    const isActive = pathname.startsWith(`/${uni.slug}`);
                    return (
                      <Link key={uni.slug} href={currentCatSlug ? `/${uni.slug}/${currentCatSlug}` : `/${uni.slug}`} className={`text-base ${isActive ? 'font-semibold text-orange-400' : 'hover:text-orange-400'}`}>
                        {uni.name}
                      </Link>
                    );
                  })}
                  <div className="my-1 border-t border-border" /> {/* 간격 압축: my-2 → my-1 */}
                  <p className="text-sm font-semibold text-muted-foreground">카테고리</p>
                  {majorCategories.map(cat => {
                    const catHref = currentUniSlug ? `/${currentUniSlug}/${cat.slug}` : `/all/${cat.slug}`;
                    const isActive = pathname.startsWith(catHref);
                    return (
                      <Link key={cat.slug} href={catHref} className={`text-base ${isActive ? 'font-semibold text-orange-400' : 'hover:text-orange-400'}`}>
                        <span className="cat-icon">{cat.icon} </span>{cat.name}
                      </Link>
                    );
                  })}
                  <div className="my-1 border-t border-border" />
                  <Link href="/suggest" className="text-base hover:text-orange-400">📬 건의하기</Link>
                </nav>
              </SheetContent>
            </Sheet>

            {/* 로고 */}
            <button
              onClick={() => {
                router.push('/');
                if (animFrameRef.current) {
                  cancelAnimationFrame(animFrameRef.current);
                  animFrameRef.current = null;
                }
                setTimeout(() => {
                  const target = document.getElementById('post-list');
                  if (!target) return;
                  const start = window.scrollY;
                  const targetTop = target.getBoundingClientRect().top + start;
                  const offset = window.innerHeight * 1 / 5;
                  const end = Math.max(0, targetTop - offset);
                  const distance = end - start;
                  const duration = 600;
                  let startTime: number | null = null;
                  const step = (timestamp: number) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const ease = progress < 0.5
                      ? 2 * progress * progress
                      : 1 - (-2 * progress + 2) ** 2 / 2;
                    window.scrollTo(0, start + distance * ease);
                    if (progress < 1) {
                      animFrameRef.current = requestAnimationFrame(step);
                    } else {
                      animFrameRef.current = null;
                    }
                  };
                  animFrameRef.current = requestAnimationFrame(step);
                }, 300);
              }}
              className="flex shrink-0 flex-col leading-tight"
            >
              <span className={`text-xl font-bold ${isHome ? 'text-orange-400' : 'text-muted-foreground'}`}>캠퍼스리스트</span>
              <span className="hidden text-xs text-muted-foreground md:block">Campu(s)+LIST+.COM=CAMPuLIST.COM</span>
            </button>

            {/* 우측 버튼 */}
            <div className="ml-auto flex items-center gap-1">
              <Link href="/search" className={`flex h-auto flex-col items-center gap-0.5 px-2 py-1 ${pathname.startsWith('/search') ? 'text-orange-400' : 'text-muted-foreground'}`} aria-label="검색">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <span className="text-xs font-medium">검색</span>
              </Link>
              <span className="hidden md:flex md:items-center md:gap-1">
                <IconToggle />
                <ThemeToggle />
              </span>
              {user ? (
                <>
                  <Link
                    href={writeHref}
                    onClick={e => {
                      if (pathname.startsWith('/write')) {
                        e.preventDefault();
                        document.getElementById('write-submit-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className={`flex h-auto flex-col items-center gap-0.5 px-2 py-1 ${pathname.startsWith('/write') ? 'text-orange-400' : 'text-muted-foreground'}`}
                    aria-label="글쓰기"
                  >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                      <span className="text-xs font-medium">글쓰기</span>
                  </Link>
                  <Link href="/camtalk" className={`relative flex h-auto flex-col items-center gap-0.5 px-2 py-1 ${pathname.startsWith('/camtalk') ? 'text-orange-400' : 'text-muted-foreground'}`} aria-label="캠퍼스톡">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                      <span className="text-xs font-medium">캠퍼스톡</span>
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/my" className={`flex h-auto flex-col items-center gap-0.5 px-2 py-1 ${pathname.startsWith('/my') ? 'text-orange-400' : 'text-muted-foreground'}`} aria-label="마이페이지">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
                      <span className="text-xs font-medium">MY</span>
                  </Link>
                </>
              ) : (
                <Link href="/auth">
                  <Button size="sm" variant="outline">
                    로그인
                  </Button>
                </Link>
              )}
            </div>
      </div>
    </header>
  );
}
