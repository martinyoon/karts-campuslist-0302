'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getPostDetail, getRelatedPosts } from '@/lib/api';
import PostDetailContent from '@/components/post/PostDetailContent';
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

  return <PostDetailContent post={post} relatedPosts={relatedPosts} />;
}
