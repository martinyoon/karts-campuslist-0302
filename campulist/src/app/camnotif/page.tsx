'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import EmptyState from '@/components/ui/EmptyState';
import { formatRelativeTime } from '@/lib/format';
import { getMyNotifs, getMyUnreadCount, markRead, markAllRead } from '@/lib/camnotif';
import type { CamNotif } from '@/lib/camnotif';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';

function NotifIcon({ type }: { type: string }) {
  const cls = 'h-5 w-5';
  if (type === 'camtalk') {
    return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
  }
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>;
}

const typeColors: Record<string, string> = {
  camtalk: 'text-blue-500',
  system: 'text-muted-foreground',
};

function CamNotifContent() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [notifs, setNotifs] = useState<CamNotif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    document.title = '캠알림 | 캠퍼스리스트';
    if (!userId) return;
    setNotifs(getMyNotifs(userId));
    setUnreadCount(getMyUnreadCount(userId));
  }, [userId]);

  const handleRead = (id: string) => {
    markRead(id);
    setUnreadCount(getMyUnreadCount(userId));
  };

  const handleReadAll = () => {
    markAllRead(userId);
    setUnreadCount(0);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold">캠알림</h1>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <>
              <span className="text-sm text-blue-500">{unreadCount}개 읽지 않음</span>
              <button
                onClick={handleReadAll}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                전체 읽음
              </button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {notifs.length === 0 ? (
        <EmptyState message="캠알림이 없습니다" />
      ) : (
        <div>
          {notifs.map(notif => (
            <Link
              key={notif.id}
              href={notif.link || '#'}
              onClick={() => handleRead(notif.id)}
              className={`flex gap-3 px-4 py-3.5 transition-colors hover:bg-muted ${
                !notif.isRead ? 'bg-blue-500/5' : ''
              }`}
            >
              <span className={`mt-0.5 ${typeColors[notif.type] || 'text-muted-foreground'}`}>
                <NotifIcon type={notif.type} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${!notif.isRead ? 'font-semibold' : 'font-medium'}`}>
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
                {notif.body && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{notif.body}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notif.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CamNotifPage() {
  return (
    <AuthGuard>
      <CamNotifContent />
    </AuthGuard>
  );
}
