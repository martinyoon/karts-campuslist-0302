// ============================================================
// 캠알림 (CamNotif) — 3세대 알림 데이터 레이어
// 핵심: 모든 알림에 recipientId 필수, isRead는 알림 자체에 저장
// ============================================================

// ─── 타입 (자체 정의, types.ts 미사용) ───

export type CamNotifType = 'camtalk' | 'system';

export interface CamNotif {
  id: string;
  recipientId: string;
  type: CamNotifType;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

// ─── localStorage 헬퍼 ───

const KEY = 'cn_notifs';

function readNotifs(): CamNotif[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function writeNotifs(notifs: CamNotif[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(notifs)); }
  catch { /* storage full */ }
}

// ─── 공개 함수 ───

/** 내 알림 목록 (최신순) — recipientId로 필터 */
export function getMyNotifs(recipientId: string): CamNotif[] {
  return readNotifs()
    .filter(n => n.recipientId === recipientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** 내 안읽음 수 — recipientId로 필터 */
export function getMyUnreadCount(recipientId: string): number {
  if (typeof window === 'undefined') return 0;
  return readNotifs()
    .filter(n => n.recipientId === recipientId && !n.isRead)
    .length;
}

/** 단건 읽음 처리 */
export function markRead(notifId: string): void {
  const notifs = readNotifs();
  const idx = notifs.findIndex(n => n.id === notifId);
  if (idx >= 0) {
    notifs[idx].isRead = true;
    writeNotifs(notifs);
    window.dispatchEvent(new Event('camnotifUpdate'));
  }
}

/** 전체 읽음 처리 — 내 알림만 */
export function markAllRead(recipientId: string): void {
  const notifs = readNotifs();
  let changed = false;
  notifs.forEach(n => {
    if (n.recipientId === recipientId && !n.isRead) {
      n.isRead = true;
      changed = true;
    }
  });
  if (changed) {
    writeNotifs(notifs);
    window.dispatchEvent(new Event('camnotifUpdate'));
  }
}

/** 알림 생성 — recipientId 필수 */
export function createCamNotif(input: {
  recipientId: string;
  type: CamNotifType;
  title: string;
  body?: string;
  link?: string;
}): void {
  const notif: CamNotif = {
    id: `cn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    recipientId: input.recipientId,
    type: input.type,
    title: input.title,
    body: input.body || null,
    link: input.link || null,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  const notifs = readNotifs();
  notifs.push(notif);
  writeNotifs(notifs);
  window.dispatchEvent(new Event('camnotifUpdate'));
}
