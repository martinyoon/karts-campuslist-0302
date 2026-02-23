# mock-auth Analysis Report

> **Analysis Type**: Gap Analysis (Check Phase -- Re-check v2.0)
>
> **Project**: campulist
> **Version**: Phase A
> **Analyst**: Claude (gap-detector)
> **Date**: 2026-02-21
> **Design Doc**: [mock-auth.design.md](../02-design/features/mock-auth.design.md)
> **Plan Doc**: [mock-auth.plan.md](../01-plan/features/mock-auth.plan.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Re-check the mock-auth implementation after Act iteration that resolved all gaps identified in v1.0 analysis. Verify that G-01 (Critical), G-02 (Low), G-05 (Low), and G-06 (Medium) have been fully fixed.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/mock-auth.design.md`
- **Plan Document**: `docs/01-plan/features/mock-auth.plan.md`
- **New Files**: `src/lib/auth.ts`, `src/contexts/AuthContext.tsx`, `src/components/auth/AuthGuard.tsx`
- **Modified Files**: `src/lib/constants.ts`, `src/app/layout.tsx`, `src/app/auth/page.tsx`, `src/app/my/page.tsx`, `src/app/write/page.tsx`, `src/app/chat/page.tsx`, `src/app/chat/[id]/page.tsx`, `src/components/post/PostStatusControl.tsx`, `src/components/post/PostBottomAction.tsx`, `src/components/user/UserChatButton.tsx`, `src/components/layout/Header.tsx`, `src/data/chats.ts`, `src/lib/api.ts`
- **Analysis Date**: 2026-02-21

---

## 2. Overall Scores

| Category | Score | v1.0 Score | Delta | Status |
|----------|:-----:|:----------:|:-----:|:------:|
| Feature Match | 100% | 95% | +5% | [PASS] |
| Data Model Match | 97% | 97% | 0% | [PASS] |
| UI/Screen Match | 100% | 100% | 0% | [PASS] |
| Architecture Compliance | 100% | 93% | +7% | [PASS] |
| Convention Compliance | 100% | 97% | +3% | [PASS] |
| **Overall** | **99%** | **96%** | **+3%** | **[PASS]** |

---

## 3. Previously Identified Gaps -- Resolution Status

### 3.1 G-01 [Critical] -- createPost authorId hardcoding

**v1.0 Status**: `api.ts` createPost hardcoded `authorId: 'u1'` instead of accepting it as a parameter.

**v2.0 Verification**:

`campulist/src/lib/api.ts` lines 247-258 -- createPost signature now includes `authorId: string`:

```typescript
export function createPost(input: {
  title: string;
  body: string;
  authorId: string;   // <-- Now accepts authorId
  universityId: number;
  categoryMajorId: number;
  categoryMinorId: number;
  price: number | null;
  priceNegotiable: boolean;
  locationDetail: string | null;
  tags: string[];
}): Post {
```

`campulist/src/lib/api.ts` line 264 -- Uses `input.authorId` instead of hardcoded `'u1'`:

```typescript
  const post: Post = {
    id: `local-${Date.now()}`,
    title: input.title,
    body: input.body,
    authorId: input.authorId,  // <-- Uses parameter
```

`campulist/src/app/write/page.tsx` line 219 -- Passes `user!.id`:

```typescript
  const post = createPost({ ...postData, authorId: user!.id, tags });
```

**Result**: RESOLVED

---

### 3.2 G-02 [Low] -- CURRENT_USER_ID export in data/chats.ts

**v1.0 Status**: `export const CURRENT_USER_ID = 'u1'` still existed in `data/chats.ts` line 4, though unused.

**v2.0 Verification**:

Grep for `CURRENT_USER_ID` across `campulist/src/` returns **0 matches**.

`campulist/src/data/chats.ts` now starts at line 1 with:

```typescript
import type { ChatRoom, ChatMessage } from '@/lib/types';

export const mockChatRooms: ChatRoom[] = [
```

The `CURRENT_USER_ID` export has been completely removed. Mock chat message data retains `'u1'` as inline string values for `senderId`, which is correct per design note: "chats.ts의 mockChatRooms 데이터에서 참조하는 'u1' 문자열은 유지".

**Result**: RESOLVED

---

### 3.3 G-05 [Low] -- Hardcoded 'campulist_chat_overrides' string in api.ts

**v1.0 Status**: `api.ts` lines 326, 333 used raw string `'campulist_chat_overrides'` instead of `STORAGE_KEYS.CHAT_OVERRIDES`.

**v2.0 Verification**:

`campulist/src/lib/constants.ts` line 20:
```typescript
  CHAT_OVERRIDES: 'campulist_chat_overrides',
```

`campulist/src/lib/api.ts` line 327:
```typescript
  const saved = localStorage.getItem(STORAGE_KEYS.CHAT_OVERRIDES);
```

`campulist/src/lib/api.ts` line 334:
```typescript
  localStorage.setItem(STORAGE_KEYS.CHAT_OVERRIDES, JSON.stringify(overrides));
```

Grep for raw `'campulist_chat_overrides'` only appears in `constants.ts` as the central definition. All usage sites reference `STORAGE_KEYS.CHAT_OVERRIDES`.

**Result**: RESOLVED

---

### 3.4 G-06 [Medium] -- /chat list page missing AuthGuard

**v1.0 Status**: `chat/page.tsx` had no AuthGuard wrapping, allowing unauthenticated users to access the chat list.

**v2.0 Verification**:

`campulist/src/app/chat/page.tsx` lines 93-98:

```typescript
export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatPageContent />
    </AuthGuard>
  );
}
```

The import is present at line 9:
```typescript
import AuthGuard from '@/components/auth/AuthGuard';
```

**Result**: RESOLVED

---

## 4. Full Design-Implementation Comparison

### 4.1 Files Created (Design: 3 files)

| Design Spec | Implementation File | Status | Notes |
|-------------|---------------------|:------:|-------|
| `src/lib/auth.ts` | `campulist/src/lib/auth.ts` (172 lines) | Match | All 5 functions present |
| `src/contexts/AuthContext.tsx` | `campulist/src/contexts/AuthContext.tsx` (71 lines) | Match | Provider + Hook |
| `src/components/auth/AuthGuard.tsx` | `campulist/src/components/auth/AuthGuard.tsx` (33 lines) | Match | Redirect + spinner |

### 4.2 Files Modified (Design: 10 files)

| Design Spec | Implementation File | Status | Notes |
|-------------|---------------------|:------:|-------|
| `src/lib/constants.ts` - STORAGE_KEYS | L18-19: CURRENT_USER, REGISTERED_USERS | Match | Both keys added |
| `src/app/layout.tsx` - AuthProvider | L30: `<AuthProvider>` wrapping | Match | Inside ThemeProvider |
| `src/app/auth/page.tsx` - login/signup | 153 lines, full form + redirect | Match | Both modes work |
| `src/app/my/page.tsx` - useAuth + AuthGuard | AuthGuard wrapper + logout button | Match | `onClick={logout}` |
| `src/app/write/page.tsx` - useAuth + AuthGuard | AuthGuard wrapper + `user!.id` passed | Match | G-01 fixed |
| `src/app/chat/page.tsx` - AuthGuard | AuthGuard wrapper | Match | G-06 fixed (beyond design scope) |
| `src/app/chat/[id]/page.tsx` - useAuth | `user?.id ?? ''` for currentUserId | Match | |
| `PostStatusControl.tsx` - useAuth | `useAuth()` for ownership check | Match | |
| `PostBottomAction.tsx` - useAuth | `useAuth()` for ownership check | Match | |
| `UserChatButton.tsx` - useAuth | `useAuth()` for identity | Match | |
| `Header.tsx` - login/logout UI | L86-113: conditional rendering | Match | |

### 4.3 auth.ts Functions

| Design Function | Implementation | Status |
|-----------------|----------------|:------:|
| `mockLogin(email, password)` | L88-116: searches mockUsers + localStorage, returns AuthResult | Match |
| `mockSignup(data)` | L120-165: email + nickname duplicate check, creates user | Match |
| `mockLogout()` | L169-171: removes CURRENT_USER from localStorage | Match |
| `getCurrentUserId()` | L81-84: reads from localStorage | Match |
| `getFullUser(userId)` | L52-77: searches mockUsers then localStorage, returns User | Match |

### 4.4 AuthContextType Interface

| Design Field | Implementation | Status |
|--------------|----------------|:------:|
| `user: User \| null` | AuthContext.tsx L9 | Match |
| `isLoading: boolean` | AuthContext.tsx L10 | Match |
| `login: (email, password) => { success, error? }` | AuthContext.tsx L11 | Match |
| `signup: (data: SignupData) => { success, error? }` | AuthContext.tsx L12 | Match |
| `logout: () => void` | AuthContext.tsx L13 | Match |

### 4.5 AuthGuard Behavior

| Design Spec | Implementation | Status |
|-------------|----------------|:------:|
| `isLoading` -> spinner | L21-27: spin animation div | Match |
| `user === null` -> `router.push('/auth')` | L16-18: useEffect redirect | Match |
| `user` exists -> render children | L31: `<>{children}</>` | Match |

### 4.6 Header UI Branching

| Design Spec | Implementation | Status |
|-------------|----------------|:------:|
| Logged in: [write] [notifications] [my] | L87-106: all three rendered | Match |
| Not logged in: [login] | L108-112: single login button | Match |

### 4.7 auth/page.tsx Behavior

| Design Spec | Implementation | Status |
|-------------|----------------|:------:|
| Login success -> toast + push('/') | L37-39 | Match |
| Login fail -> toast error message | L40-41 | Match |
| Signup success -> auto-login + push('/') | L44-47 | Match |
| Signup fail -> toast error | L48-49 | Match |
| Already logged in -> redirect home | L26-30 | Match |
| Social login -> '준비 중입니다' toast | L139-148 | Match |

### 4.8 my/page.tsx Behavior

| Design Spec | Implementation | Status |
|-------------|----------------|:------:|
| AuthGuard wrapping | L284-289 | Match |
| `useAuth().user` for data | L30 | Match |
| Logout button -> `logout()` | L275: `onClick={logout}` | Match |

---

## 5. Edge Case Verification

| Edge Case (from Design) | Implementation | Status |
|--------------------------|----------------|:------:|
| Invalid userId in localStorage -> user = null | AuthContext.tsx L27-28: `setUser(found)` where found is null | Match |
| Mock users (u1-u11) login with '1234' | auth.ts L96-103: checks `MOCK_PASSWORD = '1234'` | Match |
| Duplicate email signup -> error | auth.ts L131-137: checks mockUsers + registered | Match |
| Duplicate nickname signup -> error | auth.ts L140-145: checks mockUsers + registered | Match |
| Unauthenticated /write -> /auth | write/page.tsx L440-446: AuthGuard wrapper | Match |
| Unauthenticated /my -> /auth | my/page.tsx L284-289: AuthGuard wrapper | Match |
| Unauthenticated /chat -> /auth | chat/page.tsx L93-98: AuthGuard wrapper | Match |
| Unauthenticated post view -> read-only | UserChatButton L18: returns null if no currentUser | Match |
| Already logged in at /auth -> redirect home | auth/page.tsx L26-30 | Match |
| New user writes post -> uses new user ID | write/page.tsx L219: `authorId: user!.id` | Match |

---

## 6. CURRENT_USER_ID Removal -- Complete

| Verification | Result |
|-------------|--------|
| `grep -r "CURRENT_USER_ID" campulist/src/` | **0 matches** |
| `grep -r "import.*CURRENT_USER_ID" campulist/src/` | **0 matches** |
| `data/chats.ts` export removed | Confirmed (line 1 is now `import type`) |
| Mock data `'u1'` strings in chat messages | Retained as data content (per design: "문자열은 유지") |

---

## 7. Supabase Migration Compatibility

| Interface | Phase A (Current) | Phase B (Supabase) | Compatible |
|-----------|-------------------|---------------------|:----------:|
| `useAuth().user` | localStorage -> getFullUser | `supabase.auth.getUser()` | Yes |
| `useAuth().login()` | mockLogin() -> localStorage | `supabase.auth.signInWithPassword()` | Yes |
| `useAuth().signup()` | mockSignup() -> localStorage | `supabase.auth.signUp()` | Yes |
| `useAuth().logout()` | mockLogout() -> localStorage | `supabase.auth.signOut()` | Yes |
| `useAuth().isLoading` | useState(true) -> useEffect | `supabase.auth.onAuthStateChange` | Yes |
| `AuthGuard` | checks `useAuth().user` | Same pattern | Yes |

The `useAuth()` interface is clean for Supabase migration. Only `AuthContext.tsx` internals need to change; all consuming components remain untouched.

---

## 8. Architecture Compliance (Starter Level)

### 8.1 Layer Structure

| Layer | Files | Status |
|-------|-------|:------:|
| Presentation (components, app) | AuthGuard.tsx, Header.tsx, all pages | Correct |
| Context | AuthContext.tsx | Correct |
| Lib/Infrastructure | auth.ts, constants.ts, api.ts | Correct |
| Data | chats.ts, users.ts | Correct |

### 8.2 Dependency Direction

| File | Layer | Imports From | Status |
|------|-------|-------------|:------:|
| AuthContext.tsx | Context | lib/auth, lib/types | Correct |
| AuthGuard.tsx | Presentation | contexts/AuthContext | Correct |
| auth.ts | Lib | lib/constants, data/users, lib/types | Correct |
| auth/page.tsx | Presentation | contexts/AuthContext, components/ui | Correct |
| Header.tsx | Presentation | contexts/AuthContext | Correct |
| write/page.tsx | Presentation | contexts/AuthContext, lib/api | Correct |

No dependency violations found.

Architecture Score: **100%** (up from 93% in v1.0)

---

## 9. Convention Compliance

### 9.1 Naming Convention

| Category | Convention | Compliance | Violations |
|----------|-----------|:----------:|------------|
| Components | PascalCase | 100% | None |
| Functions | camelCase | 100% | None |
| Constants | UPPER_SNAKE_CASE | 100% | None |
| Files (component) | PascalCase.tsx | 100% | None |
| Files (utility) | camelCase.ts | 100% | None |
| Interfaces | PascalCase | 100% | None |

### 9.2 Import Order

All 14 files follow the convention:
1. External libraries (react, next)
2. Internal absolute imports (@/...)
3. Type imports (import type)

No violations found.

### 9.3 Storage Key Convention

All localStorage access uses `STORAGE_KEYS.*` constants. No hardcoded storage key strings exist outside of `constants.ts`.

Convention Score: **100%** (up from 97% in v1.0)

---

## 10. Implementation Enhancements (Design X, Implementation O)

These are positive additions not specified in the design but improving quality:

| ID | Item | Location | Description |
|----|------|----------|-------------|
| E-01 | Empty input validation | auth.ts L91-93 | Validates empty email/password before search |
| E-02 | Email case-insensitive comparison | auth.ts L89, L96, L106 | `toLowerCase()` on all email comparisons |
| E-03 | Input trimming | auth.ts L122-123 | Trims whitespace on signup data |
| E-04 | `.ac.kr` email auto-verification | auth.ts L68-69 | Users with `.ac.kr` emails get `isVerified: true` |
| E-05 | Social login "coming soon" toast | auth/page.tsx L139-148 | Social buttons show toast (matches design note) |
| E-06 | Login test hint | auth/page.tsx L122-126 | Shows "test account password: 1234" hint |
| E-07 | Password minimum length check | auth.ts L128 | Requires 4+ characters |

---

## 11. Minor Design Differences (Acceptable)

| Item | Design | Implementation | Impact |
|------|--------|----------------|--------|
| RegisteredUser.department | Not in interface | `department: string \| null` added | None (forward-compatible) |
| Password length validation | Not specified | `password.length < 4` check | Positive (better UX) |

---

## 12. Design Completion Checklist

| Checklist Item (from Design doc) | Status | Evidence |
|----------------------------------|:------:|----------|
| AuthContext + useAuth working | Done | AuthContext.tsx L64-70, all consumers verified |
| Signup -> auto login -> home | Done | auth/page.tsx L43-51 |
| Mock users (u1-u11) can log in | Done | auth.ts L96-103, MOCK_PASSWORD = '1234' |
| Logout -> /auth redirect | Done | AuthContext.tsx L51-55 |
| /write, /my redirect when not logged in | Done | Both use AuthGuard wrapper |
| Header login/logout branching | Done | Header.tsx L86-113 |
| CURRENT_USER_ID fully removed | Done | 0 grep matches in src/ |
| npm run build succeeds | Not verified | Requires build execution |
| Existing features working | Not verified | Requires manual testing |

---

## 13. Match Rate Summary

```
Overall Match Rate: 99%

  Feature Match:         100%  (20/20 requirements met, all gaps resolved)
  Data Model Match:       97%  (RegisteredUser has 1 extra field -- acceptable)
  UI/Screen Match:       100%  (Header branching, AuthGuard spinner, auth page)
  Architecture:          100%  (Starter level, correct layering, no violations)
  Convention:            100%  (All naming/import/storage conventions followed)

  Previously identified gaps: 4 (all resolved)
    G-01 [Critical] createPost authorId -- RESOLVED
    G-02 [Low]      CURRENT_USER_ID export -- RESOLVED
    G-05 [Low]      Hardcoded storage key -- RESOLVED
    G-06 [Medium]   /chat AuthGuard -- RESOLVED

  New gaps: 0
  Enhancements: 7 items (all positive additions)
```

---

## 14. Conclusion

The mock-auth feature implementation is **99% aligned** with the design document, exceeding the 90% threshold. All 4 previously identified gaps have been fully resolved:

- **G-01 (Critical)**: `createPost()` now accepts `authorId` as a parameter. `write/page.tsx` passes `user!.id`. Posts created by newly registered users are correctly attributed.
- **G-02 (Low)**: `CURRENT_USER_ID` export fully removed from `data/chats.ts`. Zero references remain in the codebase.
- **G-05 (Low)**: `campulist_chat_overrides` hardcoded string replaced with `STORAGE_KEYS.CHAT_OVERRIDES`. All storage key access is centralized through constants.
- **G-06 (Medium)**: `/chat` list page now wrapped with `AuthGuard`. Unauthenticated users are redirected to `/auth`.

The 1% gap comes from the `RegisteredUser` interface having an extra `department` field not in the design specification, which is an acceptable forward-compatible enhancement.

The feature is ready for the **Report phase** (`/pdca report mock-auth`).

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-21 | Initial gap analysis -- 4 gaps found (96%) | Claude (gap-detector) |
| 2.0 | 2026-02-21 | Re-check after Act -- all gaps resolved (99%) | Claude (gap-detector) |
