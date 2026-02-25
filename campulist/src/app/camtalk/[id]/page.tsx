'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getRoom, getMessages, sendMessage, markRead } from '@/lib/camtalk';
import { getUserSummary } from '@/data/users';
import { universities } from '@/data/universities';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import type { CamTalkMessage } from '@/lib/camtalk';

/** 약속 메시지에서 날짜/시간/장소 추출 */
function extractAppointment(content: string) {
  if (!content.startsWith('📅 거래 약속')) return null;
  const dateMatch = content.match(/날짜:\s*(.+)/);
  const timeMatch = content.match(/시간:\s*(.+)/);
  const locMatch = content.match(/장소:\s*(.+)/);
  const noteMatch = content.match(/내용:\s*(.+)/);
  if (!dateMatch || !timeMatch) return null;
  return { date: dateMatch[1].trim(), time: timeMatch[1].trim(), location: locMatch?.[1]?.trim(), note: noteMatch?.[1]?.trim() };
}

/** 구조화 메시지 제목 강조 + /post/xxx 링크 변환 */
const STRUCTURED_PREFIXES = ['📜 메시지 원칙', '📅 거래 약속', '✅ 약속 확정!', '❌ 약속 취소', '🤝 약속 종료', '📍 만남 장소', '🏦 송금 정보'];

function renderContent(content: string) {
  const isStructured = STRUCTURED_PREFIXES.some(p => content.startsWith(p));
  if (isStructured) {
    const [title, ...rest] = content.split('\n');
    return (
      <>
        <span className="text-base font-bold">{title}</span>
        {rest.length > 0 && (
          <>
            {'\n'}
            <span className="text-xs opacity-80">{rest.join('\n')}</span>
          </>
        )}
      </>
    );
  }
  const parts = content.split(/(\/post\/[\w-]+)/g);
  if (parts.length === 1) return content;
  return parts.map((part, i) =>
    /^\/post\/[\w-]+$/.test(part)
      ? <Link key={i} href={part} className="underline break-all">게시글 보기</Link>
      : part
  );
}

export default function CamTalkDetailPage() {
  return (
    <AuthGuard>
      <CamTalkDetailContent />
    </AuthGuard>
  );
}

function CamTalkDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const myId = user?.id ?? '';
  const roomId = params.id as string;

  const [messages, setMessages] = useState<CamTalkMessage[]>([]);
  const [input, setInput] = useState('');
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [canSendApp, setCanSendApp] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [canSendLoc, setCanSendLoc] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [canSendBank, setCanSendBank] = useState(false);
  const [principleOpen, setPrincipleOpen] = useState(false);
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [principleCustom, setPrincipleCustom] = useState('');
  const appDateRef = useRef<HTMLInputElement>(null);
  const appTimeRef = useRef<HTMLSelectElement>(null);
  const appLocationRef = useRef<HTMLInputElement>(null);
  const appNoteRef = useRef<HTMLInputElement>(null);
  const locNameRef = useRef<HTMLInputElement>(null);
  const locDescRef = useRef<HTMLInputElement>(null);
  const locMemoRef = useRef<HTMLInputElement>(null);
  const bankNameRef = useRef<HTMLSelectElement>(null);
  const bankAccountRef = useRef<HTMLInputElement>(null);
  const bankHolderRef = useRef<HTMLInputElement>(null);
  const bankAmountRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkCanSend = () => {
    setCanSendApp(!!(appDateRef.current?.value && appTimeRef.current?.value));
  };

  // 방 정보 + 상대방 계산
  const room = getRoom(roomId);
  const partner = room?.participants.find(p => p.id !== myId) ?? null;
  const partnerProfile = partner ? getUserSummary(partner.id) : null;
  const partnerNickname = partnerProfile?.nickname ?? partner?.nickname ?? '';
  const myNickname = user?.nickname ?? '';
  const myUniv = universities.find(u => u.id === user?.universityId);
  const univPrefix = myUniv ? `${myUniv.name} ${user?.campus ?? myUniv.region}` : '';

  // 가장 최근 확정 약속 찾기
  const confirmedApp = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      // 취소가 확정보다 최근이면 → 배너 없음
      if (messages[i].content.startsWith('❌ 약속 취소')) return null;
      if (messages[i].content.startsWith('🤝 약속 종료')) return null;
      if (messages[i].content.startsWith('✅ 약속 확정!')) {
        const dateMatch = messages[i].content.match(/날짜:\s*(.+)/);
        const timeMatch = messages[i].content.match(/시간:\s*(.+)/);
        const locMatch = messages[i].content.match(/장소:\s*(.+)/);
        const noteMatch = messages[i].content.match(/내용:\s*(.+)/);
        if (dateMatch && timeMatch) {
          return {
            date: dateMatch[1].trim(),
            time: timeMatch[1].trim(),
            location: locMatch?.[1]?.trim(),
            note: noteMatch?.[1]?.trim(),
          };
        }
      }
    }
    return null;
  }, [messages]);

  // 메시지 로드 + 읽음 처리 (roomId와 myId만 의존)
  useEffect(() => {
    if (partnerNickname) document.title = `${partnerNickname} 캠퍼스톡 | 캠퍼스리스트`;
    markRead(roomId, myId);
    setMessages(getMessages(roomId));
  }, [roomId, myId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 스크롤 하단
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!room || !partner) {
    return (
      <div className="px-4 py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">캠퍼스톡을 찾을 수 없습니다</p>
        {/* 간격 압축: mt-4 → mt-2 */}
        <Button variant="outline" className="mt-2" onClick={() => router.push('/camtalk')}>
          캠퍼스톡 목록으로
        </Button>
      </div>
    );
  }

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg = sendMessage(roomId, myId, text);
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const handleAccept = (content: string) => {
    const details = extractAppointment(content);
    if (!details) return;
    const parts = ['✅ 약속 확정!', `날짜: ${details.date}`, `시간: ${details.time}`];
    if (details.location) parts.push(`장소: ${details.location}`);
    if (details.note) parts.push(`내용: ${details.note}`);
    const newMsg = sendMessage(roomId, myId, parts.join('\n'));
    setMessages(prev => [...prev, newMsg]);
  };

  const handleCancelApp = () => {
    if (!confirmedApp) return;
    const parts = ['❌ 약속 취소', `날짜: ${confirmedApp.date}`, `시간: ${confirmedApp.time}`];
    if (confirmedApp.location) parts.push(`장소: ${confirmedApp.location}`);
    if (confirmedApp.note) parts.push(`내용: ${confirmedApp.note}`);
    const newMsg = sendMessage(roomId, myId, parts.join('\n'));
    setMessages(prev => [...prev, newMsg]);
  };

  const handleCompleteApp = () => {
    if (!confirmedApp) return;
    const parts = ['🤝 약속 종료', `날짜: ${confirmedApp.date}`, `시간: ${confirmedApp.time}`];
    if (confirmedApp.location) parts.push(`장소: ${confirmedApp.location}`);
    if (confirmedApp.note) parts.push(`내용: ${confirmedApp.note}`);
    const newMsg = sendMessage(roomId, myId, parts.join('\n'));
    setMessages(prev => [...prev, newMsg]);
  };

  const handleAppointment = () => {
    const dateVal = appDateRef.current?.value || '';
    const timeVal = appTimeRef.current?.value || '';
    const locVal = appLocationRef.current?.value?.trim() || '';
    const noteVal = appNoteRef.current?.value?.trim() || '';
    if (!dateVal || !timeVal) return;
    const dateObj = new Date(dateVal + 'T00:00:00');
    const dateStr = dateObj.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
    const parts = ['📅 거래 약속', `날짜: ${dateStr}`, `시간: ${timeVal}`];
    if (locVal) parts.push(`장소: ${locVal}`);
    if (noteVal) parts.push(`내용: ${noteVal}`);
    const newMsg = sendMessage(roomId, myId, parts.join('\n'));
    setMessages(prev => [...prev, newMsg]);
    setAppointmentOpen(false);
    setCanSendApp(false);
  };

  const checkCanSendLoc = () => {
    setCanSendLoc(!!locNameRef.current?.value?.trim());
  };

  const handleLocation = () => {
    const name = locNameRef.current?.value?.trim() || '';
    if (!name) return;
    const desc = locDescRef.current?.value?.trim() || '';
    const memo = locMemoRef.current?.value?.trim() || '';
    const parts = ['📍 만남 장소', `장소: ${name}`];
    if (desc) parts.push(`설명: ${desc}`);
    if (memo) parts.push(`참고: ${memo}`);
    const newMsg = sendMessage(roomId, myId, parts.join('\n'));
    setMessages(prev => [...prev, newMsg]);
    setLocationOpen(false);
    setCanSendLoc(false);
  };

  const checkCanSendBank = () => {
    setCanSendBank(!!(bankNameRef.current?.value && bankAccountRef.current?.value?.trim() && bankHolderRef.current?.value?.trim()));
  };

  const savedBank = useMemo(() => {
    if (!myId) return null;
    try { return JSON.parse(localStorage.getItem(`ct_bank_info_${myId}`) || 'null'); }
    catch { return null; }
  }, [bankOpen, myId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 기존 글로벌 키 → 사용자별 키 마이그레이션 (1회성)
  useEffect(() => {
    if (!myId) return;
    const oldKey = 'ct_bank_info';
    const newKey = `ct_bank_info_${myId}`;
    if (localStorage.getItem(oldKey) && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, localStorage.getItem(oldKey)!);
      localStorage.removeItem(oldKey);
    }
  }, [myId]);

  const handleBank = () => {
    const bank = bankNameRef.current?.value || '';
    const account = bankAccountRef.current?.value?.trim() || '';
    const holder = bankHolderRef.current?.value?.trim() || '';
    const amount = bankAmountRef.current?.value?.trim() || '';
    if (!bank || !account || !holder) return;
    if (myId) {
      try { localStorage.setItem(`ct_bank_info_${myId}`, JSON.stringify({ bank, account, holder })); } catch {}
    }
    const parts = ['🏦 송금 정보', `은행: ${bank}`, `계좌: ${account}`, `예금주: ${holder}`];
    if (amount) parts.push(`금액: ${amount}원`);
    const newMsg = sendMessage(roomId, myId, parts.join('\n'));
    setMessages(prev => [...prev, newMsg]);
    setBankOpen(false);
    setCanSendBank(false);
  };

  const principles = [
    { emoji: '🤝', text: '정직하고 투명하게 거래해요' },
    { emoji: '⏰', text: '시간 약속을 꼭 지켜요' },
    { emoji: '💬', text: '답변은 빠르게 드릴게요' },
    { emoji: '🙏', text: '서로 존중하며 대화해요' },
    { emoji: '📦', text: '상품 상태를 정확히 알려드려요' },
  ];

  const togglePrinciple = (text: string) => {
    setSelectedPrinciples(prev => prev.includes(text) ? prev.filter(x => x !== text) : [...prev, text]);
  };

  const handlePrinciple = () => {
    const custom = principleCustom.trim();
    if (selectedPrinciples.length === 0 && !custom) return;
    const parts = ['📜 메시지 원칙'];
    selectedPrinciples.forEach(p => parts.push(`✅ ${p}`));
    if (custom) parts.push(`💡 ${custom}`);
    const newMsg = sendMessage(roomId, myId, parts.join('\n'));
    setMessages(prev => [...prev, newMsg]);
    setPrincipleOpen(false);
    setSelectedPrinciples([]);
    setPrincipleCustom('');
  };

  return (
    <div className="flex h-[calc(100dvh-112px)] flex-col md:h-[calc(100dvh-56px)]">
      {/* 상단 헤더 */}
      {/* 간격 압축: py-3 → py-1.5 */}
      <div className="border-b border-border px-4 py-1.5">
        {/* 간격 압축: gap-3 → gap-1.5 */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => router.push('/camtalk')} className="text-muted-foreground hover:text-foreground" aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <Link href={`/user/${partner.id}`} className="min-w-0 flex-1 transition-opacity hover:opacity-70">
            {/* 간격 압축: gap-2 → gap-1.5 */}
            <div className="flex items-center gap-1.5">
              <span className="font-medium">{partnerNickname}</span>
              {partnerProfile?.isVerified && (
                <Badge variant="secondary" className="h-4 px-1 text-xs">인증</Badge>
              )}
              {partnerProfile && (
                <span className="text-xs text-muted-foreground">{partnerProfile.mannerTemp}°C</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* 확정된 약속 배너 — 간격 압축: gap-2 → gap-1.5 */}
      {confirmedApp && (
        <div className="flex items-center gap-1.5 border-b border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm">
          <span className="text-base">📅</span>
          <div className="min-w-0 flex-1">
            <span className="font-medium text-green-700 dark:text-green-400">약속 확정</span>
            <span className="ml-2 text-green-600 dark:text-green-500">
              {confirmedApp.date} {confirmedApp.time}
              {confirmedApp.location && ` · ${confirmedApp.location}`}
              {confirmedApp.note && ` · ${confirmedApp.note}`}
            </span>
          </div>
          <button
            onClick={handleCancelApp}
            className="shrink-0 rounded border border-red-500/30 px-2 py-0.5 text-xs font-medium text-red-500 hover:bg-red-500/10 dark:text-red-400"
          >
            약속 취소
          </button>
          <button
            onClick={handleCompleteApp}
            className="shrink-0 rounded border border-blue-500/30 px-2 py-0.5 text-xs font-medium text-blue-500 hover:bg-blue-500/10 dark:text-blue-400"
          >
            약속 종료
          </button>
        </div>
      )}

      {/* 메시지 영역 */}
      {/* 간격 압축: py-4 → py-2 */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="flex flex-col gap-1">
          {messages.map((msg, i) => {
            const isMine = msg.senderId === myId;
            const showDate = i === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[i - 1].createdAt).toDateString();
            const prevMsg = i > 0 ? messages[i - 1] : null;
            const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId || showDate;

            // 약속 응답 버튼 표시 조건
            const isAppointment = msg.content.startsWith('📅 거래 약속');
            const isFromOther = !isMine;
            const hasConfirmAfter = isAppointment && messages.slice(i + 1).some(m => m.content.startsWith('✅ 약속 확정!'));
            const showAppButtons = isAppointment && isFromOther && !hasConfirmAfter;

            // 간격 압축: mt-3 → mt-1.5
            return (
              <div key={msg.id} className={isFirstInGroup && i > 0 ? 'mt-1.5' : ''}>
                {showDate && (
                  // 간격 압축: my-4 → my-2
                  <div className="my-2 text-center text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                  </div>
                )}

                {/* 닉네임 라벨 — 그룹 첫 메시지만 */}
                {isFirstInGroup && (
                  <div className={`mb-1 ${isMine ? 'text-right' : 'pl-9'}`}>
                    {isMine ? (
                      <span className="text-xs font-medium text-muted-foreground">{myNickname}</span>
                    ) : (
                      <Link href={`/user/${partner.id}`} className="text-xs font-medium text-foreground/70 hover:text-foreground">
                        {partnerNickname}
                      </Link>
                    )}
                  </div>
                )}

                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[75%] items-end gap-1.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* 상대방 아바타: 그룹 첫 메시지만, 나머지는 빈 공간 */}
                    {!isMine && (
                      isFirstInGroup ? (
                        <Link href={`/user/${partner.id}`} className="shrink-0 self-start transition-opacity hover:opacity-70">
                          <Avatar size="sm">
                            <AvatarFallback>{partnerNickname.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </Link>
                      ) : (
                        <span className="w-7 shrink-0" />
                      )
                    )}
                    <div
                      className={`whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm ${
                        isMine
                          ? 'bg-blue-600 text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {renderContent(msg.content)}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* 약속 응답 버튼 — 간격 압축: mt-1.5 → mt-1, gap-2 → gap-1.5 */}
                {showAppButtons && (
                  <div className="mt-1 flex gap-1.5 pl-9">
                    <button
                      onClick={() => handleAccept(msg.content)}
                      className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-500/20"
                    >
                      ✅ 수락
                    </button>
                    <button
                      onClick={() => setAppointmentOpen(true)}
                      className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-500/20"
                    >
                      🔄 다른 시간 제안
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 + 빠른 메시지 */}
      <div className="border-t border-border px-4 py-1.5">
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-1.5"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1"
            autoFocus
          />
          <Button
            type="submit"
            disabled={!input.trim()}
            className="bg-orange-500 px-4 hover:bg-orange-600"
          >
            전송
          </Button>
        </form>
        {/* 빠른 메시지 칩 */}
        <div className="flex gap-2 overflow-x-auto pt-1.5 scrollbar-hide">
          <button
            type="button"
            onClick={() => setAppointmentOpen(true)}
            className="shrink-0 rounded-full border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900"
          >
            📅 약속 잡기
          </button>
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            className="shrink-0 rounded-full border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900"
          >
            📍 장소 안내
          </button>
          <button
            type="button"
            onClick={() => { setBankOpen(true); if (savedBank?.bank && savedBank?.account && savedBank?.holder) setCanSendBank(true); }}
            className="shrink-0 rounded-full border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900"
          >
            🏦 송금 정보
          </button>
          <button
            type="button"
            onClick={() => setPrincipleOpen(true)}
            className="shrink-0 rounded-full border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900"
          >
            📜 메시지 원칙
          </button>
          {['안녕하세요?', '감사합니다!', '아직 판매중인가요?', '직거래 장소 어디가 편하세요?', '오늘 거래 가능하신가요?'].map(msg => (
            <button
              key={msg}
              type="button"
              onClick={() => setInput(msg)}
              className="shrink-0 rounded-full border border-orange-400/40 px-3 py-1 text-sm text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-300 dark:hover:bg-orange-950"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

      {/* 약속 잡기 Sheet */}
      <Sheet open={appointmentOpen} onOpenChange={(open) => { setAppointmentOpen(open); if (!open) setCanSendApp(false); }}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl" showCloseButton={false}>
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg">거래 약속 잡기</SheetTitle>
          </SheetHeader>
          {/* 간격 압축: space-y-4 → space-y-2, pb-6 → pb-3 */}
          <div className="space-y-2 px-4 pb-3">
            <div>
              <label className="mb-1 block text-sm font-medium">날짜</label>
              <input
                ref={appDateRef}
                type="date"
                onChange={checkCanSend}
                onInput={checkCanSend}
                className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(() => {
                  const today = new Date();
                  return [0, 1, 2, 7].map(offset => {
                    const d = new Date(today);
                    d.setDate(d.getDate() + offset);
                    const value = d.toISOString().split('T')[0];
                    const day = d.toLocaleDateString('ko-KR', { weekday: 'short' });
                    const label = offset === 0 ? `오늘(${day})` : offset === 1 ? `내일(${day})` : offset === 2 ? `모레(${day})` : `일주일 후(${day})`;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          if (appDateRef.current) {
                            appDateRef.current.value = value;
                            checkCanSend();
                          }
                        }}
                        className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        {label}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">시간</label>
              <select
                ref={appTimeRef}
                onChange={checkCanSend}
                className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                defaultValue=""
              >
                <option value="" disabled>시간 선택</option>
                {Array.from({ length: 48 }, (_, i) => {
                  const h = (10 + Math.floor(i / 2)) % 24;
                  const m = i % 2 === 0 ? '00' : '30';
                  const period = h < 12 ? '오전' : '오후';
                  const h12 = h === 0 ? 12 : h === 12 ? 12 : h > 12 ? h - 12 : h;
                  const label = `${period} ${h12}:${m}`;
                  return <option key={label} value={label}>{label}</option>;
                })}
              </select>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {['오전 10:00', '오후 12:00', '오후 2:00', '오후 4:00', '오후 6:00'].map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      if (appTimeRef.current) {
                        appTimeRef.current.value = time;
                        checkCanSend();
                      }
                    }}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">장소 (선택)</label>
              <input
                ref={appLocationRef}
                placeholder="예: 중앙도서관 앞"
                className="border-input placeholder:text-muted-foreground h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {['중앙도서관 앞', '정문 앞', '학생회관 1층', '기숙사 로비', '카페'].map(place => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => { if (appLocationRef.current) appLocationRef.current.value = univPrefix ? `${univPrefix} ${place}` : place; }}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">약속 내용 (선택)</label>
              <input
                ref={appNoteRef}
                placeholder="예: 교재 2권 거래"
                className="border-input placeholder:text-muted-foreground h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {['교재 거래', '전자기기 거래', '의류 거래', '생활용품 거래', '양도'].map(note => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => { if (appNoteRef.current) appNoteRef.current.value = note; }}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="button"
              onClick={handleAppointment}
              disabled={!canSendApp}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              약속 보내기
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* 장소 안내 Sheet */}
      <Sheet open={locationOpen} onOpenChange={(open) => { setLocationOpen(open); if (!open) setCanSendLoc(false); }}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl" showCloseButton={false}>
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg">만남 장소 안내</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 px-4 pb-3">
            <div>
              <label className="mb-1 block text-sm font-medium">장소명</label>
              <input
                ref={locNameRef}
                onChange={checkCanSendLoc}
                onInput={checkCanSendLoc}
                placeholder="예: 중앙도서관 앞"
                className="border-input placeholder:text-muted-foreground h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {['중앙도서관 앞', '정문 앞', '학생회관 1층', '기숙사 로비', '카페'].map(place => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => { if (locNameRef.current) { locNameRef.current.value = univPrefix ? `${univPrefix} ${place}` : place; setCanSendLoc(true); } }}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">상세 설명 (선택)</label>
              <input
                ref={locDescRef}
                placeholder="예: 1층 정문 나오면 바로 오른쪽"
                className="border-input placeholder:text-muted-foreground h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {['1층 로비에서 만나요', '건물 정문 앞에서 만나요', '주차장 입구 쪽이에요', '엘리베이터 앞에서 기다릴게요', '편의점 앞에서 만나요'].map(desc => (
                  <button
                    key={desc}
                    type="button"
                    onClick={() => { if (locDescRef.current) locDescRef.current.value = desc; }}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {desc}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">참고사항 (선택)</label>
              <input
                ref={locMemoRef}
                placeholder="예: 파란 패딩 입고 있을게요"
                className="border-input placeholder:text-muted-foreground h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {['건물 앞 벤치에서 기다릴게요', '늦으면 연락 주세요'].map(memo => (
                  <button
                    key={memo}
                    type="button"
                    onClick={() => { if (locMemoRef.current) locMemoRef.current.value = memo; }}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {memo}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="button"
              onClick={handleLocation}
              disabled={!canSendLoc}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              장소 보내기
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* 송금 정보 Sheet */}
      <Sheet open={bankOpen} onOpenChange={(open) => { setBankOpen(open); if (!open) setCanSendBank(false); }}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl" showCloseButton={false}>
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg">송금 정보 공유</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 px-4 pb-3">
            <div>
              <label className="mb-1 block text-sm font-medium">은행</label>
              <select
                ref={bankNameRef}
                onChange={checkCanSendBank}
                className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                defaultValue={savedBank?.bank || ''}
              >
                <option value="" disabled>은행 선택</option>
                {['카카오뱅크', '토스뱅크', '국민은행', '신한은행', '우리은행', '하나은행', '농협은행', 'SC제일은행', '기업은행', '새마을금고'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">계좌번호</label>
              <input
                ref={bankAccountRef}
                onChange={checkCanSendBank}
                onInput={checkCanSendBank}
                defaultValue={savedBank?.account || ''}
                placeholder="'-' 없이 숫자만 입력"
                inputMode="numeric"
                className="border-input placeholder:text-muted-foreground h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">예금주</label>
              <input
                ref={bankHolderRef}
                onChange={checkCanSendBank}
                onInput={checkCanSendBank}
                defaultValue={savedBank?.holder || ''}
                placeholder="예금주 이름"
                className="border-input placeholder:text-muted-foreground h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">금액 (선택)</label>
              <input
                ref={bankAmountRef}
                placeholder="예: 30,000"
                inputMode="numeric"
                className="border-input placeholder:text-muted-foreground h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>
            <Button
              type="button"
              onClick={handleBank}
              disabled={!canSendBank}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              송금 정보 보내기
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* 메시지 원칙 Sheet */}
      <Sheet open={principleOpen} onOpenChange={(open) => { setPrincipleOpen(open); if (!open) { setSelectedPrinciples([]); setPrincipleCustom(''); } }}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl" showCloseButton={false}>
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg">메시지 원칙</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 px-4 pb-3">
            <p className="text-sm text-muted-foreground">거래 시 지키고 싶은 원칙을 선택하세요</p>
            <div className="space-y-1.5">
              {principles.map(({ emoji, text }) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => togglePrinciple(text)}
                  className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedPrinciples.includes(text)
                      ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <span className="text-base">{emoji}</span>
                  <span className="flex-1">{text}</span>
                  {selectedPrinciples.includes(text) && <span className="text-orange-500">✓</span>}
                </button>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">직접 입력 (선택)</label>
              <input
                value={principleCustom}
                onChange={e => setPrincipleCustom(e.target.value)}
                placeholder="나만의 거래 원칙을 적어보세요"
                className="border-input placeholder:text-muted-foreground h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {['네고 없이 정가 거래 원합니다', '직거래만 가능합니다', '택배 거래도 가능해요', '쿨거래 선호합니다', '거래 후 환불은 어려워요'].map(ex => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setPrincipleCustom(ex)}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="button"
              onClick={handlePrinciple}
              disabled={selectedPrinciples.length === 0 && !principleCustom.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              원칙 보내기
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}
