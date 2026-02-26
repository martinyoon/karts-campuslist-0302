'use client';

import { useRef, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
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

  /* ── link mode (default): button + router.push 기반 ── */
  const router = useRouter();
  const animFrameRef = useRef<number | null>(null);

  // animFrameRef cleanup (언마운트 시 애니메이션 취소)
  useEffect(() => {
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  const currentSlug = universities.find(u => pathname.startsWith(`/${u.slug}`))?.slug;

  // pathname에서 카테고리 slug 추출
  const pathParts = pathname.split('/').filter(Boolean);
  const secondSegment = pathParts[1];
  const currentCatSlug = secondSegment && majorCategories.some(c => c.slug === secondSegment)
    ? secondSegment : null;

  // 검색 파라미터 유지 (minor, sort)
  const queryString = searchParams.toString();
  const qs = queryString ? `?${queryString}` : '';

  const navigateWithScroll = (url: string) => {
    router.push(url);
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
  };

  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto border-b border-border px-4 scrollbar-hide">
        <button
          onClick={() => navigateWithScroll(currentCatSlug ? `/all/${currentCatSlug}${qs}` : '/')}
          className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${ /* 간격 압축: py-3 → py-2 */
            !currentSlug ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          모든 대학
        </button>
        {universities.map(uni => (
          <button
            key={uni.slug}
            onClick={() => navigateWithScroll(currentCatSlug ? `/${uni.slug}/${currentCatSlug}${qs}` : `/${uni.slug}`)}
            className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${ /* 간격 압축: py-3 → py-2 */
              currentSlug === uni.slug ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
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
