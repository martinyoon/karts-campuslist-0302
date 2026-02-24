'use client';

import { majorCategories, getMinorCategories } from '@/data/categories';
import { universities } from '@/data/universities';

interface Props {
  universityId: number;
  majorId: number;
  minorId: number;
  onChangeCategory: () => void;
}

export default function CategorySummary({ universityId, majorId, minorId, onChangeCategory }: Props) {
  const uni = universities.find(u => u.id === universityId);
  const major = majorCategories.find(c => c.id === majorId);
  const minor = getMinorCategories(majorId).find(c => c.id === minorId);

  return (
    <div id="field-category" className="flex items-center justify-between px-4 py-2">
      <nav aria-label="브레드크럼" className="flex items-center gap-2 text-base text-muted-foreground">
        <span className="text-orange-400">모든 대학</span>
        <span className="text-orange-300">›</span>
        <span className="text-orange-400">{uni?.name || '대학'}</span>
        <span className="text-orange-300">›</span>
        <span className="text-orange-400"><span className="cat-icon">{major?.icon} </span>{major?.name}</span>
        <span className="text-orange-300">›</span>
        <span className="font-semibold text-orange-400">{minor?.name}</span>
      </nav>
      <button
        onClick={onChangeCategory}
        className="shrink-0 text-xs text-orange-400 hover:text-orange-300 hover:underline"
      >
        변경
      </button>
    </div>
  );
}
