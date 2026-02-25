import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts, getUniversityBySlug } from '@/lib/api';
import SortBadgeRow from '@/components/post/SortBadgeRow';
import { getCategoryBySlug, getMinorCategories } from '@/data/categories';
import { Badge } from '@/components/ui/badge';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import EmptyState from '@/components/ui/EmptyState';
import Breadcrumb from '@/components/layout/Breadcrumb';
import UniversityBanner from '@/components/layout/UniversityBanner';

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

      <UniversityBanner name={university.name} subtitle={`${university.region} · ${university.nameEn}`} />

      <Breadcrumb
        segments={activeMinor ? [
          { label: '모든 대학', href: '/' },
          { label: university.name, href: `/${uniSlug}` },
          { label: category.name, href: buildUrl({ minor: '' }), icon: category.icon },
          { label: activeMinor.name },
        ] : [
          { label: '모든 대학', href: '/' },
          { label: university.name, href: `/${uniSlug}` },
          { label: category.name, icon: category.icon, suffix: '· 전체보기' },
        ]}
        showTrailingSeparator
      />

      {/* 카테고리 바로가기 */}
      <CategoryGrid universitySlug={uniSlug} activeSlug={catSlug} />

      {/* 소분류 필터 — 선택된 대분류와 동일 blue 계열로 시각적 연결 */}
      <div className="mx-4 mb-0.5 rounded-md bg-blue-50/70 px-2 py-px dark:bg-blue-950/30">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {minors.map(minor => (
            <Link key={minor.slug} href={buildUrl({ minor: minor.slug })}>
              <Badge
                variant="outline"
                className={`shrink-0 cursor-pointer text-sm px-2.5 py-0.5 ${minorSlug === minor.slug ? 'border-2 border-orange-500 text-orange-600 font-bold dark:text-orange-300' : 'border-orange-400 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950'}`}
              >
                <span className="cat-icon">{minor.icon} </span>{minor.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <SortBadgeRow sortBy={sortBy} buildHref={s => buildUrl({ sort: s })} />

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
