'use client';

import { universities } from '@/data/universities';

interface Props {
  selectedId: number;
  onSelect: (id: number) => void;
}

export default function WriteUniversityTabs({ selectedId, onSelect }: Props) {
  const selectedSlug = universities.find(u => u.id === selectedId)?.slug;

  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto border-b border-border px-4 scrollbar-hide">
        {universities.map(uni => (
          <button
            key={uni.slug}
            onClick={() => onSelect(uni.id)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
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
