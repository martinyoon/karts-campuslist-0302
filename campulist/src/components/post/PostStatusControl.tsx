'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { deletePost } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  useEffect(() => {
    setIsOwner(!!user && authorId === user.id);
  }, [user, authorId]);

  if (!isOwner) return null;

  const handleEdit = () => {
    router.push(`/write?edit=${postId}`);
  };

  const confirmDelete = () => {
    deletePost(postId);
    toast('게시글이 삭제되었습니다');
    setShowDeleteSheet(false);
    router.push('/my');
  };

  return (
    <div className="border-b border-border px-4 py-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleEdit} className="flex-1 text-base py-3 h-auto">
          수정하기
        </Button>
        <Button variant="destructive" onClick={() => setShowDeleteSheet(true)} className="flex-1 text-base py-3 h-auto">
          삭제
        </Button>
      </div>

      <Sheet open={showDeleteSheet} onOpenChange={setShowDeleteSheet}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="sr-only"><SheetTitle>게시글 삭제</SheetTitle></SheetHeader>
          <div className="pb-6">
            <p className="text-lg font-bold">게시글 삭제</p>
            <p className="mt-2 text-sm text-muted-foreground">
              정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setShowDeleteSheet(false)} className="flex-1">
                취소
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="flex-1">
                삭제
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
