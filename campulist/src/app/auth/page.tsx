'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { universities } from '@/data/universities';
import type { MemberType, University } from '@/lib/types';

const uniFullName = (u: University) => u.nameKo ? `${u.name}(${u.nameKo})` : u.name;

const CAMPUS_MEMBER_TYPES: { value: MemberType; label: string }[] = [
  { value: 'undergraduate', label: '학부생' },
  { value: 'graduate', label: '대학원생' },
  { value: 'professor', label: '교수' },
  { value: 'staff', label: '교직원' },
];

const EXTERNAL_MEMBER_TYPES: { value: MemberType; label: string; desc: string }[] = [
  { value: 'merchant', label: '비지니스 회원', desc: '대학교 상가·원룸 업체 사장님' },
  { value: 'general', label: '일반인 회원', desc: '대학교와 무관한 일반 이용자' },
];

const ALL_MEMBER_TYPES = [...CAMPUS_MEMBER_TYPES, ...EXTERNAL_MEMBER_TYPES];

export default function AuthPage() {
  const router = useRouter();
  const { user, isLoading, login, signup } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<1 | 2 | 3>(1);
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

  const isCampusType = CAMPUS_MEMBER_TYPES.some(t => t.value === memberType);
  const selectedTypeInfo = ALL_MEMBER_TYPES.find(t => t.value === memberType);

  useEffect(() => {
    if (mode === 'login') {
      document.title = '로그인 | 캠퍼스리스트';
    } else if (step === 1) {
      document.title = '회원 유형 선택 | 캠퍼스리스트';
    } else if (step === 2 && isCampusType) {
      document.title = '이메일 인증 | 캠퍼스리스트';
    } else {
      document.title = '회원가입 | 캠퍼스리스트';
    }
  }, [mode, step, isCampusType]);

  // 이미 로그인 상태면 홈으로
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  // 캠퍼스 Step 2 → Step 3 전환
  const handleCampusEmailNext = () => {
    if (!isAcKrEmail) {
      toast('대학교 이메일(.ac.kr)을 입력해주세요');
      return;
    }
    if (password.length < 4) {
      toast('비밀번호는 4자리 이상 입력해주세요');
      return;
    }
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast('이메일을 입력하세요');
      return;
    }

    if (mode === 'login') {
      const result = login(email, password);
      if (result.success) {
        toast('로그인 되었습니다');
        router.push('/');
      } else {
        toast(result.error || '로그인에 실패했습니다');
      }
    } else {
      // 공통 검증
      if (!nickname.trim()) {
        toast('닉네임을 입력하세요');
        return;
      }
      if (password.length < 4) {
        toast('비밀번호는 4자리 이상 입력해주세요');
        return;
      }

      // 유형별 검증
      if (isCampusType && !isAcKrEmail) {
        toast('캠퍼스 회원은 대학교 이메일(.ac.kr)이 필요해요');
        return;
      }
      if (!isCampusType && !universityId) {
        toast('대학교를 선택하세요');
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
    <div className="mx-auto max-w-sm px-4 py-6">
      <Link href="/" className="mb-4 block text-center">
        <span className="block text-2xl font-bold text-blue-500">캠퍼스리스트</span>
        <span className="text-xs text-muted-foreground">Campu(s)+list+.com = Campulist.com</span>
      </Link>

      <div className="rounded-xl border border-border p-3">
        {/* 탭 */}
        <div className="mb-3 flex rounded-lg bg-muted p-1">
          <button
            onClick={() => { setMode('login'); setStep(1); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => { setMode('signup'); setStep(1); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* ─── Step 1: 회원유형 선택 ─── */}
        {mode === 'signup' && step === 1 && (
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-2xl font-bold">회원 유형 선택</h2>
            </div>

            {/* 캠퍼스 회원 */}
            <div>
              <p className="mb-1 text-base font-bold text-foreground">캠퍼스 회원</p>
              <div className="mb-2 space-y-0.5 text-sm text-muted-foreground">
                <p>✓ 우리 학교 전용 게시판을 이용할 수 있어요</p>
                <p>✓ 학교 인증 배지가 프로필에 표시돼요</p>
                <p className="font-semibold text-orange-500">※ 대학교 이메일(.ac.kr)이 필요해요</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CAMPUS_MEMBER_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setMemberType(type.value)}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition-colors ${
                      memberType === type.value
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                        : 'border-border text-muted-foreground hover:border-blue-300 hover:bg-muted'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">또는</span>
              <Separator className="flex-1" />
            </div>

            {/* 외부 회원 */}
            <div>
              <p className="mb-1 text-base font-bold text-foreground">외부 회원</p>
              <div className="mb-2 space-y-0.5 text-sm text-muted-foreground">
                <p>✓ 홍보 게시판을 자유롭게 이용할 수 있어요 (캠퍼스 회원 전용 게시판 제외)</p>
                <p className="font-semibold text-orange-500">※ 일반 이메일(Gmail, Naver 등)로 편하게 가입하세요</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {EXTERNAL_MEMBER_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setMemberType(type.value)}
                    className={`rounded-xl border-2 px-3 py-3 text-left transition-colors ${
                      memberType === type.value
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                        : 'border-border text-muted-foreground hover:border-blue-300 hover:bg-muted'
                    }`}
                  >
                    <span className="block text-sm font-medium">{type.label}</span>
                    <span className="block text-xs opacity-70">{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              다음
            </Button>
          </div>
        )}

        {/* ─── Step 2 캠퍼스: 이메일 인증 + 비밀번호 ─── */}
        {mode === 'signup' && step === 2 && isCampusType && (
          <form onSubmit={(e) => { e.preventDefault(); handleCampusEmailNext(); }} className="space-y-2">
            <div className="text-center">
              <h2 className="text-lg font-bold">대학교 이메일 인증</h2>
              <p className="mt-1 text-xs text-muted-foreground">대학교 이메일로 소속을 확인해요</p>
            </div>

            <div>
              <label htmlFor="auth-email" className="mb-1 block text-sm font-medium">이메일</label>
              <Input
                id="auth-email"
                type="email"
                placeholder="대학교 이메일을 입력하세요"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {isAcKrEmail && (
                <p className="mt-1 text-xs text-green-600">
                  {uniFullName(autoMatchedUni!)} 자동 인증됩니다.
                </p>
              )}
              {!isAcKrEmail && email.includes('@') && (
                <p className="mt-1 text-xs text-orange-500">
                  대학교 이메일(.ac.kr)을 입력해주세요
                </p>
              )}
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-1 block text-sm font-medium">비밀번호</label>
              <Input
                id="auth-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                4자리 이상 입력해주세요
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                이전
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                다음
              </Button>
            </div>
          </form>
        )}

        {/* ─── Step 2 외부: 전체 가입폼 ─── */}
        {mode === 'signup' && step === 2 && !isCampusType && (
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* 회원유형 뱃지 */}
            {selectedTypeInfo && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">회원 유형</span>
                  <Badge variant="secondary" className="gap-1">
                    {selectedTypeInfo.label}
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  변경
                </button>
              </div>
            )}

            <div>
              <label htmlFor="auth-nickname" className="mb-1 block text-sm font-medium">닉네임</label>
              <Input
                id="auth-nickname"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="auth-email" className="mb-1 block text-sm font-medium">이메일</label>
              <Input
                id="auth-email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-1 block text-sm font-medium">비밀번호</label>
              <Input
                id="auth-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                4자리 이상 입력해주세요
              </p>
            </div>

            {/* 대학교 선택 */}
            <div>
              <label htmlFor="auth-university" className="mb-1 block text-sm font-medium">대학교 선택</label>
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
            </div>

            {/* 캠퍼스 선택 */}
            {selectedUni && (
              <div>
                <label className="mb-1 block text-sm font-medium">캠퍼스</label>
                {selectedUni.campuses.length > 1 && (
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
                )}
                <Input
                  value={campusName ?? ''}
                  onChange={e => setCampusName(e.target.value || null)}
                  placeholder="캠퍼스 명칭을 입력하세요"
                />
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              회원가입
            </Button>
          </form>
        )}

        {/* ─── Step 3 캠퍼스: 프로필 완성 ─── */}
        {mode === 'signup' && step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* 회원유형 뱃지 */}
            {selectedTypeInfo && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">회원 유형</span>
                  <Badge variant="secondary" className="gap-1">
                    {selectedTypeInfo.label}
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  변경
                </button>
              </div>
            )}

            {/* 인증된 이메일 + 대학교 (읽기 전용) */}
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2">
              <p className="text-xs text-muted-foreground">인증된 이메일</p>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">{email}</p>
              <p className="text-xs text-green-600">{autoMatchedUni ? uniFullName(autoMatchedUni) : ''}</p>
            </div>

            <div>
              <label htmlFor="auth-nickname" className="mb-1 block text-sm font-medium">닉네임</label>
              <Input
                id="auth-nickname"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </div>

            {/* 캠퍼스 선택 */}
            {selectedUni && selectedUni.campuses.length > 1 && (
              <div>
                <label className="mb-1 block text-sm font-medium">캠퍼스</label>
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
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              회원가입
            </Button>
          </form>
        )}

        {/* ─── 로그인 폼 ─── */}
        {mode === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label htmlFor="auth-email" className="mb-1 block text-sm font-medium">이메일</label>
              <Input
                id="auth-email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-1 block text-sm font-medium">비밀번호</label>
              <Input
                id="auth-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              로그인
            </Button>
          </form>
        )}

        <Separator className="my-3" />

        {/* 소셜 로그인 — 추후 Supabase OAuth 연동 시 활성화 */}
        <p className="text-center text-xs text-muted-foreground">
          소셜 로그인(카카오, 네이버 등)은 곧 지원 예정입니다.
        </p>
      </div>
    </div>
  );
}
