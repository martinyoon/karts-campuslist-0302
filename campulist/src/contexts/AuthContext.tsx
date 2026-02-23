'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserId, getFullUser, mockLogin, mockSignup, mockLogout, mockDeleteAccount, mockUpdateProfile } from '@/lib/auth';
import type { ProfileUpdateData } from '@/lib/auth';
import type { User, MemberType } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: { nickname: string; email: string; password: string; memberType: MemberType; universityId?: number; campus?: string | null }) => { success: boolean; error?: string };
  logout: () => void;
  deleteAccount: () => void;
  updateProfile: (data: ProfileUpdateData) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드: localStorage에서 유저 복원
  useEffect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      const found = getFullUser(userId);
      setUser(found); // null이면 자동 로그아웃 상태
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = mockLogin(email, password);
    if (result.success && result.userId) {
      const found = getFullUser(result.userId);
      setUser(found);
    }
    return result;
  }, []);

  const signup = useCallback((data: { nickname: string; email: string; password: string; memberType: MemberType; universityId?: number; campus?: string | null }) => {
    const result = mockSignup(data);
    if (result.success && result.userId) {
      const found = getFullUser(result.userId);
      setUser(found);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    mockLogout();
    setUser(null);
    router.push('/auth');
  }, [router]);

  const updateProfile = useCallback((data: ProfileUpdateData) => {
    if (!user) return { success: false, error: '로그인이 필요합니다' };
    const result = mockUpdateProfile(user.id, data);
    if (result.success) {
      const updated = getFullUser(user.id);
      setUser(updated);
    }
    return result;
  }, [user]);

  const deleteAccount = useCallback(() => {
    if (user) {
      mockDeleteAccount(user.id);
    }
    setUser(null);
    router.push('/');
  }, [user, router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, deleteAccount, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
