# 캠퍼스리스트 — Claude Code 지침서

## 1. 프로젝트 개요

- **프로젝트명**: 캠퍼스리스트 v3.2 (한예종 캠퍼스리스트)
- **설명**: 대학 기반 중고거래/커뮤니티 플랫폼
- **기술 스택**: Next.js 16.1.6, React 19.2.3, TypeScript strict, Tailwind v4, shadcn/ui
- **현재 Phase**: **A (Mock)** — localStorage / IndexedDB
- **예정 Phase**: B (Supabase 연동)
- **핵심 원칙**: `api.ts` 함수 시그니처를 유지하여, 내부만 교체하면 Phase B로 전환 가능하게 코딩

---

## 2. 디렉토리 구조

```
campulist/
├── src/app/                  — 페이지 라우트 (20+)
│   ├── [university]/[category]/  — 동적 라우트 (대학/대분류)
│   ├── write/                  — 글쓰기 (page.tsx, 가장 복잡한 파일)
│   ├── karts-eussa/            — 한예종으쌰으쌰 전용 페이지
│   ├── post/[id]/              — 게시글 상세
│   ├── camtalk/                — 캠톡 (채팅)
│   ├── all/                    — 전체 대학 통합 게시판
│   └── mypage/                 — 마이페이지
├── src/components/           — UI 컴포넌트 (49개)
│   ├── layout/                 — Header, Footer, Breadcrumb
│   ├── ui/                     — shadcn/ui 기반 (Sheet, Toast 등)
│   └── post/                   — PostCard, PostFeed 등
├── src/data/                 — Mock 데이터
│   ├── categories.ts           — 7 대분류 + 48 소분류
│   ├── universities.ts         — 5개 대학교
│   └── posts.ts                — Mock 게시글
├── src/lib/                  — 유틸리티
│   ├── api.ts                  — CRUD (Phase B 전환 핵심)
│   ├── types.ts                — 타입 정의
│   ├── constants.ts            — STORAGE_KEYS, LIMITS 등
│   ├── writeUrl.ts             — 글쓰기 URL 생성 (pathname 기반)
│   └── imageStore.ts           — IndexedDB 이미지 저장
└── src/contexts/             — AuthContext (Mock 인증)
```

---

## 3. 핵심 ID 매핑

### 대학교 (slug → id)

| slug | id | 이름 |
|------|----|------|
| snu | 1 | 서울대학교 |
| yonsei | 2 | 연세대학교 |
| korea | 3 | 고려대학교 |
| kaist | 4 | KAIST |
| karts | 5 | 한예종 |

### 대분류 카테고리 (slug → id)

| slug | id | 이름 | 배열 순서 |
|------|----|------|-----------|
| community | 4 | 게시판 | 1 (첫번째) |
| market | 1 | 중고마켓 | 2 |
| housing | 2 | 주거 | 3 |
| jobs | 3 | 일자리 | 4 |
| services | 5 | 서비스 | 5 |
| campus-life | 6 | 캠퍼스라이프 | 6 |
| gigs | 7 | 긱·의뢰 | 7 |

### 주요 소분류

| slug | id | 이름 | parentId | postAccess |
|------|----|------|----------|------------|
| cheer | 48 | 으쌰으쌰 | 4 (게시판) | campus |
| free-board | 46 | 자유게시판 | 4 (게시판) | campus |
| textbooks | 11 | 전공서적/교양도서 | 1 (마켓) | campus |
| studio | 21 | 원룸/자취방 | 2 (주거) | open |

**규칙**: slug 기반으로 코딩. 하드코딩 ID는 Server Component 초기값에만 허용.

---

## 4. 코딩 규칙 & UI 패턴

### 컴포넌트

- **Server Component 기본**, `'use client'`는 상호작용이 필요할 때만
- 모든 모달/바텀시트 → **shadcn Sheet** 사용 (`window.confirm` 절대 금지)
- Toast: `toast(msg)` 기본, `toast(msg, 'success')` 변형
- 접근성: `aria-label` 필수, `SheetTitle` sr-only 필수

### 색상 테마

- 활성 상태: **orange-400** (글쓰기 버튼, 선택된 배지 등)
- 카테고리 탭: **blue 계열**
- 비활성: `muted-foreground`, `border` 색상
- 미선택 배지: gray 테두리만 (bg 없음)

### 데이터 패턴

- **CategoryGrid**: 배열 순서 = 표시 순서 (sortOrder 필드는 런타임에서 미사용)
- **Breadcrumb**: `BreadcrumbSegment[]` 인터페이스 사용
- **UniversityTabs**: slug 기반 탭 전환
- **PostAccess**: `'campus'` (재학생만) vs `'open'` (누구나)
- **PostFilters**: 모든 필터링은 slug 기반 (`universitySlug`, `categoryMajorSlug`, `categoryMinorSlug`)

### 글쓰기 흐름

- `getWriteUrl(pathname)` → 현재 페이지의 uni/major/minor를 URL 파라미터로 전달
- `from` 파라미터 → 글쓰기 완료 후 원래 페이지로 리다이렉트
- 이미지 저장: **IndexedDB** (`imageStore.ts`) — localStorage 아님

---

## 5. 금지사항 (반복 버그 방지)

아래는 NOTES.md에서 확인된 반복 발생 버그 패턴. 절대 하지 말 것:

1. **`window.confirm()` 사용 금지** → Sheet 또는 AlertDialog 사용
2. **localStorage 키 직접 문자열 금지** → 반드시 `STORAGE_KEYS.xxx` 사용
3. **`Date.now()` ID 생성 금지** → `crypto.randomUUID()` 사용
4. **setState 연속 호출 금지** → `prev =>` 콜백 패턴 사용 (React 배칭)
5. **setInterval cleanup 누락 금지** → `useEffect` return에 `clearInterval` 필수
6. **prefix 생성 시 university 누락 금지** → 항상 대학명 포함
7. **커스텀 px 크기 금지** → Tailwind 유틸리티 클래스만 사용
8. **불필요한 리팩토링/주석/docstring 추가 금지** — 요청된 것만 수정

---

## 6. 특수 페이지 & 경로

### /karts-eussa (한예종으쌰으쌰)

- 한예종 전용 풀패키지 페이지 (Server Component)
- universitySlug=karts, majorSlug=community, minorSlug=cheer
- `writeUrl.ts`에서 특수 처리: `from=karts-eussa` 파라미터 추가
- 홈페이지 상단 배너에서 진입

### /write (글쓰기)

- URL 파라미터: `uni`, `major`, `minor`, `from`
- `from` 값에 따라 완료 후 리다이렉트 경로 결정
- `from=karts-eussa` → `/karts-eussa`로 리다이렉트
- 그 외 → `/{uni}/{major}?minor={minor}`로 리다이렉트

### /all (전체 게시판)

- 모든 대학교의 게시글을 통합 표시

### /camtalk (캠톡)

- 실시간 채팅 기능 페이지

---

## 7. 개발 워크플로우

### 명령어

```bash
npm run dev     # 개발 서버 (port 3000)
npm run build   # TypeScript 검증 + 빌드 (배포 전 필수)
```

### Git 규칙

- **커밋**: 사용자 요청 시에만 (자동 커밋 금지)
- **푸시**: 사용자 요청 시에만 (자동 푸시 금지)
- **커밋 메시지**: 한국어 OK, `feat:` / `fix:` / `docs:` 프리픽스

### Phase B (Supabase) 전환 규칙

- `api.ts` 함수 시그니처 유지 — 내부만 Supabase Client로 교체
- slug 기반 필터링 유지 (숫자 ID 직접 사용 금지)
- `PostAccess` 시스템 그대로 유지
- `imageStore.ts` → Supabase Storage로 교체

### 고위험 파일 (수정 시 주의)

| 파일 | 이유 |
|------|------|
| `src/app/write/page.tsx` | 1459줄, 가장 복잡. 글쓰기 전체 로직 |
| `src/data/categories.ts` | 배열 순서 = 표시 순서. 변경 시 UI 순서 변경됨 |
| `src/lib/api.ts` | Phase B 전환 핵심. 시그니처 절대 변경 금지 |
