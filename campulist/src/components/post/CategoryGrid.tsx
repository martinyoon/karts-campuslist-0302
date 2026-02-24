import Link from 'next/link';
import { majorCategories } from '@/data/categories';

interface CategoryGridProps {
  universitySlug?: string;
}

export default function CategoryGrid({ universitySlug }: CategoryGridProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-4 scrollbar-hide">
      {majorCategories.map(cat => (
        <Link
          key={cat.slug}
          href={universitySlug ? `/${universitySlug}/${cat.slug}` : `/all/${cat.slug}`}
          className="flex min-w-[4.5rem] flex-1 flex-col items-center gap-2 rounded-xl border border-border py-4 transition-all hover:scale-105 hover:border-blue-500/50 hover:bg-blue-500/5"
        >
          <span className="cat-icon text-3xl sm:text-4xl">{cat.icon}</span>
          <span className="whitespace-nowrap text-sm font-bold text-amber-600 sm:text-base dark:text-amber-400">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
