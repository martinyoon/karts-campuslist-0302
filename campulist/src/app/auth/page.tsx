'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { universities } from '@/data/universities';
import type { MemberType, University } from '@/lib/types';

const uniFullName = (u: University) => u.nameKo ? `${u.name}(${u.nameKo})` : u.name;

const CAMPUS_MEMBER_TYPES: { value: MemberType; label: string; icon: string }[] = [
  { value: 'undergraduate', label: '학부생/예술사(한예종)', icon: '🎓' },
  { value: 'graduate', label: '대학원생/전문사(한예종)', icon: '📚' },
  { value: 'professor', label: '교수', icon: '👨‍🏫' },
  { value: 'staff', label: '교직원', icon: '🏢' },
  { value: 'alumni', label: '졸업생', icon: '🎒' },
];

const EXTERNAL_MEMBER_TYPES: { value: MemberType; label: string; icon: string }[] = [
  { value: 'merchant', label: '비지니스 회원', icon: '🏪' },
  { value: 'general', label: '일반인 회원', icon: '👤' },
];

export default function AuthPage() {
  const router = useRouter();
  const { user, isLoading, login, signup } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [memberType, setMemberType] = useState<MemberType>('undergraduate');
  const [universityId, setUniversityId] = useState<number | null>(null);
  const [campusName, setCampusName] = useState<string | null>(null);

  // 이메일 도메인으로 대학교 자동 감지
  const emailDomain = email.trim().toLowerCase().split('@')[1] || '';
  const autoMatchedUni = universities.find(u => emailDomain.endsWith(u.domain));
  const isAcKrEmail = emailDomain.endsWith('.ac.kr') && !!autoMatchedUni;
  const effectiveUniId = isAcKrEmail ? autoMatchedUni!.id : universityId;
  const selectedUni = universities.find(u => u.id === effectiveUniId);

  useEffect(() => {
    document.title = mode === 'login' ? '로그인 | 캠퍼스리스트' : '회원가입 | 캠퍼스리스트';
  }, [mode]);

  // 이미 로그인 상태면 홈으로
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      const result = login(email, password);
      if (result.success) {
        toast('로그인 되었습니다');
        router.push('/');
      } else {
        toast(result.error || '로그인에 실패했습니다');
      }
    } else {
      if (!isAcKrEmail && !universityId) {
        toast('대학교 선택를 선택하세요');
        return;
      }
      const result = signup({
        nickname, email, password, memberType,
        universityId: effectiveUniId ?? undefined,
        campus: campusName,
      });
      if (result.success) {
        toast('회원가입이 완료되었습니다');
        router.push('/');
      } else {
        toast(result.error || '회원가입에 실패했습니다');
      }
    }
  };

  if (isLoading || user) return null;

  return (
    // 간격 압축: py-12 → py-6
    <div className="mx-auto max-w-sm px-4 py-6">
      {/* 간격 압축: mb-8 → mb-4 */}
      <Link href="/" className="mb-4 block text-center">
        <span className="block text-2xl font-bold text-blue-500">캠퍼스리스트</span>
        <span className="text-xs text-muted-foreground">Campu(s)+list+.com = Campulist.com</span>
      </Link>

      {/* 간격 압축: p-6 → p-3 (py-6→py-3 규칙 적용) */}
      <div className="rounded-xl border border-border p-3">
        {/* 탭 */}
        {/* 간격 압축: mb-6 → mb-3 */}
        <div className="mb-3 flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 간격 압축: space-y-4 → space-y-2 */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {mode === 'signup' && (
            <>
              <div>
                {/* 간격 압축: mb-1.5 → mb-1 */}
                <label htmlFor="auth-nickname" className="mb-1 block text-sm font-medium">닉네임</label>
                <Input
                  id="auth-nickname"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                />
              </div>

              {/* 회원 유형 */}
              <div>
                {/* 간격 압축: mb-2 → mb-1 */}
                <label className="mb-1 block text-sm font-medium">회원 유형</label>
                {/* 간격 압축: mb-1.5 → mb-1 */}
                <p className="mb-1 text-xs text-muted-foreground">캠퍼스 회원</p>
                {/* 간격 압축: gap-2 → gap-1 (list items) */}
                <div className="grid grid-cols-5 gap-1">
                  {CAMPUS_MEMBER_TYPES.map(type => (
                    // 간격 압축: py-2.5 → py-1.5
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setMemberType(type.value)}
                      className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-1.5 text-xs font-medium transition-colors ${
                        memberType === type.value
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                {/* 간격 압축: mb-1.5 → mb-1, mt-3 → mt-1.5 */}
                <p className="mb-1 mt-1.5 text-xs text-muted-foreground">외부 회원</p>
                {/* 간격 압축: gap-2 → gap-1 (list items) */}
                <div className="grid grid-cols-2 gap-1">
                  {EXTERNAL_MEMBER_TYPES.map(type => (
                    // 간격 압축: py-2.5 → py-1.5
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setMemberType(type.value)}
                      className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                        memberType === type.value
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            {/* 간격 압축: mb-1.5 → mb-1 */}
            <label htmlFor="auth-email" className="mb-1 block text-sm font-medium">이메일</label>
            <Input
              id="auth-email"
              type="email"
              placeholder="학교 이메일을 입력하세요"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {mode === 'signup' && isAcKrEmail && (
              <p className="mt-1 text-xs text-green-600">
                {uniFullName(autoMatchedUni!)} 자동 인증됩니다.
              </p>
            )}
            {mode === 'signup' && !isAcKrEmail && (
              <p className="mt-1 text-xs text-muted-foreground">
                .ac.kr 이메일로 가입하면 학교 인증이 자동 완료됩니다.
              </p>
            )}
          </div>

          {/* 대학교 선택 */}
          {mode === 'signup' && (
            <div>
              {/* 간격 압축: mb-1.5 → mb-1 */}
              <label htmlFor="auth-university" className="mb-1 block text-sm font-medium">대학교 선택</label>
              {isAcKrEmail ? (
                <div className="rounded-md border border-green-500/30 bg-green-500/5 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400">
                  {uniFullName(autoMatchedUni!)}
                </div>
              ) : (
                <select
                  id="auth-university"
                  value={universityId ?? ''}
                  onChange={e => { setUniversityId(e.target.value ? Number(e.target.value) : null); setCampusName(null); }}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">대학교를 선택하세요</option>
                  {universities.filter(u => u.isActive).map(u => (
                    <option key={u.id} value={u.id}>{uniFullName(u)}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* 캠퍼스 선택 */}
          {mode === 'signup' && selectedUni && (
            <div>
              {/* 간격 압축: mb-1.5 → mb-1 */}
              <label className="mb-1 block text-sm font-medium">캠퍼스</label>
              {selectedUni.campuses.length > 1 && (
                <>
                  {/* 간격 압축: mb-2 → mb-1, gap-2 → gap-1 (list items) */}
                  <div className="mb-1 flex flex-wrap gap-1">
                    {selectedUni.campuses.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setCampusName(c.name)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                          campusName === c.name
                            ? 'border-blue-500 bg-blue-500/10 font-medium text-blue-600'
                            : 'border-border text-muted-foreground hover:border-blue-500/50'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <Input
                value={campusName ?? ''}
                onChange={e => setCampusName(e.target.value || null)}
                placeholder="캠퍼스 명칭을 입력하세요"
              />
            </div>
          )}

          <div>
            {/* 간격 압축: mb-1.5 → mb-1 */}
            <label htmlFor="auth-password" className="mb-1 block text-sm font-medium">비밀번호</label>
            <Input
              id="auth-password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {mode === 'signup' && (
              <p className="mt-1 text-xs text-muted-foreground">
                4자리 이상 입력해주세요
              </p>
            )}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            {mode === 'login' ? '로그인' : '회원가입'}
          </Button>
        </form>

        {/* 간격 압축: my-6 → my-3 */}
        <Separator className="my-3" />

        {/* 소셜 로그인 — 추후 Supabase OAuth 연동 시 활성화 */}
        <p className="text-center text-xs text-muted-foreground">
          소셜 로그인(카카오, 네이버 등)은 곧 지원 예정입니다.
        </p>
      </div>
    </div>
  );
}
