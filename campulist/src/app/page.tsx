import Link from 'next/link';
import { getPosts } from '@/lib/api';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PopularPostsSection from '@/components/post/PopularPostsSection';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/format';

export default async function HomePage() {
  const [latestPosts, popularPosts, adPreviewPosts] = await Promise.all([
    getPosts({ boardType: 'campus', sortBy: 'latest', limit: 20 }),
    getPosts({ boardType: 'campus', sortBy: 'popular', limit: 5 }),
    getPosts({ boardType: 'ad', sortBy: 'popular', limit: 5 }),
  ]);

  return (
    <div>
      {/* 대학 선택 탭 (보드 탭 포함) */}
      <UniversityTabs />

      {/* 모든 대학 정보 배너 */}
      <div className="bg-blue-950/30 px-4 py-4 dark:bg-blue-950/40">
        <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">모든 대학</h1>
        <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">전체 캠퍼스 통합 · All Universities</p>
      </div>

      {/* 카테고리 바로가기 */}
      <CategoryGrid boardType="campus" />

      <Separator />

      {/* 실시간 인기글 (접기/펴기) */}
      <PopularPostsSection posts={popularPosts} />

      <Separator />

      {/* 우리 대학 근처 인기 광고 */}
      {adPreviewPosts.length > 0 && (
        <>
          <section>
            <div className="flex items-center justify-between px-4 py-4">
              <h2 className="text-xl font-bold">📢 우리 대학 근처</h2>
              <Link href="/ad" className="text-sm text-orange-500 hover:text-orange-600">광고 더보기</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-4">
              {adPreviewPosts.map(ap => (
                <Link
                  key={ap.id}
                  href={`/post/${ap.id}`}
                  className="w-60 shrink-0 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3.5 transition-colors hover:bg-orange-500/10"
                >
                  <span className="text-sm font-medium text-orange-500">{ap.categoryMinor.name}</span>
                  <h3 className="mt-1 truncate text-[15px] font-medium">{ap.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{ap.bodySnippet}</p>
                  {ap.price !== null && (
                    <p className="mt-1.5 text-base font-bold">{formatPrice(ap.price)}</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-1 text-[13px] text-muted-foreground">
                    <span>❤️ {ap.likeCount}</span>
                    <span>· {ap.university.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <Separator />
        </>
      )}

      {/* 최신 게시글 */}
      <section>
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-xl font-bold">최신 게시글</h2>
          <span className="text-sm text-muted-foreground">총 {latestPosts.length}건</span>
        </div>

        <PostFeedWithLocal serverPosts={latestPosts} boardType="campus" />
      </section>
    </div>
  );
}
