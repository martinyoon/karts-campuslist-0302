'use client';

import { useState } from 'react';
import { majorCategories } from '@/data/categories';
import CategoryDirectory from './CategoryDirectory';

interface CategoryGridProps {
  universitySlug?: string;
}

export default function CategoryGrid({ universitySlug }: CategoryGridProps) {
  const [open, setOpen] = useState(false);
  const [activeMajorId, setActiveMajorId] = useState<number | null>(null);

  const handleClick = (majorId: number) => {
    setActiveMajorId(majorId);
    setOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-3 px-4 py-4 sm:grid-cols-7">
        {majorCategories.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleClick(cat.id)}
            className="flex flex-col items-center gap-2 rounded-xl border border-border py-4 transition-colors hover:border-blue-500/50 hover:bg-blue-500/5"
          >
            <span className="cat-icon text-4xl">{cat.icon}</span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{cat.name}</span>
          </button>
        ))}
      </div>

      <CategoryDirectory
        open={open}
        onOpenChange={setOpen}
        activeMajorId={activeMajorId}
        universitySlug={universitySlug}
      />
    </>
  );
}
