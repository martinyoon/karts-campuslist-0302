'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

const AUTO_SLIDE_INTERVAL = 5000; // 5초마다 자동 넘김

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const userInteractedRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const programmaticTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // 사용자가 터치/스크롤하면 자동 슬라이드 완전 정지 (재개 없음)
  const handleUserInteraction = useCallback(() => {
    if (userInteractedRef.current) return;
    userInteractedRef.current = true;
    clearInterval(timerRef.current);
  }, []);

  // 스크롤 이벤트: 프로그래밍 방식 스크롤이 아닌 경우에만 정지
  const handleScroll = useCallback(() => {
    if (!programmaticScrollRef.current) {
      handleUserInteraction();
    }
  }, [handleUserInteraction]);

  // 특정 인덱스로 스크롤 (프로그래밍 방식)
  const scrollToIndex = useCallback((idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    programmaticScrollRef.current = true;
    clearTimeout(programmaticTimerRef.current);
    const itemWidth = container.offsetWidth;
    container.scrollTo({ left: itemWidth * idx, behavior: 'smooth' });
    programmaticTimerRef.current = setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 600);
  }, []);

  // IntersectionObserver로 현재 보이는 이미지 감지
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const idx = Number(entry.target.getAttribute('data-index'));
        if (!isNaN(idx)) setCurrent(idx);
      }
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || images.length <= 1) return;

    const observer = new IntersectionObserver(observerCallback, {
      root: container,
      threshold: 0.5,
    });

    const items = container.querySelectorAll('[data-index]');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [images.length, observerCallback]);

  // 자동 슬라이드 (사용자 조작 시 완전 정지)
  useEffect(() => {
    if (images.length <= 1) return;

    timerRef.current = setInterval(() => {
      if (userInteractedRef.current) return;
      // DOM에서 현재 위치를 직접 읽어 정확한 인덱스 계산
      const container = scrollRef.current;
      if (!container) return;
      const itemWidth = container.offsetWidth;
      if (itemWidth === 0) return;
      const currentIdx = Math.round(container.scrollLeft / itemWidth);
      const next = currentIdx < images.length - 1 ? currentIdx + 1 : 0;
      setCurrent(next);
      scrollToIndex(next);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timerRef.current);
  }, [images.length, scrollToIndex]);

  // programmatic scroll 타이머 cleanup
  useEffect(() => {
    return () => clearTimeout(programmaticTimerRef.current);
  }, []);

  // 이미지 0장: placeholder (Hooks 뒤에 배치하여 Hook 규칙 준수)
  if (images.length === 0) {
    return (
      <div className="ml-4 mt-2 flex w-1/3 aspect-video items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
      </div>
    );
  }

  return (
    <div className="relative ml-4 mt-2 w-1/3 aspect-video overflow-hidden rounded-xl bg-muted">
      <div
        ref={scrollRef}
        className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        onTouchStart={handleUserInteraction}
        onMouseDown={handleUserInteraction}
        onWheel={handleUserInteraction}
        onScroll={handleScroll}
      >
        {images.map((src, i) => (
          <div key={i} data-index={i} className="h-full w-full shrink-0 snap-start">
            <img
              src={src}
              alt={`${title} - ${i + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* 도트 인디케이터 */}
      {images.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
