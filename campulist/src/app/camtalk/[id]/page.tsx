'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

/** 메시지 내 /post/xxx 경로를 클릭 가능한 링크로 변환 */
function renderContent(content: string) {
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
  const appDateRef = useRef<HTMLInputElement>(null);
  const appTimeRef = useRef<HTMLSelectElement>(null);
  const appLocationRef = useRef<HTMLInputElement>(null);
  const appNoteRef = useRef<HTMLInputElement>(null);
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
    if (partnerNickname) document.title = `${partnerNickname} 캠톡 | 캠퍼스리스트`;
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
        <p className="text-lg font-medium">캠톡을 찾을 수 없습니다</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/camtalk')}>
          캠톡 목록으로
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

  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col md:h-[calc(100dvh-80px)]">
      {/* 상단 헤더 */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground" aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <Link href={`/user/${partner.id}`} className="min-w-0 flex-1 transition-opacity hover:opacity-70">
            <div className="flex items-center gap-2">
              <span className="font-medium">{partnerNickname}</span>
              {partnerProfile?.isVerified && (
                <Badge variant="secondary" className="h-4 px-1 text-[10px]">인증</Badge>
              )}
              {partnerProfile && (
                <span className="text-xs text-muted-foreground">{partnerProfile.mannerTemp}°C</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* 확정된 약속 배너 */}
      {confirmedApp && (
        <div className="flex items-center gap-2 border-b border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm">
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
      <div className="flex-1 overflow-y-auto px-4 py-4">
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

            return (
              <div key={msg.id} className={isFirstInGroup && i > 0 ? 'mt-3' : ''}>
                {showDate && (
                  <div className="my-4 text-center text-xs text-muted-foreground">
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
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* 약속 응답 버튼 */}
                {showAppButtons && (
                  <div className="mt-1.5 flex gap-2 pl-9">
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

      {/* 메시지 입력 */}
      <div className="border-t border-border px-4 py-3">
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setAppointmentOpen(true)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="약속 잡기"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </button>
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
            className="bg-blue-600 px-4 hover:bg-blue-700"
          >
            전송
          </Button>
        </form>
      </div>

      {/* 약속 잡기 패널 */}
      {appointmentOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setAppointmentOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-background px-4 pb-6 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">거래 약속 잡기</h3>
              <button
                type="button"
                onClick={() => setAppointmentOpen(false)}
                className="rounded-md px-3 py-1 text-base font-semibold text-yellow-500 hover:bg-yellow-500/10 dark:text-yellow-400"
              >
                취소
              </button>
            </div>
            <div className="space-y-4">
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
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                약속 보내기
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
