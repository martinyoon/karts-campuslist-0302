'use client';

import { majorCategories, getMinorCategories } from '@/data/categories';
import { Button } from '@/components/ui/button';

interface Props {
  majorId: number;
  selectedMinorId: number | null;
  onSelect: (minorId: number) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function CategoryStepMinor({
  majorId, selectedMinorId, onSelect, onContinue, onBack,
}: Props) {
  const major = majorCategories.find(c => c.id === majorId);
  const minors = getMinorCategories(majorId);

  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={onBack}
          className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          대분류 다시 선택
        </button>
        <h2 className="text-lg font-bold">
          <span className="cat-icon">{major?.icon} </span>{major?.name}
        </h2>
        <p className="text-sm text-muted-foreground">세부 카테고리를 선택해주세요</p>
      </div>

      <div className="space-y-1.5">
        {minors.map(cat => (
          <label
            key={cat.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
              selectedMinorId === cat.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-border hover:bg-muted'
            }`}
          >
            <input
              type="radio"
              name="minor-category"
              value={cat.id}
              checked={selectedMinorId === cat.id}
              onChange={() => onSelect(cat.id)}
              className="accent-blue-500"
            />
            <span className="cat-icon text-lg">{cat.icon}</span>
            <span className="text-sm font-medium">{cat.name}</span>
          </label>
        ))}
      </div>

      <Button
        onClick={onContinue}
        disabled={!selectedMinorId}
        className="w-full bg-blue-600 py-6 text-base hover:bg-blue-700"
      >
        계속하기
      </Button>
    </div>
  );
}
