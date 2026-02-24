import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts, getUniversityBySlug } from '@/lib/api';
import { getCategoryBySlug, getMinorCategories } from '@/data/categories';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
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

      {/* 대학 정보 배너 — 간격 압축: py-4 → py-2 */}
      <div className="bg-blue-950/30 px-4 py-2 dark:bg-blue-950/40">
        <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">{university.name}</h1>
        <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">{university.region} · {university.nameEn}</p>
      </div>

      {/* 브레드크럼 — 간격 압축: py-2 → py-1 */}
      <div className="border-b border-border px-4 py-1">
        <nav aria-label="브레드크럼" className="flex items-center gap-2 text-base text-muted-foreground">
          <Link href="/" className="text-orange-400 hover:text-orange-300 hover:underline">모든 대학</Link>
          <span className="text-orange-300">›</span>
          <Link href={`/${uniSlug}`} className="text-orange-400 hover:text-orange-300 hover:underline">{university.name}</Link>
          <span className="text-orange-300">›</span>
          {activeMinor ? (
            <Link href={buildUrl({ minor: '' })} className="text-orange-400 hover:text-orange-300 hover:underline">
              <span className="cat-icon">{category.icon} </span>{category.name}
            </Link>
          ) : (
            <span className="font-semibold text-orange-400"><span className="cat-icon">{category.icon} </span>{category.name}</span>
          )}
          {activeMinor && (
            <>
              <span className="text-orange-300">›</span>
              <span className="font-semibold text-orange-400">{activeMinor.name}</span>
            </>
          )}
        </nav>
      </div>

      {/* 카테고리 바로가기 */}
      <CategoryGrid universitySlug={uniSlug} activeSlug={catSlug} />

      {/* 소분류 필터 — 간격 압축: py-3 → py-1.5, gap-2 → gap-1.5 */}
      <div className="flex gap-1.5 overflow-x-auto px-4 py-1.5 scrollbar-hide">
        <Link href={buildUrl({ minor: '' })}>
          <Badge
            variant="outline"
            className={`shrink-0 cursor-pointer text-sm px-3 py-1 ${!minorSlug ? 'border-2 border-orange-500 text-orange-600 font-bold dark:text-orange-300' : 'border-orange-400 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950'}`}
          >
            전체보기
          </Badge>
        </Link>
        {minors.map(minor => (
          <Link key={minor.slug} href={buildUrl({ minor: minor.slug })}>
            <Badge
              variant="outline"
              className={`shrink-0 cursor-pointer text-sm px-3 py-1 ${minorSlug === minor.slug ? 'border-2 border-orange-500 text-orange-600 font-bold dark:text-orange-300' : 'border-orange-400 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950'}`}
            >
              <span className="cat-icon">{minor.icon} </span>{minor.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* 정렬 옵션 — 간격 압축: pb-3 → pb-1.5, gap-2 → gap-1.5 */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 pb-1.5 scrollbar-hide">
        {sortOptions.map(opt => (
          <Link key={opt.value} href={buildUrl({ sort: opt.value })}>
            <Badge
              variant={sortBy === opt.value ? 'default' : 'outline'}
              className={`shrink-0 cursor-pointer ${sortBy === opt.value ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
            >
              {opt.label}
            </Badge>
          </Link>
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
