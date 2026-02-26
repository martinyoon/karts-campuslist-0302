import { getPosts } from '@/lib/api';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PopularPostsSection from '@/components/post/PopularPostsSection';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import { Separator } from '@/components/ui/separator';
import Breadcrumb from '@/components/layout/Breadcrumb';
import UniversityBanner from '@/components/layout/UniversityBanner';

export default async function HomePage() {
  const [latestPosts, popularPosts] = await Promise.all([
    getPosts({ sortBy: 'latest', limit: 20 }),
    getPosts({ sortBy: 'popular', limit: 5 }),
  ]);

  return (
    <div>
      <UniversityTabs />

      <UniversityBanner name="모든 대학" subtitle="전체 캠퍼스 통합 · All Universities" />

      <Breadcrumb
        segments={[{ label: '모든 대학', suffix: '· 전체보기' }]}
        showTrailingSeparator
      />

      {/* 카테고리 바로가기 */}
      <CategoryGrid />

      <Separator />

      {/* 실시간 인기글 */}
      {popularPosts.length > 0 && (
        <>
          <PopularPostsSection posts={popularPosts} />
          <Separator />
        </>
      )}

      {/* 최신 게시글 */}
      <div id="post-list" />
      <section>
        <div className="flex items-center justify-between px-4 py-2"> {/* 간격 압축: py-4 → py-2 */}
          <h2 className="text-xl font-bold">최신 게시글</h2>
          <span className="text-sm text-muted-foreground">총 {latestPosts.length}건</span>
        </div>

        <PostFeedWithLocal serverPosts={latestPosts} />
      </section>
    </div>
  );
}
