import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getUniversityBySlug } from '@/lib/api';
import SortBadgeRow from '@/components/post/SortBadgeRow';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import EmptyState from '@/components/ui/EmptyState';
import { Separator } from '@/components/ui/separator';
import Breadcrumb from '@/components/layout/Breadcrumb';
import UniversityBanner from '@/components/layout/UniversityBanner';

interface Props {
  params: Promise<{ university: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { university: slug } = await params;
  const university = await getUniversityBySlug(slug);
  if (!university) return { title: '캠퍼스리스트' };
  return {
    title: `${university.name} | 캠퍼스리스트`,
    description: `${university.name} 캠퍼스 중고거래, 주거, 일자리, 커뮤니티 - 캠퍼스리스트`,
  };
}

export default async function UniversityPage({ params, searchParams }: Props) {
  const { university: slug } = await params;
  const { sort } = await searchParams;
  const university = await getUniversityBySlug(slug);
  if (!university) notFound();

  const sortBy = (sort as 'latest' | 'price_asc' | 'price_desc' | 'popular') || 'latest';

  const posts = await getPosts({
    universitySlug: slug,
    sortBy,
    limit: 20,
  });

  const buildSortHref = (sortValue: string) => {
    if (sortValue === 'latest') return `/${slug}`;
    return `/${slug}?sort=${sortValue}`;
  };

  return (
    <div>
      <UniversityTabs />

      <UniversityBanner name={university.name} subtitle={`${university.region} · ${university.nameEn}`} />

      <Breadcrumb
        segments={[
          { label: '모든 대학', href: '/' },
          { label: university.name, suffix: '· 전체보기' },
        ]}
        showTrailingSeparator
      />

      <CategoryGrid universitySlug={slug} />

      <Separator />

      <div id="post-list" />
      <section>
        <div className="flex items-center justify-between px-4 py-2"> {/* 간격 압축: py-4 → py-2 */}
          <h2 className="text-xl font-bold">{university.name} 게시글</h2>
          <span className="text-sm text-muted-foreground">{posts.length}건</span>
        </div>
        <SortBadgeRow sortBy={sortBy} buildHref={buildSortHref} className="pb-1.5" />

        <PostFeedWithLocal
          serverPosts={posts}
          universityId={university.id}
          sortBy={sortBy}
          emptyState={<EmptyState message="아직 게시글이 없습니다." />}
        />
      </section>
    </div>
  );
}
