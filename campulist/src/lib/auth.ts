// ============================================================
// 캠퍼스리스트 — Mock 인증 함수
// Phase A: localStorage 기반, Phase B: Supabase로 교체
// ============================================================

import { STORAGE_KEYS } from '@/lib/constants';
import { mockUsers, getProfileOverrides } from '@/data/users';
import { universities } from '@/data/universities';
import type { User, MemberType } from '@/lib/types';

// Mock 유저 기본 비밀번호
const MOCK_PASSWORD = '1234';

interface RegisteredUser {
  id: string;
  email: string;
  password: string;
  nickname: string;
  memberType: MemberType;
  universityId: number;
  campus: string | null;
  department: string | null;
  createdAt: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  userId?: string;
}

interface SignupData {
  nickname: string;
  email: string;
  password: string;
  memberType: MemberType;
  universityId?: number;
  campus?: string | null;
}

// ── localStorage 헬퍼 ──

function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: RegisteredUser[]) {
  localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
}

// ── 유저 검색 ──

export function getFullUser(userId: string): User | null {
  // 1. mockUsers에서 찾기 (오버라이드 병합)
  const mock = mockUsers.find(u => u.id === userId);
  if (mock) {
    const override = getProfileOverrides(userId);
    if (override) {
      return { ...mock, ...override };
    }
    return mock;
  }

  // 2. localStorage 가입유저에서 찾기
  const registered = getRegisteredUsers().find(u => u.id === userId);
  if (registered) {
    return {
      id: registered.id,
      email: registered.email,
      nickname: registered.nickname,
      avatarUrl: null,
      role: 'user',
      memberType: registered.memberType,
      universityId: registered.universityId,
      campus: registered.campus,
      department: registered.department,
      isVerified: registered.email.endsWith('.ac.kr'),
      verifiedAt: registered.email.endsWith('.ac.kr') ? registered.createdAt : null,
      mannerTemp: 36.5,
      tradeCount: 0,
      createdAt: registered.createdAt,
    };
  }

  return null;
}

// ── 현재 유저 ID ──

export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || null;
}

// ── 로그인 ──

export function mockLogin(email: string, password: string): AuthResult {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    return { success: false, error: '이메일과 비밀번호를 입력하세요' };
  }

  // 1. mockUsers에서 찾기 (비밀번호: '1234')
  const mockUser = mockUsers.find(u => u.email.toLowerCase() === trimmedEmail);
  if (mockUser) {
    if (password === MOCK_PASSWORD) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, mockUser.id);
      return { success: true, userId: mockUser.id };
    }
    return { success: false, error: '비밀번호가 일치하지 않습니다' };
  }

  // 2. localStorage 가입유저에서 찾기
  const registered = getRegisteredUsers().find(u => u.email.toLowerCase() === trimmedEmail);
  if (registered) {
    if (password === registered.password) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, registered.id);
      return { success: true, userId: registered.id };
    }
    return { success: false, error: '비밀번호가 일치하지 않습니다' };
  }

  return { success: false, error: '가입되지 않은 이메일입니다' };
}

// ── 회원가입 ──

export function mockSignup(data: SignupData): AuthResult {
  const { nickname, email, password, memberType, universityId: selectedUniId, campus: selectedCampus } = data;
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedNickname = nickname.trim();

  if (!trimmedNickname) return { success: false, error: '닉네임을 입력하세요' };
  if (!trimmedEmail) return { success: false, error: '이메일을 입력하세요' };
  if (!password) return { success: false, error: '비밀번호를 입력하세요' };
  if (password.length < 4) return { success: false, error: '비밀번호는 4자 이상이어야 합니다' };

  // 이메일 중복 체크
  if (mockUsers.some(u => u.email.toLowerCase() === trimmedEmail)) {
    return { success: false, error: '이미 가입된 이메일입니다' };
  }
  const registeredUsers = getRegisteredUsers();
  if (registeredUsers.some(u => u.email.toLowerCase() === trimmedEmail)) {
    return { success: false, error: '이미 가입된 이메일입니다' };
  }

  // 닉네임 중복 체크
  if (mockUsers.some(u => u.nickname === trimmedNickname)) {
    return { success: false, error: '이미 사용 중인 닉네임입니다' };
  }
  if (registeredUsers.some(u => u.nickname === trimmedNickname)) {
    return { success: false, error: '이미 사용 중인 닉네임입니다' };
  }

  // 대학교 결정: 사용자 선택값 > 이메일 도메인 자동매칭 > 기본값
  const emailDomain = trimmedEmail.split('@')[1];
  const matchedUni = universities.find(u => emailDomain?.endsWith(u.domain));
  const universityId = selectedUniId ?? matchedUni?.id ?? 1;

  // 새 유저 생성
  const newUser: RegisteredUser = {
    id: `local-user-${Date.now()}`,
    email: trimmedEmail,
    password,
    nickname: trimmedNickname,
    memberType,
    universityId,
    campus: selectedCampus ?? null,
    department: null,
    createdAt: new Date().toISOString(),
  };

  registeredUsers.push(newUser);
  saveRegisteredUsers(registeredUsers);

  // 자동 로그인
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, newUser.id);

  return { success: true, userId: newUser.id };
}

// ── 프로필 수정 ──

export interface ProfileUpdateData {
  nickname?: string;
  department?: string | null;
  memberType?: MemberType;
  campus?: string | null;
}

export function mockUpdateProfile(userId: string, data: ProfileUpdateData): AuthResult {
  const trimmedNickname = data.nickname?.trim();

  // 닉네임 변경 시 유효성 + 중복 체크
  if (trimmedNickname !== undefined) {
    if (!trimmedNickname) return { success: false, error: '닉네임을 입력하세요' };

    // mockUsers에서 중복 확인 (본인 제외, 오버라이드 반영)
    for (const u of mockUsers) {
      if (u.id === userId) continue;
      const override = getProfileOverrides(u.id);
      const currentNick = override?.nickname ?? u.nickname;
      if (currentNick === trimmedNickname) {
        return { success: false, error: '이미 사용 중인 닉네임입니다' };
      }
    }

    // registeredUsers에서 중복 확인 (본인 제외)
    const registeredUsers = getRegisteredUsers();
    if (registeredUsers.some(u => u.id !== userId && u.nickname === trimmedNickname)) {
      return { success: false, error: '이미 사용 중인 닉네임입니다' };
    }
  }

  // mockUser인 경우: 오버라이드 저장
  const isMockUser = mockUsers.some(u => u.id === userId);
  if (isMockUser) {
    const allOverrides: Record<string, Record<string, unknown>> = (() => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE_OVERRIDES) || '{}');
      } catch { return {}; }
    })();
    const current = allOverrides[userId] || {};
    if (trimmedNickname !== undefined) current.nickname = trimmedNickname;
    if (data.department !== undefined) current.department = data.department;
    if (data.memberType !== undefined) current.memberType = data.memberType;
    if (data.campus !== undefined) current.campus = data.campus;
    allOverrides[userId] = current;
    localStorage.setItem(STORAGE_KEYS.PROFILE_OVERRIDES, JSON.stringify(allOverrides));
    return { success: true, userId };
  }

  // registeredUser인 경우: 직접 업데이트
  const registeredUsers = getRegisteredUsers();
  const idx = registeredUsers.findIndex(u => u.id === userId);
  if (idx === -1) return { success: false, error: '사용자를 찾을 수 없습니다' };

  if (trimmedNickname !== undefined) registeredUsers[idx].nickname = trimmedNickname;
  if (data.department !== undefined) registeredUsers[idx].department = data.department;
  if (data.memberType !== undefined) registeredUsers[idx].memberType = data.memberType;
  if (data.campus !== undefined) registeredUsers[idx].campus = data.campus;

  saveRegisteredUsers(registeredUsers);
  return { success: true, userId };
}

// ── 로그아웃 ──

export function mockLogout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// ── 회원탈퇴 ──

export function mockDeleteAccount(userId: string): void {
  // REGISTERED_USERS에서 해당 유저 제거
  const users = getRegisteredUsers().filter(u => u.id !== userId);
  saveRegisteredUsers(users);

  // 사용자 관련 localStorage 전부 삭제 (UI 설정 제외)
  Object.values(STORAGE_KEYS).forEach(key => {
    if (key !== STORAGE_KEYS.SHOW_ICONS) {
      localStorage.removeItem(key);
    }
  });
}
