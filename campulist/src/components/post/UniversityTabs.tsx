'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { universities } from '@/data/universities';
import { majorCategories } from '@/data/categories';

type UniversityTabsProps =
  | { mode?: 'link' }
  | { mode: 'select'; selectedId: number; onSelect: (id: number) => void };

export default function UniversityTabs(props: UniversityTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* ── select mode: button 기반 ── */
  if (props.mode === 'select') {
    const selectedSlug = universities.find(u => u.id === props.selectedId)?.slug;
    return (
      <div className="relative">
        <div className="flex gap-1 overflow-x-auto border-b border-border px-4 scrollbar-hide">
          {universities.map(uni => (
            <button
              key={uni.slug}
              onClick={() => props.onSelect(uni.id)}
              className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${ /* 간격 압축: py-3 → py-2 */
                selectedSlug === uni.slug ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {uni.name.replace('대학교', '대')}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
      </div>
    );
  }

  /* ── link mode (default): Link 기반 ── */
  const currentSlug = universities.find(u => pathname.startsWith(`/${u.slug}`))?.slug;

  // pathname에서 카테고리 slug 추출
  const pathParts = pathname.split('/').filter(Boolean);
  const secondSegment = pathParts[1];
  const currentCatSlug = secondSegment && majorCategories.some(c => c.slug === secondSegment)
    ? secondSegment : null;

  // 검색 파라미터 유지 (minor, sort)
  const queryString = searchParams.toString();
  const qs = queryString ? `?${queryString}` : '';

  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto border-b border-border px-4 scrollbar-hide">
        <Link
          href={currentCatSlug ? `/all/${currentCatSlug}${qs}` : '/'}
          className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${ /* 간격 압축: py-3 → py-2 */
            !currentSlug ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          모든 대학
        </Link>
        {universities.map(uni => (
          <Link
            key={uni.slug}
            href={currentCatSlug ? `/${uni.slug}/${currentCatSlug}${qs}` : `/${uni.slug}`}
            className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${ /* 간격 압축: py-3 → py-2 */
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
