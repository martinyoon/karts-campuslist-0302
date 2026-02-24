'use client';

import { majorCategories } from '@/data/categories';

interface Props {
  activeId: number | null;
  onSelect: (id: number) => void;
}

export default function WriteCategoryGrid({ activeId, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-4 scrollbar-hide">
      {majorCategories.map(cat => {
        const isActive = activeId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-2 rounded-xl border py-4 transition-all hover:scale-105 ${isActive ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/50 hover:bg-blue-500/5'}`}
          >
            <span className="cat-icon text-3xl sm:text-4xl">{cat.icon}</span>
            <span className={`whitespace-nowrap text-sm font-bold sm:text-base ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
