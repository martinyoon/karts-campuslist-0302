# Full Code Quality Analysis Report

## Analysis Target
- **Path**: `campulist/src/` (app, components, lib, data, contexts)
- **File count**: 85 TypeScript/TSX files
- **Analysis date**: 2026-02-26
- **Analyzer**: bkit-code-analyzer

---

## Quality Score: 76 / 100

| Area | Score | Max |
|------|-------|-----|
| Bug Safety | 17 | 25 |
| Security | 16 | 20 |
| Code Quality | 20 | 25 |
| Performance | 12 | 15 |
| Cross-file Consistency | 11 | 15 |

---

## Issues Found

### CRITICAL -- Immediate Fix Required

| # | File | Line | Issue | Recommended Action |
|---|------|------|-------|-------------------|
| C1 | `src/app/suggest/page.tsx` | 52-71 | **submitting state never resets.** `setSubmitting(true)` is called but never set back to `false`. If localStorage write fails or user navigates back, the submit button stays permanently disabled. This also means `router.push('/my')` runs before the user sees feedback if the navigation is slow. | Add `setSubmitting(false)` in a `finally` block, or at minimum after `router.push`. |
| C2 | `src/app/suggest/page.tsx` | 66 | **No try/catch around localStorage parse.** `JSON.parse(localStorage.getItem(STORAGE_KEYS.SUGGESTIONS) || '[]')` will throw a runtime error if the stored value is corrupted (e.g., invalid JSON). Every other localStorage read in the codebase uses try/catch, but this one does not. | Wrap in try/catch like every other localStorage read in the project. |
| C3 | `src/data/posts.ts` | 144 | **Hardcoded localStorage key `'campulist_post_images'`** instead of using `STORAGE_KEYS.POST_IMAGES`. If the constant value ever changes, this function will read from the wrong key, causing images to silently disappear for user-created posts. | Replace `'campulist_post_images'` with `STORAGE_KEYS.POST_IMAGES` (import from `@/lib/constants`). |
| C4 | `src/data/posts.ts` | 154 | **Hardcoded localStorage key `'campulist_post_tags'`** instead of using `STORAGE_KEYS.POST_TAGS`. Same issue as C3. | Replace `'campulist_post_tags'` with `STORAGE_KEYS.POST_TAGS`. |
| C5 | `src/data/users.ts` | 56 | **Hardcoded localStorage key `'campulist_registered_users'`** instead of using `STORAGE_KEYS.REGISTERED_USERS`. If constant changes, `getUserSummary()` will fail to find registered users, showing "Unknown User" for all locally-registered accounts. | Replace with `STORAGE_KEYS.REGISTERED_USERS`. |
| C6 | `src/lib/camtalk.ts` | 36-37 | **localStorage keys `ct_rooms` and `ct_msgs` are not in `STORAGE_KEYS`**, so `mockDeleteAccount()` which iterates `Object.values(STORAGE_KEYS)` to clean up user data will never delete chat rooms or messages. After account deletion, orphaned chat data remains. | Add `CAMTALK_ROOMS` and `CAMTALK_MESSAGES` to `STORAGE_KEYS` and use them here. Also add `cn_notifs` (from `camnotif.ts` line 23). |
| C7 | `src/app/camnotif/page.tsx` | 38-43 | **Notification list does not update after `markRead`.** `handleRead()` calls `markRead(id)` and updates `unreadCount`, but never re-fetches the `notifs` array. The notification item remains visually styled as unread (`!notif.isRead`) even after clicking on it until the page is refreshed. | Add `setNotifs(getMyNotifs(userId))` after `markRead(id)`. |
| C8 | `src/components/post/PostStatusControl.tsx` | 18 | **`initialStatus` prop is accepted but never used.** The component destructs it from props but does nothing with it. The "Edit" button uses `variant="destructive"` (red styling) which is confusing for an edit action. | Either use `initialStatus` to show the current status, or remove the unused prop. Fix the button variant for the edit action. |

---

### WARNING -- Potential Bug or Bad Practice

| # | File | Line | Issue | Recommended Action |
|---|------|------|-------|-------------------|
| W1 | `src/app/suggest/page.tsx` | 58 | **Unsafe type assertion** `category as Suggestion['category']`. If the Select component returns a value not in the union type, this silently passes validation. | Validate the category value against the CATEGORIES array before casting. |
| W2 | `src/components/search/PriceFilter.tsx` | 19-20 | **State not synced with props.** `useState(currentMin?.toString())` captures the initial value only. If the URL changes (e.g., user presses back), the input fields won't update. This is a common React anti-pattern with `useState` initialized from props. | Either use a `key` prop to force re-mount when price params change, or use `useEffect` to sync state when props change. |
| W3 | `src/components/search/PriceFilter.tsx` | 29 | **No validation for negative numbers.** Users can type negative prices. The `<Input type="number">` allows negative values. The backend `api.ts` filters by `p.price >= min` which would work correctly but the UX is confusing. | Add `min="0"` to the number inputs, or validate before applying. |
| W4 | `src/components/search/SearchFilters.tsx` | 30 | **`priceMin` of `0` is treated as falsy.** `if (priceMin !== undefined) p.set(...)` is correct here, but the `buildHref` is called from SearchFilters where `priceMin` could be `0` (free items). The number `0` does pass the `!== undefined` check, so this is OK, but the naming pattern `priceMin?: number` with `0` being a valid filter value should be documented. | Add a comment clarifying that `0` is a valid filter value (for free items). |
| W5 | `src/app/search/page.tsx` | 28-29 | **`Number(pMin)` where `pMin` is a string can produce `NaN`.** If a user manipulates the URL with `?priceMin=abc`, `Number('abc')` returns `NaN`, which then gets passed to the API filter. The filter `p.price >= NaN` always returns `false`, silently filtering out all posts. | Add `isNaN` guard: `const priceMin = pMin && !isNaN(Number(pMin)) ? Number(pMin) : undefined`. |
| W6 | `src/app/search/page.tsx` | 73-78 | **SortBadgeRow's buildHref drops uni/cat filters when sort changes.** The inline `buildHref` function for SortBadgeRow creates `new URLSearchParams({ q: query, sort: s })` then conditionally adds uni/cat/price. However, if the user has active university and category filters through SearchFilters, and then changes the sort order, the filters are correctly preserved. This is fine but could be simplified by extracting a shared URL builder function. | Extract a shared `buildSearchUrl()` utility to avoid duplicating URL construction logic across SearchFilters, PriceFilter, and the search page. |
| W7 | `src/lib/auth.ts` | 12 | **Hardcoded mock password `'1234'`.** While this is intentionally mock data, the password is stored in plain text in `RegisteredUser.password` field in localStorage. If someone inspects localStorage, they see all registered users' passwords in cleartext. | Add a comment noting this is Phase A only, and consider at minimum base64 encoding for the mock phase. |
| W8 | `src/lib/auth.ts` | 122 | **Plain-text password comparison** `password === registered.password`. Same concern as W7 but for the comparison side. | Acceptable for Phase A mock, but flag for Phase B Supabase migration. |
| W9 | `src/lib/api.ts` | 49 | **`getPosts` filters only `active` status posts.** This means if the search page or category page returns results, reserved/completed posts from the user's own localStorage posts are never shown in feeds. Only the My page (which uses `getMyPosts`) shows non-active posts. | This may be intentional, but document the filtering behavior. Consider adding a `status` filter parameter to `getPosts`. |
| W10 | `src/app/write/page.tsx` | 321 | **Large useEffect with `[user]` dependency** re-runs the entire initialization logic whenever the `user` object changes (e.g., profile update). The `initialized.current` flag prevents double init, but `isEditRef` and URL params are re-parsed unnecessarily. | Split the init effect into separate concerns: edit mode detection, URL params, and draft loading. |
| W11 | `src/app/write/page.tsx` | 72 | **WritePageContent is 1440+ lines.** This is extremely long for a single component. It contains form state, validation, multiple Sheet dialogs, image compression, example filling logic, draft auto-save, and URL parameter parsing all in one function. | Extract into smaller components: `WriteForm`, `ExampleFiller`, `PreviewSheet`, `ContactSheet`, `OtherPostsSheet`. |
| W12 | `src/app/my/page.tsx` | 33-50 | **MyPageContent has 17 useState calls.** This is a code smell indicating the component is doing too much. | Consider using `useReducer` or splitting into sub-components with their own state. |
| W13 | `src/components/post/PostCard.tsx` | 16 | **`useRouter` imported but only used for edit redirect.** The PostCard component uses `useRouter` which forces it to be a client component. Since PostCard is used in server-rendered lists, this forces client-side hydration for every post card in the feed. | Consider making PostCard a server component and extracting the edit button into a separate client component. |
| W14 | `src/app/camtalk/[id]/page.tsx` | 101-108 | **`getRoom()` is called directly in the render body** (not inside useEffect or useMemo). This means every re-render reads and parses the entire rooms array from localStorage. | Memoize or move to state that updates on `camtalkUpdate` events. |
| W15 | `src/app/camtalk/page.tsx` | 54 | **`getMessages(room.id)` called for every room on every render** to extract the first message's post title. This reads all messages from localStorage for each room in the list. | Pre-compute post titles when room data is loaded, not during render. |
| W16 | `src/lib/api.ts` | 39-46 | **`getAllPosts()` is called on every API function invocation**, parsing localStorage twice (user posts + overrides). No caching layer exists. In a page with search + filters + related posts, this can result in 4-6 full parses per page load. | Add a simple in-memory cache with a TTL or invalidation on `storage` events. |
| W17 | `src/components/layout/Header.tsx` | 19 | **`useSearchParams()` inside Header** causes the component to re-render on every URL change. Since Header is rendered on every page via layout.tsx, this is a performance concern. The `Suspense` wrapper in layout.tsx mitigates the initial SSR issue but not the re-render cost. | This is acceptable given the Suspense boundary, but worth noting. |

---

### INFO -- Improvement Suggestions

| # | File | Line | Issue | Suggested Improvement |
|---|------|------|-------|----------------------|
| I1 | `src/lib/constants.ts` | 40-48 | **`MEMBER_TYPE_LABELS` uses `import()` in Record type.** While this works, a direct import of `MemberType` at the top of the file would be cleaner. | Move the import to the top: `import type { MemberType } from './types'`. |
| I2 | `src/app/suggest/page.tsx` | 62 | **`user.nickname` accessed without `User` type import.** The component relies on the shape from `useAuth()` which returns `User | null`. The `user.nickname` property is correct, but the Suggestion interface duplicates the `userName` concept. | Consider using `userId` only and resolving the name at display time, consistent with other data models. |
| I3 | `src/components/search/SearchFilters.tsx` | 1 | **`'use client'` directive may be unnecessary.** This component uses no hooks or event handlers -- it only renders Links and Badges. It could potentially be a server component. | Remove `'use client'` and test if it works as a server component. |
| I4 | `src/data/categories.ts` | 33 | **Category id 53 ('lesson') has parentId 3 but id 53 is in the 50s range** (services range). This inconsistency in ID numbering could cause confusion when debugging. | Document the ID numbering convention, or renumber to be consistent (e.g., use 38 for lesson under jobs). |
| I5 | `src/app/post/[id]/page.tsx` | 14 | **`generateMetadata` calls `getPostDetail` which internally calls `getLikedPostIds()`.** On the server side, `getLikedPostIds()` returns `[]` (SSR guard), so `isLiked` is always `false` in metadata generation. This is wasted computation. | Consider a lighter `getPostMetadata()` function that skips like status for metadata generation. |
| I6 | `src/components/post/PostFeedWithLocal.tsx` | 28 | **Initial state is `serverPosts`** but `useEffect` immediately overwrites it. On first render, the server posts flash before local posts are merged. | Consider using `useMemo` for the initial merge computation to avoid the flash. |
| I7 | Multiple files | -- | **Inconsistent error boundary patterns.** Some pages use `notFound()`, some use state-based error display, some return null. There is no consistent error handling pattern for data loading failures. | Establish a project-wide convention: use Next.js `notFound()` for 404s, `error.tsx` for unexpected errors, and loading states for async operations. |
| I8 | `src/components/layout/BottomNav.tsx` | 38-39 | **Home route matching logic** `pathname === '/' || universities.some(u => pathname === \`/\${u.slug}\`)` iterates all universities on every render. | Use a `Set` for O(1) lookup: `universityPaths.has(pathname)`. |
| I9 | `src/lib/format.ts` | 7-21 | **`formatRelativeTime` creates `new Date()` on every call.** When rendering a list of 30+ posts, this creates 30+ Date objects. | Minor, but could accept a `now` parameter for batch formatting. |
| I10 | `src/app/auth/page.tsx` | 17-22 | **Local `CAMPUS_MEMBER_TYPES` duplicates `types.ts` export.** `src/lib/types.ts` already exports `CAMPUS_MEMBER_TYPES` as `MemberType[]`. The auth page defines its own version with labels. | Rename to `CAMPUS_MEMBER_TYPE_OPTIONS` to distinguish from the types.ts export. |
| I11 | `src/app/user/[id]/page.tsx` | 36 | **`getUserPosts(id).then(setPosts)` -- unhandled promise rejection.** If `getUserPosts` throws, the error is silently swallowed. | Add `.catch()` handler or use async/await with try/catch. |
| I12 | `src/app/camtalk/[id]/page.tsx` | 232-236 | **`savedBank` useMemo depends on `bankOpen`**, which is a UI state toggle. This means the bank info is re-read from localStorage every time the sheet opens/closes, which is the correct behavior but the dependency is non-obvious. | Add a comment explaining why `bankOpen` is in the dependency array. |
| I13 | `src/app/write/page.tsx` | 156-177 | **`compressImage` creates and revokes object URLs** correctly, but `canvas.getContext('2d')!` uses non-null assertion. If canvas context is unavailable (rare), this will throw. | Add a null check for the 2d context. |

---

## Duplicate Code Analysis

### Duplicates Found

| Type | Location 1 | Location 2 | Similarity | Recommended Action |
|------|------------|------------|------------|-------------------|
| Exact | `src/lib/api.ts:350-354` (`getLikedPostIds`) | `src/app/my/page.tsx:25-31` (`getLikedPostIds`) | 100% | Remove the duplicate in `my/page.tsx` and import from `@/lib/api`. |
| Structural | `src/app/my/page.tsx:196-234` (post list rendering) | `src/app/my/page.tsx:243-264` (liked posts rendering) | ~85% | Extract a shared `PostListItem` rendering component. The same card layout with thumbnail + title + price + metadata is repeated 3 times (selling, likes, recent). |
| Structural | `src/components/post/PostBottomAction.tsx:43-49` | `src/components/user/UserChatButton.tsx:19-25` | ~80% | Both components have identical `findRoomByUser` + `camtalkUpdate` event listener patterns. Extract a `useExistingRoom(partnerId)` custom hook. |
| Structural | `src/components/search/PriceFilter.tsx:23-31` | `src/components/search/SearchFilters.tsx:17-33` | ~70% | Both build search URL params in the same pattern. Extract a shared `buildSearchHref()` utility. |
| Structural | `src/components/layout/Header.tsx:34-39` | `src/components/layout/BottomNav.tsx:26-31` | ~75% | Both listen for `camtalkUpdate` events and call `getMyUnreadTotal`. Extract a `useChatUnreadCount()` hook. |

### Reuse Opportunities

| Function/Component | Current Location | Suggestion | Reason |
|-------------------|-----------------|------------|--------|
| `getLikedPostIds()` | `api.ts` + `my/page.tsx` | Use only `api.ts` export | Exact duplicate |
| camtalkUpdate listener | Header, BottomNav, PostBottomAction, UserChatButton | `useCamTalkUpdates()` hook | Same pattern in 4 places |
| Search URL builder | SearchFilters, PriceFilter, search/page.tsx | `buildSearchUrl()` in `lib/` | 3 places build search params identically |
| Post list item card | my/page.tsx (3 tab variants) | `<CompactPostCard>` component | 3 near-identical card layouts |

---

## Security Analysis

### OWASP Considerations

| Check | Status | Notes |
|-------|--------|-------|
| XSS | PASS | React's JSX auto-escaping handles output encoding. No `dangerouslySetInnerHTML` usage found. User input (titles, bodies, tags) is rendered via JSX. |
| Injection | N/A | No server-side database queries in Phase A (localStorage only). |
| Authentication bypass | WARNING | Mock auth stores `CURRENT_USER` ID in localStorage. Any user can impersonate another by editing localStorage directly. Acceptable for Phase A. |
| Sensitive data in localStorage | WARNING | Passwords stored in plaintext in `campulist_registered_users`. Bank account info stored in `ct_bank_info_{userId}`. Both are accessible via browser DevTools. |
| CSRF | N/A | No server API endpoints yet. All operations are client-side localStorage. |
| Input validation | PARTIAL | Suggest page validates length. Write page validates required fields. Auth page validates email/password length. But no sanitization of HTML entities or script injection in stored content (mitigated by React rendering). |

### Environment Variable Check

| Check | Status | Notes |
|-------|--------|-------|
| NEXT_PUBLIC_* exposure | N/A | No environment variables used in the project. All data is mock/hardcoded. |
| .env.example | MISSING | No `.env.example` template exists. Should be created before Phase B (Supabase). |
| Secrets in code | WARNING | `MOCK_PASSWORD = '1234'` in `auth.ts:12`. Acceptable for mock phase. |

---

## Performance Analysis

| Check | Status | Details |
|-------|--------|---------|
| N+1 queries | WARNING | `getAllPosts()` is called multiple times per page (search page: once for `getPosts`, once for `getFilteredLocalPosts`). Each call parses localStorage twice. |
| Unnecessary re-renders | WARNING | `PostCard` uses `useAuth()` and `useRouter()` forcing client-side rendering for every card. `CamTalkDetailContent` calls `getRoom()` in render body. |
| Memory leaks | PASS | All `useEffect` cleanups properly remove event listeners and clear timeouts. |
| Heavy computation caching | WARNING | `getAllPosts()` has no caching. `formatRelativeTime()` creates `new Date()` per call. `completionScore` in write page is properly memoized. |
| Async handling | PASS | Async operations properly use `await` and Promise.all for parallel fetches. |
| Large localStorage reads | WARNING | `getMessages()` in CamTalk list page reads ALL messages to extract post titles. As chat history grows, this becomes O(n) per room. |

---

## Architecture Compliance

| Check | Status | Notes |
|-------|--------|-------|
| Layer separation | PASS | Clear separation: `data/` (mock data) -> `lib/api.ts` (data access) -> `components/` (presentation) -> `app/` (pages). |
| Dependency direction | PASS | Pages import components, components import lib, lib imports data. No reverse dependencies found. |
| Type consistency | PASS | Shared types in `lib/types.ts` used consistently across all files. `PostListItem`, `PostDetail`, `User` types are well-defined. |
| STORAGE_KEYS usage | CRITICAL | 5 hardcoded localStorage keys found outside `STORAGE_KEYS` (see C3, C4, C5, C6). This breaks the centralized key management pattern. |
| Naming conventions | PASS | Components use PascalCase, functions use camelCase, constants use UPPER_SNAKE_CASE. Consistent throughout. |

---

## Recent Changes Review (Priority Files)

### `src/app/suggest/page.tsx` (NEW)
- **C1**: submitting never resets (CRITICAL)
- **C2**: No try/catch on localStorage parse (CRITICAL)
- **W1**: Unsafe type assertion (WARNING)
- Overall: Functional but needs error handling hardening

### `src/components/search/SearchFilters.tsx` (NEW)
- **I3**: Possibly unnecessary `'use client'` directive
- Well-structured, clean component. No bugs found.

### `src/components/search/PriceFilter.tsx` (MODIFIED)
- **W2**: State not synced with prop changes (WARNING)
- **W3**: No negative number validation (WARNING)
- `uni` and `cat` props correctly threaded through URL builder

### `src/app/search/page.tsx` (MODIFIED)
- **W5**: NaN handling for price params (WARNING)
- Filter integration is correct and comprehensive
- Good use of server component for initial data fetch

### `src/lib/constants.ts` (MODIFIED)
- SUGGESTIONS key added correctly
- **I1**: Minor type import style issue
- No bugs found

### `src/app/my/page.tsx` (MODIFIED)
- Suggestion link (`/suggest`) added correctly to menu
- **W12**: 17 useState calls -- complex state management
- Structural duplication in post list rendering

### `src/components/layout/Header.tsx` (MODIFIED)
- Suggestion link added to hamburger menu correctly
- No bugs introduced by the change

---

## Summary

### Critical Issues: 8
All critical issues are fixable with small, targeted changes. The most impactful are:
1. **C1/C2**: Suggest page error handling (new feature, easy fix)
2. **C3/C4/C5**: Hardcoded localStorage keys (consistency violation, find-and-replace fix)
3. **C6**: CamTalk/CamNotif keys missing from STORAGE_KEYS (data cleanup gap)
4. **C7**: Notification read state not updating UI
5. **C8**: Unused prop and misleading button variant

### Warning Issues: 17
Most warnings relate to defensive coding (NaN guards, prop sync, validation) and code organization (large components, duplicate patterns).

### Deployment Recommendation

**Fix critical issues before deployment.** C1 and C2 can cause user-facing bugs in the new suggest feature. C3-C6 create data inconsistency risks during account deletion. C7 makes the notification page appear broken.

Warning issues should be addressed in the next sprint but do not block deployment.

---

## Improvement Priorities

1. **Immediate** (before next deploy):
   - Fix suggest page: try/catch on parse, reset submitting state
   - Replace all hardcoded localStorage keys with STORAGE_KEYS constants
   - Add CamTalk/CamNotif keys to STORAGE_KEYS
   - Fix notification read state UI update
   - Add NaN guard for search price parameters

2. **Short-term** (next 1-2 sprints):
   - Extract duplicate patterns (hooks, URL builders, post cards)
   - Split write page into smaller components (<300 lines each)
   - Add localStorage caching layer for `getAllPosts()`
   - Move PostCard edit button to separate client component

3. **Medium-term** (before Phase B):
   - Create `.env.example` template
   - Establish project-wide error boundary pattern
   - Add input sanitization layer for user content
   - Remove all mock auth plaintext passwords
