'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { universities } from '@/data/universities';

export default function UniversityTabs() {
  const pathname = usePathname();

  const isAdBoard = pathname === '/ad' || pathname.startsWith('/ad/');
  const effectivePath = isAdBoard ? pathname.slice(3) || '/' : pathname;
  const currentSlug = universities.find(u => effectivePath.startsWith(`/${u.slug}`))?.slug;

  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto border-b border-border px-4 scrollbar-hide">
        {/* 보드 탭 */}
        <Link
          href={currentSlug ? `/${currentSlug}` : '/'}
          className={`shrink-0 border-b-2 px-3 py-3 text-[15px] font-medium transition-colors ${
            !isAdBoard ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          📚 캠퍼스
        </Link>
        <Link
          href={currentSlug ? `/ad/${currentSlug}` : '/ad'}
          className={`shrink-0 border-b-2 px-3 py-3 text-[15px] font-medium transition-colors ${
            isAdBoard ? 'border-orange-500 text-orange-500' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          📢 광고
        </Link>

        {/* 구분선 */}
        <div className="my-2.5 w-px shrink-0 bg-border" />

        {/* 대학 탭 */}
        <Link
          href={isAdBoard ? '/ad' : '/'}
          className={`shrink-0 border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
            !currentSlug ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          모든 대학
        </Link>
        {universities.map(uni => (
          <Link
            key={uni.slug}
            href={isAdBoard ? `/ad/${uni.slug}` : `/${uni.slug}`}
            className={`shrink-0 border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
              currentSlug === uni.slug ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {uni.name.replace('대학교', '대')}
          </Link>
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
