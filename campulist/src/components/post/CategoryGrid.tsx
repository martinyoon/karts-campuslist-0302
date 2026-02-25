'use client';

import Link from 'next/link';
import { majorCategories } from '@/data/categories';

type CategoryGridProps =
  | { mode?: 'link'; universitySlug?: string; activeSlug?: string }
  | { mode: 'select'; activeId: number | null; onSelect: (id: number) => void };

export default function CategoryGrid(props: CategoryGridProps) {
  return (
    <div className="flex gap-1 overflow-x-auto px-4 pb-1 pt-0.5 scrollbar-hide">
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
          <div key={cat.slug} className="relative shrink-0">
            <Link
              href={props.universitySlug ? `/${props.universitySlug}/${cat.slug}` : `/all/${cat.slug}`}
              className={itemClass}
            >
              {inner}
            </Link>
            {triangle}
          </div>
        );
      })}
    </div>
  );
}
