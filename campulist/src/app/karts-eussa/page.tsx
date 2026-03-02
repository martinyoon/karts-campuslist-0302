import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/api';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import SortBadgeRow from '@/components/post/SortBadgeRow';
import EmptyState from '@/components/ui/EmptyState';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import EussaClientBits from './EussaClientBits';

export const metadata: Metadata = {
  title: '🔥 한예종으쌰으쌰 | 캠퍼스리스트',
  description: '한예종으쌰으쌰 게시판 - 캠퍼스리스트',
};

/* 인기 태그 */
const POPULAR_TAGS = ['시험기간', '졸업작품', '공연준비', '전시', '합평', '오디션', '연습', '레슨', '협업', '축제'];

interface Props {
  searchParams: Promise<{ q?: string; sort?: string }>;
}

export default async function EussaPage({ searchParams }: Props) {
  const { q, sort } = await searchParams;
  const query = q?.trim() || '';
  const sortBy = (sort as 'latest' | 'price_asc' | 'price_desc' | 'popular') || 'latest';

  const posts = await getPosts({
    universitySlug: 'karts',
    categoryMajorSlug: 'community',
    categoryMinorSlug: 'cheer',
    query: query || undefined,
    sortBy,
    limit: 50,
  });

  const buildSortHref = (s: string) => {
    const sp = new URLSearchParams();
    if (query) sp.set('q', query);
    if (s && s !== 'latest') sp.set('sort', s);
    const qs = sp.toString();
    return qs ? `/karts-eussa?${qs}` : '/karts-eussa';
  };

  return (
    <div>
      {/* 브레드크럼: 한예종 › 게시판 › 으쌰으쌰 › */}
      <Breadcrumb
        segments={[
          { label: '한예종', href: '/karts' },
          { label: '게시판', href: '/karts/community', icon: '👥' },
          { label: '으쌰으쌰' },
        ]}
        showTrailingSeparator
      />

      {/* 한예종 테마 헤더 + 응원 카운터 */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-700 px-4 py-4 text-center text-white">
        <h1 className="text-2xl font-bold">🔥 한예종으쌰으쌰 🔥</h1>
        <p className="mt-1 text-sm text-blue-200">
          오늘의 으쌰으쌰 🔥 {posts.length}건
        </p>
      </div>

      {/* 랜덤 응원 한마디 + 검색창 (클라이언트) */}
      <EussaClientBits query={query} sort={sort} />

      {/* 인기 태그 뱃지 */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-2 scrollbar-hide">
        {POPULAR_TAGS.map(tag => (
          <Link key={tag} href={`/karts-eussa?q=${encodeURIComponent(tag)}`}>
            <Badge
              variant="outline"
              className={`shrink-0 cursor-pointer px-2.5 py-0.5 text-sm ${
                query === tag
                  ? 'border-2 border-orange-500 font-bold text-orange-600 dark:text-orange-300'
                  : 'border-orange-400 text-orange-600 hover:bg-orange-50 dark:text-orange-300 dark:hover:bg-orange-950'
              }`}
            >
              #{tag}
            </Badge>
          </Link>
        ))}
      </div>

      {/* 정렬 옵션 */}
      <SortBadgeRow sortBy={sortBy} buildHref={buildSortHref} />

      {/* 게시글 목록 (한예종 으쌰으쌰만) */}
      <div id="post-list" />
      <PostFeedWithLocal
        serverPosts={posts}
        universityId={5}
        categoryMajorId={4}
        categoryMinorId={48}
        query={query || undefined}
        sortBy={sortBy}
        emptyState={
          query
            ? <EmptyState message={`"${query}" 결과가 없습니다.`} sub="다른 검색어로 시도해보세요." />
            : <EmptyState message="으쌰으쌰 게시글이 아직 없습니다." sub="첫 번째 으쌰으쌰 글을 작성해보세요!" actionLabel="글쓰기" actionHref="/write?uni=karts&major=community&minor=cheer" />
        }
      />
    </div>
  );
}
