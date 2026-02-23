'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { getFilteredLocalPosts } from '@/lib/api';
import type { PostListItem } from '@/lib/types';

interface Props {
  serverPosts: PostListItem[];
  universityId?: number;
  categoryMajorId?: number;
  categoryMinorId?: number;
  query?: string;
  authorId?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'latest' | 'price_asc' | 'price_desc' | 'popular';
  emptyState?: React.ReactNode;
}

/**
 * Server Component에서 가져온 게시글 + localStorage 로컬 게시글을 병합하여 표시.
 * Server Component는 localStorage에 접근할 수 없으므로, 이 Client Component가
 * 마운트 후 로컬 게시글을 읽어 필터 조건에 맞게 병합합니다.
 */
export default function PostFeedWithLocal({
  serverPosts, universityId, categoryMajorId, categoryMinorId,
  query, authorId, priceMin, priceMax, sortBy = 'latest', emptyState,
}: Props) {
  const [posts, setPosts] = useState<PostListItem[]>(serverPosts);

  useEffect(() => {
    const localPosts = getFilteredLocalPosts({
      universityId, categoryMajorId, categoryMinorId,
      query, authorId, priceMin, priceMax,
    });

    if (localPosts.length > 0) {
      const serverIds = new Set(serverPosts.map(p => p.id));
      const newLocal = localPosts.filter(p => !serverIds.has(p.id));

      if (newLocal.length > 0) {
        const merged = [...newLocal, ...serverPosts];
        switch (sortBy) {
          case 'latest':
            merged.sort((a, b) => new Date(b.bumpedAt).getTime() - new Date(a.bumpedAt).getTime());
            break;
          case 'price_asc':
            merged.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
            break;
          case 'price_desc':
            merged.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
            break;
          case 'popular':
            merged.sort((a, b) => b.likeCount - a.likeCount);
            break;
        }
        setPosts(merged);
        return;
      }
    }
    setPosts(serverPosts);
  }, [serverPosts, universityId, categoryMajorId, categoryMinorId, query, authorId, priceMin, priceMax, sortBy]);

  if (posts.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
