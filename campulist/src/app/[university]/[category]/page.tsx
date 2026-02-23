import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts, getUniversityBySlug } from '@/lib/api';
import { getCategoryBySlug, getMinorCategories } from '@/data/categories';
import UniversityTabs from '@/components/post/UniversityTabs';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import EmptyState from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/badge';

interface Props {
  params: Promise<{ university: string; category: string }>;
  searchParams: Promise<{ minor?: string; sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { university: uniSlug, category: catSlug } = await params;
  const university = await getUniversityBySlug(uniSlug);
  const category = getCategoryBySlug(catSlug);
  if (!university || !category) return { title: '캠퍼스리스트' };
  return {
    title: `${category.icon} ${category.name} | ${university.name} | 캠퍼스리스트`,
    description: `${university.name} ${category.name} 게시글 목록 - 캠퍼스리스트`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { university: uniSlug, category: catSlug } = await params;
  const { minor: minorSlug, sort } = await searchParams;
  const sortBy = (sort as 'latest' | 'price_asc' | 'price_desc' | 'popular') || 'latest';

  const university = await getUniversityBySlug(uniSlug);
  const category = getCategoryBySlug(catSlug);
  if (!university || !category || category.parentId !== null) notFound();

  const minors = getMinorCategories(category.id);
  const posts = await getPosts({
    universitySlug: uniSlug,
    categoryMajorSlug: catSlug,
    categoryMinorSlug: minorSlug || undefined,
    sortBy,
    limit: 30,
  });

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'price_asc', label: '가격 낮은순' },
    { value: 'price_desc', label: '가격 높은순' },
    { value: 'popular', label: '인기순' },
  ];

  const buildUrl = (params: { minor?: string; sort?: string }) => {
    const base = `/${uniSlug}/${catSlug}`;
    const sp = new URLSearchParams();
    const m = params.minor ?? minorSlug;
    const s = params.sort ?? sort;
    if (m) sp.set('minor', m);
    if (s && s !== 'latest') sp.set('sort', s);
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const activeMinor = minorSlug ? minors.find(m => m.slug === minorSlug) : null;

  return (
    <div>
      <UniversityTabs />

      {/* 대학 정보 (컴팩트) */}
      <div className="bg-blue-950/30 px-4 py-2 dark:bg-blue-950/40">
        <p className="text-sm">
          <span className="font-bold text-blue-400 dark:text-blue-300">{university.name}</span>
          <span className="ml-1.5 text-blue-500/70 dark:text-blue-400/70">{university.region}</span>
        </p>
      </div>

      {/* 카테고리 헤더 */}
      <div className="border-b border-border px-4 py-4">
        <nav className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-lg text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
          <Link href={`/${uniSlug}`} className="font-semibold hover:text-amber-500 hover:underline">
            {university.name}
          </Link>
          <span className="font-normal text-amber-400/50">›</span>
          {activeMinor ? (
            <Link href={buildUrl({ minor: '' })} className="font-semibold hover:text-amber-500 hover:underline">
              <span className="cat-icon">{category.icon} </span>{category.name}
            </Link>
          ) : (
            <span className="font-bold"><span className="cat-icon">{category.icon} </span>{category.name}</span>
          )}
          {activeMinor && (
            <>
              <span className="font-normal text-amber-400/50">›</span>
              <span className="font-bold">{activeMinor.name}</span>
            </>
          )}
        </nav>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-xl font-bold"><span className="cat-icon">{category.icon} </span>{category.name}</h1>
          <span className="text-sm text-muted-foreground">{posts.length}건</span>
        </div>
      </div>

      {/* 소분류 필터 */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        <a href={buildUrl({ minor: '' })}>
          <Badge
            variant={!minorSlug ? 'default' : 'outline'}
            className={`shrink-0 cursor-pointer ${!minorSlug ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
          >
            전체보기
          </Badge>
        </a>
        {minors.map(minor => (
          <a key={minor.slug} href={buildUrl({ minor: minor.slug })}>
            <Badge
              variant={minorSlug === minor.slug ? 'default' : 'outline'}
              className={`shrink-0 cursor-pointer ${minorSlug === minor.slug ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
            >
              <span className="cat-icon">{minor.icon} </span>{minor.name}
            </Badge>
          </a>
        ))}
      </div>

      {/* 정렬 옵션 */}
      <div className="flex gap-2 overflow-x-auto border-b border-border px-4 pb-3 scrollbar-hide">
        {sortOptions.map(opt => (
          <a key={opt.value} href={buildUrl({ sort: opt.value })}>
            <Badge
              variant={sortBy === opt.value ? 'default' : 'outline'}
              className={`shrink-0 cursor-pointer ${sortBy === opt.value ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
            >
              {opt.label}
            </Badge>
          </a>
        ))}
      </div>

      {/* 게시글 목록 */}
      <PostFeedWithLocal
        serverPosts={posts}
        universityId={university.id}
        categoryMajorId={category.id}
        categoryMinorId={minorSlug ? minors.find(m => m.slug === minorSlug)?.id : undefined}
        sortBy={sortBy}
        emptyState={<EmptyState message="이 카테고리에 게시글이 없습니다." />}
      />
    </div>
  );
}
