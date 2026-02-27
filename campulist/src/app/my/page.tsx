'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import EmptyState from '@/components/ui/EmptyState';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getMyPosts, getPostsByIds, getRecentViewedPosts, getLikedPostIds } from '@/lib/api';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import type { PostListItem, MemberType, UserContactInfo } from '@/lib/types';
import { MEMBER_TYPE_LABELS } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { universities } from '@/data/universities';
import { compressProfileImage } from '@/lib/imageUtils';

type Tab = 'selling' | 'likes' | 'recent' | 'reviews';

function MyPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout, deleteAccount, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('selling');
  const [myPosts, setMyPosts] = useState<PostListItem[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostListItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<PostListItem[]>([]);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editMemberType, setEditMemberType] = useState<MemberType>('undergraduate');
  const [editCampus, setEditCampus] = useState<string | null>(null);
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [editError, setEditError] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');
  const [editContactPhoneCall, setEditContactPhoneCall] = useState(true);
  const [editContactPhoneSms, setEditContactPhoneSms] = useState(true);
  const [editContactKakao, setEditContactKakao] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');


  useEffect(() => {
    document.title = '마이페이지 | 캠퍼스리스트';
    if (user) {
      setMyPosts(getMyPosts(user.id));
    }
    const ids = getLikedPostIds();
    if (ids.length > 0) {
      setLikedPosts(getPostsByIds(ids));
    }
    setRecentPosts(getRecentViewedPosts());
  }, [user]);

  if (!user) return <LoadingSpinner />;

  const university = universities.find(u => u.id === user.universityId);

  // Mock 후기 데이터
  const mockReviews = [
    { id: 'r1', reviewer: '민수짱', rating: 5, content: '거래 매우 깔끔하고 물건 상태 좋았습니다!', createdAt: '2026-02-18T10:00:00Z' },
    { id: 'r2', reviewer: '하나둘셋', rating: 4, content: '친절하게 거래해주셨어요. 감사합니다.', createdAt: '2026-02-15T14:00:00Z' },
    { id: 'r3', reviewer: '태현이네', rating: 5, content: '시간 약속 잘 지켜주셔서 좋았어요!', createdAt: '2026-02-10T09:00:00Z' },
  ];

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'selling', label: '내 게시글', count: myPosts.length },
    { key: 'likes', label: '찜한 목록', count: likedPosts.length },
    { key: 'recent', label: '최근 본', count: recentPosts.length },
    { key: 'reviews', label: '받은 후기', count: mockReviews.length },
  ];

  return (
    <div>
      {/* 프로필 카드 */}
      {/* 간격 압축: py-6 → py-3 */}
      <div className="px-4 py-3">
        {/* 간격 압축: gap-4 → gap-2 */}
        <div className="flex items-center gap-2">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-2xl font-bold text-blue-500">
              {user.nickname.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{user.nickname}</h1>
              {user.isVerified && (
                <VerifiedBadge />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {university?.name ?? ''}{user.campus ? ` ${user.campus}` : ''} · {MEMBER_TYPE_LABELS[user.memberType]}{user.department ? ` · ${user.department}` : ''}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          {/* 간격 압축: gap-2 → gap-1 (stacked list items) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLogoutOpen(true)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              로그아웃
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditNickname(user.nickname);
                setEditDepartment(user.department ?? '');
                setEditMemberType(user.memberType);
                setEditCampus(user.campus);
                setEditAvatarUrl(user.avatarUrl);
                setEditContactPhone(user.contactInfo?.phone ?? '');
                setEditContactPhoneCall(user.contactInfo?.phoneCall ?? true);
                setEditContactPhoneSms(user.contactInfo?.phoneSms ?? true);
                setEditContactKakao(user.contactInfo?.kakaoLink ?? '');
                setEditContactEmail(user.contactInfo?.email ?? '');
                setEditError('');
                setEditOpen(true);
              }}
            >
              수정
            </Button>
            <Link href={`/user/${user.id}`}>
              <Button variant="outline" size="sm">프로필</Button>
            </Link>
          </div>
        </div>

        {/* 매너온도 + 거래 통계 */}
        {/* 간격 압축: mt-4 → mt-2, gap-4 → gap-2, py-3 → py-1.5 */}
        <div className="mt-2 flex gap-2 rounded-lg bg-muted px-4 py-1.5">
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-blue-500">{user.mannerTemp}°</p>
            <p className="text-xs text-muted-foreground">매너온도</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold">{user.tradeCount}</p>
            <p className="text-xs text-muted-foreground">거래 횟수</p>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="border-b border-border py-1">
        {[
          { icon: '🔔', label: '캠알림', href: '/camnotif' },
          { icon: 'ℹ️', label: '서비스 소개', href: '/about' },
          { icon: '📬', label: '건의함', href: '/suggest' },
        ].map(item => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        ))}
        <button
          onClick={() => { setDeleteOpen(true); setConfirmText(''); }}
          className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-destructive/5"
        >
          <span className="text-lg">⚠️</span>
          <span className="flex-1 text-left text-sm font-medium text-destructive">회원탈퇴</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      {/* 탭 바 */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          // 간격 압축: py-3 → py-1.5
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-1.5 text-center text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label} <span className="ml-1 text-xs">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div>
        {/* 내 게시글 */}
        {activeTab === 'selling' && (
          myPosts.length > 0 ? (
            myPosts.map(post => (
              // 간격 압축: gap-3 → gap-1.5, py-3 → py-1.5
              <Link key={post.id} href={`/post/${post.id}`} className="flex gap-1.5 border-b border-border px-4 py-1.5 transition-colors hover:bg-muted/50">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-2xl text-muted-foreground">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {post.status !== 'active' && (
                      <Badge variant="outline" className={`text-xs ${post.status === 'reserved' ? 'text-orange-500 border-orange-500/30' : 'text-green-500 border-green-500/30'}`}>
                        {post.status === 'reserved' ? '예약중' : '거래완료'}
                      </Badge>
                    )}
                    <p className="truncate text-sm font-medium">{post.title}</p>
                  </div>
                  <p className="mt-0.5 text-sm font-bold">
                    {post.price !== null ? formatPrice(post.price) : '가격 미정'}
                  </p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(post.createdAt)} · 조회 {post.viewCount} · 찜 {post.likeCount}
                    </p>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/write?edit=${post.id}`); }}
                      className="flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-500/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      수정
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState message="등록한 게시글이 없습니다." actionLabel="첫 게시글 작성하기" actionHref="/write" />
          )
        )}

        {/* 찜한 목록 */}
        {activeTab === 'likes' && (
          likedPosts.length > 0 ? (
            likedPosts.map(post => (
              // 간격 압축: gap-3 → gap-1.5, py-3 → py-1.5
              <Link key={post.id} href={`/post/${post.id}`} className="flex gap-1.5 border-b border-border px-4 py-1.5 transition-colors hover:bg-muted/50">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="mt-0.5 text-sm font-bold">
                    {post.price !== null ? formatPrice(post.price) : '가격 미정'}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {post.university.name} · {formatRelativeTime(post.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState message="찜한 게시글이 없습니다." sub="게시글의 하트 버튼을 눌러 찜해보세요." />
          )
        )}

        {/* 최근 본 게시글 */}
        {activeTab === 'recent' && (
          recentPosts.length > 0 ? (
            recentPosts.map(post => (
              // 간격 압축: gap-3 → gap-1.5, py-3 → py-1.5
              <Link key={post.id} href={`/post/${post.id}`} className="flex gap-1.5 border-b border-border px-4 py-1.5 transition-colors hover:bg-muted/50">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="mt-0.5 text-sm font-bold">
                    {post.price !== null ? formatPrice(post.price) : '가격 미정'}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {post.university.name} · {formatRelativeTime(post.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState message="최근 본 게시글이 없습니다." sub="게시글을 둘러보면 여기에 표시됩니다." />
          )
        )}

        {/* 받은 후기 */}
        {activeTab === 'reviews' && (
          mockReviews.length > 0 ? (
            mockReviews.map(review => (
              // 간격 압축: py-4 → py-2
              <div key={review.id} className="border-b border-border px-4 py-2">
                <div className="flex items-center justify-between">
                  {/* 간격 압축: gap-2 → gap-1 (inline icon group) */}
                  <div className="flex items-center gap-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {review.reviewer.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{review.reviewer}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < review.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={i < review.rating ? 'text-yellow-400' : 'text-muted-foreground/30'}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                {/* 간격 압축: mt-2 → mt-1 */}
                <p className="mt-1 text-sm text-foreground/90">{review.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(review.createdAt)}</p>
              </div>
            ))
          ) : (
            <EmptyState message="받은 후기가 없습니다." />
          )
        )}
      </div>

      {/* 프로필 수정 Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl" showCloseButton={false}>
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg">프로필 수정</SheetTitle>
          </SheetHeader>
          {/* 간격 압축: space-y-4 → space-y-2, pb-6 → pb-3 */}
          <div className="space-y-2 px-4 pb-3">
            {/* 프로필 사진 */}
            <div className="flex items-center gap-3">
              <label className="relative cursor-pointer">
                {editAvatarUrl ? (
                  <img src={editAvatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-2xl font-bold text-blue-500">
                    {user.nickname.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">📷</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const compressed = await compressProfileImage(file);
                      setEditAvatarUrl(compressed);
                    } catch {
                      toast('이미지를 처리할 수 없습니다.');
                    }
                    e.target.value = '';
                  }}
                />
              </label>
              <div className="space-y-1">
                <p className="text-sm font-medium">프로필 사진</p>
                {editAvatarUrl && (
                  <button
                    type="button"
                    onClick={() => setEditAvatarUrl(null)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">닉네임</label>
              <Input
                value={editNickname}
                onChange={e => { setEditNickname(e.target.value); setEditError(''); }}
                placeholder="닉네임을 입력하세요"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">학과</label>
              <Input
                value={editDepartment}
                onChange={e => setEditDepartment(e.target.value)}
                placeholder="학과를 입력하세요"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">캠퍼스</label>
              {university && university.campuses.length > 1 && (
                // 간격 압축: mb-2 → mb-1, gap-2 → gap-1 (stacked list items)
                <div className="mb-1 flex flex-wrap gap-1">
                  {university.campuses.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setEditCampus(c.name)}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        editCampus === c.name
                          ? 'border-blue-500 bg-blue-500/10 font-medium text-blue-600'
                          : 'border-border text-muted-foreground hover:border-blue-500/50'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
              <Input
                value={editCampus ?? ''}
                onChange={e => setEditCampus(e.target.value || null)}
                placeholder="캠퍼스 명칭을 입력하세요"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">회원 유형</label>
              {/* 간격 압축: gap-2 → gap-1 (stacked list items) */}
              <div className="flex flex-wrap gap-1">
                {(Object.entries(MEMBER_TYPE_LABELS) as [MemberType, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setEditMemberType(value)}
                    className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                      editMemberType === value
                        ? 'border-blue-500 bg-blue-500/10 font-medium text-blue-600'
                        : 'border-border text-muted-foreground hover:border-blue-500/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* 연락 방법 기본값 */}
            <div>
              <label className="mb-1 block text-sm font-medium">연락 방법 기본값</label>
              <p className="mb-1.5 text-xs text-muted-foreground">글쓰기 시 자동으로 채워집니다</p>
              <div className="space-y-1.5 rounded-xl border border-border p-2">
                {/* 전화번호 */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" checked={!!editContactPhone} onChange={e => { if (!e.target.checked) { setEditContactPhone(''); setEditContactPhoneCall(true); setEditContactPhoneSms(true); } else { setEditContactPhone(' '); } }} className="rounded" />
                    <span>전화번호</span>
                  </label>
                  {!!editContactPhone && (
                    <div className="mt-1 ml-7 space-y-1">
                      <Input type="tel" placeholder="010-0000-0000" value={editContactPhone.trim()} onChange={e => setEditContactPhone(e.target.value)} className="max-w-xs" />
                      <div className="flex gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <input type="checkbox" checked={editContactPhoneCall} onChange={e => setEditContactPhoneCall(e.target.checked)} className="rounded" /> 전화 OK
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <input type="checkbox" checked={editContactPhoneSms} onChange={e => setEditContactPhoneSms(e.target.checked)} className="rounded" /> 문자 OK
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                {/* 카카오 오픈채팅 */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" checked={!!editContactKakao} onChange={e => { if (!e.target.checked) setEditContactKakao(''); else setEditContactKakao(' '); }} className="rounded" />
                    <span>카카오 오픈채팅</span>
                  </label>
                  {!!editContactKakao && (
                    <div className="mt-1 ml-7">
                      <Input type="url" placeholder="https://open.kakao.com/o/..." value={editContactKakao.trim()} onChange={e => setEditContactKakao(e.target.value)} className="max-w-sm" />
                    </div>
                  )}
                </div>
                {/* 이메일 */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" checked={!!editContactEmail} onChange={e => { if (!e.target.checked) setEditContactEmail(''); else setEditContactEmail(user?.email || ' '); }} className="rounded" />
                    <span>이메일</span>
                  </label>
                  {!!editContactEmail && (
                    <div className="mt-1 ml-7">
                      <Input type="email" placeholder="example@university.ac.kr" value={editContactEmail.trim()} onChange={e => setEditContactEmail(e.target.value)} className="max-w-sm" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {editError && (
              <p className="text-sm text-destructive">{editError}</p>
            )}
            <Button
              onClick={() => {
                const contactInfo: UserContactInfo = {};
                if (editContactPhone.trim()) {
                  contactInfo.phone = editContactPhone.trim();
                  contactInfo.phoneCall = editContactPhoneCall;
                  contactInfo.phoneSms = editContactPhoneSms;
                }
                if (editContactKakao.trim()) contactInfo.kakaoLink = editContactKakao.trim();
                if (editContactEmail.trim()) contactInfo.email = editContactEmail.trim();
                const result = updateProfile({
                  nickname: editNickname.trim(),
                  department: editDepartment.trim() || null,
                  memberType: editMemberType,
                  campus: editCampus,
                  avatarUrl: editAvatarUrl,
                  contactInfo: Object.keys(contactInfo).length > 0 ? contactInfo : undefined,
                });
                if (result.success) {
                  toast('프로필이 수정되었습니다');
                  setEditOpen(false);
                } else {
                  setEditError(result.error ?? '수정에 실패했습니다');
                }
              }}
              disabled={!editNickname.trim()}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              저장
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* 로그아웃 확인 Sheet */}
      <Sheet open={logoutOpen} onOpenChange={setLogoutOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl" showCloseButton={false}>
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg">로그아웃</SheetTitle>
          </SheetHeader>
          {/* 간격 압축: space-y-4 → space-y-2, pb-6 → pb-3 */}
          <div className="space-y-2 px-4 pb-3">
            <p className="text-sm text-muted-foreground">로그아웃 하시겠습니까?</p>
            {/* 간격 압축: gap-3 → gap-1.5 */}
            <div className="flex gap-1.5">
              <Button variant="outline" className="flex-1" onClick={() => setLogoutOpen(false)}>
                취소
              </Button>
              <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700" onClick={() => { setLogoutOpen(false); logout(); }}>
                로그아웃
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 회원탈퇴 확인 Sheet */}
      <Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl" showCloseButton={false}>
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg text-destructive">회원탈퇴</SheetTitle>
          </SheetHeader>
          {/* 간격 압축: space-y-4 → space-y-2, pb-6 → pb-3 */}
          <div className="space-y-2 px-4 pb-3">
            <p className="text-sm text-muted-foreground">
              탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 작성한 게시글 및 캠퍼스톡 내역</li>
              <li>• 찜한 목록 및 검색 기록</li>
              <li>• 알림 및 임시저장 데이터</li>
            </ul>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                확인을 위해 <span className="font-bold text-destructive">탈퇴합니다</span>를 입력하세요
              </label>
              <Input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="탈퇴합니다"
              />
            </div>
            <Button
              onClick={() => {
                deleteAccount();
                toast('회원탈퇴가 완료되었습니다');
              }}
              disabled={confirmText !== '탈퇴합니다'}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              회원탈퇴
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}

export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  );
}
