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
| 캠퍼스톡 | `/camtalk`, `/camtalk/[id]` | 1:1 채팅 |
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
| `9b6c10c` | feat: UI/UX 전면 개선 14건 (이미지/헤더/카테고리/검색/캠퍼스톡 등) |
| `793cdae` | refactor: 디자인 통일성 개선 9건 (타이포/활성상태/Toast/Sheet 등) |
| `597dc4e` | fix: Header 데스크톱 카테고리 네비 제거 (CategoryGrid와 중복 해소) |
| `8052896` | refactor: 3차 UI/UX 종합 검토 8건 (버그 수정, Sheet 전환, 접근성) |
| `016fda0` | refactor: 4차 UI 통일성 개선 — 아이콘 라벨, 활성 색상, 네비 일관성 |
| `ca2ae6b` | refactor: 5차 UI/UX 종합 개선 — 사이드바 색상 통일, 접근성, 조회수, hover |
| `98ccd5c` | refactor: 6차 UI 통일성 개선 — 검색 아이콘, 로고 반응, 카테고리 레이아웃, 브레드크럼 |
| `29f51cc` | feat: 카테고리 페이지에 CategoryGrid 유지 — 대분류 네비게이션 일관성 |
| `49a856e` | refactor: 7차 UI/UX 개선 — 햄버거 메뉴, 브레드크럼, 대학 전환, 소분류 Badge |
| `b559e1b` | refactor: 8차 UI/UX 개선 — 글쓰기 카테고리 pre-selection + 브레드크럼 스타일 통일 |
| `1f4fe28` | refactor: 9차 UI/UX 개선 — 글쓰기 페이지 레이아웃 브라우징과 완전 동일화 |
| `848d8ce` | refactor: 수직 간격 대폭 압축 — 25개 파일 40~60% 수직 공간 축소 + NOTES.md 업데이트 |
| `2924d29` | feat: 글쓰기 UI 개선 8건 — 문체/샘플 버튼 디자인 + 랜덤 알고리즘 + "다른 사람 글 가져오기" 기능 |
| `0daaead` | feat: 글쓰기 "다른 사람 글 가져오기" 개선 3건 — 인기순 정렬 + 경고 문구 + 목록 이동 |
| `264f1a7` | fix+refactor: 글쓰기 UI 개선 4건 — 문체 prefix 버그 수정 + 완성도/버튼 1줄 압축 |
| `(이전)` | fix+refactor: 글쓰기 버그 수정 + UI 압축 3건 — prefix 대학 버그 + 완성도 글자 + 브레드크럼 |
| (현재) | feat: 회원가입 3-Step 분리 — 캠퍼스 이메일 인증 + 외부 회원 플로우 분리 |

---

## 완료된 작업

### 1. 캠퍼스톡 univPrefix 수정

**파일**: `campulist/src/app/camtalk/[id]/page.tsx`

캠퍼스톡 메시지의 대학 접두어가 캠퍼스 `region` 대신 캠퍼스 `name`을 사용하도록 변경.

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
| 7 | 캠퍼스톡 Realtime — localStorage 채팅 → Supabase Realtime |
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

**B3. 캠퍼스톡 대화목록에 게시글 정보 추가**
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

**C7. 캠퍼스톡 뒤로가기 → 목록으로**
- `router.back()` → `router.push('/camtalk')` — 항상 캠퍼스톡 목록으로

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
| 1 | **캠퍼스톡 채팅 높이 오류 수정** | `app/camtalk/[id]/page.tsx` | 버그 |
| 2 | **window.confirm → Sheet 모달 (4곳)** | `app/write/page.tsx` | UX 일관성 |
| 3 | **캠퍼스톡 약속잡기 패널 → Sheet** | `app/camtalk/[id]/page.tsx` | 디자인 통일 |
| 4 | **Header aria-label 추가 (5곳)** | `components/layout/Header.tsx` | 접근성 |
| 5 | **글쓰기 미리보기 → Sheet** | `app/write/page.tsx` | 디자인 통일 |
| 6 | **textarea 포커스 스타일 통일** | `app/write/page.tsx` | 디자인 통일 |
| 7 | **브레드크럼 aria-label 추가** | `app/[university]/page.tsx` | 접근성 |
| 8 | **PostCard 가격 null 방어** | `components/post/PostCard.tsx` | 방어적 코딩 |

#### 1. 캠퍼스톡 채팅 높이 오류 수정

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

#### 3. 캠퍼스톡 약속잡기 패널 → Sheet

커스텀 오버레이(`fixed inset-0 z-40 bg-black/50` + 직접 구현 바텀시트)를
shadcn Sheet 컴포넌트로 교체. 포커스 트랩, Escape 닫기, 접근성 자동 확보.

#### 4. Header aria-label 추가 (5곳)

| 요소 | 추가한 aria-label |
|------|-------------------|
| 모바일 검색 닫기 버튼 | `aria-label="검색 닫기"` |
| 햄버거 메뉴 버튼 | `aria-label="메뉴 열기"` |
| 모바일 검색 버튼 | `aria-label="검색"` |
| 캠퍼스톡 버튼 | `aria-label="캠퍼스톡"` |
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

- 검색, 글쓰기, 캠퍼스톡, MY 아이콘 아래에 `text-[10px]` 텍스트 라벨 추가
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
[완료] 캠퍼스톡 univPrefix 수정
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
       B3. 캠퍼스톡 대화목록 게시글 제목 표시
       B4. 하단 고정바 본문 제거 (가격만 표시)
       C2. 필터/정렬 <a>→<Link> (클라이언트 네비게이션)
       C3. ShareButton Web Share API
       C4. 삭제 확인 Sheet 모달
       C5. PostCard 이미지 lazy loading
       C6. 회원가입 유형 2그룹 분리
       C7. 캠퍼스톡 뒤로가기 → 목록으로
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
       1. 캠퍼스톡 채팅 높이 오류 수정 (100dvh-112px)
       2. write/page.tsx window.confirm → Sheet 모달 (4곳)
       3. 캠퍼스톡 약속잡기 패널 → Sheet
       4. Header aria-label 추가 (5곳)
       5. 글쓰기 미리보기 → Sheet
       6. textarea 포커스 스타일 통일
       7. 브레드크럼 aria-label 추가
       8. PostCard 가격 null 방어
[완료] npm run build 성공 (TypeScript 에러 없음)
[완료] 4차 UI 통일성 개선 — 아이콘 라벨 + 활성 색상 + 네비 일관성
       1. 실시간 인기글 디폴트 접기 (useState false)
       2. Header 아이콘 텍스트 라벨 추가 (검색/글쓰기/캠퍼스톡/MY)
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
[완료] GitHub 푸시 완료 (98ccd5c)
[완료] CategoryGrid 카테고리 페이지 유지 — 대분류 네비게이션 일관성
       1. CategoryGrid에 activeSlug prop 추가 (선택된 카테고리 하이라이트)
       2. 활성 스타일: border-blue-500 bg-blue-500/10 + text-blue-500
       3. all/[category] 페이지에 CategoryGrid 추가 (브레드크럼↔소분류 사이)
       4. [university]/[category] 페이지에 CategoryGrid 추가 (universitySlug 전달)
[완료] 7차 UI/UX 개선 — 햄버거 메뉴, 브레드크럼, 대학 전환, 소분류 Badge
       1. 햄버거 메뉴 항상 표시 (md:hidden 제거) + "메뉴" 라벨 + 아이콘 28x28 확대
       2. 햄버거 클릭 오렌지 피드백 (menuHighlight 분리 상태 + 30ms 딜레이)
       3. 로고 서브타이틀 변경 → "Campu(s)+LIST+.COM=CAMPuLIST.COM"
       4. Sheet 닫기 버튼 확대 (size-4→size-6, p-1, rounded-md)
       5. 브레드크럼 크기+색상 개선 (text-base, 전체 오렌지 톤, 현재 페이지 font-semibold)
       6. 대학 전환 시 카테고리 컨텍스트 유지 (UniversityTabs + Header sidebar)
       7. 소분류 Badge 가시성 개선 (text-sm, 두꺼운 테두리+굵은 글씨 활성, 오렌지 톤)
[완료] 8차 UI/UX 개선 — 글쓰기 카테고리 pre-selection + 브레드크럼 스타일 통일
       1. 글쓰기 카테고리 뷰에서 pre-selected 대분류 시각적 강조 (오렌지 ring + 배경 + "선택됨")
       2. pre-selected 대분류 자동 스크롤 (useEffect + scrollIntoView)
       3. CategorySummary 브레드크럼 스타일 통일 (blue→orange, text-lg→text-base, 풀네임)
[완료] 9차 UI/UX 개선 — 글쓰기 페이지 레이아웃 브라우징과 완전 동일화
       1. WriteUniversityTabs 컴포넌트 생성 (state 기반 대학 탭)
       2. WriteCategoryGrid 컴포넌트 생성 (state 기반 카테고리 아이콘 그리드)
       3. 글쓰기 페이지 레이아웃 재구성: UniversityTabs → 배너 → 브레드크럼 → CategoryGrid → 소분류 Badge → 폼
       4. 라운드 대학 버튼 제거 → 수평 탭 바 (브라우징과 동일)
       5. 2열 카테고리 텍스트 그리드 제거 → 수평 아이콘 스크롤 (브라우징과 동일)
       6. 소분류 배지 추가 (오렌지 톤, 잠금 표시, 브라우징과 동일)
       7. CategorySummary 제거 (상단 브레드크럼으로 대체)
[완료] 수직 간격 대폭 압축 — 25개 파일 전체 (40~60% 수직 공간 축소)
       Phase 1: 공유 컴포넌트 7개 (UniversityTabs, CategoryGrid, PostCard, PopularPosts, Header 등)
       Phase 2: 주요 페이지 10개 (홈, 대학별, 카테고리별, 검색, 인증, 마이페이지, 캠퍼스톡 등)
       Phase 3: 글쓰기 페이지 (168줄 변경)
       Phase 4: 기타 페이지 7개 (알림, 소개, 프로필, 개인정보, 약관, PostBottomAction, ContactMethods)
[완료] npm run build 성공 (JSX 주석 배치 오류 4건 수정 포함)
[완료] Mock Auth PDCA Gap Analysis v2.0 — 99% Match Rate (4건 Gap 전부 해결)
```

### 15. 7차 UI/UX 개선 — 햄버거 메뉴 + 브레드크럼 + 대학 전환 + 소분류 Badge (8개 파일 수정)

#### 수정 파일 목록 (8개)

| # | 수정 내용 | 파일 | 유형 |
|---|----------|------|------|
| 1 | **햄버거 메뉴 항상 표시 + 오렌지 피드백** | `components/layout/Header.tsx` | UX |
| 2 | **로고 서브타이틀 변경** | `components/layout/Header.tsx` | 디자인 |
| 3 | **Sheet 닫기 버튼 확대** | `components/ui/sheet.tsx` | UX |
| 4 | **브레드크럼 크기+색상 (오렌지)** | `app/page.tsx` 외 4개 | 시인성 |
| 5 | **대학 전환 시 카테고리 유지** | `components/post/UniversityTabs.tsx` | 네비게이션 |
| 6 | **대학 전환 시 카테고리 유지** | `components/layout/Header.tsx` | 네비게이션 |
| 7 | **소분류 Badge 가시성 개선** | `app/[university]/[category]/page.tsx` | 시인성 |
| 8 | **소분류 Badge 가시성 개선** | `app/all/[category]/page.tsx` | 시인성 |

#### 1. 햄버거 메뉴 항상 표시 + 오렌지 클릭 피드백

**파일**: `components/layout/Header.tsx`

- `md:hidden` 제거 → 데스크톱에서도 항상 표시
- `<Button>` → `<button>` 변경 (shadcn 스타일 충돌 방지)
- "메뉴" 라벨 추가 (다른 아이콘과 동일 패턴)
- 아이콘 20x20 → 28x28, strokeWidth 2 → 2.5 (시인성)
- `menuHighlight` 상태 분리: 클릭 시 즉시 오렌지 → 30ms 후 Sheet 열림
- `SheetTrigger` 제거 → 수동 `handleMenuClick` + `handleSheetChange`

#### 2. 로고 서브타이틀 변경

`Campulist.com` → `Campu(s)+LIST+.COM=CAMPuLIST.COM` (데스크톱 전용 `hidden md:block`)

#### 3. Sheet 닫기 버튼 확대

**파일**: `components/ui/sheet.tsx`

- XIcon `size-4` → `size-6`
- `p-1` 패딩 추가 (터치 타겟 확대)
- `rounded-xs` → `rounded-md`

#### 4. 브레드크럼 크기+색상 (오렌지 톤 통일)

**파일**: 5개 페이지

- 글자 크기: `text-sm` → `text-base`
- 링크: `text-orange-400 hover:text-orange-300 hover:underline`
- 현재 페이지: `font-semibold text-orange-400`
- 구분자 `›`: `text-orange-300`
- 전체 오렌지 톤으로 통일, 현재 위치만 굵은 글씨로 구분

#### 5-6. 대학 전환 시 카테고리 컨텍스트 유지

**파일**: `UniversityTabs.tsx`, `Header.tsx`

**문제**: `/한예종/housing`에서 서울대 클릭 → `/서울대`로 이동 (카테고리 사라짐)
**해결**: pathname에서 카테고리 slug 추출하여 대학 링크에 반영

```tsx
const pathParts = pathname.split('/').filter(Boolean);
const currentCatSlug = pathParts[1] && majorCategories.some(c => c.slug === pathParts[1])
  ? pathParts[1] : null;

// 대학 탭: /${uni.slug}/${currentCatSlug}${qs}
// 모든 대학 탭: /all/${currentCatSlug}${qs}
```

- UniversityTabs: searchParams(minor, sort)도 유지
- Header sidebar: 대분류만 유지 (searchParams 제외)

#### 7-8. 소분류 Badge 가시성 개선

**파일**: `[university]/[category]/page.tsx`, `all/[category]/page.tsx`

- 글자 크기: `text-xs` → `text-sm` + `px-3 py-1` (패딩 확대)
- 활성: `bg-orange-400 text-white` → `border-2 border-orange-500 text-orange-600 font-bold` (배경 없이 두꺼운 테두리+굵은 글씨)
- 비활성: `border-orange-400 text-orange-600 dark:text-orange-300`
- 정렬 옵션(최신순 등)은 기존 블루 스타일 유지

### 16. 8차 UI/UX 개선 — 글쓰기 카테고리 pre-selection + 브레드크럼 스타일 통일 (2개 파일 수정)

#### 수정 파일 목록 (2개)

| # | 수정 내용 | 파일 | 유형 |
|---|----------|------|------|
| 1 | **카테고리 뷰 pre-selected 대분류 강조** | `app/write/page.tsx` | UX |
| 2 | **pre-selected 대분류 자동 스크롤** | `app/write/page.tsx` | UX |
| 3 | **CategorySummary 브레드크럼 스타일 통일** | `components/write/CategorySummary.tsx` | 디자인 통일 |

#### 1. 글쓰기 카테고리 뷰 — pre-selected 대분류 시각적 강조

**파일**: `app/write/page.tsx`

브레드크럼 "모든 대학 › 한예종 › 주거"에서 글쓰기 클릭 시, `getWriteUrl()`이 `/write?uni=karts&major=housing`을 생성하고 글쓰기 페이지에서 대학교+대분류를 자동 설정하는 기능은 이미 구현되어 있었으나, 카테고리 선택 뷰에서 pre-selected 대분류가 **시각적으로 구분되지 않는** 문제.

**해결**: 캠퍼스 회원 뷰 + 비캠퍼스 회원 뷰 양쪽에 동일 적용

```tsx
<div
  id={`major-group-${major.id}`}
  className={`mb-3 break-inside-avoid ${
    majorId === major.id
      ? 'rounded-lg bg-orange-50 ring-2 ring-orange-300 p-2 dark:bg-orange-950/30 dark:ring-orange-700'
      : ''
  }`}
>
  <span className={`text-lg font-bold ${majorId === major.id ? 'text-orange-500' : ''}`}>
    {major.name}
  </span>
  {majorId === major.id && <span className="ml-auto text-xs font-medium text-orange-500">선택됨</span>}
```

#### 2. pre-selected 대분류 자동 스크롤

```tsx
useEffect(() => {
  if (majorId && step !== 'form') {
    const timer = setTimeout(() => {
      const el = document.getElementById(`major-group-${majorId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    return () => clearTimeout(timer);
  }
}, [step, majorId]);
```

#### 3. CategorySummary 브레드크럼 스타일 통일

**파일**: `components/write/CategorySummary.tsx`

글쓰기 폼 상단의 카테고리 요약 브레드크럼이 일반 페이지와 불일치.

| 항목 | Before (블루) | After (오렌지 통일) |
|------|-------------|-------------------|
| 글자 크기 | `text-lg` | `text-base` |
| 글자 색상 | `text-blue-600 dark:text-blue-400` | `text-orange-400` |
| 구분자 | `text-blue-400/50` | `text-orange-300` |
| 배경 | `bg-blue-500/10 rounded-lg` | 없음 |
| 대학명 | 축약형 ("고려대") | 풀네임 ("고려대학교") |
| "모든 대학" | 없음 | 추가 |
| 마지막 항목 | `font-bold` | `font-semibold` |
| 변경 버튼 | `text-blue-500` | `text-orange-400 hover:text-orange-300` |
| aria-label | 없음 | `브레드크럼` 추가 |

### 17. 9차 UI/UX 개선 — 글쓰기 페이지 레이아웃 브라우징과 완전 동일화 (3개 파일 수정/생성)

**목표**: 글쓰기 페이지를 브라우징 페이지(`/[university]/[category]`)와 완전히 동일한 레이아웃으로 재구성.
브라우징 시 보던 화면 구성(대학탭, 배너, 브레드크럼, 카테고리 아이콘, 소분류 Badge)을 유지한 상태에서 글쓰기.

#### 수정/생성 파일 목록 (3개)

| # | 파일 | 변경 내용 | 유형 |
|---|------|----------|------|
| 1 | `components/write/WriteUniversityTabs.tsx` | **신규** — state 기반 대학 탭 컴포넌트 | 신규 |
| 2 | `components/write/WriteCategoryGrid.tsx` | **신규** — state 기반 카테고리 아이콘 그리드 | 신규 |
| 3 | `app/write/page.tsx` | 레이아웃 전면 재구성 | 리팩터링 |

#### Before vs After 레이아웃 비교

**Before (글쓰기 페이지)**:
```
타이틀 ("카테고리 선택" / "글쓰기")
라운드 대학 버튼 (서울대 / 연세대 / 고려대 ...)
2열 카테고리 텍스트 그리드 (대분류 + 소분류 텍스트 나열)
→ 소분류 클릭 시 → 글쓰기 폼
```

**After (브라우징과 동일)**:
```
WriteUniversityTabs (수평 대학 탭 바)
대학 정보 배너 (bg-blue-950/30, 대학명, 지역, 영문명)
브레드크럼 (모든 대학 › 서울대학교 › 📦 중고마켓 › 전공서적)
WriteCategoryGrid (수평 아이콘 스크롤, 7개 대분류)
소분류 Badge (수평 스크롤, 오렌지 톤, 잠금 표시)
→ 소분류 선택 시 → 글쓰기 폼
```

#### 1. WriteUniversityTabs 컴포넌트 (신규)

**파일**: `components/write/WriteUniversityTabs.tsx`

UniversityTabs의 state 기반 버전. `<Link>` 대신 `<button>` + `onSelect` 콜백 사용.
대학 탭 클릭 시 페이지 이동 없이 `setUniversityId()` 호출.

```tsx
interface Props {
  selectedId: number;
  onSelect: (id: number) => void;
}
```

- 브라우징 UniversityTabs와 동일한 스타일 (border-b-2, text-blue-500 활성)
- 우측 그라데이션 fade 효과
- "모든 대학" 탭은 미포함 (글쓰기는 항상 특정 대학 대상)

#### 2. WriteCategoryGrid 컴포넌트 (신규)

**파일**: `components/write/WriteCategoryGrid.tsx`

CategoryGrid의 state 기반 버전. `<Link>` 대신 `<button>` + `onSelect` 콜백 사용.
카테고리 아이콘 클릭 시 페이지 이동 없이 `handleMajorSelect()` 호출.

```tsx
interface Props {
  activeId: number | null;
  onSelect: (id: number) => void;
}
```

- 브라우징 CategoryGrid와 동일한 스타일 (flex 수평 스크롤, 아이콘 3xl, border 활성)
- `activeId`로 선택된 대분류 하이라이트

#### 3. write/page.tsx 레이아웃 재구성

**주요 변경 사항**:

| 항목 | Before | After |
|------|--------|-------|
| 외부 래퍼 | `<div className="px-4 py-6">` | `<div>` (패딩 없음, 각 섹션이 자체 패딩) |
| 대학 선택 | 라운드 버튼 5개 | WriteUniversityTabs 수평 탭 |
| 대학 정보 | 없음 | 배너 (`bg-blue-950/30`, name, region, nameEn) |
| 브레드크럼 | 폼 안 CategorySummary | 상단 고정 nav (오렌지 톤) |
| 카테고리 | 2열 텍스트 그리드 (columns-2) | WriteCategoryGrid 아이콘 수평 스크롤 |
| 소분류 | 카테고리 그리드 내 텍스트 버튼 | Badge 수평 스크롤 (오렌지 톤, 잠금 표시) |
| 폼 래퍼 | `<div className="mt-6">` | `<div className="px-4 py-4">` |

**추가된 computed values**:
```tsx
const selectedUni = universities.find(u => u.id === universityId);
const selectedMajor = majorId ? majorCategories.find(c => c.id === majorId) ?? null : null;
const currentMinors = majorId ? getMinorCategories(majorId) : [];
const selectedMinor = minorId ? currentMinors.find(c => c.id === minorId) ?? null : null;
const isCampusMember = user ? CAMPUS_MEMBER_TYPES.includes(user.memberType) : true;
```

**추가된 handler 함수**:
```tsx
handleMajorSelect(id)  // 대분류 클릭 → majorId 설정, minorId 초기화
handleMinorSelect(id)  // 소분류 클릭 → campus 접근 체크 → minorId 설정, form 진입
handleChangeCategory() // 변경됨: minorId도 초기화
```

**삭제된 항목**:
- `import CategorySummary` → `import WriteUniversityTabs, WriteCategoryGrid`
- `import getCategoryGroups` → `import getMinorCategories, majorCategories`
- auto-scroll useEffect (major-group DOM 엘리먼트 없음)
- 2열 카테고리 그리드 전체 (캠퍼스/비캠퍼스 분기)
- CategorySummary 렌더링 (브레드크럼으로 대체)
- `showLocked` state (더 이상 사용 안 함)

**소분류 Badge 접근 제어**:
- campus 전용 소분류: `🔒` 아이콘 + `border-border text-muted-foreground/50 cursor-not-allowed`
- open 소분류: `border-orange-400 text-orange-600` (브라우징과 동일)
- 선택된 소분류: `border-2 border-orange-500 text-orange-600 font-bold` (브라우징과 동일)
- 비캠퍼스 회원이 campus 소분류 클릭 시 토스트 안내

---

### 18. 수직 간격 대폭 압축 — 25개 파일 전체 압축 (2026-02-24)

**목적**: 화면 정보 밀도를 높이기 위해 전체 앱의 수직 공간(패딩, 마진, gap)을 40~60% 압축.
텍스트 크기, 좌우 패딩, 색상, border-radius 등 브랜드 스타일은 유지.

#### 압축 규칙

| 대상 | 축소율 | 예시 |
|------|--------|------|
| 섹션/컨테이너 수직 패딩 | 40-50% | py-6→py-3, py-4→py-2 |
| 버튼/인터랙티브 패딩 | 40-50% (min 36px) | py-3→py-2, py-2.5→py-1.5 |
| Gap/Space-y | 50-60% | space-y-4→space-y-2, gap-3→gap-1.5 |
| 마진 | 40-50% | mt-4→mt-2, mb-3→mb-1.5, my-6→my-3 |

**변경 안 함**: font-size, px-/mx- (좌우 패딩), 색상, border-radius, 구조적 패딩(pb-36, pb-24, pb-16)

#### 수정 파일 목록 (25개)

**Phase 1: 공유 컴포넌트 (7개)**
| 파일 | 주요 변경 |
|------|----------|
| `components/post/UniversityTabs.tsx` | py-3→py-2 |
| `components/write/WriteUniversityTabs.tsx` | py-3→py-2 |
| `components/post/CategoryGrid.tsx` | py-4→py-2, gap-2→gap-1.5 |
| `components/write/WriteCategoryGrid.tsx` | 동일 |
| `components/post/PostCard.tsx` | py-5→py-3, gap-4→gap-2 |
| `components/post/PopularPostsSection.tsx` | py-4→py-2, gap-3→gap-1.5, p-3.5→p-2 |
| `components/layout/Header.tsx` | gap-3→gap-1.5, gap-4→gap-2, my-2→my-1 |

**Phase 2: 주요 페이지 (10개)**
| 파일 | 주요 변경 |
|------|----------|
| `app/page.tsx` | 배너 py-4→py-2, 브레드크럼 py-2→py-1 |
| `app/[university]/page.tsx` | 동일 패턴 |
| `app/[university]/[category]/page.tsx` | 소분류 py-3→py-1.5, 정렬 pb-3→pb-1.5 |
| `app/all/[category]/page.tsx` | 동일 패턴 |
| `app/post/[id]/page.tsx` | py-4→py-2, gap-3→gap-1.5, my-4→my-2 |
| `app/search/page.tsx` | 패딩/gap 압축 |
| `app/auth/page.tsx` | py-12→py-6, mb-8→mb-4, space-y-4→space-y-2 |
| `app/my/page.tsx` | py-6→py-3, gap-4→gap-2, space-y-4→space-y-2 |
| `app/camtalk/page.tsx` | py-4→py-2, gap-2→gap-1.5 |
| `app/camtalk/[id]/page.tsx` | py-3→py-1.5, gap-3→gap-1.5, space-y-4→space-y-2 |

**Phase 3: 글쓰기 페이지**
| 파일 | 주요 변경 |
|------|----------|
| `app/write/page.tsx` | space-y-5→space-y-2.5, py-6→py-3, mb/mt/gap 전체 압축 (168줄 변경) |

**Phase 4: 기타 페이지 및 컴포넌트 (7개)**
| 파일 | 주요 변경 |
|------|----------|
| `app/camnotif/page.tsx` | py-3→py-1.5, gap-3→gap-1.5 |
| `app/about/page.tsx` | py-6→py-3, space-y-4→space-y-2, mt-6→mt-3 |
| `app/user/[id]/page.tsx` | py-6→py-3, gap-4→gap-2 |
| `app/privacy/page.tsx` | py-6→py-3, space-y-4→space-y-2, mt-8→mt-4 |
| `app/terms/page.tsx` | 동일 패턴 |
| `components/post/PostBottomAction.tsx` | space-y-2→space-y-1, pb-6→pb-3 |
| `components/post/ContactMethodsDisplay.tsx` | mt-4→mt-2, p-3.5→p-2, space-y-2→space-y-1 |

#### 주석 규칙
모든 변경 위치에 `{/* 간격 압축: 기존값 → 변경값 */}` 인라인 주석 표기.

#### 빌드 검증
- `npm run build` 성공 (17개 라우트 전체 컴파일 완료)
- JSX 주석 배치 오류 4건 수정 (return 루트 sibling, 조건부 표현식 내부)

### 19. 글쓰기 UI 개선 8건 — 문체/샘플 버튼 디자인 + 랜덤 알고리즘 + 다른 사람 글 가져오기 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`, `campulist/src/data/categoryExamples.ts`

#### 1. 문체 선택기 항상 표시
- 이전: `exSet?.tones` 조건부 렌더링 → 10/46 카테고리에서만 표시
- 변경: 조건 제거, 모든 카테고리에서 표시 (`applyTone`이 tones 없으면 원본 반환)

#### 2. 시즌 힌트 기능 삭제
- `getCurrentSeason()`, `SEASON_LABELS`, 시즌 배지 UI 삭제 (write/page.tsx)
- `seasonalHints` 인터페이스 필드 + 9개 카테고리 데이터 삭제 (categoryExamples.ts)

#### 3. 문체 선택기 스타일 개선 — 오렌지 Badge 스타일
| 요소 | Before | After |
|------|--------|-------|
| 글자 크기 | text-xs | text-sm |
| 패딩 | px-2 py-0.5 | px-3 py-1 |
| 색상 | blue 계열 | orange 계열 (소분류 Badge와 통일) |
| "문체:" 라벨 | text-xs 흐린 회색 | text-lg font-bold text-foreground |

#### 4. 샘플 채우기 버튼 디자인 변경
- 버튼 이름: `📝 미리 준비된 샘플 글로 일단 채워보기` → `샘플 글로 채워보기 · 누를 때마다 랜덤!`
- 아이콘 📝 제거, 서브텍스트 버튼 안에 통합
- 스타일: 오렌지 테두리 (`rounded-full border-2 border-orange-500`)
- 반응형 글자: `text-[clamp(0.65rem,2.8vw,1rem)]` + `whitespace-nowrap` (1줄 유지)

#### 5. 샘플 채우기 동작 변경 — 항상 모든 필드 교체
- 이전: 빈 필드만 채움 → "모든 필드가 이미 작성되어 있어요!" 경고
- 변경: 매번 모든 필드를 새 샘플로 교체 (prefix `[대학][학부생]` 자동 유지)
- 토스트: "샘플로 채워졌어요!"
- "이미 작성되어 있어요" 경고 삭제

#### 6. 랜덤 반복 방지 알고리즘
- `lastExampleIdxRef` (useRef)로 이전 선택 인덱스 기억
- 같은 인덱스가 나오면 최대 5회 재시도
- `exExamples.length > 1` 조건으로 샘플 1개 카테고리에서 재시도 건너뜀
- 반복 확률: 2개 샘플 50%→3.1%, 3개 샘플 33%→0.4%

#### 7. "다른 사람 글 가져와서 고치기" 기능 (신규)
- 샘플 버튼 아래에 새 버튼 추가
- 같은 소분류 게시글 조회 (getPosts) → 본인 글 제외, 최대 10개
- Bottom Sheet에 글 목록 표시 (제목 + 본문 요약 + 작성자 + 가격)
- 선택 시 `getPostDetail()`로 전체 내용 조회
- 제목의 다른 사람 prefix → 내 prefix로 교체 (`[서울대][학부생]`)
- 내용, 가격, 태그, 장소 채움 (이미지는 복사 안 함)
- 토스트: "가져온 글을 자유롭게 수정하세요!"

#### 8. 기타
- 서브텍스트 변경: "작성한 내용은 그대로 유지돼요 · 누를 때마다 새로운 샘플!" → "누를 때마다 랜덤으로 새로운 샘플!" → 버튼에 통합

### 20. 글쓰기 "다른 사람 글 가져오기" 개선 3건 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

#### 1. 다른 사람 글 목록 정렬 변경 — 최신순 → 인기순
- **변경**: `fetchOtherPosts`에서 `sortBy: 'latest'` → `sortBy: 'popular'`
- **이유**: 인기 있는 글을 참고하는 것이 더 유용
- `PostFilters.sortBy` 타입에 `'popular'` 옵션이 이미 정의되어 있어 1줄 변경으로 완료

#### 2. 다른 사람 글 가져온 후 경고 안내 문구 추가
- `fillFromOtherPost` 함수에서 필드 채울 때 수정 유도 문구 삽입
- 사용자가 다른 사람의 글을 그대로 게시하지 않고 수정하도록 유도

| 필드 | 추가 문구 |
|------|----------|
| 제목 | ` — 제목을 내 것으로 고쳐주세요!` (뒤에 붙임) |
| 내용 | `\n\n— 다른 사람의 글입니다. 내용을 내 것으로 고쳐주세요!` (마지막에 추가) |
| 장소 | ` — 장소를 내 것으로 고쳐주세요!` (뒤에 붙임) |
| 가격 | 숫자이므로 문구 없음 (하이라이트로 표시) |

#### 3. 글쓰기 완료 후 이동 경로 변경 — 상세 페이지 → 카테고리 목록
- **이전**: 글 등록 후 `router.push(/post/{id})` → 내 글 상세 페이지로 이동
- **변경**: `router.push(/{대학slug}/{대분류slug}?minor={소분류slug})` → 카테고리 목록으로 이동
- **이유**: 방금 쓴 글이 목록에 정상적으로 노출되는지 사용자가 직접 확인 가능
- 목록은 기본 최신순 정렬이므로 방금 쓴 글이 최상단에 표시
- slug 조회 실패 시 기존처럼 상세 페이지로 fallback

### 21. 글쓰기 UI 개선 4건 — 문체 prefix 버그 수정 + 완성도/버튼 1줄 압축 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

#### 1. 친근/급매/유머 문체 — 제목 prefix 누락 버그 수정
- **원인**: `applyTone()`이 `tones[tone].title`로 덮어쓰는데, tones 데이터에 `{{prefix}}`가 없음
- **수정**: `fillSmartExamples`, `fillTitleExample`, `handleConfirmAction` 3곳에서 `fillTemplate()` 결과에 prefix 없으면 `startsWith`로 감지하여 강제 추가
- "깔끔" 문체는 원본에 `{{prefix}}`가 있어 정상이었음

#### 2. 완성도 점수 3줄 → 1줄 압축
- Before: 라벨+점수 / 프로그레스 바 / 힌트 (3줄)
- After: `flex items-center gap-2`로 한 줄 배치 (라벨+점수 + 짧은 바 + 힌트)
- 글자 크기: `text-xs` → `text-sm font-bold` (가독성 개선)
- 프로그레스 바: `w-full h-2` → `w-20 h-2`
- `60/100` 텍스트 제거

#### 3. 샘플/다른글 버튼 2줄 → 1줄 가로 배치
- Before: `w-full` 세로 2줄
- After: `flex gap-2` + `flex-1` 가로 50:50 배치
- 버튼 이름 축약: `샘플 채우기 · 랜덤!` / `다른 글 가져와 고치기`

#### 4. 완성도 영역 글자 크기 확대
- 라벨: `text-xs font-medium` → `text-sm font-bold`
- 힌트: `text-xs` → `text-sm`
- 패딩: `py-1` → `py-1.5`

### 22. 글쓰기 버그 수정 + UI 개선 3건 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

#### 1. 다른 학교 카테고리에서 글쓰기 시 prefix 대학 이름 버그 수정
- **원인**: prefix 생성 시 `universityId`(URL 파라미터 기반 상태값)를 사용 → 다른 학교 이름이 들어감
- **수정**: 9곳에서 `universityId` → `user.universityId`(사용자 소속)로 변경
- 영향 함수: `fillTitleExample`, `fillBodyExample`, `handleConfirmAction`, `fillSmartExamples`, `fillFromOtherPost`, spinner animation

#### 2. 완성도 점수 글자 크기 추가 확대
- 라벨: `text-sm font-bold`, 힌트: `text-sm`, 바: `h-2 w-20`

#### 3. 브레드크럼 "✏️ 글쓰기" → "카테고리 선택" 수정
- 대분류 미선택 시 `모든 대학 › KAIST › ✏️ 글쓰기` → `모든 대학 › KAIST › 카테고리 선택`
- "글쓰기"는 페이지 이름이지 경로가 아니므로 브레드크럼에 부적절

### Mock Auth PDCA Gap Analysis v2.0 결과 (2026-02-24 확인)

**Overall Match Rate: 99%**

| 카테고리 | 점수 | v1.0 | 변화 |
|---------|:----:|:----:|:----:|
| Feature Match | 100% | 95% | +5% |
| Data Model Match | 97% | 97% | 0% |
| UI/Screen Match | 100% | 100% | 0% |
| Architecture | 100% | 93% | +7% |
| Convention | 100% | 97% | +3% |
| **Overall** | **99%** | **96%** | **+3%** |

**해결된 Gap 4건:**
- G-01 (Critical): `createPost`가 `authorId`를 파라미터로 받도록 수정
- G-02 (Low): `CURRENT_USER_ID` export 완전 제거
- G-05 (Low): 하드코딩된 storage key → `STORAGE_KEYS.CHAT_OVERRIDES`
- G-06 (Medium): `/chat` 페이지에 `AuthGuard` 래핑 추가

**Match Rate 변화 이력:**
```
Check-1: 52% → Check-3: 76% → Check-4: 88% → Check-5: 93% → Check-6: 96% → mock-auth v2: 99%
```

### 23. 미리보기 버튼 이동 + 등록 버튼 옆 배치 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

- 미리보기 버튼을 원래 위치(본문 아래 흐린 회색)에서 제거
- 등록 버튼 옆에 `flex gap-2`로 나란히 배치
- 미리보기: `border-2 border-blue-600 text-blue-600` (outline 스타일)
- 등록하기: `bg-blue-600 text-white` (solid 스타일)

### 24. 미리보기/등록 버튼 동일 크기 C안 적용 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

- 두 버튼 모두 `flex-1` → 동일 50:50 크기
- 두 버튼 모두 `py-3 text-base font-bold` → 동일 높이/폰트
- 미리보기: `bg-blue-100 text-blue-700` (밝은 파란 배경) + 👀 이모지
- 등록하기: `bg-blue-600 text-white` (진한 파란 배경) + ✏️ 이모지
- 다크모드: `dark:bg-blue-900/40 dark:text-blue-300`

### 25. 미리보기 Sheet 닫기/수정 2버튼 추가 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

- 미리보기 Sheet에 명시적 닫기 버튼이 없던 문제 해결
- 하단에 2버튼 가로 배치: "수정할래요" + "확인했어요"
- 수정할래요: `bg-blue-100 text-blue-700` + `window.scrollTo({ top: 0 })` (상단 이동)
- 확인했어요: `bg-blue-600 text-white` (Sheet 닫기)
- 바깥 터치/스와이프 닫기도 그대로 유지

### 26. 미리보기 Sheet 한 화면 압축 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

- 이미지: `h-48 w-48` → `h-28 w-28` (-80px)
- 제목: `text-lg` → `text-base leading-tight`
- 가격: `text-xl` → `text-lg`
- 태그+장소: 2줄 분리 → 1줄 합침, `text-[10px]`
- 작성자: 2줄(이름+학교) → 1줄 가로, 아바타 `h-8` → `h-6`
- 간격: `space-y-1.5 pb-3` → `space-y-1 pb-2`
- 버튼: 스크롤 영역 밖 하단 고정
- 콘텐츠 영역: `overflow-y-auto` + `maxHeight: calc(85vh - 100px)`

### 27. 미리보기 본문 전체 표시 + 글자 크기/색상 개선 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

- `line-clamp-4` 제거 → 본문 전체 표시 (스크롤로 확인)
- 글자 크기: `text-xs` → `text-base` (12px → 16px, 실제 게시글과 동일)
- 글자 색상: `text-muted-foreground` → `text-amber-600 dark:text-amber-400` (노랑/주황 계열로 눈에 띄게)

### 28. 등록 → 미리보기 → 최종 등록 흐름 변경 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

- **Before**: 등록 버튼 누르면 바로 게시글 등록
- **After**: 등록 버튼 → validate → 미리보기 Sheet → "최종 등록!" 버튼으로 실제 등록
- `handlePreviewBeforeSubmit()` 함수 추가: validate 통과 시 미리보기 Sheet 열기
- 미리보기 Sheet "확인했어요" → "최종 등록!" / "최종 수정!" 텍스트 변경 + `handleSubmit()` 호출
- 별도 미리보기 버튼 제거 (등록이 미리보기를 여므로 불필요)
- 하단 버튼: 2버튼(미리보기+등록) → 1버튼(등록) `w-full`로 단순화

### 29. 미리보기 UI 세부 조정 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

#### 1. 등록 버튼 아이콘 제거 + 이름 변경
- `✏️ 등록하기` → `미리보기 후 등록` (미리보기를 여는 역할이므로 동작 명확화)
- `✏️ 수정하기` → `미리보기 후 수정`

#### 2. 미리보기 Sheet 헤더 문구/스타일 변경
- 문구: `다른 사람에게 이렇게 보여요!` → `미리보기 화면입니다 — 하단의 버튼을 눌러, 수정 또는 최종 등록 해주세요`
- 스타일: `text-xs text-muted-foreground` → `text-xl font-bold text-white border-4 border-white rounded-lg px-3 py-1.5 text-center`

#### 3. 미리보기 Sheet 하단 버튼 통일
- "수정할래요" → "수정" (간결하게)
- 두 버튼 모두 `bg-blue-600 text-white`로 바탕색 통일

#### 4. 미리보기 본문 글자 색상
- `text-base text-amber-600 dark:text-amber-400` (노랑 계열, 전체 표시)

### 30. 미리보기 브레드크럼 접두어 추가 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`

- 미리보기 Sheet 브레드크럼에 "글쓰기 위치 : " 접두어 추가
- Before: `서울대학교 › 주거 › 룸메이트`
- After: `글쓰기 위치 : 서울대학교 › 주거 › 룸메이트`
- 사용자가 게시 위치를 즉시 파악할 수 있도록 안내 문구 명시

### 31. 문체 선택기 삭제 + SheetTitle 접근성 수정 + 버튼 이름 조정 (2026-02-24)

**파일**: `campulist/src/app/write/page.tsx`, `Header.tsx`, `PostStatusControl.tsx`

#### 문체 선택기 완전 삭제
- `TONE_OPTIONS` 상수, `selectedTone` 상태, `applyTone()` 함수 삭제
- `ToneType` import 삭제
- 문체 Badge UI (📋깔끔/😊친근/🔥급매/😂유머) 4개 삭제
- 모든 `applyTone()` 호출을 `exExamples[0]` 직접 사용으로 교체

#### SheetTitle 접근성 경고 수정
- `Header.tsx`: 사이드 메뉴 Sheet에 `sr-only` SheetTitle("메뉴") 추가
- `PostStatusControl.tsx`: 삭제 확인 Sheet에 `sr-only` SheetTitle("게시글 삭제") 추가
- Console Error `DialogContent requires a DialogTitle` 해결

#### 기타
- "글 제목·내용을 어떻게 채울지 막막하다면?" 글자 크기: `text-sm` → `text-xl font-bold`
- "최종 등록!" → "최종 등록", "최종 수정!" → "최종 수정" (느낌표 제거)

### 32. 캠퍼스톡 퀵 메시지 개선 + 회원 유형 라벨 정비 (2026-02-24)

**커밋**: `60ba47e`, `5e24e65`

#### 캠퍼스톡 퀵 메시지 (`PostBottomAction.tsx`)
- 첫 번째 메시지 "관심 있습니다. 연락 부탁 드립니다" 추가
- "가격 네고 가능한가요?" 삭제 (첫 연락 부적절)
- "직접 입력하기" 버튼 시인성 강화: `border-2 border-blue-500 text-base font-bold text-blue-600`

#### 회원 유형 라벨 변경 (4개 파일: auth, write, my, user/[id])
- `학부생` → `학부생/예술사(한예종)` (한예종 학부 과정 명칭 반영)
- `대학원생` → `대학원생/전문사(한예종)`
- `인근상인` → `비지니스 회원`
- `일반인` → `일반인 회원`

#### 회원가입 아이콘 삭제 (`auth/page.tsx`)
- 캠퍼스 회원/외부 회원 버튼에서 이모지 아이콘(`🎓📚👨‍🏫🏢🎒🏪👤`) 표시 삭제
- "관련 대학교" → "대학교 선택" (라벨 + 토스트 메시지)

### 33. 한예종 캠퍼스 3개 추가 + 대학 이름 표시 분리 (2026-02-24)

**커밋**: `e7bca3a`, `a6d62bf`

#### 한예종 캠퍼스 데이터 추가 (`universities.ts`)
- 기존 1개(`석관캠퍼스`) → 3개(`석관동 캠퍼스`, `서초동 캠퍼스`, `대학로 캠퍼스`)
- 회원가입 시 캠퍼스 선택 버튼 자동 표시 (`campuses.length > 1` 조건 충족)

#### 대학 이름 표시 분리
- `University` 타입에 `nameKo?: string` 필드 추가 (`types.ts`)
- `universities.ts`: `name: '한예종'`, `nameKo: '한국예술종합학교'`
- 회원가입 대학 선택: `한예종(한국예술종합학교)` 풀네임 (`uniFullName()` 헬퍼)
- 나머지 20곳(탭/브레드크럼/게시글/프로필): `한예종` 자동 축약
- `UniversityTabs.tsx`: 불필요 `.replace(/\(.*\)/, '')` 제거

### 34. 게시글 제목 prefix 대학별 분기 (2026-02-24)

#### 문제
- `MEMBER_TYPE_SHORT` 상수가 대학 구분 없이 `학부생/예술사(한예종)` 표시
- 서울대 학부생도 `[서울대][학부생/예술사(한예종)]`으로 표시되는 버그

#### 해결 (`write/page.tsx`)
- `MEMBER_TYPE_SHORT` 상수 → `getMemberTypeShort(memberType, universityId)` 함수로 교체
- 한예종(id:5): `예술사` / `전문사`
- 다른 대학: `학부생` / `대학원생`
- 나머지 (교수/교직원/졸업생/비지니스/일반인): 동일
- 7곳 호출부 모두 함수 호출로 변경

#### 결과 예시
| 사용자 | prefix |
|--------|--------|
| 한예종 학부생 | `[한예종][예술사]` |
| 서울대 학부생 | `[서울대][학부생]` |
| 한예종 대학원생 | `[한예종][전문사]` |
| 연세대 대학원생 | `[연세대][대학원생]` |

### Mock Auth PDCA Gap Analysis v4.0 결과 (2026-02-24)

**Overall Match Rate: 99%** (4회 연속 동일)

| 카테고리 | 점수 |
|---------|:----:|
| Feature Match | 100% |
| Data Model Match | 97% |
| UI/Screen Match | 100% |
| Architecture | 100% |
| Convention | 100% |
| **Overall** | **99%** |

- 이전 4개 Gap (G-01, G-02, G-05, G-06) 모두 해결 상태 유지
- 신규 Gap: 0건
- 1%: `RegisteredUser`/`SignupData` 추가 필드 (허용 범위)

### 35. 게시글 상세 이미지 1/3 축소 (2026-02-25)

#### 변경 (`ImageGallery.tsx`)
- 이미지 컨테이너: `aspect-[4/3] w-full` → `w-1/3 aspect-video ml-4 mt-2 rounded-xl`
- 가로세로 모두 약 1/3로 축소 (375px 기준: 343×257px → 115×65px)
- 네비게이션 버튼: `h-8 w-8` → `h-5 w-5`, SVG 12px → 8px
- 인디케이터 점 제거 (공간 부족), 카운터만 유지 (`text-[10px]`)
- 빈 이미지 상태 SVG: 48px → 16px

### 36. 수정하기/삭제 버튼 개선 (2026-02-25)

#### 변경 (`PostStatusControl.tsx`)
- 커스텀 `<button>` + SVG 아이콘 → `<Button variant="destructive">` 통일
- 아이콘 제거, 텍스트만 표시
- 두 버튼 동일 크기: `flex-1`
- 글씨 크기 `text-base` (16px), 높이 `py-3 h-auto`
- 삭제 확인 Sheet 내부 버튼과 동일한 Button 컴포넌트 스타일 통일

### 37. 전체보기 버튼 소분류와 구분 강화 (2026-02-25)

#### 변경 (`all/[category]/page.tsx`, `[university]/[category]/page.tsx`)
- 전체보기 버튼 색상: 주황 → 파랑 (`border-blue-*`, `text-blue-*`)으로 소분류(주황)와 색깔 구분
- 항상 `border-2` 유지 (선택/미선택 테두리 두께 동일 → 수직 정렬 유지)
- 선택 시: `border-blue-600 text-blue-700 font-extrabold bg-blue-100 shadow-sm`
- 미선택 시: `border-blue-300 text-blue-400 font-medium` (연한 파랑)
- 글씨 크기/버튼 크기는 소분류와 동일 (`text-sm px-3 py-1`)

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
- [ ] 캠퍼스톡 실시간 채팅 (localStorage → Supabase Realtime)
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
- `CAMPUS_MEMBER_TYPES` = undergraduate, graduate, professor, staff — alumni 삭제됨, icon 필드 제거됨
- `EXTERNAL_MEMBER_TYPES` = merchant, general — `desc` 필드 추가 (버튼 내 설명 표시)
- 회원가입 3-Step: 캠퍼스 (유형선택→이메일인증→프로필) / 외부 (유형선택→전체폼), `handleCampusEmailNext`로 Step 2→3 전환
- `isCampusType` — `CAMPUS_MEMBER_TYPES.some()` 기반 파생 변수, step 분기/검증에 사용
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
- `seasonalHints` 기능 완전 삭제됨 — 인터페이스, 데이터, UI 코드 모두 제거
- `lastExampleIdxRef` — 랜덤 샘플 반복 방지용 useRef, 최대 5회 재시도로 무한루프 방지
- `fillSmartExamples` — 빈칸 체크 없이 항상 모든 필드 교체, prefix는 `fillTemplate()`이 자동 포함
- `fetchOtherPosts` — 같은 소분류 게시글 조회, 본인 글 제외, 최대 10개
- `fillFromOtherPost` — 다른 사람 글 prefix를 내 prefix로 교체 후 필드 채움 (이미지 제외)
- Toast `variant` — `toast('메시지')` 기존 호출 하위 호환, `toast('성공!', 'success')` 가능
- Header 활성 상태 표준: 탭형 `border-b-2 + font-medium`, 메뉴형 `font-semibold`
- 대학 페이지 브레드크럼 — 배너와 CategoryGrid 사이에 위치
- Header 데스크톱 카테고리 네비 제거됨 — CategoryGrid가 유일한 카테고리 진입점. 사이드 메뉴는 유지
- 캠퍼스톡 채팅 높이: 모바일 `100dvh-112px` (Header 56px + BottomNav 56px), 데스크톱 `100dvh-56px` (Header만)
- `confirmAction` state — write/page.tsx에서 'title'|'price'|'body'|'delete' 4개 케이스를 단일 Sheet로 관리
- 커스텀 오버레이 → Sheet 전환 원칙: 모든 바텀시트/모달을 shadcn Sheet로 통일 (포커스 트랩, Escape, 접근성)
- Header 접근성: 모든 아이콘 버튼에 aria-label 적용 완료 (검색, 메뉴, 캠퍼스톡, 마이페이지)
- textarea 포커스 패턴: `border-input` + `focus-visible:border-ring` + `focus-visible:ring-ring/50` (Input과 동일)
- 로고(캠퍼스리스트) 활성 색상: `isHome ? 'text-orange-400' : 'text-muted-foreground'` — 다른 아이콘과 동일 패턴
- CategoryGrid — flex 수평 스크롤 레이아웃, `min-w-[4.5rem] flex-1`로 반응형 크기, `overflow-x-auto scrollbar-hide`
- CategoryGrid `activeSlug` — 카테고리 페이지에서 현재 선택된 대분류 하이라이트 (border-blue-500 bg-blue-500/10)
- 브레드크럼 통일 패턴: `text-base` + 전체 오렌지 톤 (`text-orange-400`, 현재 페이지 `font-semibold`), 구분자 `text-orange-300`
- 배너 통일 패턴: `bg-blue-950/30 px-4 py-4` + `h1 text-xl font-bold text-blue-400`
- PopularPostsSection 순위 색상: 1위 yellow-500, 2위 gray-400, 3위 amber-600, 4위이후 orange-500
- 햄버거 메뉴: `<button>` (not `<Button>`), `menuHighlight`/`menuOpen` 분리 상태, 30ms 딜레이
- 로고 서브타이틀: `Campu(s)+LIST+.COM=CAMPuLIST.COM` (데스크톱 전용)
- Sheet 닫기 버튼: `size-6 p-1 rounded-md` (확대됨)
- 대학 전환 카테고리 유지: UniversityTabs + Header sidebar에서 pathname의 카테고리 slug 추출하여 링크에 반영
- 소분류 Badge: `text-sm px-3 py-1`, 활성=`border-2 border-orange-500 font-bold`, 비활성=`border-orange-400 text-orange-600`
- 정렬 Badge: 기존 블루 스타일 유지 (`bg-blue-600 text-white` 활성, `outline hover:bg-muted` 비활성)
- `getWriteUrl()` — pathname에서 uni/major/minor 추출하여 `/write?uni=&major=&minor=` 생성 (Header에서 사용)
- 글쓰기 카테고리 뷰 pre-selection: `id={major-group-N}` + `ring-2 ring-orange-300 bg-orange-50` + "선택됨" 라벨
- CategorySummary 브레드크럼: 일반 페이지와 완전 동일 스타일 (text-base, text-orange-400, 풀네임, "모든 대학" 포함)
- 등록 흐름 패턴: 등록 버튼 → `handlePreviewBeforeSubmit`(validate) → 미리보기 Sheet → "최종 등록" → `handleSubmit`(실제 등록)
- 미리보기 Sheet 하단 패턴: 2버튼 ("수정" + "최종 등록") + 바깥 터치/스와이프 유지
- 문체 선택기 삭제됨 — `applyTone()`, `TONE_OPTIONS`, `selectedTone` 모두 제거. 예시는 항상 기본(clean) 톤으로 적용
- SheetTitle 접근성: SheetContent에 SheetTitle 필수 — 보이지 않아도 `sr-only`로 추가 (Radix UI 요구사항)
- 미리보기 본문: `text-base text-amber-600 dark:text-amber-400` — 노랑 계열로 눈에 띄게, 전체 표시 (line-clamp 없음)
- 미리보기 브레드크럼 접두어: `글쓰기 위치 : {대학} › {대분류} › {소분류}` — 게시 위치 즉시 파악용

---

## 38. 전체보기 버튼 삭제 + 브레드크럼 "· 전체보기 ›" 표시

### 배경
- 소분류 필터 영역의 "전체보기" 버튼이 소분류 버튼과 구분이 어려움
- 여러 차례 스타일 변경 시도 후, 버튼 자체를 삭제하고 브레드크럼에서 상태를 표시하는 방식으로 전환

### 변경 사항

**전체보기 Badge 버튼 삭제** — 소분류 필터 영역에서 `<Link><Badge>전체보기</Badge></Link>` 제거
- `campulist/src/app/all/[category]/page.tsx`
- `campulist/src/app/[university]/[category]/page.tsx`

**브레드크럼 "· 전체보기 ›" 원칙** — 마지막 세그먼트에 항상 `· 전체보기 ›` 표시
- 홈: `모든 대학 · 전체보기 ›`
- 대분류만: `모든 대학 › 📦 중고마켓 · 전체보기 ›`
- 소분류 선택: `모든 대학 › 🏠 주거 › 하숙/고시원 · 전체보기 ›`
- 대학별: `모든 대학 › 서울대 › 📦 중고마켓 · 전체보기 ›`
- 대학별+소분류: `모든 대학 › 서울대 › 📦 중고마켓 › 하숙/고시원 · 전체보기 ›`

**수정 파일:**
- `campulist/src/app/page.tsx` — 홈 브레드크럼
- `campulist/src/app/all/[category]/page.tsx` — 전체 카테고리 브레드크럼 + 전체보기 버튼 삭제
- `campulist/src/app/[university]/[category]/page.tsx` — 대학별 카테고리 브레드크럼 + 전체보기 버튼 삭제

## 39. 소분류명 구분자 변경

- `전공서적·교양도서` → `전공서적/교양도서` (가운데점 → 슬래시)
- `campulist/src/data/categories.ts` 수정

---

## 40. 캠퍼스톡 메시지 원칙 기능 (2026-02-25)

**파일:** `campulist/src/app/camtalk/[id]/page.tsx`

### 추가 기능
- 채팅창에 "📜 메시지 원칙" 빠른 메시지 칩 추가 (약속 잡기/장소 안내/송금 정보와 동일 패턴)
- 5가지 원칙 체크박스 선택 + 직접 입력 필드
  - 🤝 정직하고 투명하게 거래해요
  - ⏰ 시간 약속을 꼭 지켜요
  - 💬 답변은 빠르게 드릴게요
  - 🙏 서로 존중하며 대화해요
  - 📦 상품 상태를 정확히 알려드려요
- 직접 입력 아래에 5개 예시 문구 (네고 없이 정가 거래 등)
- 빠른 메시지 칩 순서: 기능 칩 → 안녕하세요?/감사합니다! → 일반 문구

### 채팅 표시 스타일 개선
- 구조화된 메시지(메시지 원칙, 거래 약속, 만남 장소, 송금 정보 등) 타이틀 `text-base font-bold`, 내용 `text-xs opacity-80`으로 계층 구분
- `STRUCTURED_PREFIXES` 배열로 모든 구조화 메시지 타입 일괄 처리

---

## 41. 대분류-소분류 시각적 연결 (2026-02-25)

**파일:**
- `campulist/src/components/post/CategoryGrid.tsx`
- `campulist/src/app/all/[category]/page.tsx`
- `campulist/src/app/[university]/[category]/page.tsx`

### CategoryGrid 변경
- 세로 카드 레이아웃 → 가로 알약형 칩(pill) 스타일로 변경
  - `flex-col rounded-xl` → `flex items-center rounded-full`
  - 아이콘 `text-2xl`, 텍스트 `text-lg font-bold`
- 선택된 대분류 아래에 삼각형(▼) 커넥터 표시
  - `absolute -bottom-2`, `border-x-[8px] border-t-[8px]` 파란색

### 소분류 컨테이너
- 테두리 제거, 연한 배경색만 사용 (`bg-blue-50/70 dark:bg-blue-950/30`)
- 최소 패딩 (`px-2 py-px`)
- 소분류 뱃지: `text-sm`, 오렌지 계열 색상

---

## 42. 수직 공간 압축 (2026-02-25)

글자 크기 유지, 패딩/마진만 축소 원칙

| 컴포넌트 | 변경 내용 |
|----------|----------|
| UniversityBanner | 2줄→1줄 (이름+부제 한 줄), `py-px`, 긴 부제 `truncate` 처리 |
| Breadcrumb | `py-1` → `py-px` |
| CategoryGrid 컨테이너 | `pb-1 pt-0.5`, 칩 `py-0.5` |
| 소분류 컨테이너 | `py-px mb-0.5` |
| SortBadgeRow | `pb-1.5` → `pb-0.5` |

### 수정 파일 목록

| 파일 | 변경 |
|------|------|
| `campulist/src/components/layout/UniversityBanner.tsx` | 1줄 레이아웃 + truncate |
| `campulist/src/components/layout/Breadcrumb.tsx` | 패딩 축소 |
| `campulist/src/components/post/CategoryGrid.tsx` | 칩 스타일 + 삼각형 커넥터 |
| `campulist/src/components/post/SortBadgeRow.tsx` | 패딩 축소 |
| `campulist/src/app/all/[category]/page.tsx` | 소분류 컨테이너 스타일 |
| `campulist/src/app/[university]/[category]/page.tsx` | 소분류 컨테이너 스타일 |

---

## 43. 이미지 갤러리 개선 — 가로 스크롤 캐러셀 + 자동 슬라이드 (2026-02-25)

게시글 상세 페이지의 이미지 표시 방식을 좌우 화살표 → 가로 스크롤 캐러셀로 전면 교체.

### 주요 기능

| 기능 | 설명 |
|------|------|
| 가로 스크롤 | CSS `scroll-snap` (`snap-x snap-mandatory` + `snap-start`)로 스와이프/드래그 |
| 도트 인디케이터 | 하단 중앙에 현재 이미지 위치 표시 (`bg-white` / `bg-white/40`) |
| 자동 슬라이드 | 5초 간격으로 다음 이미지 자동 전환, 마지막→첫 번째로 순환 |
| 사용자 조작 시 정지 | 터치/드래그/휠/스크롤 감지 시 자동 슬라이드 **완전 정지** (재개 없음) |
| IntersectionObserver | 스크롤 위치 기반으로 현재 보이는 이미지 인덱스 감지 |
| 목록 카드 이미지 뱃지 | 여러 장일 때 썸네일 우측 하단에 `📷 N` 뱃지 표시 |

### 이미지 크기

- 기존 크기 유지: `ml-4 mt-2 w-1/3 aspect-video` (풀 너비 아님)

### 버그 수정 (자동 슬라이드 정지 불량)

**원인:** `onTouchStart`와 `onMouseDown`만으로는 데스크톱 트랙패드/마우스 휠 스크롤을 감지 불가

**수정:**
- `onWheel` 이벤트 추가 — 마우스 휠/트랙패드 감지
- `onScroll` + `programmaticScrollRef` — 모든 스크롤 감지하되 자동 슬라이드의 프로그래밍 스크롤은 무시
- `scrollToIndex` 호출 시 600ms 동안 프로그래밍 스크롤 플래그 활성화

### 코드 품질 개선

| 문제 | 수정 |
|------|------|
| React Hooks 규칙 위반 (조기 return이 Hooks 앞) | 조기 return을 모든 Hooks 뒤로 이동 |
| state updater 내 side effect (`setCurrent` 안에서 `scrollToIndex`) | DOM `scrollLeft`에서 직접 읽어 분리 호출 |
| setTimeout 누수 (연속 호출 시 타이머 겹침) | `clearTimeout` + unmount cleanup effect 추가 |
| timerRef 타입 불일치 (`setTimeout` → `setInterval`) | `ReturnType<typeof setInterval>`로 수정 |

### 수정 파일 목록

| 파일 | 변경 |
|------|------|
| `campulist/src/components/post/ImageGallery.tsx` | 가로 스크롤 캐러셀 전면 리뉴얼 |
| `campulist/src/components/post/PostCard.tsx` | 썸네일에 이미지 개수 뱃지 추가 |
| `campulist/src/lib/types.ts` | `PostListItem`에 `imageCount` 필드 추가 |
| `campulist/src/data/posts.ts` | `toPostListItem()`에 `imageCount: images.length` 반환 |

---

## 44. 회원가입 2-Step 위저드 구현 (2026-02-25)

회원가입 시 회원유형 선택을 별도 화면(Step 1)으로 분리하는 2-Step 위저드 패턴 적용.

### Step 구조
- **Step 1**: 회원 유형 선택 (캠퍼스 회원 / 외부 회원)
- **Step 2**: 가입 폼 (선택한 유형 뱃지 + 변경 버튼 + 닉네임/이메일/비밀번호)

### 주요 변경
- `step` state 추가 (`1 | 2`)
- Step 1에 캠퍼스/외부 회원 체크포인트 설명 추가
- Step 2에 선택된 회원유형 `Badge` + "변경" 버튼 표시

### 수정 파일
| 파일 | 변경 |
|------|------|
| `campulist/src/app/auth/page.tsx` | 2-Step 위저드 전체 구현 |

---

## 45. 회원유형 선택 화면 UI 개선 시리즈 (2026-02-25)

Step 1 회원유형 선택 화면에 대한 연속적인 UI 개선.

### 변경 내역

| 항목 | 변경 |
|------|------|
| 아이콘 삭제 | 회원유형 카드에서 이모지 아이콘 제거 |
| 체크포인트 설명 추가 | 캠퍼스: ✓ 전용 게시판, ✓ 인증 배지 / 외부: ✓ 홍보 게시판 |
| 졸업생 삭제 | `CAMPUS_MEMBER_TYPES`에서 alumni 제거 |
| .ac.kr 필수 고지 | 주황색 경고문 "※ 대학교 이메일(.ac.kr)이 필요해요" 추가 |
| 라벨 단순화 | 학부생/예술사(한예종) → 학부생, 대학원생/전문사(한예종) → 대학원생 |
| 2x2 그리드 | 교직원을 교수 옆에 배치 (col-span-2 제거) |
| 문구 수정 | 제목: "회원 유형 선택", 부제 삭제 |
| 글자 크기 확대 | 제목 `text-2xl`, 섹션명 `text-base font-bold`, 설명 `text-sm` |
| 문체 친절화 | "~할 수 있어요", "~필요해요" 등 해요체로 변경 |
| 외부 회원 설명 | 비지니스: "대학교 상가·원룸 업체 사장님" / 일반인: "대학교와 무관한 일반 이용자" |
| 외부 회원 체크포인트 | "✓ 홍보 게시판을 자유롭게 이용할 수 있어요 (캠퍼스 회원 전용 게시판 제외)" |
| dead code 제거 | 타입 정의에서 미사용 `icon` 필드 제거 |

---

## 46. 회원가입 3-Step 분리 — 캠퍼스/외부 플로우 분리 (2026-02-25)

캠퍼스 회원과 외부 회원의 가입 절차를 완전히 분리. 캠퍼스 회원은 이메일 인증을 가장 먼저 처리하여 불필요한 폼 작성을 방지.

### 사용자 플로우

**캠퍼스 회원 (3-step)**
```
Step 1: 회원 유형 선택
Step 2: 대학교 이메일(.ac.kr) + 비밀번호 입력
        → 대학교 자동 감지 (녹색 표시)
        → 비.ac.kr 시 주황 경고 + "다음" 차단
Step 3: 닉네임 + 캠퍼스 선택
        → 인증된 이메일/대학교 읽기 전용 표시 (녹색 박스)
```

**외부 회원 (2-step)**
```
Step 1: 회원 유형 선택
Step 2: 전체 가입폼 (닉네임 + 이메일 + 비밀번호 + 대학교 선택 + 캠퍼스)
```

**로그인** — 변경 없음 (이메일 + 비밀번호)

### 주요 구현

| 항목 | 내용 |
|------|------|
| step 타입 | `1 \| 2` → `1 \| 2 \| 3` 확장 |
| `handleCampusEmailNext` | Step 2→3 전환 함수 (.ac.kr + 비밀번호 4자리 검증) |
| Step 2 분기 | `isCampusType` 여부로 캠퍼스/외부 화면 분기 |
| Step 3 | 캠퍼스 전용 — 인증된 이메일 읽기 전용 + 닉네임 + 캠퍼스 |
| 로그인 폼 분리 | `mode === 'login'` 별도 섹션으로 회원가입 step 로직과 독립 |
| document.title | step별 분기 (이메일 인증 / 회원가입 / 회원 유형 선택) |

### 검증 로직

| 대상 | 검증 |
|------|------|
| 이메일 빈값 | `handleSubmit` 최상단에서 로그인/회원가입 공통 검증 |
| 닉네임 빈값 | 회원가입 시 검증 |
| 비밀번호 4자리 | 회원가입 + 캠퍼스 Step 2→3 전환 시 이중 검증 |
| 캠퍼스 .ac.kr | Step 2→3 전환 시 + handleSubmit 방어적 이중 검증 |
| 외부 대학교 | universityId 필수 검증 |

### Supabase 호환
- `signup()` 호출은 최종 step에서만 1회 — AuthContext 변경 없음
- Step 2(캠퍼스)에서 `signUp(email, password)` 자연스럽게 호출 가능 (Phase B)

### 수정 파일
| 파일 | 변경 |
|------|------|
| `campulist/src/app/auth/page.tsx` | 3-Step 플로우 전면 리팩토링 |

## 47. 버튼 전체 점검 + PDCA 갭 분석 + 텍스트 수정 (2026-02-25)

### 버튼 전체 점검 (auth/page.tsx)

회원가입/로그인 페이지의 모든 버튼(13종) 동작 검증 완료:

| 구분 | 버튼 | 동작 | 상태 |
|------|------|------|------|
| 탭 | 로그인/회원가입 | `setMode` + `setStep(1)` | OK |
| Step 1 | 학부생/대학원생/교수/교직원 (4) | `setMemberType` | OK |
| Step 1 | 비지니스/일반인 (2) | `setMemberType` | OK |
| Step 1 | 다음 | `setStep(2)` | OK |
| Step 2 캠퍼스 | 이전 | `setStep(1)` | OK |
| Step 2 캠퍼스 | 다음 | `handleCampusEmailNext` → `setStep(3)` | OK |
| Step 2 외부 | 변경 | `setStep(1)` | OK |
| Step 2 외부 | 캠퍼스 선택 | `setCampusName` | OK |
| Step 2 외부 | 회원가입 | `handleSubmit` | OK |
| Step 3 | 변경 | `setStep(1)` | OK |
| Step 3 | 캠퍼스 선택 | `setCampusName` | OK |
| Step 3 | 회원가입 | `handleSubmit` | OK |
| 로그인 | 로그인 | `handleSubmit` | OK |

### PDCA 갭 분석 (3-Step Signup Flow)

3-Step 회원가입 설계 문서(Plan) 대비 구현 일치율 분석:

| 카테고리 | 일치율 | 상태 |
|----------|:------:|:----:|
| User Flow Match (step 전환, 조건) | 100% | OK |
| UI Element Match (버튼, 입력, 레이블) | 100% | OK |
| Validation Logic Match (검증 로직) | 100% | OK |
| Edge Case Handling Match | 100% | OK |
| Title/Meta Match (document.title) | 100% | OK |
| **Overall** | **100%** | **OK** |

- 설계 요구사항 전체 구현 완료, 미구현 항목 0건
- 설계 외 추가 구현 6건 (비밀번호 검증, 회원 유형 설명, 부제목, 인증 리디렉트, 소셜 로그인 안내 등)
- 분석 보고서: `docs/03-analysis/campulist.analysis.md` (v7.0)

### 버튼 텍스트 수정 (write/page.tsx)

| 파일 | 변경 |
|------|------|
| `campulist/src/app/write/page.tsx:1260` | `{isEditMode ? '최종 수정' : '최종 등록'}` → `최종 등록` (항상 동일 표시) |

---

## 48. 글쓰기 페이지 안내 텍스트 + Toast 기능 확장 + 코드 정리

### 대분류/소분류 미선택 안내 텍스트 개선

| 항목 | Before | After |
|------|--------|-------|
| 대분류 미선택 | `대분류를 선택해주세요` (기본 크기) | ⬆ 화살표 아이콘(`text-4xl`) + `위에 보이는, 대분류를 선택해주세요` (`text-2xl font-bold`) |
| 소분류 미선택 | `소분류를 선택하면 글쓰기를 시작합니다` (기본 크기) | ⬆ 화살표 아이콘(`text-4xl`) + `위에 보이는, 소분류를 선택해 주세요` (`text-2xl font-bold`) |

### Toast 컴포넌트 기능 확장 (`Toast.tsx`)

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `duration` | `number` | 2500 | 표시 시간(ms) |
| `size` | `'sm' \| 'lg'` | `'sm'` | `lg`: `text-2xl font-bold` + 넓은 패딩 |
| `dismissOnMove` | `boolean` | `false` | 마우스 움직임/터치 시 즉시 사라짐 |

- "샘플로 채워졌어요!" toast: `duration=1000`, `size='lg'`, `dismissOnMove=true`

### 버튼 텍스트 수정 (write/page.tsx)

| Before | After |
|--------|-------|
| `샘플 채우기 · 랜덤!` | `샘플로 게시글 채우기` |
| `다른 글 가져와 고치기` | `다른 게시글 가져와서 고치기` |

### 전체 코드 체크 결과

| 항목 | 결과 |
|------|------|
| TypeScript 빌드 | 통과 (17 routes, 0 errors) |
| console.log | 0건 |
| any 타입 | 0건 |
| 미사용 import | 0건 |
| null 접근 위험 | 0건 |
| 이벤트 리스너 누수 | 0건 |
| TODO | 1건 (Phase B Supabase — 정상) |

- 미사용 state `showLocked` / `setShowLocked` 제거 (write/page.tsx)

---

## 49. "캠톡" → "캠퍼스톡" 브랜드 리네이밍 (2026-02-25)

15개 파일에서 "캠톡"을 "캠퍼스톡"으로 일괄 변경.

| 파일 | 변경 내용 |
|------|----------|
| `Header.tsx` | aria-label "캠톡" → "캠퍼스톡" |
| `BottomNav.tsx` | 라벨 "캠톡" → "캠퍼스톡" |
| `camtalk/page.tsx` | 제목 "캠톡" → "캠퍼스톡", 빈 상태 텍스트 |
| `camtalk/[id]/page.tsx` | 헤더 제목, 약속잡기 설명, 뒤로가기 텍스트 |
| `PostBottomAction.tsx` | 버튼 라벨 "캠톡으로 대화하기" → "캠퍼스톡으로 대화하기" |
| `UserChatButton.tsx` | 버튼 텍스트 |
| `my/page.tsx` | 메뉴 라벨 |
| `privacy/page.tsx` | 개인정보 처리방침 내 서비스명 |
| `camtalk.ts` | 스토리지 키 접두어 `ct_` 유지 (호환성) |
| `USER_MANUAL.md` | 사용자 매뉴얼 전체 |
| `NOTES.md` | 작업 노트 전체 |
| `SUPABASE_MIGRATION_GUIDE.md` | 마이그레이션 가이드 |

- 스토리지 키(`ct_messages`, `ct_read_status` 등)는 기존 데이터 호환을 위해 변경하지 않음

---

## 50. 인기 퀵 칩 기능 시도 및 철회 (2026-02-25)

홈페이지에 S-tier 소분류 7개를 퀵 칩으로 표시하는 기능을 PDCA 전체 사이클(Plan → Design → Do)로 구현 후, 검토 결과 전체 철회.

### 구현했던 내용

| 파일 | 변경 |
|------|------|
| `categories.ts` | `POPULAR_SLUGS` 상수 + `getPopularChips()` 함수 추가 |
| `PopularQuickChips.tsx` | Server Component 신규 생성 (27줄) |
| `page.tsx` | CategoryGrid 위에 퀵 칩 배치 |

### 표시했던 7개 항목

전공서적/교양도서, 전자기기, 가구/생활용품, 의류/패션, 무료나눔, 원룸/자취방, 아르바이트

### 철회 사유

사용자 판단으로 전체 철회 결정. 3개 파일 변경 + 2개 PDCA 문서 + 메모리 항목 모두 삭제.

---

## 51. 전체 코드 체크 — 세션 최종 (2026-02-25)

70+ 파일 대상 전체 코드 체크 수행. TypeScript 빌드 통과, 크리티컬 이슈 0건.

### 결과 요약

| 구분 | 건수 |
|------|------|
| Critical | 0 |
| Warning | 6 |
| Info | 4 |
| TypeScript 빌드 | 통과 (0 errors) |

### 경고 항목 (6건)

| # | 파일 | 내용 | 비고 |
|---|------|------|------|
| 1 | `camtalk.ts:156,210,228` | `window.dispatchEvent()` typeof 체크 없음 | SSR 시 에러 가능성 |
| 2 | `camnotif.ts:60,76,101` | 동일 이슈 | SSR 시 에러 가능성 |
| 3 | `api.ts` `campulist_liked_posts` | 사용자별 격리 안 됨 | Phase B에서 해결 |
| 4 | `api.ts` `campulist_recent_viewed` | 사용자별 격리 안 됨 | Phase B에서 해결 |
| 5 | `api.ts` `toggleLike()` | localStorage.setItem try/catch 없음 | 저위험 |
| 6 | `users.ts`, `posts.ts` | 하드코딩된 localStorage 키 | STORAGE_KEYS 상수화 권장 |

- 경고 #3, #4는 Phase B Supabase 마이그레이션 시 자동 해결 예정

---

## #52. 검색 필터 — 대학/카테고리 필터 추가 (search-filter)

검색 페이지에 대학별, 카테고리(대분류)별 필터링 기능 추가. 기존 `getPosts()`가 이미 `universitySlug`, `categoryMajorSlug` 필터를 지원하고 있어 API 변경 없이 UI만 추가.

### URL 파라미터

```
/search?q=맥북&uni=snu&cat=market&sort=latest&priceMin=100000&priceMax=500000
```

### 수정 파일 (3개)

| 파일 | 변경 |
|------|------|
| `components/search/SearchFilters.tsx` | 신규 — 대학/카테고리 Badge 칩 필터 UI (Client Component) |
| `components/search/PriceFilter.tsx` | `uni`, `cat` props 추가, URL 파라미터 보존 |
| `app/search/page.tsx` | `uni`, `cat` searchParams 추가 + 필터 연동 |

### PDCA: Match Rate 99%

---

## #53. 건의함 기능 (suggestion-box)

사용자가 기능 요청, 불편사항, 버그 신고를 제출할 수 있는 건의함 페이지 추가. localStorage 저장 (Phase A), Supabase 전환 대비 인터페이스 설계.

### 접근 경로
- MY 페이지 메뉴 → 건의함
- 햄버거 메뉴(좌측) → 건의하기

### 건의 폼
- 분류: Select (버그/기능제안/불편사항/기타)
- 제목: Input (2~50자)
- 내용: textarea (10~1000자)
- 제출 → toast 알림 + /my 이동

### 수정 파일 (4개)

| 파일 | 변경 |
|------|------|
| `app/suggest/page.tsx` | 신규 — 건의 작성 페이지 (AuthGuard, Select, Input, textarea) |
| `lib/constants.ts` | `SUGGESTIONS` 키 추가 |
| `app/my/page.tsx` | 메뉴에 "건의함" 링크 1줄 추가 |
| `components/layout/Header.tsx` | 햄버거 메뉴에 "건의하기" 링크 추가 |

### PDCA: Match Rate 100%

---

## #54. 전체 코드 품질 체크 + CRITICAL 버그 수정

85개 파일 대상 코드 분석 실행. CRITICAL 8건 + WARNING 1건 수정 완료.

### CRITICAL 수정 (8건)

| # | 파일 | 문제 | 수정 |
|---|------|------|------|
| C1 | `suggest/page.tsx` | submitting 상태 리셋 안 됨 | try/catch + 에러 시 `setSubmitting(false)` |
| C2 | `suggest/page.tsx` | localStorage parse에 try/catch 없음 | 내부 try/catch 추가 |
| C3 | `posts.ts` | `'campulist_post_images'` 하드코딩 | → `STORAGE_KEYS.POST_IMAGES` |
| C4 | `posts.ts` | `'campulist_post_tags'` 하드코딩 | → `STORAGE_KEYS.POST_TAGS` |
| C5 | `users.ts` | `'campulist_registered_users'` 하드코딩 | → `STORAGE_KEYS.REGISTERED_USERS` |
| C6 | `camtalk.ts`+`camnotif.ts` | `ct_rooms`, `ct_msgs`, `cn_notifs` 미등록 | STORAGE_KEYS에 등록 + import 사용 |
| C7 | `camnotif/page.tsx` | 알림 읽음 후 UI 안 바뀜 | `setNotifs()` 재호출 추가 |
| C8 | `PostStatusControl.tsx` | 수정 버튼 `variant="destructive"` (빨간색) | → `variant="outline"` |

### WARNING 수정 (1건)

| # | 파일 | 문제 | 수정 |
|---|------|------|------|
| W5 | `search/page.tsx` | `Number(pMin)` NaN 가능성 | `isNaN` 가드 추가 |

### 수정 파일 총 9개

`suggest/page.tsx`, `posts.ts`, `users.ts`, `constants.ts`, `camtalk.ts`, `camnotif.ts`, `camnotif/page.tsx`, `PostStatusControl.tsx`, `search/page.tsx`

### TypeScript 빌드: 0 에러

---

## 작업 일자: 2026-02-26

---

## 1. 카테고리 네비게이션 UX 개선 — 스무스 스크롤 통합

### 핵심 변경

모든 네비게이션 요소(대분류, 소분류, 대학 탭, 메인 로고) 클릭 시 **게시글 목록(`#post-list`)까지 부드럽게 스크롤**되도록 통합.

### 스크롤 사양

| 항목 | 값 |
|------|-----|
| 애니메이션 | `requestAnimationFrame` 기반 커스텀 easeInOut |
| 지속시간 | 600ms |
| 도착 위치 | 화면 상단 1/5 지점에 게시글 목록 시작 |
| 충돌 방지 | `cancelAnimationFrame` + `useRef` (빠른 연속 클릭 대응) |

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `components/post/CategoryGrid.tsx` | `smoothScrollToPostList()` 공통 함수 추출, 대분류/소분류 `<Link>` → `<button>` + `router.push` + 스크롤, children prop 추가 (소분류 필터 Badge 래핑), 활성 대분류 가로 자동스크롤, 펼침 시 활성 그룹 자동스크롤 |
| `components/post/UniversityTabs.tsx` | link 모드 `<Link>` → `<button>` + `router.push` + `navigateWithScroll()`, 스크롤 애니메이션 적용 |
| `components/layout/Header.tsx` | 로고 `<Link href="/">` → `<button>` + `router.push("/")` + 스크롤, `useRouter`/`useRef` 추가 |
| `app/page.tsx` | `<div id="post-list" />` 앵커 추가 (최신 게시글 상단) |
| `app/[university]/page.tsx` | `<div id="post-list" />` 앵커 추가 |
| `app/[university]/[category]/page.tsx` | 소분류 필터를 `<CategoryGrid>` children으로 이동, `activeMinorSlug` prop 전달 |
| `app/all/[category]/page.tsx` | 소분류 필터를 `<CategoryGrid>` children으로 이동, `activeMinorSlug` prop 전달 |
| `app/globals.css` | `html { scroll-behavior: smooth; }` 추가 |

### 카테고리 펼침 영역 UX 개선

- "카테고리 전체보기" 토글 버튼을 소분류 필터 **하단**으로 이동
- 활성 대분류/소분류에 **오렌지색 하이라이트** 적용 (text-orange-500, border-orange-500)
- 펼침 시 활성 대분류 그룹으로 **자동 스크롤** (`scrollIntoView`)
- 상단 대분류 가로바에서 활성 항목 **중앙 자동 스크롤** (`container.scrollTo`)

### `post-list` 앵커 현황

| 페이지 | 상태 |
|--------|------|
| `/` (홈) | 추가 |
| `/[university]` (대학 메인) | 추가 |
| `/[university]/[category]` | 기존 있음 |
| `/all/[category]` | 기존 있음 |

---

## 2. 캠퍼스톡 — "연락방법" 기능 추가

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `app/camtalk/[id]/page.tsx` | "📱 연락방법" 액션 버튼 + Sheet UI + 구조화 메시지 전송 |

### 구현 상세

**액션 버튼**: 기존 "📅 약속잡기" 옆에 "📱 연락방법" 버튼 추가

**Sheet UI (하단 모달)**:
- 💬 캠퍼스톡: 기본 (항상 활성, disabled)
- 📱 전화번호: ON/OFF 토글 → 번호 입력 + 전화OK/문자OK 체크
- 💬 카카오 오픈채팅: ON/OFF 토글 → URL 입력
- 📧 이메일: ON/OFF 토글 → 이메일 입력

**구조화 메시지 형식**:
```
📱 연락 방법
💬 캠퍼스톡: 기본
📱 전화번호: 010-1234-5678 (전화·문자)
💬 카카오톡: https://open.kakao.com/o/...
📧 이메일: user@university.ac.kr
```

**localStorage 저장**: `ct_contact_info_{userId}` 키로 연락처 저장/자동 채움 (송금정보와 동일 패턴)

**STRUCTURED_PREFIXES**: `'📱 연락 방법'` 추가 → 제목 굵게 + 내용 작게 자동 렌더링

### TypeScript 빌드: 0 에러

---

## 작업 일자: 2026-02-26 (2차) — Supabase 연동 전 코드 체크 & 버그 수정

### 배경

Supabase 연결 + Vercel 배포를 앞두고, 현재 Mock 기반 코드의 버그/안전성 문제를 사전 수정.
3개 영역(데이터 레이어, UI/페이지, 인증/채팅/유틸리티) 전체 감사 수행 후 12건 수정.

### A. ID 충돌 방지 (4건)

`Date.now()` 기반 ID → `crypto.randomUUID()` 통일 (Supabase UUID 타입과 직접 호환).

| 파일 | 변경 |
|------|------|
| `lib/api.ts` | `local-${Date.now()}` → `local-${crypto.randomUUID()}` (`local-` 접두사 유지: 로컬 게시글 감지용) |
| `lib/auth.ts` | `local-user-${Date.now()}` → `crypto.randomUUID()` |
| `lib/camtalk.ts` | `genId()` → `${prefix}-${crypto.randomUUID()}` |
| `lib/camnotif.ts` | `cn-${Date.now()}-...` → `cn-${crypto.randomUUID()}` |

### B. 메모리 누수 방지 (3건)

`requestAnimationFrame` 사용 컴포넌트에 `useEffect` cleanup 추가 — 언마운트 시 `cancelAnimationFrame` 보장.

| 파일 | 변경 |
|------|------|
| `components/layout/Header.tsx` | cleanup useEffect 추가 |
| `components/post/UniversityTabs.tsx` | cleanup useEffect 추가 + `useEffect` import |
| `components/post/CategoryGrid.tsx` | cleanup useEffect 추가 |

### C. Promise.all 에러 처리 (1건)

| 파일 | 변경 |
|------|------|
| `app/post/[id]/page.tsx` | `getRelatedPosts(id, 4)` → `getRelatedPosts(id, 4).catch(() => [])` — 관련 게시글 로드 실패 시 빈 배열 폴백 |

### D. 이미지 유틸 안전성 (1건)

| 파일 | 변경 |
|------|------|
| `lib/imageUtils.ts` | `validateImageFile()` 함수 추가 — 10MB 크기 제한 + `image/*` 타입 검증 (jpeg/png/gif/webp) |

### E. 입력값 검증 강화 (1건)

| 파일 | 변경 |
|------|------|
| `lib/api.ts` | `createPost`/`updatePost`에 제목(100자)/본문(5000자) 길이 검증 + 빈값 체크 (`LIMITS` 상수 사용) |

### F. 접근성 개선 (2건)

| 파일 | 변경 |
|------|------|
| `app/search/page.tsx` | 검색 input에 `aria-label="검색어 입력"` 추가 |
| `components/layout/BottomNav.tsx` | 5개 네비 SVG에 `aria-hidden="true"` 추가 |

### 수정 파일 목록 (11개)

```
campulist/src/lib/api.ts
campulist/src/lib/auth.ts
campulist/src/lib/camtalk.ts
campulist/src/lib/camnotif.ts
campulist/src/lib/imageUtils.ts
campulist/src/components/layout/Header.tsx
campulist/src/components/layout/BottomNav.tsx
campulist/src/components/post/UniversityTabs.tsx
campulist/src/components/post/CategoryGrid.tsx
campulist/src/app/post/[id]/page.tsx
campulist/src/app/search/page.tsx
```

### TypeScript 빌드: 0 에러

---

## 작업 일자: 2026-02-26 (3차) — 카테고리 이름 변경 + 소분류 추가

### A. 대분류 이름 변경: "커뮤니티" → "게시판"

기존 "커뮤니티"가 직관적이지 않아 간결한 "게시판"으로 변경.
소분류(스터디, 동아리, 자유게시판 등)가 이미 구체적이므로 대분류는 짧게.

| 파일 | 변경 |
|------|------|
| `data/categories.ts` | `name: '커뮤니티'` → `name: '게시판'` (slug `community` 유지) |
| `data/categoryExamples.ts` | `"커뮤니티에서"` → `"게시판에서"` |

### B. 소분류 추가: "🔥 으쌰으쌰" (게시판 > 으쌰으쌰)

캠퍼스 학생들이 서로 응원/격려/동기부여 글을 올리는 게시판.

| 항목 | 값 |
|------|-----|
| id | 48 |
| name | 으쌰으쌰 |
| slug | cheer |
| icon | 🔥 |
| postAccess | campus |
| sortOrder | 8 |

| 파일 | 변경 |
|------|------|
| `data/categories.ts` | 소분류 항목 추가 |
| `data/categoryExamples.ts` | 글쓰기 예시 템플릿 추가 |

### 영향 범위

- slug 불변 → URL/라우팅 변경 없음
- UI 자동 반영 (CategoryGrid, Header 메뉴, 글쓰기 폼 모두 데이터 기반)

### TypeScript 빌드: 0 에러
