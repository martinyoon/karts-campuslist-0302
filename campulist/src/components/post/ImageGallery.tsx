'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="ml-4 mt-2 flex w-1/3 aspect-video items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
      </div>
    );
  }

  const goToPrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative ml-4 mt-2 w-1/3 aspect-video overflow-hidden rounded-xl bg-muted">
      <img
        src={images[currentIndex]}
        alt={`${title} - ${currentIndex + 1}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />

      {/* 좌우 네비게이션 버튼 */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-0.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            aria-label="이전 이미지"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            aria-label="다음 이미지"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
          </button>

          {/* 카운터 */}
          <div className="absolute bottom-0.5 right-0.5 rounded-full bg-black/60 px-1 py-px text-[10px] text-white">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
}
