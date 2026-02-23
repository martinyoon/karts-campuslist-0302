'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PriceFilterProps {
  query: string;
  sort: string;
  currentMin?: number;
  currentMax?: number;
}

export default function PriceFilter({ query, sort, currentMin, currentMax }: PriceFilterProps) {
  const router = useRouter();
  const [min, setMin] = useState(currentMin?.toString() || '');
  const [max, setMax] = useState(currentMax?.toString() || '');
  const [open, setOpen] = useState(currentMin !== undefined || currentMax !== undefined);

  const apply = () => {
    const params = new URLSearchParams();
    params.set('q', query);
    if (sort !== 'latest') params.set('sort', sort);
    if (min) params.set('priceMin', min);
    if (max) params.set('priceMax', max);
    router.push(`/search?${params.toString()}`);
  };

  const clear = () => {
    setMin('');
    setMax('');
    const params = new URLSearchParams();
    params.set('q', query);
    if (sort !== 'latest') params.set('sort', sort);
    router.push(`/search?${params.toString()}`);
  };

  const hasFilter = currentMin !== undefined || currentMax !== undefined;

  return (
    <div className="border-b border-border px-4 py-2">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-sm ${hasFilter ? 'font-medium text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        가격 필터
        {hasFilter && ' (적용중)'}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="mt-2 flex items-center gap-2 pb-1">
          <Input
            type="number"
            placeholder="최소"
            value={min}
            onChange={e => setMin(e.target.value)}
            className="h-8 w-24 text-sm"
          />
          <span className="text-xs text-muted-foreground">~</span>
          <Input
            type="number"
            placeholder="최대"
            value={max}
            onChange={e => setMax(e.target.value)}
            className="h-8 w-24 text-sm"
          />
          <span className="text-xs text-muted-foreground">원</span>
          <Button size="sm" onClick={apply} className="h-8 bg-blue-600 px-3 text-xs hover:bg-blue-700">
            적용
          </Button>
          {hasFilter && (
            <Button size="sm" variant="ghost" onClick={clear} className="h-8 px-2 text-xs text-muted-foreground">
              초기화
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
