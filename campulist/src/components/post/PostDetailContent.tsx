import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ImageGallery from '@/components/post/ImageGallery';
import PostCard from '@/components/post/PostCard';
import ReportButton from '@/components/post/ReportButton';
import LikeButton from '@/components/post/LikeButton';
import ShareButton from '@/components/post/ShareButton';
import PostStatusControl from '@/components/post/PostStatusControl';
import PostBottomAction from '@/components/post/PostBottomAction';
import ViewCountTracker from '@/components/post/ViewCountTracker';
import ContactMethodsDisplay from '@/components/post/ContactMethodsDisplay';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import type { PostDetail, PostListItem } from '@/lib/types';

interface PostDetailContentProps {
  post: PostDetail;
  relatedPosts: PostListItem[];
}

export default function PostDetailContent({ post, relatedPosts }: PostDetailContentProps) {
  return (
    <div className="pb-36 md:pb-24">
      {/* 이미지 갤러리 */}
      <ImageGallery images={post.images} title={post.title} />

      {/* 작성자 정보 — 간격 압축: py-4 → py-2, gap-3 → gap-2 */}
      <Link href={`/user/${post.authorId}`} className="flex items-center gap-2 border-b border-border px-4 py-2 transition-colors hover:bg-muted/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg font-medium">
          {post.author.nickname.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{post.author.nickname}</span>
            {post.author.isVerified && (
              <VerifiedBadge label={`${post.university.name} 인증`} compact />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            매너온도 {post.author.mannerTemp}° · 거래 {post.author.tradeCount}회
          </p>
        </div>
      </Link>

      <Breadcrumb segments={[
        { label: '모든 대학', href: '/' },
        { label: post.university.name, href: `/${post.university.slug}` },
        { label: post.categoryMajor.name, href: `/${post.university.slug}/${post.categoryMajor.slug}`, icon: post.categoryMajor.icon },
        { label: post.categoryMinor.name },
      ]} />

      {/* 게시글 내용 — 간격 압축: py-4 → py-2 */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-1.5"> {/* 간격 압축: gap-2 → gap-1.5 */}
          {post.status !== 'active' && (
            <Badge variant={post.status === 'reserved' ? 'secondary' : 'outline'} className={post.status === 'reserved' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}>
              {post.status === 'reserved' ? '예약중' : post.status === 'completed' ? '거래완료' : post.status}
            </Badge>
          )}
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {formatRelativeTime(post.createdAt)} · 조회 <ViewCountTracker postId={post.id} initialCount={post.viewCount} />
          </p>
          <ReportButton postId={post.id} />
        </div>

        <Separator className="my-2" /> {/* 간격 압축: my-4 → my-2 */}

        <div className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
          {post.body}
        </div>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5"> {/* 간격 압축: mt-4 → mt-2, gap-2 → gap-1.5 */}
            {post.tags.map(tag => (
              <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* 거래 장소 */}
        {post.locationDetail && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground"> {/* 간격 압축: mt-4 → mt-2, gap-2 → gap-1.5, py-2.5 → py-1.5 */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {post.locationDetail}
          </div>
        )}

        {/* 연락 방법 */}
        <ContactMethodsDisplay contactMethods={post.contactMethods} />
      </div>

      {/* 거래 상태 변경 (작성자만 표시) */}
      <PostStatusControl postId={post.id} authorId={post.authorId} initialStatus={post.status} />

      {/* 관련 게시글 */}
      {relatedPosts.length > 0 && (
        <>
          <Separator />
          <section className="px-4 py-2"> {/* 간격 압축: py-4 → py-2 */}
            <h2 className="mb-1.5 text-lg font-bold">관련 게시글</h2> {/* 간격 압축: mb-3 → mb-1.5 */}
            <div>
              {relatedPosts.map(rp => (
                <PostCard key={rp.id} post={rp} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* 하단 고정 바 — 간격 압축: py-3 → py-2, gap-3 → gap-1.5 */}
      <div className="fixed bottom-14 left-0 right-0 z-10 border-t border-border bg-background px-4 py-2 md:bottom-0">
        <div className="mx-auto flex max-w-5xl items-center gap-1.5">
          <LikeButton postId={post.id} initialLiked={post.isLiked} initialCount={post.likeCount} />
          <ShareButton />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold">{formatPrice(post.price)}</p>
            {post.priceNegotiable && (
              <p className="text-xs text-muted-foreground">가격 협의 가능</p>
            )}
          </div>
          <PostBottomAction
            postId={post.id}
            postTitle={post.title}
            postPrice={post.price}
            postThumbnail={post.images[0] || null}
            author={post.author}
          />
        </div>
      </div>
    </div>
  );
}
