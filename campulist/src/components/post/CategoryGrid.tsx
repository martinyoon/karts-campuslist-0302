'use client';

import Link from 'next/link';
import { majorCategories } from '@/data/categories';

type CategoryGridProps =
  | { mode?: 'link'; universitySlug?: string; activeSlug?: string }
  | { mode: 'select'; activeId: number | null; onSelect: (id: number) => void };

export default function CategoryGrid(props: CategoryGridProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto px-4 py-2 scrollbar-hide"> {/* 간격 압축: py-4 → py-2, gap-2 → gap-1.5 */}
      {majorCategories.map(cat => {
        const isActive = props.mode === 'select'
          ? props.activeId === cat.id
          : props.activeSlug === cat.slug;

        const itemClass = `flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 rounded-xl border py-2 transition-all hover:scale-105 ${isActive ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/50 hover:bg-blue-500/5'}`; /* 간격 압축: gap-2 → gap-1, py-4 → py-2 */

        const inner = (
          <>
            <span className="cat-icon text-3xl sm:text-4xl">{cat.icon}</span>
            <span className={`whitespace-nowrap text-sm font-bold sm:text-base ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>{cat.name}</span>
          </>
        );

        if (props.mode === 'select') {
          return (
            <button key={cat.id} onClick={() => props.onSelect(cat.id)} className={itemClass}>
              {inner}
            </button>
          );
        }

        return (
          <Link
            key={cat.slug}
            href={props.universitySlug ? `/${props.universitySlug}/${cat.slug}` : `/all/${cat.slug}`}
            className={itemClass}
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
