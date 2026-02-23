'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ImageGallery from '@/components/post/ImageGallery';
import ReportButton from '@/components/post/ReportButton';
import LikeButton from '@/components/post/LikeButton';
import ShareButton from '@/components/post/ShareButton';
import PostStatusControl from '@/components/post/PostStatusControl';
import PostBottomAction from '@/components/post/PostBottomAction';
import ViewCountTracker from '@/components/post/ViewCountTracker';
import PostCard from '@/components/post/PostCard';
import ContactMethodsDisplay from '@/components/post/ContactMethodsDisplay';
import { getPostDetail, getRelatedPosts } from '@/lib/api';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import type { PostDetail, PostListItem } from '@/lib/types';

interface LocalPostViewProps {
  id: string;
}

export default function LocalPostView({ id }: LocalPostViewProps) {
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, rp] = await Promise.all([
        getPostDetail(id),
        getRelatedPosts(id, 4),
      ]);
      setPost(p);
      setRelatedPosts(rp);
      setLoading(false);
      if (p) {
        document.title = `${p.title} | 캠퍼스리스트`;
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="px-4 py-16 text-center text-muted-foreground">
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="px-4 py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">게시글을 찾을 수 없습니다</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-36 md:pb-24">
      <ImageGallery images={post.images} title={post.title} />

      {/* 작성자 정보 */}
      <Link href={`/user/${post.authorId}`} className="flex items-center gap-3 border-b border-border px-4 py-4 transition-colors hover:bg-muted/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg font-medium">
          {post.author.nickname.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{post.author.nickname}</span>
            {post.author.isVerified && (
              <Badge variant="secondary" className="h-5 gap-0.5 px-1.5 text-[10px] text-blue-500">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                {post.university.name} 인증
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            매너온도 {post.author.mannerTemp}° · 거래 {post.author.tradeCount}회
          </p>
        </div>
      </Link>

      {/* 게시글 내용 */}
      <div className="px-4 py-4">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href={`/${post.university.slug}`} className="hover:text-blue-500">
            {post.university.name}
          </Link>
          <span>›</span>
          <Link href={`/${post.university.slug}/${post.categoryMajor.slug}`} className="hover:text-blue-500">
            <span className="cat-icon">{post.categoryMajor.icon} </span>{post.categoryMajor.name}
          </Link>
          <span>›</span>
          <Link href={`/${post.university.slug}/${post.categoryMajor.slug}?minor=${post.categoryMinor.slug}`} className="hover:text-blue-500">{post.categoryMinor.name}</Link>
        </nav>

        <div className="mt-2 flex items-center gap-2">
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

        <Separator className="my-4" />

        <div className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
          {post.body}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {post.locationDetail && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {post.locationDetail}
          </div>
        )}

        {/* 연락 방법 */}
        <ContactMethodsDisplay contactMethods={post.contactMethods} />
      </div>

      <PostStatusControl postId={post.id} authorId={post.authorId} initialStatus={post.status} />

      {relatedPosts.length > 0 && (
        <>
          <Separator />
          <section className="px-4 py-4">
            <h2 className="mb-3 text-lg font-bold">관련 게시글</h2>
            <div>
              {relatedPosts.map(rp => (
                <PostCard key={rp.id} post={rp} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* 하단 고정 바 */}
      <div className="fixed bottom-14 left-0 right-0 z-10 border-t border-border bg-background px-4 py-3 md:bottom-0">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <LikeButton postId={post.id} initialLiked={post.isLiked} initialCount={post.likeCount} />
          <ShareButton />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{post.title}</p>
            <p className="truncate text-sm text-muted-foreground">
              {formatPrice(post.price)}
              {post.priceNegotiable && ' · 가격 협의 가능'}
              {post.body && ` · ${post.body}`}
            </p>
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
