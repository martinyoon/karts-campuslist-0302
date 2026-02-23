'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { STORAGE_KEYS } from '@/lib/constants';

const MAX_RECENT = 5;

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES) || '[]');
  } catch {
    return [];
  }
}

function saveRecent(searches: string[]) {
  localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
}

interface RecentSearchesProps {
  currentQuery?: string;
}

export default function RecentSearches({ currentQuery }: RecentSearchesProps) {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const list = getRecent();

    // 현재 검색어가 있으면 목록 맨 앞에 추가
    if (currentQuery) {
      const updated = [currentQuery, ...list.filter(q => q !== currentQuery)].slice(0, MAX_RECENT);
      saveRecent(updated);
      setRecent(updated);
    } else {
      setRecent(list);
    }
  }, [currentQuery]);

  const removeItem = (query: string) => {
    const updated = recent.filter(q => q !== query);
    saveRecent(updated);
    setRecent(updated);
  };

  const clearAll = () => {
    saveRecent([]);
    setRecent([]);
  };

  // 검색 결과가 있거나 최근 검색어가 없으면 렌더링 안 함
  if (currentQuery || recent.length === 0) return null;

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">최근 검색어</h2>
        <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">
          전체 삭제
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {recent.map(query => (
          <div key={query} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm">
            <Link href={`/search?q=${encodeURIComponent(query)}`} className="hover:text-blue-500">
              {query}
            </Link>
            <button onClick={() => removeItem(query)} className="ml-0.5 text-muted-foreground hover:text-foreground">
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
