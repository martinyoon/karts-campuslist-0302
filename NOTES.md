# 캠퍼스리스트 작업 노트

## 작업 일자: 2026-02-23

---

## 프로젝트 개요

**캠퍼스리스트(Campulist)** — 대학교 기반 중고거래/커뮤니티 플랫폼

- **기술 스택**: Next.js 16.1.6 (App Router, Turbopack), React, TypeScript, Tailwind CSS
- **인증**: localStorage 기반 Mock Auth (Supabase 연동 예정)
- **데이터**: 로컬 JSON/TS 파일 기반 Mock Data
- **경로**: `campulist/` 디렉토리 내 Next.js 프로젝트

### 주요 페이지

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 홈 | `/` | 대학별 최신 게시글 |
| 대학별 | `/[university]` | 대학교별 게시글 목록 |
| 카테고리별 | `/[university]/[category]` | 대학+카테고리 필터 |
| 전체 카테고리 | `/all/[category]` | 전체 대학 카테고리별 |
| 글쓰기 | `/write` | 게시글 작성/수정 |
| 게시글 상세 | `/post/[id]` | 개별 게시글 |
| 캠톡 | `/camtalk`, `/camtalk/[id]` | 1:1 채팅 |
| 마이페이지 | `/my` | 내 정보/게시글 |
| 검색 | `/search` | 게시글 검색 |
| 인증 | `/auth` | 회원가입/로그인 |

### 핵심 데이터 파일

| 파일 | 내용 |
|------|------|
| `src/data/universities.ts` | 대학교 목록 (캠퍼스, 지역 포함) |
| `src/data/categories.ts` | 카테고리 (대분류/소분류 46개) |
| `src/data/categoryExamples.ts` | 카테고리별 글쓰기 예시 데이터 |
| `src/data/posts.ts` | Mock 게시글 데이터 |
| `src/lib/types.ts` | TypeScript 타입 정의 |
| `src/lib/api.ts` | Mock API 함수 (CRUD) |
| `src/contexts/AuthContext.tsx` | 인증 컨텍스트 |

### User 타입 참고

```ts
interface User {
  id: string;
  email: string;
  nickname: string;        // name이 아닌 nickname 주의
  avatarUrl: string | null;
  role: UserRole;
  memberType: MemberType;
  universityId: number;
  campus: string | null;
  department: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  mannerTemp: number;
  tradeCount: number;
  createdAt: string;
}
```

---

## GitHub 저장소

- **Repo**: https://github.com/martinyoon/campuslist0020020260223 (private)
- **Branch**: main

### 커밋 히스토리

| 커밋 | 내용 |
|------|------|
| `2d214d1` | feat: 캠퍼스리스트 초기 커밋 — 글쓰기 예시 채우기 7가지 기능 개선 |
| `cf3a159` | feat: 글쓰기 나머지 3기능 추가 (인기태그/하이라이트/미리보기) + NOTES.md |
| `98e019c` | fix: 예시 채우기 버튼 UX 개선 + interval 메모리 누수 수정 |
| `d68b578` | docs: NOTES.md 최신 작업 내용으로 업데이트 |
| `5bdc6ef` | fix: 글 수정 시 제목 내용 사라지는 버그 수정 (React 배칭 타이밍) |
| `68ad6ec` | fix: UI 버그 수정 + UX 개선 6건 |
| `17362ca` | docs: NOTES.md 업데이트 + Supabase 연동 가이드 추가 |
| `6cb3ecc` | feat: 게시판 분리 — 캠퍼스 게시판 vs 광고 게시판 |
| `86b2910` | fix: 글쓰기 권한 버그 수정 — 회원유형별 보드 접근 제한 |
| `5c5f921` | refactor: 보드 분리 제거 + 오픈 소분류 체계 구현 |
| `9b6c10c` | feat: UI/UX 전면 개선 14건 (이미지/헤더/카테고리/검색/캠톡 등) |
| `793cdae` | refactor: 디자인 통일성 개선 9건 (타이포/활성상태/Toast/Sheet 등) |
| `597dc4e` | fix: Header 데스크톱 카테고리 네비 제거 (CategoryGrid와 중복 해소) |
| `8052896` | refactor: 3차 UI/UX 종합 검토 8건 (버그 수정, Sheet 전환, 접근성) |
| (현재) | refactor: 4차 UI 통일성 개선 — 아이콘 라벨, 활성 색상, 네비 일관성 |

---

## 완료된 작업

### 1. 캠톡 univPrefix 수정

**파일**: `campulist/src/app/camtalk/[id]/page.tsx`

캠톡 메시지의 대학 접두어가 캠퍼스 `region` 대신 캠퍼스 `name`을 사용하도록 변경.

```tsx
// 변경 전
const myCampus = myUniv?.campuses.find(c => c.name === user?.campus);
const univPrefix = myUniv ? `${myUniv.name} ${myCampus?.region ?? user?.campus ?? myUniv.region}` : '';

// 변경 후 (myCampus 변수 제거)
const univPrefix = myUniv ? `${myUniv.name} ${user?.campus ?? myUniv.region}` : '';
```

### 2. 글쓰기 "전체 예시 채우기" 7가지 기능 개선

기존: 카테고리당 고정 1개 예시, 즉시 채워지는 단순 기능
개선: 사용자가 재미있고 편리하게 글을 작성할 수 있는 7가지 기능 통합

#### 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/data/categoryExamples.ts` | 타입 확장, 예시 배열(3개씩), 톤 변형, 인기태그, 시즌 힌트 |
| `src/app/write/page.tsx` | 7가지 기능 UI/로직 전체 통합 |

#### 데이터 구조 확장 (`categoryExamples.ts`)

```ts
export interface ToneVariant { title: string; body: string; }
export type ToneType = 'clean' | 'friendly' | 'urgent' | 'humor';
export interface CategoryExampleSet {
  examples: CategoryExample[];
  tones?: Partial<Record<ToneType, ToneVariant>>;
  popularTags: string[];
  seasonalHints?: Record<string, { titleSuffix?: string; bodyHint?: string }>;
}
```

- 기존 `categoryExamples` 유지 (하위 호환) + 새로 `categoryExampleSets` 추가
- 46개 소분류 전체 데이터 확장, 10개 카테고리에 톤 변형 적용

#### 7가지 기능

| # | 기능 | 설명 |
|---|------|------|
| 1 | 랜덤 예시 뽑기 | 슬롯머신 애니메이션(80ms x 10회), 여러 예시 중 랜덤 선택 |
| 2 | 문체 선택기 | 4개 문체(깔끔/친근/급매/유머) 칩 버튼, 제목/본문만 변형 |
| 3 | 완성도 점수 | 0~100점 프로그레스 바, 구간별 라벨/색상, 다음 단계 힌트 |
| 4 | 시즌 맞춤 | 월 기반 시즌 감지(신학기/시험/축제/방학), 배지+힌트 표시 |
| 5 | 스마트 채우기 | 비어있는 필드만 채움, 토스트 알림, 필드 하이라이트(1.5초) |
| 6 | 실시간 미리보기 | 바텀시트로 실제 게시글 형태 렌더링 |
| 7 | 인기 태그 추천 | 카테고리별 인기 태그 칩, 클릭 즉시 추가 |

### 3. 예시 채우기 버튼 UX 개선

버튼 텍스트가 사용자에게 직관적이지 않은 문제 해결.

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 섹션 헤딩 | (없음) | **글 작성이 막막하신가요?** |
| 메인 버튼 | `🎲 랜덤 예시 뽑기 (빈칸만 채움)` | **✨ 예시로 채우기** |
| 예시 1개일 때 | `⚡ 빈칸 자동완성` | **✨ 예시로 채우기** (동일) |
| 서브텍스트 | (없음) | **이미 작성한 항목은 유지돼요 · 누를 때마다 다른 예시!** |
| 톤 라벨 | `톤:` | **문체:** |
| 스피닝 텍스트 | `뽑는 중...` | **예시 고르는 중...** |

### 4. 버그 수정 — setInterval 메모리 누수 + user assertion

- **setInterval 메모리 누수** — `useRef`로 interval ID 관리 + `useEffect` cleanup 추가
- **user! non-null assertion** — 스피닝 시작 시점에 `capturedUser`로 안전하게 캡처

### 5. 버그 수정 — 글 수정 시 제목 사라짐 (React 배칭 타이밍)

**파일**: `campulist/src/app/write/page.tsx`

게시글 수정 진입 시 원래 제목에서 사용자 입력 부분이 사라지고 접두어(`[대학약칭][회원유형] `)만 남는 버그.

#### 원인

React 상태 배칭(batching) 타이밍 문제. 두 개의 `useEffect`가 같은 렌더 사이클에서 경합:

```
useEffect #1 (수정 모드 초기화, line 204):
  setIsEditMode(true)  ← state 배칭, 아직 반영 안됨
  setTitle(post.title) ← state 배칭, 아직 반영 안됨

useEffect #2 (접두어 삽입, line 312):
  if (!isEditMode)     ← 아직 false (이전 렌더 클로저)
  if (!title)          ← 아직 "" (이전 렌더 클로저)
  → setTitle(접두어)   ← 마지막 setTitle이 승리 → 원래 제목 덮어쓰기
```

#### 수정

`isEditRef` (useRef) 추가 — ref는 state와 달리 동기적으로 반영되므로 같은 렌더 사이클에서 즉시 확인 가능.

```tsx
// 1. ref 추가
const isEditRef = useRef(false);

// 2. 수정 모드 초기화에서 동기적으로 설정
isEditRef.current = true;
setIsEditMode(true);

// 3. 접두어 useEffect에서 ref 체크
if (user && !isEditMode && !draftLoaded && !isEditRef.current) {
```

### 6. 캠퍼스/광고 보드 통합 — "오픈 소분류" 방식 전환

**Before:** 캠퍼스 게시판 + 광고 게시판 (2개 보드, boardType 분기, 18개+ 파일에 분산)
**After:** 통합 7개 대분류 + 46개 소분류 (소분류별 `postAccess: 'campus' | 'open'`)

#### 핵심 변경

- `BoardType` 타입 → `PostAccess` 타입으로 교체
- 광고 카테고리(ID 101+) 전부 삭제, 기존 7개 대분류 유지
- 소분류별 `postAccess` 필드 추가 (campus 20개 / open 26개)
- 상인/일반인은 `open` 소분류에만 글쓰기 가능
- `app/ad/` 라우트 삭제

#### 변경된 파일 (18개)

| 파일 | 변경 내용 |
|------|----------|
| `lib/types.ts` | PostAccess 추가, BoardType 제거 |
| `data/categories.ts` | 광고 카테고리 삭제, postAccess 추가, 헬퍼 정리 |
| `data/posts.ts` | boardType 필드 제거, 광고 게시글 카테고리 재매핑 |
| `lib/api.ts` | boardType 필터 전체 제거 |
| `app/write/page.tsx` | 보드 탭 제거, postAccess 기반 권한 체크 |
| `app/page.tsx` | 보드 필터 칩 제거, 통합 피드 |
| `app/[university]/page.tsx` | 보드 필터 칩 제거 |
| `app/search/page.tsx` | 보드 필터 탭 제거 |
| `app/ad/page.tsx` | 삭제 |
| `app/ad/[university]/page.tsx` | 삭제 |
| `components/post/UniversityTabs.tsx` | boardParam 제거 |
| `components/post/CategoryGrid.tsx` | boardType 분기 제거 |
| `components/post/CategoryDirectory.tsx` | boardType 제거 |
| `components/post/PostCard.tsx` | 배지 로직 변경 |
| `components/post/PostFeedWithLocal.tsx` | boardType 제거 |
| `components/write/CategorySummary.tsx` | boardType 색상 제거, 통합 blue |
| `components/layout/Header.tsx` | 카테고리 통합 |
| `components/layout/BottomNav.tsx` | /ad 참조 제거 |
| `lib/writeUrl.ts` | board 파라미터 제거 |

#### PostAccess 분포

| 대분류 | campus | open |
|--------|--------|------|
| 중고마켓 | 8 (전부) | 0 |
| 주거 | 2 (룸메이트, 양도) | 3 (원룸, 하숙, 단기) |
| 일자리 | 3 (과외, RA, 구직) | 5 (알바, 레슨, 인턴, 프리랜서, 구인) |
| 커뮤니티 | 7 (전부) | 0 |
| 서비스 | 0 | 8 (전부) |
| 캠퍼스라이프 | 0 | 4 (전부) |
| 긱·의뢰 | 0 | 6 (전부) |
| **합계** | **20** | **26** |

### 7. 글쓰기 페이지 UX 개선 — "필터 우선" 카테고리 표시

**문제:** 비캠퍼스 회원(인근상인/일반인)이 46개 카테고리를 모두 보고 혼란. 🔒 표시만으로는 직관적이지 않음.

**해결:** 사용자 역할에 따라 카테고리 표시를 분리.

#### 비캠퍼스 회원 (인근상인/일반인)

1. 상단 안내 배너: "🏪 인근상인 회원님, 아래 카테고리에 글을 작성할 수 있어요"
2. open 카테고리 26개만 5개 대분류 아래에 표시
3. 하단 접기/펼치기: "🔒 캠퍼스 인증 회원 전용 (20개)"
4. 펼치면 campus 카테고리가 opacity 50%로 표시
5. 잠긴 소분류 클릭 시 토스트 안내

#### 캠퍼스 회원

- 변경 없음 (7개 대분류, 46개 소분류 전체)

### 8. campus 카테고리 조기 차단 — 3개 우회 경로 수정

**문제:** 등록하기 클릭 시(handleSubmit)에서만 차단 → 폼 작성 후에야 막힘 → UX 나쁨.

**해결:** 진입 시점에서 차단하도록 3개 경로에 `isCampusBlocked()` 체크 추가.

| 우회 경로 | 차단 동작 |
|----------|----------|
| URL 파라미터 `/write?major=market&minor=textbooks` | 토스트 경고 + 카테고리 선택으로 복귀 |
| 임시저장 복원 (localStorage에 campus 카테고리) | minorId를 null로 초기화 |
| 수정 모드 `/write?edit=postId` | 토스트 경고 + 원래 게시글로 리다이렉트 |

handleSubmit 방어 코드(501~507행)는 최후 안전장치로 유지.

### 9. Supabase 연동 가이드 문서 작성

**파일**: `SUPABASE_MIGRATION_GUIDE.md` (프로젝트 루트)

UI 완료 후 Supabase 연동 시 Claude Code에 전달할 지시사항을 10단계로 체계적으로 정리.

| 단계 | 내용 |
|------|------|
| 1 | 사전 준비 — 패키지 설치, 클라이언트 초기화 |
| 2 | 테이블 생성 — 12개 테이블 SQL + 시드 데이터 |
| 3 | 인증 전환 — Mock Auth → Supabase Auth + profiles |
| 4 | 게시글 CRUD — localStorage → posts 테이블 |
| 5 | 이미지 업로드 — base64 → Supabase Storage |
| 6 | 찜/조회수/검색 — post_likes + view_count + Full-text Search |
| 7 | 캠톡 Realtime — localStorage 채팅 → Supabase Realtime |
| 8 | 캠노티 알림 — localStorage 알림 → notifications 테이블 |
| 9 | RLS 보안 — Row Level Security 정책 |
| 10 | 정리/배포 — Mock 코드 삭제 + Vercel 배포 |

포함 내용:
- 12개 Supabase 테이블 스키마 (컬럼, 타입, 인덱스, 제약조건)
- 현재 TypeScript 타입 ↔ Supabase snake_case 매핑표
- 각 단계별 테스트 체크리스트
- 삭제할 파일/localStorage 키 vs 유지할 파일 목록
- RLS 정책 (테이블별 SELECT/INSERT/UPDATE/DELETE 규칙)

### 10. UI/UX 전면 개선 — 14개 항목 (Critical 3 + High 4 + Medium 7)

전체 앱(18개 페이지, 30+ 컴포넌트)을 탐색하여 발견한 UI/UX 문제 14건을 일괄 개선.
구현 난이도가 낮고, Supabase 연동에 문제 없으며, 기존 코드 패턴을 유지하면서 수정.

#### 수정 파일 목록 (15개)

| # | 파일 | 수정 내용 | 등급 |
|---|------|----------|------|
| A1 | `components/post/ImageGallery.tsx` | w-1/3→w-full, aspect-[4/3], 버튼 확대, lazy | Critical |
| A2+C1 | `components/layout/Header.tsx` | 데스크톱 카테고리 링크 + 모바일 1줄 컴팩트 | Critical |
| A3 | `components/post/ContactMethodsDisplay.tsx` | tel:, mailto:, 복사 토스트 | Critical |
| B1 | `components/post/CategoryGrid.tsx` | Sheet→Link 직접 이동 (2클릭→1클릭) | High |
| B2 | `app/search/page.tsx` | 검색 폼 추가 + a→Link | High |
| B3 | `app/camtalk/page.tsx` | 대화목록에 게시글 제목 표시 | High |
| B4 | `app/post/[id]/page.tsx` | 하단바에서 본문 제거, 가격만 표시 | High |
| B4 | `components/post/LocalPostView.tsx` | 동일 (하단바 본문 제거) | High |
| C2 | `app/[university]/[category]/page.tsx` | a→Link (클라이언트 네비게이션) | Medium |
| C2 | `app/all/[category]/page.tsx` | a→Link (클라이언트 네비게이션) | Medium |
| C3 | `components/post/ShareButton.tsx` | Web Share API + 클립보드 폴백 | Medium |
| C4 | `components/post/PostStatusControl.tsx` | window.confirm→Sheet 모달 | Medium |
| C5 | `components/post/PostCard.tsx` | 이미지 loading="lazy" | Medium |
| C6 | `app/auth/page.tsx` | 회원유형 캠퍼스/외부 2그룹 분리 | Medium |
| C7 | `app/camtalk/[id]/page.tsx` | router.back()→push('/camtalk') | Medium |

#### A. Critical 버그 수정 (3개)

**A1. ImageGallery 크기 수정**
- 이미지 `w-1/3 aspect-[16/9]` → `w-full aspect-[4/3]` (모바일 ~120px→전체 너비)
- 좌우 화살표 `h-6 w-6` → `h-8 w-8` (터치 타겟 확대)
- 인디케이터 `h-1` → `h-1.5`, 활성 `w-3` → `w-4`
- `loading="lazy"` 추가
- `mx-4 mt-4` 제거 (부모가 패딩 담당)

**A2. 데스크톱 네비게이션 추가 + C1. 모바일 헤더 컴팩트화**
- 데스크톱: 7개 대분류 카테고리 링크를 로고와 검색 사이에 배치 (`hidden md:flex`)
- 모바일: 2줄 헤더(로고바+검색바) → 1줄 + 돋보기 아이콘 검색 오버레이
- `showMobileSearch` state로 검색 모드 토글
- 현재 pathname 기반 활성 카테고리 하이라이트
- `currentUniSlug` 기반 컨텍스트 인식 카테고리 URL

**A3. 전화번호 tap-to-call + 이메일 mailto**
- 전화번호: `<span>` → `<a href="tel:...">` (녹색)
- 이메일: `<span>` → `<a href="mailto:...">` + 복사 시 `toast()` 피드백

#### B. High Impact 개선 (4개)

**B1. 카테고리 직접 이동**
- CategoryGrid에서 Sheet(CategoryDirectory) 제거, `<Link>` 직접 이동
- `'use client'` 제거, `useState` 제거 — 서버 컴포넌트 가능
- `grid-cols-3` → `grid-cols-4` (7개 아이콘에 더 적합)

**B2. 검색 페이지에 검색 폼 추가**
- `<form action="/search">` 네이티브 폼 (서버 컴포넌트 유지)
- 정렬 `<a>` → `<Link>` (클라이언트 네비게이션)

**B3. 캠톡 대화목록에 게시글 정보 추가**
- `getMessages()` import 추가
- 첫 메시지에서 게시글 제목 파싱: `firstMsg.match(/^\[(.+?)\]\n\/post\//)`
- 닉네임 아래에 파란색 게시글 제목 표시

**B4. 게시글 하단 고정바 정리**
- `post.body` 텍스트 제거 → 가격만 크게 표시
- `priceNegotiable`은 별도 줄로 분리
- `page.tsx` + `LocalPostView.tsx` 양쪽 동일하게 수정

#### C. Medium Impact 개선 (7개)

**C1.** (A2와 병합 — 모바일 헤더 컴팩트화)

**C2. 필터/정렬을 `<Link>`로 변경**
- `app/[university]/[category]/page.tsx`, `app/all/[category]/page.tsx`
- `<a>` → `<Link>` — 풀 페이지 리로드 → 클라이언트 네비게이션

**C3. ShareButton에 Web Share API 추가**
- `navigator.share()` 지원 시 네이티브 공유 시트
- 미지원 시 클립보드 복사 폴백

**C4. 게시글 삭제 확인 — window.confirm → Sheet**
- `showDeleteSheet` state + Sheet bottom panel
- 스타일된 취소/삭제 버튼

**C5. PostCard 이미지 lazy loading**
- `<img>` 태그에 `loading="lazy"` 추가

**C6. 로그인 페이지 회원유형 그룹 분리**
- `MEMBER_TYPES` → `CAMPUS_MEMBER_TYPES` (5개, 5열) + `EXTERNAL_MEMBER_TYPES` (2개, 2열)
- "캠퍼스 회원" / "외부 회원" 그룹 라벨 추가

**C7. 캠톡 뒤로가기 → 목록으로**
- `router.back()` → `router.push('/camtalk')` — 항상 캠톡 목록으로

### 11. 디자인 통일성 개선 — 9개 항목 (16개 파일 수정)

전체 앱을 재탐색하여 타이포그래피/색상/활성상태/네비게이션/접근성 불일치 9건을 일괄 개선.
모두 UI 레이어에 한정 — 데이터/타입 변경 없음, Supabase 연동에 영향 없음.

#### 수정 파일 목록 (16개)

| # | 수정 내용 | 파일 | 상세 |
|---|----------|------|------|
| 1 | **타이포그래피 통일** | 15개 파일 (23곳) | 커스텀 픽셀값 전량 제거 |
| 2 | **섹션 헤더 크기 통일** | `app/[university]/page.tsx` | `text-lg`→`text-xl`, `py-3`→`py-4` |
| 3 | **활성 상태 패턴 통일** | `components/layout/Header.tsx` | 사이드메뉴 `font-bold`→`font-semibold` |
| 5 | **대학 페이지 브레드크럼** | `app/[university]/page.tsx` | "모든 대학 › 대학명" 네비게이션 추가 |
| 6 | **Toast 접근성** | `components/ui/Toast.tsx` | `role="status" aria-live="polite"` 추가 |
| 7 | **Toast 변형 + 위치** | `components/ui/Toast.tsx` | success/error 색상, `md:bottom-8` |
| 8 | **BottomNav 글쓰기 활성** | `components/layout/BottomNav.tsx` | 아이콘 `strokeWidth` 활성 변화 추가 |
| 9 | **로그아웃 Sheet** | `app/my/page.tsx` | `window.confirm`→Sheet 컴포넌트 전환 |
| 10 | **검색 빈상태** | `app/search/page.tsx` | 커스텀 HTML→EmptyState 재사용 컴포넌트 |

#### 1. 타이포그래피 통일 — 커스텀 픽셀값 전량 제거

앱 전체에 흩어진 5종의 커스텀 픽셀 글자크기를 Tailwind 표준 클래스로 교체:

| 커스텀 값 | Tailwind 표준 | 이유 |
|-----------|--------------|------|
| `text-[15px]` (15px) | `text-sm` (14px) | 1px 차이, 표준화 |
| `text-[13px]` (13px) | `text-xs`/`text-sm` | 용도에 따라 선택 |
| `text-[11px]` (11px) | `text-xs` (12px) | 가독성 향상 |
| `text-[10px]` (10px) | `text-xs` (12px) | 접근성, 가독성 |
| `text-[9px]` (9px) | `text-xs` (12px) | 접근성, 가독성 |

수정된 15개 파일:
- `UniversityTabs.tsx` — 탭 텍스트 `text-[15px]`→`text-sm`
- `PopularPostsSection.tsx` — 토글/제목/메타 3곳
- `PostCard.tsx` — 배지/메타 `text-[10px]`/`text-[13px]`→`text-xs`
- `BottomNav.tsx` — 뱃지/라벨 `text-[10px]`/`text-[11px]`→`text-xs`
- `Header.tsx` — 서브타이틀/뱃지 `text-[10px]`→`text-xs`
- `post/[id]/page.tsx` — 인증 뱃지 `text-[10px]`→`text-xs`
- `my/page.tsx` — 인증/상태 뱃지
- `camtalk/[id]/page.tsx` — 인증 뱃지/타임스탬프
- `user/[id]/page.tsx` — 인증/비즈니스 뱃지
- `camtalk/page.tsx` — 안읽음 뱃지
- `write/page.tsx` — 이미지 오버레이 3곳 (`text-[10px]`, `text-[9px]`)
- `PostBottomAction.tsx` — 빠른 메시지 버튼 `text-[15px]`→`text-sm`
- `CategoryStepMajor.tsx` — 소분류 태그 `text-[11px]`→`text-xs`
- `ImageGallery.tsx` — 이미지 카운터 `text-[10px]`→`text-xs`
- `LocalPostView.tsx` — 인증 뱃지

#### 2. 섹션 헤더 크기 통일

대학 페이지 "게시글" 섹션 헤더를 홈페이지 패턴(`text-xl font-bold`, `py-4`)과 동일하게 통일.

#### 3. 활성 상태 패턴 통일

Header 사이드 메뉴의 활성 링크: `font-bold`→`font-semibold` (데스크톱 카테고리 네비와 통일).

표준 2가지 패턴:
- **탭형** (수평): `border-b-2 border-blue-500 text-blue-500 font-medium`
- **메뉴형** (세로/링크): `font-semibold text-blue-500`

#### 5. 대학 페이지 브레드크럼 추가

대학 정보 배너 아래에 "모든 대학 › 대학명" 브레드크럼 삽입. 홈으로의 이동 경로 제공.

#### 6+7. Toast 접근성 + 변형 + 위치

- **접근성**: `role="status" aria-live="polite"` — 스크린 리더 지원
- **변형**: `variant` 파라미터 추가 (`'default' | 'success' | 'error'`)
  - `success`: `bg-green-600 text-white`
  - `error`: `bg-red-600 text-white`
  - 기본값 `'default'` — 기존 `toast('메시지')` 호출 하위 호환
- **위치**: 데스크톱에서 `md:bottom-8` (BottomNav 없으므로 더 아래로)

#### 8. BottomNav 글쓰기 아이콘 활성상태

글쓰기 아이콘이 유일하게 `active` 파라미터를 받지 않던 문제.
`icon: ()` → `icon: (active: boolean)` + `strokeWidth={active ? 2.5 : 2}` (검색 아이콘과 동일 패턴).

#### 9. 로그아웃 Sheet 전환

`window.confirm('로그아웃 하시겠습니까?')` → Sheet 모달.
회원탈퇴 Sheet와 동일한 패턴 (취소/확인 버튼).
브라우저 기본 다이얼로그 대신 앱 디자인과 일관된 UI.

#### 10. 검색 빈상태 EmptyState 사용

검색어 미입력 시 커스텀 SVG+텍스트 HTML → `<EmptyState>` 재사용 컴포넌트.
앱 전체의 빈상태 패턴 통일.

### 12. Header 데스크톱 카테고리 네비게이션 제거

**파일**: `campulist/src/components/layout/Header.tsx`

이전 세션(A2)에서 추가한 데스크톱 카테고리 네비게이션(7개 대분류 텍스트 링크, `hidden md:flex`)이
홈 화면 본문의 CategoryGrid(아이콘 그리드)와 **중복**되는 문제 발견.

**삭제 내용**: 라인 105~124의 `<nav>` 블록 전체 (19줄)

```tsx
{/* 데스크톱: 카테고리 네비게이션 */}
<nav className="hidden items-center gap-1 md:flex">
  {majorCategories.map(cat => { ... })}
</nav>
```

**유지 항목**:
- `majorCategories` import — 사이드 메뉴(라인 86)에서 사용
- `currentUniSlug` — 사이드 메뉴 카테고리 링크(라인 87)에서 사용
- 모바일 사이드 메뉴(Sheet)의 카테고리 목록

**결과**:
- 데스크톱 Header: 로고 + 검색 + 버튼 (간결)
- 카테고리 진입: CategoryGrid 아이콘 그리드가 유일한 진입점
- 중복 해소

### 13. 3차 UI/UX 종합 검토 — 8건 (5개 파일 수정)

코드베이스 전체를 재탐색하여 발견한 버그, 디자인 불일치, 접근성 이슈 8건을 일괄 개선.
구현 난이도가 낮고, Supabase 연동에 영향 없는 UI 레이어 항목만 선별.

#### 수정 파일 목록 (5개)

| # | 수정 내용 | 파일 | 유형 |
|---|----------|------|------|
| 1 | **캠톡 채팅 높이 오류 수정** | `app/camtalk/[id]/page.tsx` | 버그 |
| 2 | **window.confirm → Sheet 모달 (4곳)** | `app/write/page.tsx` | UX 일관성 |
| 3 | **캠톡 약속잡기 패널 → Sheet** | `app/camtalk/[id]/page.tsx` | 디자인 통일 |
| 4 | **Header aria-label 추가 (5곳)** | `components/layout/Header.tsx` | 접근성 |
| 5 | **글쓰기 미리보기 → Sheet** | `app/write/page.tsx` | 디자인 통일 |
| 6 | **textarea 포커스 스타일 통일** | `app/write/page.tsx` | 디자인 통일 |
| 7 | **브레드크럼 aria-label 추가** | `app/[university]/page.tsx` | 접근성 |
| 8 | **PostCard 가격 null 방어** | `components/post/PostCard.tsx` | 방어적 코딩 |

#### 1. 캠톡 채팅 높이 오류 수정

**파일**: `campulist/src/app/camtalk/[id]/page.tsx`

메시지 입력창이 모바일 BottomNav 뒤에 가려지는 버그.
Header(56px) + BottomNav(56px) = 112px인데, 64px만 빼고 있었음.

```
Before: h-[calc(100dvh-64px)] md:h-[calc(100dvh-80px)]
After:  h-[calc(100dvh-112px)] md:h-[calc(100dvh-56px)]
```

#### 2. write/page.tsx window.confirm → Sheet 모달 (4곳)

my/page.tsx 로그아웃에서 Sheet 패턴 적용 완료 후, write 페이지에도 동일 패턴 적용.
`confirmAction` state 하나로 4개 케이스(제목/가격/내용 예시 대체 + 게시글 삭제)를 관리하는 단일 Sheet.

| 위치 | 기존 | 변경 |
|------|------|------|
| fillTitleExample | `window.confirm('기존 제목을 예시로 대체할까요?')` | Sheet 모달 |
| fillPriceExample | `window.confirm('기존 가격을 예시로 대체할까요?')` | Sheet 모달 |
| fillBodyExample | `window.confirm('기존 내용을 예시로 대체할까요?')` | Sheet 모달 |
| handleDelete | `window.confirm('정말 삭제하시겠습니까?')` | Sheet 모달 (빨간 삭제 버튼) |

#### 3. 캠톡 약속잡기 패널 → Sheet

커스텀 오버레이(`fixed inset-0 z-40 bg-black/50` + 직접 구현 바텀시트)를
shadcn Sheet 컴포넌트로 교체. 포커스 트랩, Escape 닫기, 접근성 자동 확보.

#### 4. Header aria-label 추가 (5곳)

| 요소 | 추가한 aria-label |
|------|-------------------|
| 모바일 검색 닫기 버튼 | `aria-label="검색 닫기"` |
| 햄버거 메뉴 버튼 | `aria-label="메뉴 열기"` |
| 모바일 검색 버튼 | `aria-label="검색"` |
| 캠톡 버튼 | `aria-label="캠톡"` |
| MY 버튼 | `aria-label="마이페이지"` |

#### 5. 글쓰기 미리보기 → Sheet

커스텀 오버레이를 shadcn Sheet(side="bottom")으로 교체.
포커스 트랩, Escape, 스크린리더 지원 자동 확보.

#### 6. textarea 포커스 스타일 통일

글쓰기 본문 textarea가 shadcn Input과 다른 포커스 스타일 사용.
`border-border focus:border-blue-500` → `border-input focus-visible:border-ring focus-visible:ring-ring/50`

#### 7. 브레드크럼 aria-label 추가

대학 페이지 브레드크럼 `<nav>`에 `aria-label="브레드크럼"` 추가.

#### 8. PostCard 가격 null 방어

`price`가 null일 때 "협의가능" 텍스트가 표시되지 않도록 방어 코드 추가.
```tsx
{post.price !== null && post.priceNegotiable && <span>협의가능</span>}
```

### 14. 4차 UI 통일성 개선 — 아이콘 라벨 + 활성 색상 + 네비 일관성 (5개 파일 수정)

상단/하단 네비게이션의 디자인 통일성과 시인성을 개선. 아이콘에 텍스트 라벨 추가, 활성 상태 색상 변경, 상단·하단 바 동작 일치화.

#### 수정 파일 목록 (5개)

| # | 수정 내용 | 파일 | 유형 |
|---|----------|------|------|
| 1 | **실시간 인기글 디폴트 접기** | `components/post/PopularPostsSection.tsx` | UX |
| 2 | **Header 아이콘 텍스트 라벨 추가** | `components/layout/Header.tsx` | 디자인 통일 |
| 3 | **IconToggle 텍스트 라벨 추가** | `components/IconToggle.tsx` | 디자인 통일 |
| 4 | **ThemeToggle 텍스트 라벨 추가** | `components/ThemeToggle.tsx` | 디자인 통일 |
| 5 | **BottomNav 활성 색상 변경** | `components/layout/BottomNav.tsx` | 시인성 |

#### 1. 실시간 인기글 디폴트 접기

`useState(true)` → `useState(false)` — 홈 화면 진입 시 인기글 섹션이 접힌 상태로 시작.

#### 2. Header 아이콘 텍스트 라벨 + 활성 상태 + 동작 통일

- 검색, 글쓰기, 캠톡, MY 아이콘 아래에 `text-[10px]` 텍스트 라벨 추가
- 글쓰기 버튼: 텍스트 버튼 → `+` 아이콘(30x30) + "글쓰기" 라벨 (하단 바와 동일)
- MY 아이콘: `hidden md:block` 제거 → 모바일에서도 항상 표시
- 모바일 검색: `onClick`(인라인 검색) → `<Link href="/search">` (하단 바와 동일하게 페이지 이동)
- 인라인 검색 폼 제거: `showMobileSearch` 상태 및 조건분기 코드 정리
- 활성 상태: `pathname` 기반으로 `text-orange-400` / `text-muted-foreground` 적용

#### 3-4. IconToggle / ThemeToggle 텍스트 라벨 추가

- `size="icon"` → `flex flex-col items-center` 레이아웃 + `text-[10px]` 라벨
- IconToggle: "아이콘" 라벨
- ThemeToggle: 다크모드일 때 "라이트", 라이트모드일 때 "다크" 라벨

#### 5. BottomNav 활성 색상 변경

`text-blue-500` → `text-orange-400` — 다크/라이트 모드 모두에서 시인성 개선.
Header와 동일한 `text-orange-400` 활성 색상으로 상단·하단 통일.

---

## 현재 상태

```
[완료] 캠톡 univPrefix 수정
[완료] categoryExamples.ts 데이터 구조 확장 (46개 카테고리)
[완료] write/page.tsx 7가지 기능 통합 구현
[완료] 인기태그 추천 / 필드 하이라이트 / 미리보기 바텀시트
[완료] 예시 채우기 버튼 UX 개선 (텍스트 + 서브텍스트 + 헤딩)
[완료] setInterval 메모리 누수 + user assertion 버그 수정
[완료] 글 수정 시 제목 사라짐 버그 수정 (isEditRef)
[완료] Supabase 연동 가이드 문서 작성 (SUPABASE_MIGRATION_GUIDE.md)
[완료] 캠퍼스/광고 보드 통합 → "오픈 소분류" 방식 (18개 파일 수정, app/ad/ 삭제)
[완료] 글쓰기 UX 개선 — 필터 우선 카테고리 표시 (비캠퍼스: open만, 캠퍼스: 전체)
[완료] campus 카테고리 조기 차단 (URL 파라미터, 임시저장, 수정 모드 3개 경로)
[완료] UI/UX 전면 개선 14건 — Critical 3 + High 4 + Medium 7
       A1. ImageGallery w-full + aspect-[4/3] + lazy loading
       A2. 데스크톱 카테고리 네비게이션 + 모바일 헤더 컴팩트
       A3. 전화번호 tap-to-call + 이메일 mailto + 복사 토스트
       B1. 카테고리 직접 이동 (Sheet 제거 → Link)
       B2. 검색 페이지 검색 폼 추가
       B3. 캠톡 대화목록 게시글 제목 표시
       B4. 하단 고정바 본문 제거 (가격만 표시)
       C2. 필터/정렬 <a>→<Link> (클라이언트 네비게이션)
       C3. ShareButton Web Share API
       C4. 삭제 확인 Sheet 모달
       C5. PostCard 이미지 lazy loading
       C6. 회원가입 유형 2그룹 분리
       C7. 캠톡 뒤로가기 → 목록으로
[완료] npm run build 성공 (TypeScript 에러 없음)
[완료] GitHub 푸시 완료
[완료] 디자인 통일성 개선 9건 — 16개 파일 수정
       1. 타이포그래피 통일 (커스텀 픽셀값 23곳 전량 제거)
       2. 섹션 헤더 크기 통일 (대학 페이지 text-lg→text-xl)
       3. 활성 상태 패턴 통일 (Header font-bold→font-semibold)
       5. 대학 페이지 브레드크럼 추가 (모든 대학 › 대학명)
       6. Toast 접근성 (role="status" aria-live="polite")
       7. Toast 변형+위치 (success/error 색상, md:bottom-8)
       8. BottomNav 글쓰기 아이콘 활성상태
       9. 로그아웃 Sheet 전환 (window.confirm 제거)
       10. 검색 빈상태 EmptyState 사용
[완료] npm run build 성공 (TypeScript 에러 없음)
[완료] Header 데스크톱 카테고리 네비 제거 (CategoryGrid와 중복 해소)
[완료] npm run build 성공 (TypeScript 에러 없음)
[완료] GitHub 푸시 완료
[완료] 3차 UI/UX 종합 검토 8건
       1. 캠톡 채팅 높이 오류 수정 (100dvh-112px)
       2. write/page.tsx window.confirm → Sheet 모달 (4곳)
       3. 캠톡 약속잡기 패널 → Sheet
       4. Header aria-label 추가 (5곳)
       5. 글쓰기 미리보기 → Sheet
       6. textarea 포커스 스타일 통일
       7. 브레드크럼 aria-label 추가
       8. PostCard 가격 null 방어
[완료] npm run build 성공 (TypeScript 에러 없음)
[완료] 4차 UI 통일성 개선 — 아이콘 라벨 + 활성 색상 + 네비 일관성
       1. 실시간 인기글 디폴트 접기 (useState false)
       2. Header 아이콘 텍스트 라벨 추가 (검색/글쓰기/캠톡/MY)
       3. IconToggle/ThemeToggle 텍스트 라벨 추가
       4. 글쓰기 버튼 아이콘화 (+ 아이콘 30x30)
       5. MY 아이콘 모바일 항상 표시 (hidden md:block 제거)
       6. BottomNav 활성 색상 blue→orange (시인성 개선)
       7. Header 활성 색상 orange 통일 (pathname 기반)
       8. 모바일 검색 동작 통일 (인라인→/search 페이지 이동)
[완료] 5차 UI/UX 종합 개선 — 사이드바 색상 통일 + 접근성 + 조회수 + hover 효과
       1. 사이드바 메뉴 활성 색상 blue-500→orange-400 통일
       2. 글쓰기 Link aria-label="글쓰기" 추가
       3. 글쓰기 아이콘 크기 30x30→24x24 조정
       4. Header 아이콘 라벨 text-[10px]→text-xs font-medium 통일
       5. Header 아이콘 gap-0→gap-0.5 통일
       6. IconToggle/ThemeToggle aria-label + gap/라벨 통일
       7. PostCard 조회수(viewCount) 표시 추가
       8. CategoryGrid hover:scale-105 효과 추가
       9. PopularPostsSection TOP 3 순위 배지 색상 차별화 (금/은/동)
[완료] GitHub 푸시 완료 (ca2ae6b)
[완료] 6차 UI 통일성 개선 — 검색 아이콘 + 로고 반응 + 카테고리 레이아웃 + 브레드크럼 통일
       1. 검색: 데스크톱 검색 입력폼 제거, 검색 아이콘만 항상 표시
       2. 로고(캠퍼스리스트) 활성 색상 반응 추가 (홈=orange-400, 그외=muted-foreground)
       3. CategoryGrid grid→flex 수평 스크롤 (1열 항상 표시)
       4. CategoryGrid 반응형 크기 (min-w-[4.5rem] flex-1, sm: 확대)
       5. 홈 페이지 브레드크럼 "모든 대학 ›" 추가
       6. 대학+카테고리 페이지 브레드크럼에 "모든 대학 ›" 루트 추가
       7. 게시글 상세 페이지 브레드크럼에 "모든 대학 ›" 루트 추가
       8. 전체 브레드크럼 스타일 통일 (text-sm text-muted-foreground)
       9. 전체 배너 크기 통일 (py-4, h1 text-xl font-bold)
```

---

## 다음 할 일 (TODO)

### 우선순위 높음

- [ ] 실제 사용 테스트 — `npm run dev`로 글쓰기 페이지에서 전체 기능 직접 확인
- [ ] 캠퍼스 선택 기능 점검 — 회원가입/프로필 편집에서 정상 작동 확인
- [ ] UI 전체 점검 — 모든 페이지 기능 확인 후 Supabase 연동 착수

### 우선순위 중간 (Supabase 연동 — `SUPABASE_MIGRATION_GUIDE.md` 참조)

- [ ] Supabase 프로젝트 생성 + 패키지 설치
- [ ] DB 테이블 생성 (12개 테이블 + 시드 데이터)
- [ ] 인증 시스템 전환 (Mock → Supabase Auth)
- [ ] 게시글 CRUD 전환 (localStorage → Supabase)
- [ ] 이미지 업로드 전환 (base64 → Supabase Storage)
- [ ] 찜/조회수/검색 전환
- [ ] 캠톡 실시간 채팅 (localStorage → Supabase Realtime)
- [ ] 캠노티 알림 전환
- [ ] RLS 보안 정책 설정

### 우선순위 낮음

- [ ] 글쓰기 예시 데이터 검수 — 46개 카테고리 예시 문구 품질 확인/수정
- [ ] 톤 변형 카테고리 확장 — 현재 10개 → 전체 46개
- [ ] 다크모드 대응 점검
- [ ] PWA / 모바일 최적화
- [ ] SEO 메타태그 설정
- [ ] 배포 (Vercel)

---

## 참고 사항

- `categoryExamples` (기존)과 `categoryExampleSets` (신규) 두 개의 export가 공존 — 하위 호환 유지
- User 타입에서 이름 필드는 `name`이 아닌 `nickname`
- `fillTemplate()`은 `{{prefix}}`, `{{university}}`, `{{department}}`, `{{memberType}}` 플레이스홀더 지원
- 톤 변형은 `title`과 `body`만 오버라이드, `price`/`tags`/`location`은 기본 예시 유지
- `spinIntervalRef`로 interval ID 관리, 컴포넌트 언마운트 시 자동 정리
- `isEditRef`로 수정 모드 동기 플래그 관리, React 배칭 타이밍 문제 방지
- Supabase 연동 시 snake_case ↔ camelCase 변환 유틸 필요
- Supabase 연동 상세 지시사항은 `SUPABASE_MIGRATION_GUIDE.md` 참조
- `PostAccess` = `'campus' | 'open'` — 소분류에만 적용, 대분류에는 undefined
- `CAMPUS_MEMBER_TYPES` = undergraduate, graduate, professor, staff, alumni — 권한 체크용 유지
- `isCampusBlocked()` — write/page.tsx useEffect 내 인라인 헬퍼, URL/드래프트/수정 3곳에서 사용
- `getCategoryGroups()` — 인자 없이 호출 (boardType 파라미터 제거됨)
- `app/ad/` 라우트는 완전 삭제됨 (리다이렉트 없음, 404 반환)
- Header `showMobileSearch` 제거됨 — 검색은 `/search` 페이지 아이콘으로 통일 (데스크톱 검색 입력폼도 제거)
- Header/BottomNav 활성 색상 `text-orange-400` 통일 — pathname 기반 활성/비활성 전환
- Header 아이콘 레이아웃: `flex h-auto flex-col items-center gap-0.5 px-2 py-1` + `text-xs font-medium` 라벨
- Header `currentUniSlug` — pathname에서 대학 slug 추출하여 카테고리 URL에 반영
- CategoryGrid — `'use client'` 제거, Sheet/useState 없는 순수 서버 컴포넌트로 변환
- `navigator.share()` — iOS/Android 네이티브 공유 시트, 미지원 브라우저는 클립보드 폴백
- CamTalk 게시글 제목 파싱 — 첫 메시지 `[제목]\n/post/id` 형식에서 정규식 추출
- 커스텀 픽셀 글자크기 전량 제거 완료 — `text-[Npx]` 패턴이 앱에 0개 (grep 확인)
- Toast `variant` — `toast('메시지')` 기존 호출 하위 호환, `toast('성공!', 'success')` 가능
- Header 활성 상태 표준: 탭형 `border-b-2 + font-medium`, 메뉴형 `font-semibold`
- 대학 페이지 브레드크럼 — 배너와 CategoryGrid 사이에 위치
- Header 데스크톱 카테고리 네비 제거됨 — CategoryGrid가 유일한 카테고리 진입점. 사이드 메뉴는 유지
- 캠톡 채팅 높이: 모바일 `100dvh-112px` (Header 56px + BottomNav 56px), 데스크톱 `100dvh-56px` (Header만)
- `confirmAction` state — write/page.tsx에서 'title'|'price'|'body'|'delete' 4개 케이스를 단일 Sheet로 관리
- 커스텀 오버레이 → Sheet 전환 원칙: 모든 바텀시트/모달을 shadcn Sheet로 통일 (포커스 트랩, Escape, 접근성)
- Header 접근성: 모든 아이콘 버튼에 aria-label 적용 완료 (검색, 메뉴, 캠톡, 마이페이지)
- textarea 포커스 패턴: `border-input` + `focus-visible:border-ring` + `focus-visible:ring-ring/50` (Input과 동일)
- 로고(캠퍼스리스트) 활성 색상: `isHome ? 'text-orange-400' : 'text-muted-foreground'` — 다른 아이콘과 동일 패턴
- CategoryGrid — flex 수평 스크롤 레이아웃, `min-w-[4.5rem] flex-1`로 반응형 크기, `overflow-x-auto scrollbar-hide`
- 브레드크럼 통일 패턴: `text-sm text-muted-foreground` + `hover:text-foreground hover:underline` + 루트 "모든 대학 ›"
- 배너 통일 패턴: `bg-blue-950/30 px-4 py-4` + `h1 text-xl font-bold text-blue-400`
- PopularPostsSection 순위 색상: 1위 yellow-500, 2위 gray-400, 3위 amber-600, 4위이후 orange-500
