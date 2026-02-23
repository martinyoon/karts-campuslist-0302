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

### 6. Supabase 연동 가이드 문서 작성

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
[완료] npm run build 성공 (TypeScript 에러 없음)
[완료] GitHub 푸시 완료 (5개 커밋)
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
