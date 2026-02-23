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
  const uniShort = uni?.name.replace('대학교', '대') || '대학';
  const major = majorCategories.find(c => c.id === majorId);
  const minor = getMinorCategories(majorId).find(c => c.id === minorId);

  return (
    <div id="field-category" className="flex items-center justify-between rounded-lg bg-amber-500/10 px-3 py-2 dark:bg-amber-500/15">
      <nav className="flex items-center gap-2 text-lg text-amber-600 dark:text-amber-400">
        <span className="font-semibold">{uniShort}</span>
        <span className="font-normal text-amber-400/50">›</span>
        <span className="font-semibold"><span className="cat-icon">{major?.icon} </span>{major?.name}</span>
        <span className="font-normal text-amber-400/50">›</span>
        <span className="font-bold">{minor?.name}</span>
      </nav>
      <button
        onClick={onChangeCategory}
        className="shrink-0 text-xs text-amber-500 hover:underline"
      >
        변경
      </button>
    </div>
  );
}
