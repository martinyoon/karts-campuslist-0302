import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getUniversityBySlug } from '@/lib/api';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import EmptyState from '@/components/ui/EmptyState';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'popular', label: '인기순' },
] as const;

export default async function UniversityPage({ params, searchParams }: Props) {
  const { university: slug } = await params;
  const { sort } = await searchParams;
  const university = await getUniversityBySlug(slug);
  if (!university) notFound();

  const sortBy = (sort as 'latest' | 'price_asc' | 'price_desc' | 'popular') || 'latest';
  const posts = await getPosts({ universitySlug: slug, sortBy, limit: 20 });

  return (
    <div>
      <UniversityTabs />

      {/* 대학 정보 배너 */}
      <div className="bg-blue-950/30 px-4 py-4 dark:bg-blue-950/40">
        <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">{university.name}</h1>
        <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">{university.region} · {university.nameEn}</p>
      </div>

      <CategoryGrid universitySlug={slug} />

      <Separator />

      <section>
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-bold">{university.name} 게시글</h2>
          <span className="text-sm text-muted-foreground">{posts.length}건</span>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {sortOptions.map(opt => (
            <a key={opt.value} href={`/${slug}?sort=${opt.value}`}>
              <Badge
                variant={sortBy === opt.value ? 'default' : 'outline'}
                className={`shrink-0 cursor-pointer ${sortBy === opt.value ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
              >
                {opt.label}
              </Badge>
            </a>
          ))}
        </div>

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
