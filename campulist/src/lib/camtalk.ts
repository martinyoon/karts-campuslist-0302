// ============================================================
// 캠톡 (CamTalk) — 3세대 채팅 데이터 레이어
// 핵심 원칙: 사용자1 + 사용자2 사이에는 단 하나의 캠톡만 존재
// unread는 유저별 맵, participants는 대칭 구조
// 게시글 정보는 메시지 링크로만 전달 (방 속성 아님)
// ============================================================

import { createCamNotif } from './camnotif';

// ─── 타입 (자체 정의, types.ts 미사용) ───

export interface CamTalkParticipant {
  id: string;
  nickname: string;
}

export interface CamTalkRoom {
  id: string;
  participants: [CamTalkParticipant, CamTalkParticipant];
  lastMessage: string | null;
  lastMessageAt: string | null;
  unread: { [userId: string]: number };
  createdAt: string;
}

export interface CamTalkMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

// ─── localStorage 헬퍼 ───

const KEY_ROOMS = 'ct_rooms';
const KEY_MSGS = 'ct_msgs';

function readRooms(): CamTalkRoom[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY_ROOMS) || '[]'); }
  catch { return []; }
}

function writeRooms(rooms: CamTalkRoom[]): void {
  try { localStorage.setItem(KEY_ROOMS, JSON.stringify(rooms)); }
  catch { /* storage full */ }
}

function readMsgs(): CamTalkMessage[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY_MSGS) || '[]'); }
  catch { return []; }
}

function writeMsgs(msgs: CamTalkMessage[]): void {
  try { localStorage.setItem(KEY_MSGS, JSON.stringify(msgs)); }
  catch { /* storage full */ }
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── 공개 함수 ───

/** 내 캠톡 목록 (최신순) */
export function getMyRooms(userId: string): CamTalkRoom[] {
  return readRooms()
    .filter(r => r.participants.some(p => p.id === userId))
    .sort((a, b) => {
      const at = a.lastMessageAt || a.createdAt;
      const bt = b.lastMessageAt || b.createdAt;
      return new Date(bt).getTime() - new Date(at).getTime();
    });
}

/** 단일 캠톡 방 조회 */
export function getRoom(roomId: string): CamTalkRoom | null {
  return readRooms().find(r => r.id === roomId) || null;
}

/** 두 유저 사이 기존 캠톡 찾기 — 유일한 검색 함수 */
export function findRoomByUser(targetId: string, myId: string): CamTalkRoom | null {
  return readRooms().find(r =>
    r.participants.some(p => p.id === targetId) &&
    r.participants.some(p => p.id === myId)
  ) || null;
}

/**
 * 캠톡 시작 (방 생성 + 선택적 첫 메시지)
 * 핵심: 같은 두 사용자 사이에 이미 방이 있으면 무조건 기존 방 반환
 * 첫 메시지가 있으면 기존 방에 메시지만 추가
 */
export function startCamTalk(input: {
  me: CamTalkParticipant;
  partner: CamTalkParticipant;
  firstMessage?: string;
}): CamTalkRoom {
  // 중복 방지: 같은 두 사용자 사이에 이미 방이 있으면 기존 반환
  const rooms = readRooms();
  const existing = rooms.find(r =>
    r.participants.some(p => p.id === input.me.id) &&
    r.participants.some(p => p.id === input.partner.id)
  );

  if (existing) {
    // 기존 방이 있으면 첫 메시지만 추가 (방 새로 만들지 않음)
    if (input.firstMessage) {
      sendMessage(existing.id, input.me.id, input.firstMessage);
    }
    return existing;
  }

  // 새 방 생성
  const now = new Date().toISOString();
  const room: CamTalkRoom = {
    id: genId('ct'),
    participants: [input.me, input.partner],
    lastMessage: input.firstMessage || null,
    lastMessageAt: input.firstMessage ? now : null,
    unread: {
      [input.me.id]: 0,
      [input.partner.id]: input.firstMessage ? 1 : 0,
    },
    createdAt: now,
  };

  rooms.push(room);
  writeRooms(rooms);

  // 첫 메시지가 있으면 저장 + 알림
  if (input.firstMessage) {
    const msg: CamTalkMessage = {
      id: genId('ctm'),
      roomId: room.id,
      senderId: input.me.id,
      content: input.firstMessage,
      createdAt: now,
    };
    const msgs = readMsgs();
    msgs.push(msg);
    writeMsgs(msgs);

    // 받는 사람에게 알림
    createCamNotif({
      recipientId: input.partner.id,
      type: 'camtalk',
      title: '새 캠톡이 도착했습니다',
      body: input.firstMessage.slice(0, 50),
      link: `/camtalk/${room.id}`,
    });
  }

  window.dispatchEvent(new Event('camtalkUpdate'));
  return room;
}

/** 메시지 목록 */
export function getMessages(roomId: string): CamTalkMessage[] {
  return readMsgs()
    .filter(m => m.roomId === roomId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/** 메시지 전송 */
export function sendMessage(roomId: string, senderId: string, content: string): CamTalkMessage {
  const now = new Date().toISOString();
  const msg: CamTalkMessage = {
    id: genId('ctm'),
    roomId,
    senderId,
    content,
    createdAt: now,
  };

  // 메시지 저장
  const msgs = readMsgs();
  msgs.push(msg);
  writeMsgs(msgs);

  // 방 업데이트: lastMessage + 받는 사람 unread +1
  const rooms = readRooms();
  const idx = rooms.findIndex(r => r.id === roomId);
  if (idx >= 0) {
    const room = rooms[idx];
    room.lastMessage = content;
    room.lastMessageAt = now;

    // 받는 사람 = 참여자 중 보낸 사람이 아닌 쪽
    const recipient = room.participants.find(p => p.id !== senderId);
    if (recipient) {
      room.unread[recipient.id] = (room.unread[recipient.id] || 0) + 1;
      writeRooms(rooms);

      // 받는 사람에게만 알림
      createCamNotif({
        recipientId: recipient.id,
        type: 'camtalk',
        title: '새 메시지가 도착했습니다',
        body: content.slice(0, 50),
        link: `/camtalk/${roomId}`,
      });
    } else {
      writeRooms(rooms);
    }
  }

  window.dispatchEvent(new Event('camtalkUpdate'));
  return msg;
}

/** 내 안읽음 총합 */
export function getMyUnreadTotal(userId: string): number {
  return readRooms()
    .filter(r => r.participants.some(p => p.id === userId))
    .reduce((sum, r) => sum + (r.unread[userId] || 0), 0);
}

/** 읽음 처리 — 특정 유저의 unread만 초기화 */
export function markRead(roomId: string, userId: string): void {
  const rooms = readRooms();
  const idx = rooms.findIndex(r => r.id === roomId);
  if (idx >= 0) {
    rooms[idx].unread[userId] = 0;
    writeRooms(rooms);
    window.dispatchEvent(new Event('camtalkUpdate'));
  }
}
