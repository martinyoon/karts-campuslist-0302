# mock-auth Planning Document

> **Summary**: Supabase 없이 localStorage 기반 Mock 인증 시스템 구현
>
> **Project**: campulist
> **Version**: Phase A
> **Author**: Claude
> **Date**: 2026-02-21
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

현재 캠퍼스리스트는 `CURRENT_USER_ID = 'u1'`로 하드코딩되어 있어 로그인/회원가입/로그아웃 기능이 없음. Supabase 없이 localStorage만으로 동작하는 Mock 인증 시스템을 구현하여:

- 사용자가 회원가입/로그인/로그아웃을 체험할 수 있음
- 다른 Mock 유저로 로그인하여 기능을 테스트할 수 있음
- Phase B에서 Supabase로 전환 시 AuthContext 내부만 교체하면 됨

### 1.2 Background

- Phase A는 100% localStorage 기반 Mock 데이터 시스템
- `/auth` 페이지 UI는 존재하지만 `handleSubmit`이 toast만 표시
- `CURRENT_USER_ID`가 5개 파일에서 직접 참조됨
- 인증 상태 관리 (Context, Hook, Guard) 없음

### 1.3 Related Documents

- campulist 설계 문서: `docs/02-design/features/campulist.design.md`
- 기존 분석: `docs/03-analysis/campulist.analysis.md` (96% match rate)

---

## 2. Scope

### 2.1 In Scope

- [x] AuthContext + AuthProvider (React Context)
- [x] useAuth() Hook
- [x] localStorage 기반 login/signup/logout 함수
- [x] 기존 `CURRENT_USER_ID` 참조 전체 교체
- [x] `/auth` 페이지 실제 동작 연결
- [x] 로그인 필요 페이지 보호 (AuthGuard)
- [x] Header에 로그인/로그아웃 UI

### 2.2 Out of Scope

- Supabase 연동 (Phase B)
- 이메일 인증 (실제 이메일 발송)
- 비밀번호 해싱/암호화
- 소셜 로그인 실제 구현 (OAuth)
- 세션 만료/토큰 갱신
- 비밀번호 재설정

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 회원가입: 닉네임+이메일+비밀번호로 새 유저 생성, localStorage 저장 | High | Pending |
| FR-02 | 로그인: 이메일+비밀번호로 mockUsers에서 유저 검색, 일치 시 로그인 | High | Pending |
| FR-03 | 로그아웃: 현재 유저 상태 초기화, /auth로 리다이렉트 | High | Pending |
| FR-04 | 자동 로그인: 앱 시작 시 localStorage에서 로그인 상태 복원 | High | Pending |
| FR-05 | AuthGuard: 글쓰기, 마이페이지, 채팅 등 보호 라우트 | Medium | Pending |
| FR-06 | Header UI: 비로그인 시 "로그인" 버튼, 로그인 시 유저 아이콘 | Medium | Pending |
| FR-07 | 기존 Mock 유저(u1~u11)로 로그인 가능 (비밀번호: "1234") | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Supabase 호환 | useAuth() 인터페이스 변경 없이 Supabase 전환 가능 | 인터페이스 검토 |
| 구현 난이도 | 새 파일 3개 + 수정 6개 이내 | 파일 수 확인 |
| 빌드 안정성 | `npm run build` 성공 | 빌드 실행 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] AuthContext + useAuth Hook 동작
- [ ] 회원가입 → 자동 로그인 → 홈으로 이동
- [ ] 로그인 → 홈으로 이동
- [ ] 로그아웃 → /auth로 이동
- [ ] 글쓰기/마이페이지 비로그인 시 /auth로 리다이렉트
- [ ] CURRENT_USER_ID 하드코딩 완전 제거
- [ ] `npm run build` 성공

### 4.2 Quality Criteria

- [ ] Zero lint errors
- [ ] Build succeeds
- [ ] 기존 기능 깨지지 않음

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Server Component에서 useAuth() 사용 불가 | High | High | Server Component는 user prop 전달 받음, Client Component만 useAuth() 사용 |
| CURRENT_USER_ID 교체 누락 | Medium | Low | Grep으로 전체 검색 후 교체 |
| 새 회원가입 유저의 universityId 결정 | Medium | Medium | 회원가입 시 대학 선택 UI 추가 또는 기본값(1) 사용 |
| 비로그인 상태에서 글쓰기 접근 | Medium | High | AuthGuard로 /auth 리다이렉트 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites, portfolios | ✅ |
| Dynamic | Feature-based modules, BaaS | Web apps with backend | ☐ |
| Enterprise | Strict layer separation | High-traffic systems | ☐ |

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 인증 상태 관리 | Context / Zustand / localStorage 직접 | React Context | Supabase 전환 시 Provider만 교체 |
| 저장 위치 | localStorage / sessionStorage / Cookie | localStorage | 기존 패턴과 일관성 |
| 비밀번호 처리 | 해싱 / 평문 비교 | 평문 비교 | Mock 전용, Phase B에서 Supabase가 처리 |
| 보호 라우트 | Middleware / Client Guard | Client Guard | Starter 레벨, 간단한 구현 |
| Server Component 대응 | Props 전달 / Cookie | Props 전달 + Client Component | SSR 없는 Mock 환경 |

### 6.3 파일 구조

```
신규 생성:
  src/contexts/AuthContext.tsx     ← AuthProvider + useAuth
  src/lib/auth.ts                  ← login/signup/logout 함수
  src/components/auth/AuthGuard.tsx ← 보호 라우트 컴포넌트

수정:
  src/app/layout.tsx               ← AuthProvider 감싸기
  src/app/auth/page.tsx            ← 실제 login/signup 호출
  src/app/my/page.tsx              ← CURRENT_USER_ID → useAuth
  src/app/write/page.tsx           ← AuthGuard 적용
  src/components/layout/Header.tsx ← 로그인/로그아웃 UI
  src/components/post/PostStatusControl.tsx  ← useAuth
  src/components/post/PostBottomAction.tsx   ← useAuth
  src/components/user/UserChatButton.tsx     ← useAuth
  src/lib/constants.ts             ← CURRENT_USER 스토리지 키 추가
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] TypeScript strict mode
- [x] Tailwind CSS v4
- [x] shadcn/ui 컴포넌트
- [x] `'use client'` 지시어 규칙
- [x] `STORAGE_KEYS` 중앙 관리 (`constants.ts`)

### 7.2 인증 관련 규칙

| Category | Rule |
|----------|------|
| Context 사용 | Client Component에서만 `useAuth()` 호출 |
| Server Component | `user` prop으로 전달 받음 (직접 Context 접근 불가) |
| Storage Key | `STORAGE_KEYS.CURRENT_USER = 'campulist_current_user'` |
| 비밀번호 | Mock 단계: 평문 비교, Phase B: Supabase 위임 |

### 7.3 Environment Variables Needed

없음 (localStorage 전용, 환경 변수 불필요)

---

## 8. useAuth() 인터페이스 설계

```typescript
interface AuthContextType {
  user: User | null;          // 현재 로그인 유저
  isLoading: boolean;         // 초기 localStorage 로드 중
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { nickname: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
```

Phase B에서 Supabase 전환 시:
- `login()` → `supabase.auth.signInWithPassword()`
- `signup()` → `supabase.auth.signUp()`
- `logout()` → `supabase.auth.signOut()`
- `user` → `supabase.auth.getUser()`

→ **useAuth() 호출 코드는 변경 없음**

---

## 9. Next Steps

1. [ ] 설계 문서 작성 (`/pdca design mock-auth`)
2. [ ] 구현 시작
3. [ ] Gap 분석

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-21 | Initial draft | Claude |
