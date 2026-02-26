'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { majorCategories, getCategoryGroups } from '@/data/categories';

const CAT_EXPANDED_KEY = 'campulist_cat_expanded';

type CategoryGridProps = { children?: React.ReactNode } & (
  | { mode?: 'link'; universitySlug?: string; activeSlug?: string; activeMinorSlug?: string }
  | { mode: 'select'; activeId: number | null; onSelect: (id: number) => void }
);

export default function CategoryGrid(props: CategoryGridProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(CAT_EXPANDED_KEY) === 'true';
  });

  // A: 스크롤 애니메이션 충돌 방지용 ref
  const animFrameRef = useRef<number | null>(null);

  // animFrameRef cleanup (언마운트 시 애니메이션 취소)
  useEffect(() => {
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  // D: 상단 대분류 가로 스크롤 영역 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // C: 펼침 영역 내 활성 대분류 그룹 ref
  const activeGroupRef = useRef<HTMLDivElement>(null);

  // A: 공통 스무스 스크롤 함수 (중복 제거)
  const smoothScrollToPostList = () => {
    // 진행 중인 애니메이션 취소
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

  const toggleExpanded = () => {
    setExpanded(prev => {
      const next = !prev;
      sessionStorage.setItem(CAT_EXPANDED_KEY, String(next));
      return next;
    });
  };

  // D: 활성 대분류를 가로 스크롤 영역 중앙으로 자동 스크롤
  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = activeItemRef.current;
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: itemLeft - containerWidth / 2 + itemWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [props.mode === 'select' ? undefined : (props as { activeSlug?: string }).activeSlug]);

  // C: 펼침 시 활성 대분류 그룹으로 자동 스크롤
  useEffect(() => {
    if (expanded && activeGroupRef.current) {
      const timer = setTimeout(() => {
        activeGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  return (
    <div>
      {/* 대분류 가로 스크롤 */}
      <div ref={scrollContainerRef} className="flex gap-1 overflow-x-auto px-4 pb-1 pt-0.5 scrollbar-hide">
        {majorCategories.map(cat => {
          const isActive = props.mode === 'select'
            ? props.activeId === cat.id
            : props.activeSlug === cat.slug;

          const itemClass = `flex items-center gap-1 rounded-full border px-3 py-0.5 transition-all hover:scale-105 ${isActive ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/50 hover:bg-blue-500/5'}`;

          const inner = (
            <>
              <span className="cat-icon text-2xl">{cat.icon}</span>
              <span className={`whitespace-nowrap text-lg font-bold ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>{cat.name}</span>
            </>
          );

          const triangle = isActive && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0 w-0 border-x-[8px] border-t-[8px] border-x-transparent border-t-blue-500 dark:border-t-blue-400" />
          );

          if (props.mode === 'select') {
            return (
              <div key={cat.id} className="relative shrink-0">
                <button onClick={() => props.onSelect(cat.id)} className={itemClass}>
                  {inner}
                </button>
                {triangle}
              </div>
            );
          }

          return (
            <div key={cat.slug} ref={isActive ? activeItemRef : undefined} className="relative shrink-0">
              <button
                onClick={() => {
                  const url = props.universitySlug ? `/${props.universitySlug}/${cat.slug}` : `/all/${cat.slug}`;
                  router.push(url);
                  smoothScrollToPostList();
                }}
                className={itemClass}
              >
                {inner}
              </button>
              {triangle}
            </div>
          );
        })}
      </div>

      {/* 소분류 필터 (부모에서 children으로 전달) — 클릭 시 스크롤 */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={() => smoothScrollToPostList()}>
        {props.children}
      </div>

      {/* 펼쳐보기/접기 토글 — link 모드에서만 표시 */}
      {props.mode !== 'select' && (
        <>
          <button
            onClick={toggleExpanded}
            className={`flex w-full items-center justify-center gap-1 py-1.5 text-sm transition-colors ${expanded ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <span>{expanded ? '카테고리 전체보기 접기' : '카테고리 전체보기 펴기'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* 펼침 영역 — 대분류별 소분류 목록 */}
          {expanded && (
            <div className="border-t border-border px-4 pb-2">
              {getCategoryGroups().map(({ major, minors }, idx, arr) => {
                const baseUrl = props.universitySlug ? `/${props.universitySlug}` : '/all';
                const isMajorActive = props.activeSlug === major.slug;
                return (
                  <div key={major.id} ref={isMajorActive ? activeGroupRef : undefined}>
                    <button
                      onClick={() => {
                        router.push(`${baseUrl}/${major.slug}`);
                        smoothScrollToPostList();
                      }}
                      className={`flex w-full items-center gap-1.5 py-2 transition-colors hover:text-orange-500 dark:hover:text-orange-400 ${isMajorActive ? 'text-orange-500 dark:text-orange-400' : 'text-foreground'}`}
                    >
                      <span className="cat-icon text-lg">{major.icon}</span>
                      <span className={`text-base font-bold ${isMajorActive ? 'text-orange-500 dark:text-orange-400' : ''}`}>{major.name}</span>
                      <span className={`text-sm ${isMajorActive ? 'text-orange-400 dark:text-orange-300' : 'text-blue-500'}`}>전체보기 ›</span>
                    </button>

                    <div className="flex flex-wrap gap-1.5 pb-2">
                      {minors.map(minor => {
                        const isMinorActive = isMajorActive && props.activeMinorSlug === minor.slug;
                        return (
                          <button
                            key={minor.id}
                            onClick={() => {
                              router.push(`${baseUrl}/${major.slug}?minor=${minor.slug}`);
                              smoothScrollToPostList();
                            }}
                            className={`rounded-md border px-2 py-0.5 text-xs transition-colors ${isMinorActive ? 'border-orange-500 bg-orange-50 font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' : 'border-border text-foreground hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-orange-500/10 dark:hover:text-orange-400'}`}
                          >
                            {minor.name}
                          </button>
                        );
                      })}
                    </div>

                    {idx < arr.length - 1 && <div className="border-b border-border" />}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
