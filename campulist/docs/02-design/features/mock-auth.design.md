# mock-auth Design

> **Created**: 2026-02-21
> **Plan Reference**: `docs/01-plan/features/mock-auth.plan.md`

---

## Goal

Supabase 없이 localStorage만으로 동작하는 Mock 인증 시스템.
`CURRENT_USER_ID` 하드코딩을 `useAuth()` Hook으로 교체하여,
Phase B Supabase 전환 시 AuthContext 내부만 수정하면 됨.

---

## How It Works

```
[회원가입]
  닉네임 + 이메일 + 비밀번호 입력
  → mockUsers + localStorage 저장
  → STORAGE_KEYS.CURRENT_USER에 userId 저장
  → 홈(/)으로 리다이렉트

[로그인]
  이메일 + 비밀번호 입력
  → mockUsers + localStorage 유저에서 이메일 검색
  → 비밀번호 일치 확인 (평문 비교)
  → STORAGE_KEYS.CURRENT_USER에 userId 저장
  → 홈(/)으로 리다이렉트

[로그아웃]
  → STORAGE_KEYS.CURRENT_USER 삭제
  → /auth로 리다이렉트

[앱 시작 (자동 로그인)]
  → localStorage에서 CURRENT_USER 읽기
  → userId 있으면 → mockUsers에서 유저 찾기 → 로그인 상태
  → userId 없으면 → 비로그인 상태 (user: null)

[보호 라우트]
  → useAuth().user가 null이면 /auth로 리다이렉트
  → 적용 대상: /write, /my, /chat
```

---

## Data Design

### Storage Key 추가

```typescript
// constants.ts에 추가
STORAGE_KEYS = {
  ...기존,
  CURRENT_USER: 'campulist_current_user',       // 로그인 userId
  REGISTERED_USERS: 'campulist_registered_users', // 가입한 유저 목록
}
```

### 가입 유저 저장 구조

```typescript
// localStorage에 저장되는 가입 유저
interface RegisteredUser {
  id: string;           // 'local-user-{timestamp}'
  email: string;
  password: string;     // 평문 (Mock 전용)
  nickname: string;
  universityId: number; // 기본값 1 (서울대)
  createdAt: string;
}

// STORAGE_KEYS.REGISTERED_USERS에 JSON 배열로 저장
```

### Mock 유저 비밀번호 규칙

```
기존 mockUsers (u1~u11): 비밀번호 '1234'로 통일
신규 가입 유저: 입력한 비밀번호 그대로 저장
```

---

## Interface Design

### AuthContextType

```typescript
interface AuthContextType {
  user: User | null;        // 현재 로그인 유저 (null = 비로그인)
  isLoading: boolean;       // 초기 localStorage 로드 중
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: SignupData) => { success: boolean; error?: string };
  logout: () => void;
}

interface SignupData {
  nickname: string;
  email: string;
  password: string;
}
```

### Supabase 전환 호환성

```
Phase A (현재)                    Phase B (Supabase)
─────────────────                 ─────────────────
login():                          login():
  mockUsers에서 email 검색           supabase.auth.signInWithPassword()
  localStorage에 userId 저장         (자동 세션 관리)

signup():                         signup():
  localStorage에 새 유저 추가         supabase.auth.signUp()
  CURRENT_USER에 userId 저장         (자동 세션 관리)

logout():                         logout():
  CURRENT_USER 삭제                  supabase.auth.signOut()

user:                             user:
  localStorage에서 읽기               supabase.auth.getUser()

→ useAuth() 호출 코드는 변경 없음
```

---

## What We Need to Build

### Files to Create (3개)

| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | AuthProvider + useAuth Hook |
| `src/lib/auth.ts` | login, signup, logout, getCurrentUser 함수 |
| `src/components/auth/AuthGuard.tsx` | 보호 라우트 래퍼 컴포넌트 |

### Files to Modify (8개)

| File | Change |
|------|--------|
| `src/lib/constants.ts` | CURRENT_USER, REGISTERED_USERS 키 추가 |
| `src/app/layout.tsx` | AuthProvider 감싸기 |
| `src/app/auth/page.tsx` | 실제 login/signup 호출, 로그인 시 리다이렉트 |
| `src/app/my/page.tsx` | CURRENT_USER_ID → useAuth(), AuthGuard 적용, 로그아웃 연결 |
| `src/app/write/page.tsx` | authorId 하드코딩 → useAuth(), AuthGuard 적용 |
| `src/app/chat/[id]/page.tsx` | CURRENT_USER_ID → useAuth() |
| `src/components/post/PostStatusControl.tsx` | CURRENT_USER_ID → useAuth() |
| `src/components/post/PostBottomAction.tsx` | CURRENT_USER_ID → useAuth() |
| `src/components/user/UserChatButton.tsx` | CURRENT_USER_ID → useAuth() |
| `src/components/layout/Header.tsx` | 로그인/비로그인 UI 분기 |

---

## Component Design

### 1. AuthContext.tsx

```
'use client'

AuthContext (createContext)
├ AuthProvider
│  ├ state: user (User | null), isLoading (boolean)
│  ├ useEffect: localStorage에서 userId 읽기 → 유저 찾기
│  ├ login(email, password) → 결과 반환
│  ├ signup(data) → 결과 반환
│  └ logout() → 상태 초기화 + 리다이렉트
└ useAuth() → useContext(AuthContext)
```

### 2. auth.ts

```
mockLogin(email, password)
  → mockUsers에서 찾기 (비밀번호 '1234')
  → localStorage 가입유저에서 찾기
  → 성공: userId 반환
  → 실패: error 반환

mockSignup(data)
  → 이메일 중복 체크 (mockUsers + localStorage)
  → 닉네임 중복 체크
  → 새 유저 생성 → localStorage 저장
  → userId 반환

mockLogout()
  → CURRENT_USER 삭제

getCurrentUserId()
  → localStorage에서 CURRENT_USER 읽기

getFullUser(userId)
  → mockUsers에서 찾기 || localStorage 가입유저에서 찾기 → User 객체
```

### 3. AuthGuard.tsx

```
'use client'

AuthGuard({ children })
  → useAuth()
  → isLoading: 스피너 표시
  → user === null: router.push('/auth')
  → user 있음: children 렌더링
```

### 4. Header.tsx 변경

```
현재:
  [글쓰기] [알림] [마이]

변경 (로그인 시):
  [글쓰기] [알림] [마이]     ← 변경 없음

변경 (비로그인 시):
  [로그인]                    ← 글쓰기/알림/마이 대신 로그인 버튼
```

### 5. auth/page.tsx 변경

```
현재:
  handleSubmit → toast만 표시

변경:
  handleSubmit →
    login mode: auth.login(email, password)
      → 성공: router.push('/')
      → 실패: toast('이메일 또는 비밀번호를 확인하세요')
    signup mode: auth.signup({ nickname, email, password })
      → 성공: 자동 로그인 + router.push('/')
      → 실패: toast(error)

  이미 로그인 상태면 홈으로 리다이렉트
```

### 6. my/page.tsx 변경

```
현재:
  CURRENT_USER_ID로 mockUsers에서 직접 찾기
  로그아웃 버튼 → toast만

변경:
  AuthGuard로 감싸기
  useAuth().user로 현재 유저 데이터
  로그아웃 버튼 → auth.logout() 호출
```

---

## Implementation Order

```
1. src/lib/constants.ts          ← STORAGE_KEYS 추가 (1분)
2. src/lib/auth.ts               ← Mock 인증 함수 (핵심)
3. src/contexts/AuthContext.tsx   ← Provider + Hook
4. src/components/auth/AuthGuard.tsx ← 보호 라우트
5. src/app/layout.tsx            ← AuthProvider 감싸기
6. src/app/auth/page.tsx         ← 실제 인증 연결
7. src/app/my/page.tsx           ← useAuth + 로그아웃
8. src/app/write/page.tsx        ← useAuth + AuthGuard
9. src/app/chat/[id]/page.tsx    ← useAuth
10. src/components/post/PostStatusControl.tsx  ← useAuth
11. src/components/post/PostBottomAction.tsx   ← useAuth
12. src/components/user/UserChatButton.tsx     ← useAuth
13. src/components/layout/Header.tsx           ← 로그인/비로그인 UI
14. 빌드 검증: npm run build
```

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| localStorage에 없는 userId 저장됨 | user = null 처리 (자동 로그아웃) |
| 기존 Mock 유저(u1~u11) 로그인 | 이메일 + '1234'로 로그인 가능 |
| 이메일 중복 가입 | error: '이미 가입된 이메일입니다' |
| 닉네임 중복 가입 | error: '이미 사용 중인 닉네임입니다' |
| 비로그인 상태에서 /write 접근 | /auth로 리다이렉트 |
| 비로그인 상태에서 /my 접근 | /auth로 리다이렉트 |
| 비로그인 상태에서 게시글 보기 | 정상 (읽기 전용, 채팅 버튼 숨김) |
| 로그인 상태에서 /auth 접근 | 홈으로 리다이렉트 |
| 새로 가입한 유저로 글쓰기 | authorId에 새 유저 ID 사용 |

---

## Completion Checklist

- [ ] AuthContext + useAuth 동작
- [ ] 회원가입 → 자동 로그인 → 홈
- [ ] 기존 Mock 유저(u1~u11) 로그인 가능
- [ ] 로그아웃 → /auth로 이동
- [ ] /write, /my 비로그인 시 리다이렉트
- [ ] Header 로그인/비로그인 분기
- [ ] CURRENT_USER_ID 완전 제거
- [ ] npm run build 성공
- [ ] 기존 기능 정상 동작

---

## Notes

- 비밀번호는 평문 비교 (Mock 전용, Phase B에서 Supabase가 해싱 처리)
- 소셜 로그인 버튼은 UI만 유지 (클릭 시 '준비 중입니다' toast)
- Server Component에서는 useAuth() 사용 불가 → 필요 시 Client Component로 전환 또는 prop 전달
- `CURRENT_USER_ID` export는 최종적으로 삭제하되, chats.ts의 mockChatRooms 데이터에서 참조하는 'u1' 문자열은 유지
