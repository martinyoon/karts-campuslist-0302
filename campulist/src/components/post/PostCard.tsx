'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { PostListItem } from '@/lib/types';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isOwner = !!user && post.author.id === user.id;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/write?edit=${post.id}`);
  };

  return (
    <Link href={`/post/${post.id}`} className="flex gap-4 border-b border-border px-4 py-5 transition-colors hover:bg-muted/50">
      {/* 썸네일 */}
      {post.thumbnail ? (
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
        </div>
      )}

      {/* 정보 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          {post.status !== 'active' && (
            <Badge variant="outline" className={`shrink-0 text-[10px] ${post.status === 'reserved' ? 'text-orange-500 border-orange-500/30' : 'text-green-500 border-green-500/30'}`}>
              {post.status === 'reserved' ? '예약중' : '거래완료'}
            </Badge>
          )}
          <h3 className="truncate text-base font-medium text-foreground">{post.title}</h3>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
          {post.bodySnippet}
        </p>
        <p className="mt-1 text-lg font-bold text-foreground">
          {formatPrice(post.price)}
          {post.priceNegotiable && <span className="ml-1 text-sm font-normal text-muted-foreground">협의가능</span>}
        </p>

        <div className="mt-auto flex items-center gap-1.5 text-[13px] text-muted-foreground">
          {post.author.isVerified && (
            <Badge variant="secondary" className="h-5 gap-0.5 px-1.5 text-[10px] text-blue-500">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
              인증
            </Badge>
          )}
          <span>{post.university.name}</span>
          <span>{formatRelativeTime(post.createdAt)}</span>
          {post.likeCount > 0 && (
            <span className="flex items-center gap-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              {post.likeCount}
            </span>
          )}
          {isOwner && (
            <button
              onClick={handleEdit}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-500/20"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              수정
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
