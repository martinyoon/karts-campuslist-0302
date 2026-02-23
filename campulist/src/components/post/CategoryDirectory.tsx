'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCategoryGroups } from '@/data/categories';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeMajorId: number | null;
  universitySlug?: string;
}

export default function CategoryDirectory({
  open,
  onOpenChange,
  activeMajorId,
  universitySlug,
}: Props) {
  const router = useRouter();
  const groups = getCategoryGroups();
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && activeRef.current) {
      setTimeout(() => {
        activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [open, activeMajorId]);

  const baseUrl = universitySlug ? `/${universitySlug}` : '/all';

  const handleMajorClick = (majorSlug: string) => {
    router.push(`${baseUrl}/${majorSlug}`);
    onOpenChange(false);
  };

  const handleMinorClick = (majorSlug: string, minorSlug: string) => {
    router.push(`${baseUrl}/${majorSlug}?minor=${minorSlug}`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[75vh] overflow-hidden rounded-t-2xl">
        <SheetHeader className="pb-0">
          <SheetTitle className="text-lg">카테고리 전체보기</SheetTitle>
        </SheetHeader>

        <div className="columns-2 gap-4 overflow-y-auto px-4 pb-4">
          {groups.map(({ major, minors }, idx) => {
            const isActive = major.id === activeMajorId;
            return (
              <div
                key={major.id}
                ref={isActive ? activeRef : undefined}
                className="mb-1 break-inside-avoid"
              >
                {/* 대분류 헤더 */}
                <button
                  onClick={() => handleMajorClick(major.slug)}
                  className={`flex w-full items-center gap-1.5 rounded-lg py-2 text-left transition-colors hover:text-blue-500 ${
                    isActive
                      ? 'bg-amber-500/15 px-2 text-amber-600 dark:text-amber-400'
                      : ''
                  }`}
                >
                  <span className={`cat-icon ${isActive ? 'text-xl' : 'text-lg'}`}>{major.icon}</span>
                  <span className={isActive ? 'text-lg font-bold' : 'text-lg font-bold'}>{major.name}</span>
                  <span className={`text-lg font-normal ${isActive ? 'text-amber-500' : 'text-blue-500'}`}>전체 ›</span>
                </button>

                {/* 소분류 목록 */}
                <div className="flex flex-wrap gap-1 pb-2">
                  {minors.map(minor => (
                    <button
                      key={minor.id}
                      onClick={() => handleMinorClick(major.slug, minor.slug)}
                      className="rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {minor.name}
                    </button>
                  ))}
                </div>

                {/* 구분선 (마지막 제외) */}
                {idx < groups.length - 1 && <div className="border-b border-border" />}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
