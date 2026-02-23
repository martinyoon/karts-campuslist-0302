'use client';

import { majorCategories, getMinorCategories } from '@/data/categories';
import { Button } from '@/components/ui/button';

interface Props {
  selectedMajorId: number | null;
  onSelect: (majorId: number) => void;
  onContinue: () => void;
}

export default function CategoryStepMajor({ selectedMajorId, onSelect, onContinue }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">어떤 종류의 글인가요?</h2>
        <p className="text-sm text-muted-foreground">대분류를 선택해주세요</p>
      </div>

      <div className="space-y-1.5">
        {majorCategories.map(cat => (
          <label
            key={cat.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
              selectedMajorId === cat.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-border hover:bg-muted'
            }`}
          >
            <input
              type="radio"
              name="major-category"
              value={cat.id}
              checked={selectedMajorId === cat.id}
              onChange={() => onSelect(cat.id)}
              className="accent-blue-500"
            />
            <span className="cat-icon text-xl">{cat.icon}</span>
            <div className="flex-1">
              <span className="text-sm font-medium">{cat.name}</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {getMinorCategories(cat.id).map(m => (
                  <span key={m.id} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{m.name}</span>
                ))}
              </div>
            </div>
          </label>
        ))}
      </div>

      <Button
        onClick={onContinue}
        disabled={!selectedMajorId}
        className="w-full bg-blue-600 py-6 text-base hover:bg-blue-700"
      >
        계속하기
      </Button>
    </div>
  );
}
