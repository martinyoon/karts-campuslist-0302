import Link from 'next/link';
import { getPosts } from '@/lib/api';
import PostCard from '@/components/post/PostCard';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PopularPostsSection from '@/components/post/PopularPostsSection';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import { Separator } from '@/components/ui/separator';
import Breadcrumb from '@/components/layout/Breadcrumb';
import UniversityBanner from '@/components/layout/UniversityBanner';

export default async function HomePage() {
  const [latestPosts, popularPosts, lessonPosts] = await Promise.all([
    getPosts({ sortBy: 'latest', limit: 20 }),
    getPosts({ sortBy: 'popular', limit: 5 }),
    getPosts({ universitySlug: 'karts', categoryMinorSlug: 'lesson', sortBy: 'latest', limit: 5 }),
  ]);

  return (
    <div>
      {/* 레슨 히어로 배너 */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 px-4 py-8 text-center text-white">
        <p className="text-sm font-medium tracking-wide opacity-80">한예종 레슨</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight">
          한예종 학생에게<br />
          음악·미술·연기 레슨을 받아보세요
        </h1>
        <Link
          href="/write?uni=karts&major=jobs&minor=lesson&from=home-lesson"
          className="mt-5 inline-block rounded-full bg-orange-500 px-8 py-3 text-base font-bold text-white shadow-lg transition-colors hover:bg-orange-600"
        >
          레슨 요청 글쓰기
        </Link>
        <p className="mt-3 text-sm opacity-70">
          현재 {lessonPosts.length}건의 레슨 요청이 등록되어 있습니다
        </p>
      </section>

      {/* 한예종 - 으쌰으쌰 바로가기 (컴팩트) */}
      <Link
        href="/karts-eussa"
        className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        <span>🔥 한예종으쌰으쌰</span>
        <span className="text-xs opacity-80">바로가기 →</span>
      </Link>

      {/* 최신 레슨 요청 */}
      <section className="border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-bold">최신 레슨 요청</h2>
          <Link href="/karts/jobs?minor=lesson" className="text-sm font-medium text-primary hover:underline">
            전체보기 →
          </Link>
        </div>
        {lessonPosts.length > 0 ? (
          <div>
            {lessonPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-muted-foreground">
            <p className="text-base">아직 레슨 요청이 없습니다.</p>
            <p className="mt-1 text-sm">첫 번째 요청을 올려보세요!</p>
          </div>
        )}
      </section>

      <Separator />

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
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-xl font-bold">최신 게시글</h2>
          <span className="text-sm text-muted-foreground">총 {latestPosts.length}건</span>
        </div>

        <PostFeedWithLocal serverPosts={latestPosts} />
      </section>
    </div>
  );
}
