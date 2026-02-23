import type { Metadata } from 'next';
import { getPosts } from '@/lib/api';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import EmptyState from '@/components/ui/EmptyState';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: '캠퍼스 광고 | 캠퍼스리스트',
  description: '대학가 주변 맛집, 학원, 서비스 광고 - 캠퍼스리스트',
};

export default async function AdBoardPage() {
  const latestAdPosts = await getPosts({ boardType: 'ad', sortBy: 'latest', limit: 30 });

  return (
    <div>
      {/* 대학 선택 탭 (보드 탭 포함) */}
      <UniversityTabs />

      {/* 광고 보드 배너 */}
      <div className="bg-orange-950/30 px-4 py-4 dark:bg-orange-950/40">
        <h1 className="text-xl font-bold text-orange-400 dark:text-orange-300">📢 캠퍼스 광고</h1>
        <p className="mt-0.5 text-sm text-orange-500 dark:text-orange-400">대학가 주변 맛집, 학원, 서비스 광고</p>
      </div>

      {/* 광고 카테고리 그리드 */}
      <CategoryGrid boardType="ad" />

      <Separator />

      {/* 최신 광고 */}
      <section>
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-xl font-bold">최신 광고</h2>
          <span className="text-sm text-muted-foreground">총 {latestAdPosts.length}건</span>
        </div>

        <PostFeedWithLocal
          serverPosts={latestAdPosts}
          boardType="ad"
          emptyState={<EmptyState message="아직 광고가 없습니다." sub="첫 번째 광고를 올려보세요!" />}
        />
      </section>
    </div>
  );
}
