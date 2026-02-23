'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/ui/EmptyState';
import { getMyRooms } from '@/lib/camtalk';
import type { CamTalkRoom } from '@/lib/camtalk';
import { formatRelativeTime } from '@/lib/format';
import { getUserSummary } from '@/data/users';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';

function CamTalkContent() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [rooms, setRooms] = useState<CamTalkRoom[]>([]);

  useEffect(() => {
    document.title = '캠톡 | 캠퍼스리스트';
    if (!userId) return;
    setRooms(getMyRooms(userId));

    const update = () => setRooms(getMyRooms(userId));
    window.addEventListener('camtalkUpdate', update);
    return () => window.removeEventListener('camtalkUpdate', update);
  }, [userId]);

  return (
    <div>
      <div className="border-b border-border px-4 py-4">
        <h1 className="text-xl font-bold">캠톡</h1>
      </div>

      {rooms.length === 0 ? (
        <EmptyState
          message="캠톡이 없습니다"
          sub="관심 있는 게시글에서 캠톡을 시작해보세요."
          actionLabel="게시글 둘러보기"
          actionHref="/"
        />
      ) : (
        <div>
          {rooms.map(room => {
            const partner = room.participants.find(p => p.id !== userId);
            if (!partner) return null;
            const partnerProfile = getUserSummary(partner.id);
            const displayNickname = partnerProfile.nickname !== '알 수 없음' ? partnerProfile.nickname : partner.nickname;
            const myUnread = room.unread[userId] || 0;

            return (
              <Link
                key={room.id}
                href={`/camtalk/${room.id}`}
                className="flex items-center gap-3 border-b border-border px-4 py-3.5 transition-colors hover:bg-muted"
              >
                <Avatar className="size-12">
                  <AvatarFallback className="text-lg">{displayNickname.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{displayNickname}</span>
                    <span className="text-xs text-muted-foreground">
                      {room.lastMessageAt ? formatRelativeTime(room.lastMessageAt) : ''}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {room.lastMessage || '캠톡을 시작해보세요'}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  {myUnread > 0 && (
                    <Badge className="h-5 min-w-5 justify-center bg-blue-600 px-1.5 text-[10px] text-white">
                      {myUnread}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CamTalkPage() {
  return (
    <AuthGuard>
      <CamTalkContent />
    </AuthGuard>
  );
}
