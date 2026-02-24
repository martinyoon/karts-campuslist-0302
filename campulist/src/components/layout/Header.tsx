'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';
import IconToggle from '@/components/IconToggle';
import { universities } from '@/data/universities';
import { majorCategories } from '@/data/categories';
import { getMyUnreadTotal } from '@/lib/camtalk';
import { useAuth } from '@/contexts/AuthContext';
import { getWriteUrl } from '@/lib/writeUrl';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const writeHref = getWriteUrl(pathname, searchParams.toString());
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const update = () => setUnreadCount(user ? getMyUnreadTotal(user.id) : 0);
    update();
    window.addEventListener('camtalkUpdate', update);
    return () => window.removeEventListener('camtalkUpdate', update);
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  // 현재 pathname에서 대학 slug 추출
  const currentUniSlug = universities.find(u => pathname.startsWith(`/${u.slug}`))?.slug;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        {/* 모바일 메뉴 */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="메뉴 열기">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="mt-8 flex flex-col gap-4">
                  <p className="text-sm font-semibold text-muted-foreground">대학교</p>
                  {universities.map(uni => {
                    const isActive = pathname.startsWith(`/${uni.slug}`);
                    return (
                      <Link key={uni.slug} href={`/${uni.slug}`} className={`text-base ${isActive ? 'font-semibold text-blue-500' : 'hover:text-blue-500'}`}>
                        {uni.name}
                      </Link>
                    );
                  })}
                  <div className="my-2 border-t border-border" />
                  <p className="text-sm font-semibold text-muted-foreground">카테고리</p>
                  {majorCategories.map(cat => {
                    const catHref = currentUniSlug ? `/${currentUniSlug}/${cat.slug}` : `/all/${cat.slug}`;
                    const isActive = pathname.startsWith(catHref);
                    return (
                      <Link key={cat.slug} href={catHref} className={`text-base ${isActive ? 'font-semibold text-blue-500' : 'hover:text-blue-500'}`}>
                        <span className="cat-icon">{cat.icon} </span>{cat.name}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* 로고 */}
            <Link href="/" className="flex shrink-0 flex-col leading-tight">
              <span className="text-xl font-bold text-blue-500">캠퍼스리스트</span>
              <span className="hidden text-xs text-muted-foreground md:block">Campulist.com</span>
            </Link>

            {/* 데스크톱: 검색 */}
            <form onSubmit={handleSearch} className="hidden flex-1 md:block">
              <Input
                type="search"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
            </form>

            {/* 모바일: 돋보기 버튼 */}
            <Link href="/search" className={`ml-auto flex h-auto flex-col items-center gap-0 px-2 py-1 md:hidden ${pathname.startsWith('/search') ? 'text-orange-400' : 'text-muted-foreground'}`} aria-label="검색">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <span className="text-[10px] leading-tight">검색</span>
            </Link>

            {/* 우측 버튼 */}
            <div className="flex items-center gap-1 md:ml-auto">
              <span className="hidden md:flex md:items-center md:gap-1">
                <IconToggle />
                <ThemeToggle />
              </span>
              {user ? (
                <>
                  <Link href={writeHref}>
                    <Button variant="ghost" className={`flex h-auto flex-col items-center gap-0 px-2 py-1 ${pathname.startsWith('/write') ? 'text-orange-400' : 'text-muted-foreground'}`}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                      <span className="text-[10px] leading-tight">글쓰기</span>
                    </Button>
                  </Link>
                  <Link href="/camtalk" className="relative">
                    <Button variant="ghost" className={`flex h-auto flex-col items-center gap-0 px-2 py-1 ${pathname.startsWith('/camtalk') ? 'text-orange-400' : 'text-muted-foreground'}`} aria-label="캠톡">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                      <span className="text-[10px] leading-tight">캠톡</span>
                    </Button>
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/my">
                    <Button variant="ghost" className={`flex h-auto flex-col items-center gap-0 px-2 py-1 ${pathname.startsWith('/my') ? 'text-orange-400' : 'text-muted-foreground'}`} aria-label="마이페이지">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
                      <span className="text-[10px] leading-tight">MY</span>
                    </Button>
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
