import type { User, UserSummary, MemberType } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface ProfileOverride {
  nickname?: string;
  department?: string | null;
  memberType?: MemberType;
  campus?: string | null;
  avatarUrl?: string | null;
}

/** mockUsers의 프로필 수정 사항을 localStorage에서 가져옴 */
export function getProfileOverrides(userId: string): ProfileOverride | null {
  if (typeof window === 'undefined') return null;
  try {
    const all: Record<string, ProfileOverride> = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROFILE_OVERRIDES) || '{}'
    );
    return all[userId] ?? null;
  } catch {
    return null;
  }
}

export const mockUsers: User[] = [
  { id: 'u1', email: 'seo@snu.ac.kr', nickname: '서연이', avatarUrl: null, role: 'user', memberType: 'undergraduate', universityId: 1, campus: '관악캠퍼스', department: '경영학과', isVerified: true, verifiedAt: '2025-09-01', mannerTemp: 38.2, tradeCount: 12, createdAt: '2025-09-01' },
  { id: 'u2', email: 'min@snu.ac.kr', nickname: '민수짱', avatarUrl: null, role: 'user', memberType: 'undergraduate', universityId: 1, campus: '관악캠퍼스', department: '컴퓨터공학과', isVerified: true, verifiedAt: '2025-09-01', mannerTemp: 37.8, tradeCount: 8, createdAt: '2025-10-15' },
  { id: 'u3', email: 'jh@yonsei.ac.kr', nickname: '정호네분식', avatarUrl: null, role: 'business', memberType: 'staff', universityId: 2, campus: '신촌캠퍼스', department: null, isVerified: false, verifiedAt: null, mannerTemp: 39.1, tradeCount: 45, createdAt: '2025-08-20' },
  { id: 'u4', email: 'eunju@korea.ac.kr', nickname: '은주교수', avatarUrl: null, role: 'user', memberType: 'professor', universityId: 3, campus: '안암캠퍼스', department: '사회학과', isVerified: true, verifiedAt: '2025-09-01', mannerTemp: 36.8, tradeCount: 3, createdAt: '2025-11-01' },
  { id: 'u5', email: 'hana@snu.ac.kr', nickname: '하나둘셋', avatarUrl: null, role: 'user', memberType: 'graduate', universityId: 1, campus: '연건캠퍼스', department: '디자인학과', isVerified: true, verifiedAt: '2025-09-01', mannerTemp: 40.2, tradeCount: 25, createdAt: '2025-07-15' },
  { id: 'u6', email: 'tae@yonsei.ac.kr', nickname: '태현이네', avatarUrl: null, role: 'user', memberType: 'undergraduate', universityId: 2, campus: '신촌캠퍼스', department: '전자공학과', isVerified: true, verifiedAt: '2025-09-01', mannerTemp: 37.5, tradeCount: 6, createdAt: '2025-12-01' },
  { id: 'u7', email: 'sol@korea.ac.kr', nickname: '솔이맘', avatarUrl: null, role: 'user', memberType: 'alumni', universityId: 3, campus: '안암캠퍼스', department: '영어영문학과', isVerified: true, verifiedAt: '2025-09-01', mannerTemp: 38.9, tradeCount: 18, createdAt: '2025-09-10' },
  { id: 'u8', email: 'cafe@yonsei.ac.kr', nickname: '신촌카페', avatarUrl: null, role: 'business', memberType: 'staff', universityId: 2, campus: '신촌캠퍼스', department: null, isVerified: false, verifiedAt: null, mannerTemp: 41.0, tradeCount: 60, createdAt: '2025-06-01' },
  { id: 'u9', email: 'jw@kaist.ac.kr', nickname: '정우개발자', avatarUrl: null, role: 'user', memberType: 'graduate', universityId: 4, campus: '대전 본원', department: '전산학부', isVerified: true, verifiedAt: '2025-09-01', mannerTemp: 39.5, tradeCount: 15, createdAt: '2025-08-01' },
  { id: 'u10', email: 'yuri@kaist.ac.kr', nickname: '유리별', avatarUrl: null, role: 'user', memberType: 'undergraduate', universityId: 4, campus: '대전 본원', department: '생명과학과', isVerified: true, verifiedAt: '2025-09-01', mannerTemp: 37.2, tradeCount: 4, createdAt: '2025-10-20' },
  { id: 'u11', email: 'dj@kaist.ac.kr', nickname: '대전맛집왕', avatarUrl: null, role: 'business', memberType: 'alumni', universityId: 4, campus: '대전 본원', department: null, isVerified: false, verifiedAt: null, mannerTemp: 40.5, tradeCount: 35, createdAt: '2025-07-01' },
];

export function getUserSummary(userId: string): UserSummary {
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    const override = getProfileOverrides(userId);
    return {
      id: user.id,
      nickname: override?.nickname ?? user.nickname,
      avatarUrl: override?.avatarUrl !== undefined ? override.avatarUrl : user.avatarUrl,
      isVerified: user.isVerified,
      mannerTemp: user.mannerTemp,
      tradeCount: user.tradeCount,
    };
  }

  // localStorage 가입유저에서 찾기
  if (typeof window !== 'undefined') {
    try {
      const registered: Array<{ id: string; email: string; nickname: string; avatarUrl?: string | null }> =
        JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
      const regUser = registered.find(u => u.id === userId);
      if (regUser) {
        return {
          id: regUser.id,
          nickname: regUser.nickname,
          avatarUrl: regUser.avatarUrl ?? null,
          isVerified: regUser.email?.endsWith('.ac.kr') ?? false,
          mannerTemp: 36.5,
          tradeCount: 0,
        };
      }
    } catch { /* ignore */ }
  }

  return { id: userId, nickname: '알 수 없음', avatarUrl: null, isVerified: false, mannerTemp: 36.5, tradeCount: 0 };
}
