import Link from 'next/link';
import { majorCategories } from '@/data/categories';

interface CategoryGridProps {
  universitySlug?: string;
}

export default function CategoryGrid({ universitySlug }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3 px-4 py-4 sm:grid-cols-7">
      {majorCategories.map(cat => (
        <Link
          key={cat.slug}
          href={universitySlug ? `/${universitySlug}/${cat.slug}` : `/all/${cat.slug}`}
          className="flex flex-col items-center gap-2 rounded-xl border border-border py-4 transition-colors hover:border-blue-500/50 hover:bg-blue-500/5"
        >
          <span className="cat-icon text-4xl">{cat.icon}</span>
          <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
