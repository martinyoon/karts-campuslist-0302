import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { SORT_OPTIONS } from '@/lib/constants';

interface SortBadgeRowProps {
  sortBy: string;
  buildHref: (sortValue: string) => string;
  /** border-b border-border pb-1.5 by default; override for pages without border */
  className?: string;
}

export default function SortBadgeRow({ sortBy, buildHref, className }: SortBadgeRowProps) {
  return (
    <div className={`flex gap-1.5 overflow-x-auto px-4 scrollbar-hide ${className ?? 'border-b border-border pb-0.5'}`}>
      {SORT_OPTIONS.map(opt => (
        <Link key={opt.value} href={buildHref(opt.value)}>
          <Badge
            variant={sortBy === opt.value ? 'default' : 'outline'}
            className={`shrink-0 cursor-pointer ${sortBy === opt.value ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
          >
            {opt.label}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
