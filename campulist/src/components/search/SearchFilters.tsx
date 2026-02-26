'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { universities } from '@/data/universities';
import { majorCategories } from '@/data/categories';

interface SearchFiltersProps {
  query: string;
  sort: string;
  priceMin?: number;
  priceMax?: number;
  currentUni?: string;
  currentCat?: string;
}

function buildHref(
  query: string,
  sort: string,
  priceMin: number | undefined,
  priceMax: number | undefined,
  uni?: string,
  cat?: string,
) {
  const p = new URLSearchParams();
  p.set('q', query);
  if (uni) p.set('uni', uni);
  if (cat) p.set('cat', cat);
  if (sort !== 'latest') p.set('sort', sort);
  if (priceMin !== undefined) p.set('priceMin', String(priceMin));
  if (priceMax !== undefined) p.set('priceMax', String(priceMax));
  return `/search?${p.toString()}`;
}

export default function SearchFilters({ query, sort, priceMin, priceMax, currentUni, currentCat }: SearchFiltersProps) {
  return (
    <div className="space-y-1 border-b border-border px-4 py-2">
      {/* 대학 필터 */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        <span className="shrink-0 text-xs text-muted-foreground">대학</span>
        <Link href={buildHref(query, sort, priceMin, priceMax, undefined, currentCat)}>
          <Badge
            variant={!currentUni ? 'default' : 'outline'}
            className={`shrink-0 cursor-pointer ${!currentUni ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
          >
            전체
          </Badge>
        </Link>
        {universities.map(u => (
          <Link key={u.slug} href={buildHref(query, sort, priceMin, priceMax, u.slug, currentCat)}>
            <Badge
              variant={currentUni === u.slug ? 'default' : 'outline'}
              className={`shrink-0 cursor-pointer ${currentUni === u.slug ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
            >
              {u.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        <span className="shrink-0 text-xs text-muted-foreground">분류</span>
        <Link href={buildHref(query, sort, priceMin, priceMax, currentUni, undefined)}>
          <Badge
            variant={!currentCat ? 'default' : 'outline'}
            className={`shrink-0 cursor-pointer ${!currentCat ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
          >
            전체
          </Badge>
        </Link>
        {majorCategories.map(c => (
          <Link key={c.slug} href={buildHref(query, sort, priceMin, priceMax, currentUni, c.slug)}>
            <Badge
              variant={currentCat === c.slug ? 'default' : 'outline'}
              className={`shrink-0 cursor-pointer ${currentCat === c.slug ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
            >
              {c.icon} {c.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
