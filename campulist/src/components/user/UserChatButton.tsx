'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { findRoomByUser, startCamTalk } from '@/lib/camtalk';
import { useAuth } from '@/contexts/AuthContext';
import type { UserSummary } from '@/lib/types';

interface UserChatButtonProps {
  user: UserSummary;
}

export default function UserChatButton({ user: profileUser }: UserChatButtonProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  // 본인이면 표시하지 않음
  if (!currentUser || profileUser.id === currentUser.id) return null;

  const handleChat = () => {
    const existing = findRoomByUser(profileUser.id, currentUser.id);
    if (existing) {
      router.push(`/camtalk/${existing.id}`);
      return;
    }

    const room = startCamTalk({
      me: { id: currentUser.id, nickname: currentUser.nickname },
      partner: { id: profileUser.id, nickname: profileUser.nickname },
    });
    router.push(`/camtalk/${room.id}`);
  };

  return (
    <Button onClick={handleChat} className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      캠톡하기
    </Button>
  );
}
