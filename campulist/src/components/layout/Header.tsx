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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      setShowMobileSearch(false);
    }
  };

  // 현재 pathname에서 대학 slug 추출
  const currentUniSlug = universities.find(u => pathname.startsWith(`/${u.slug}`))?.slug;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        {/* 모바일: 검색 모드 */}
        {showMobileSearch ? (
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 md:hidden">
            <Input
              autoFocus
              type="search"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => setShowMobileSearch(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </Button>
          </form>
        ) : (
          <>
            {/* 모바일 메뉴 */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="mt-8 flex flex-col gap-4">
                  <p className="text-sm font-semibold text-muted-foreground">대학교</p>
                  {universities.map(uni => {
                    const isActive = pathname.startsWith(`/${uni.slug}`);
                    return (
                      <Link key={uni.slug} href={`/${uni.slug}`} className={`text-base ${isActive ? 'font-bold text-blue-500' : 'hover:text-blue-500'}`}>
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
                      <Link key={cat.slug} href={catHref} className={`text-base ${isActive ? 'font-bold text-blue-500' : 'hover:text-blue-500'}`}>
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
              <span className="hidden text-[10px] text-muted-foreground md:block">Campulist.com</span>
            </Link>

            {/* 데스크톱: 카테고리 네비게이션 */}
            <nav className="hidden items-center gap-1 md:flex">
              {majorCategories.map(cat => {
                const catHref = currentUniSlug ? `/${currentUniSlug}/${cat.slug}` : `/all/${cat.slug}`;
                const isActive = pathname.includes(`/${cat.slug}`);
                return (
                  <Link
                    key={cat.slug}
                    href={catHref}
                    className={`rounded-md px-2 py-1 text-sm transition-colors ${
                      isActive
                        ? 'font-semibold text-blue-500'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="cat-icon">{cat.icon}</span> {cat.name}
                  </Link>
                );
              })}
            </nav>

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
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto md:hidden"
              onClick={() => setShowMobileSearch(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </Button>

            {/* 우측 버튼 */}
            <div className="flex items-center gap-1 md:ml-auto">
              <span className="hidden md:flex md:items-center md:gap-1">
                <IconToggle />
                <ThemeToggle />
              </span>
              {user ? (
                <>
                  <Link href={writeHref}>
                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                      글쓰기
                    </Button>
                  </Link>
                  <Link href="/camtalk" className="relative">
                    <Button variant="ghost" size="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </Button>
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/my" className="hidden md:block">
                    <Button variant="ghost" size="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
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
          </>
        )}
      </div>
    </header>
  );
}
