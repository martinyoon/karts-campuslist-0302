'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/Toast';
import { bumpPost } from '@/lib/api';
import { findRoomByUser, startCamTalk } from '@/lib/camtalk';
import { useAuth } from '@/contexts/AuthContext';
import type { UserSummary } from '@/lib/types';

const QUICK_MESSAGES = [
  '구매 의사가 있습니다. 거래 가능한가요?',
  '가격 네고 가능한가요?',
  '직거래 장소와 시간이 어떻게 되나요?',
];

interface PostBottomActionProps {
  postId: string;
  postTitle: string;
  postPrice: number | null;
  postThumbnail: string | null;
  author: UserSummary;
}

export default function PostBottomAction({ postId, postTitle, postPrice, postThumbnail, author }: PostBottomActionProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [open, setOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  useEffect(() => {
    setIsOwner(!!user && author.id === user.id);
  }, [author.id, user]);

  // 본인 게시글: 끌어올리기 버튼
  if (isOwner) {
    const handleBump = () => {
      bumpPost(postId);
      toast('게시글이 목록 맨 위로 올라갔습니다! 더 많은 사람들이 볼 수 있어요.');
    };

    return (
      <Button onClick={handleBump} variant="outline" className="px-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
          <path d="m18 15-6-6-6 6" />
        </svg>
        끌어올리기
      </Button>
    );
  }

  const sendMessage = (content: string) => {
    if (!user || !content.trim()) return;

    // 첫 메시지에 게시글 링크를 포함하여 어떤 게시글 문의인지 명확히 함
    const messageWithPost = `[${postTitle}]\n/post/${postId}\n\n${content.trim()}`;

    const room = startCamTalk({
      me: { id: user.id, nickname: user.nickname },
      partner: { id: author.id, nickname: author.nickname },
      firstMessage: messageWithPost,
    });
    setOpen(false);
    router.push(`/camtalk/${room.id}`);
  };

  // 타인 게시글: 캠톡하기 버튼
  const handleChat = () => {
    if (!user) {
      toast('로그인이 필요합니다');
      router.push('/auth');
      return;
    }

    const existing = findRoomByUser(author.id, user.id);
    if (existing) {
      router.push(`/camtalk/${existing.id}`);
      return;
    }

    setShowInput(false);
    setCustomMsg('');
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleChat} className="bg-blue-600 px-8 text-white hover:bg-blue-700">
        캠톡하기
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl" showCloseButton={false}>
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg">캠톡 메시지 선택</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 px-4 pb-6">
            {QUICK_MESSAGES.map(msg => (
              <button
                key={msg}
                onClick={() => sendMessage(msg)}
                className="w-full rounded-lg border border-border px-4 py-3 text-left text-[15px] transition-colors hover:border-blue-500/50 hover:bg-blue-500/5"
              >
                {msg}
              </button>
            ))}

            {!showInput ? (
              <button
                onClick={() => setShowInput(true)}
                className="w-full rounded-lg border border-dashed border-border px-4 py-3 text-center text-[15px] text-muted-foreground transition-colors hover:border-blue-500/50 hover:text-foreground"
              >
                직접 입력하기
              </button>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={customMsg}
                  onChange={e => setCustomMsg(e.target.value)}
                  placeholder="메시지를 입력하세요"
                  onKeyDown={e => { if (e.key === 'Enter' && customMsg.trim()) sendMessage(customMsg); }}
                  autoFocus
                />
                <Button
                  onClick={() => sendMessage(customMsg)}
                  disabled={!customMsg.trim()}
                  className="shrink-0 bg-blue-600 text-white hover:bg-blue-700"
                >
                  전송
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
