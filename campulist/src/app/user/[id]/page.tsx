'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserPosts } from '@/lib/api';
import { getFullUser } from '@/lib/auth';
import { universities } from '@/data/universities';
import { formatRelativeTime } from '@/lib/format';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import EmptyState from '@/components/ui/EmptyState';
import UserChatButton from '@/components/user/UserChatButton';
import type { User, MemberType, PostListItem } from '@/lib/types';

const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  undergraduate: '🎓 학부생/예술사(한예종)',
  graduate: '📚 대학원생/전문사(한예종)',
  professor: '👨‍🏫 교수',
  staff: '🏢 교직원',
  alumni: '🎒 졸업생',
  merchant: '🏪 비지니스 회원',
  general: '👤 일반인 회원',
};

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const found = getFullUser(id);
    if (!found) {
      setNotFound(true);
      document.title = '사용자를 찾을 수 없습니다 | 캠퍼스리스트';
      return;
    }
    setUser(found);
    document.title = `${found.nickname}님의 프로필 | 캠퍼스리스트`;

    getUserPosts(id).then(setPosts);
  }, [id]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-muted-foreground">사용자를 찾을 수 없습니다</p>
      </div>
    );
  }

  if (!user) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="text-sm text-muted-foreground">프로필 로딩 중...</p>
      </div>
    </div>
  );

  const university = universities.find(u => u.id === user.universityId);
  const activePosts = posts.filter(p => p.status === 'active');
  const completedPosts = posts.filter(p => p.status === 'completed');

  return (
    <div>
      {/* 프로필 헤더 — 간격 압축: py-6 → py-3 */}
      <div className="px-4 py-3">
        {/* 간격 압축: gap-4 → gap-2 */}
        <div className="flex items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-2xl font-bold text-blue-500">
            {user.nickname.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{user.nickname}</h1>
              {user.isVerified && (
                <Badge variant="secondary" className="gap-0.5 text-xs text-blue-500">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                  인증됨
                </Badge>
              )}
              {user.role === 'business' && (
                <Badge variant="outline" className="text-xs text-orange-500 border-orange-500/30">
                  비즈니스
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {university?.name ?? ''} · {MEMBER_TYPE_LABELS[user.memberType]}{user.department ? ` · ${user.department}` : ''}
            </p>
            <p className="text-xs text-muted-foreground">
              가입일 {formatRelativeTime(user.createdAt)}
            </p>
          </div>
        </div>

        {/* 매너온도 + 거래 통계 */}
        {/* 간격 압축: mt-4 → mt-2, gap-4 → gap-2, py-3 → py-1.5 */}
        <div className="mt-2 flex gap-2 rounded-lg bg-muted px-4 py-1.5">
          <div className="flex-1 text-center">
            <p className={`text-2xl font-bold ${user.mannerTemp >= 38 ? 'text-blue-500' : user.mannerTemp >= 36.5 ? 'text-foreground' : 'text-orange-500'}`}>
              {user.mannerTemp}°
            </p>
            <p className="text-xs text-muted-foreground">매너온도</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold">{user.tradeCount}</p>
            <p className="text-xs text-muted-foreground">거래 횟수</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold">{posts.length}</p>
            <p className="text-xs text-muted-foreground">게시글</p>
          </div>
        </div>

        {/* 채팅 버튼 (타인 프로필만) */}
        <UserChatButton user={{ id: user.id, nickname: user.nickname, avatarUrl: user.avatarUrl, isVerified: user.isVerified, mannerTemp: user.mannerTemp, tradeCount: user.tradeCount }} />
      </div>

      <Separator />

      {/* 판매 게시글 */}
      <section className="py-2">
        {/* 간격 압축: py-3 → py-1.5 */}
        <div className="flex items-center justify-between px-4 py-1.5">
          <h2 className="text-lg font-bold">판매 게시글</h2>
          <span className="text-sm text-muted-foreground">
            판매중 {activePosts.length} · 거래완료 {completedPosts.length}
          </span>
        </div>

        <PostFeedWithLocal
          serverPosts={posts}
          authorId={id}
          emptyState={<EmptyState message="등록된 게시글이 없습니다." />}
        />
      </section>
    </div>
  );
}
