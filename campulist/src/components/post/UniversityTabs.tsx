'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { universities } from '@/data/universities';

export default function UniversityTabs() {
  const pathname = usePathname();

  const currentSlug = universities.find(u => pathname.startsWith(`/${u.slug}`))?.slug;

  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto border-b border-border px-4 scrollbar-hide">
        <Link
          href="/"
          className={`shrink-0 border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
            !currentSlug ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          모든 대학
        </Link>
        {universities.map(uni => (
          <Link
            key={uni.slug}
            href={`/${uni.slug}`}
            className={`shrink-0 border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
              currentSlug === uni.slug ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {uni.name.replace('대학교', '대')}
          </Link>
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
