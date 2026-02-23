import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getUniversityBySlug } from '@/lib/api';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import EmptyState from '@/components/ui/EmptyState';
import { Separator } from '@/components/ui/separator';

interface Props {
  params: Promise<{ university: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { university: slug } = await params;
  const university = await getUniversityBySlug(slug);
  if (!university) return { title: '캠퍼스 광고 | 캠퍼스리스트' };
  return {
    title: `캠퍼스 광고 | ${university.name} | 캠퍼스리스트`,
    description: `${university.name} 근처 맛집, 학원, 서비스 광고 - 캠퍼스리스트`,
  };
}

export default async function AdUniversityPage({ params }: Props) {
  const { university: slug } = await params;
  const university = await getUniversityBySlug(slug);
  if (!university) notFound();

  const adPosts = await getPosts({ boardType: 'ad', universitySlug: slug, sortBy: 'latest', limit: 30 });

  return (
    <div>
      <UniversityTabs />

      {/* 대학 정보 배너 (광고 테마) */}
      <div className="bg-orange-950/30 px-4 py-4 dark:bg-orange-950/40">
        <h1 className="text-xl font-bold text-orange-400 dark:text-orange-300">📢 {university.name} 근처 광고</h1>
        <p className="mt-0.5 text-sm text-orange-500 dark:text-orange-400">{university.region} · 맛집, 학원, 서비스</p>
      </div>

      <CategoryGrid universitySlug={slug} boardType="ad" />

      <Separator />

      <section>
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-bold">{university.name} 근처 광고</h2>
          <span className="text-sm text-muted-foreground">{adPosts.length}건</span>
        </div>

        <PostFeedWithLocal
          serverPosts={adPosts}
          universityId={university.id}
          boardType="ad"
          emptyState={<EmptyState message="아직 이 대학 근처 광고가 없습니다." sub="첫 번째 광고를 올려보세요!" />}
        />
      </section>
    </div>
  );
}
