import { getPosts } from '@/lib/api';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PopularPostsSection from '@/components/post/PopularPostsSection';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import { Separator } from '@/components/ui/separator';

export default async function HomePage() {
  const [latestPosts, popularPosts] = await Promise.all([
    getPosts({ sortBy: 'latest', limit: 20 }),
    getPosts({ sortBy: 'popular', limit: 5 }),
  ]);

  return (
    <div>
      <UniversityTabs />

      {/* 모든 대학 정보 배너 — 간격 압축: py-4 → py-2 */}
      <div className="bg-blue-950/30 px-4 py-2 dark:bg-blue-950/40">
        <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">모든 대학</h1>
        <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">전체 캠퍼스 통합 · All Universities</p>
      </div>

      {/* 브레드크럼 — 간격 압축: py-2 → py-1 */}
      <div className="border-b border-border px-4 py-1">
        <nav aria-label="브레드크럼" className="flex items-center gap-2 text-base text-muted-foreground">
          <span className="font-semibold text-orange-400">모든 대학 · 전체보기</span>
          <span className="text-orange-300">›</span>
        </nav>
      </div>

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
