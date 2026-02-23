'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { deletePost } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { PostStatus } from '@/lib/types';

interface PostStatusControlProps {
  postId: string;
  authorId: string;
  initialStatus: PostStatus;
}

export default function PostStatusControl({ postId, authorId }: PostStatusControlProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setIsOwner(!!user && authorId === user.id);
  }, [user, authorId]);

  if (!isOwner) return null;

  const handleEdit = () => {
    router.push(`/write?edit=${postId}`);
  };

  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    deletePost(postId);
    toast('게시글이 삭제되었습니다');
    router.push('/my');
  };

  return (
    <div className="border-b border-border px-4 py-4">
      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/5 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-500/15"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          수정하기
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/15"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          삭제
        </button>
      </div>
    </div>
  );
}
