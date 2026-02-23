# 캠퍼스리스트 작업 노트

## 작업 일자: 2026-02-23

---

## 프로젝트 개요

**캠퍼스리스트(Campulist)** — 대학교 기반 중고거래/커뮤니티 플랫폼

- **기술 스택**: Next.js 16.1.6 (App Router, Turbopack), React, TypeScript, Tailwind CSS
- **인증**: localStorage 기반 Mock Auth (Supabase 연동 예정)
- **데이터**: 로컬 JSON/TS 파일 기반 Mock Data
- **경로**: `campulist/` 디렉토리 내 Next.js 프로젝트

### 주요 기능 구조

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 홈 | `/` | 대학별 최신 게시글 |
| 대학별 | `/[university]` | 대학교별 게시글 목록 |
| 카테고리별 | `/[university]/[category]` | 대학+카테고리 필터 |
| 전체 카테고리 | `/all/[category]` | 전체 대학 카테고리별 |
| 글쓰기 | `/write` | 게시글 작성/수정 |
| 게시글 상세 | `/post/[id]` | 개별 게시글 |
| 캠톡 | `/camtalk` | 1:1 채팅 목록 |
| 캠톡 대화 | `/camtalk/[id]` | 개별 채팅방 |
| 마이페이지 | `/my` | 내 정보/게시글 |
| 검색 | `/search` | 게시글 검색 |
| 회원가입/로그인 | `/auth` | 인증 |

### 핵심 데이터 파일

| 파일 | 내용 |
|------|------|
| `src/data/universities.ts` | 대학교 목록 (캠퍼스, 지역 포함) |
| `src/data/categories.ts` | 카테고리 (대분류/소분류 46개) |
| `src/data/categoryExamples.ts` | 카테고리별 글쓰기 예시 데이터 |
| `src/data/posts.ts` | Mock 게시글 데이터 |
| `src/lib/types.ts` | TypeScript 타입 정의 |
| `src/lib/api.ts` | Mock API 함수 (CRUD) |
| `src/lib/constants.ts` | 상수 (STORAGE_KEYS, LIMITS 등) |
| `src/contexts/AuthContext.tsx` | 인증 컨텍스트 |

### User 타입 참고

```ts
interface User {
  id: string;
  email: string;
  nickname: string;        // name이 아닌 nickname
  avatarUrl: string | null;
  role: UserRole;
  memberType: MemberType;  // undergraduate | graduate | professor | staff | alumni | merchant | general
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
- **최근 커밋**: `2d214d1` — feat: 캠퍼스리스트 초기 커밋 (글쓰기 예시 채우기 7가지 기능 개선)
- **마지막 푸시**: 2026-02-23 (7가지 기능 구현 전 상태)
- **푸시 안 된 변경**: 인기태그 추천, 필드 하이라이트, 미리보기 바텀시트, NOTES.md

---

## 완료된 작업

### 1. 캠톡 univPrefix 수정

**파일**: `campulist/src/app/camtalk/[id]/page.tsx` (line ~74-76)

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

#### 2-1. 데이터 구조 확장 (`categoryExamples.ts`)

```ts
export interface ToneVariant { title: string; body: string; }
export type ToneType = 'clean' | 'friendly' | 'urgent' | 'humor';
export interface CategoryExampleSet {
  examples: CategoryExample[];                          // 카테고리당 2~3개
  tones?: Partial<Record<ToneType, ToneVariant>>;       // 톤별 제목/본문 변형
  popularTags: string[];                                // 인기 태그 5~8개
  seasonalHints?: Record<string, { titleSuffix?: string; bodyHint?: string }>;
}
```

- 기존 `categoryExamples` (Record<number, CategoryExample>) 유지 (하위 호환)
- 새로 `categoryExampleSets` (Record<number, CategoryExampleSet>) 추가
- 46개 소분류 전체에 데이터 확장
- 주요 10개 카테고리(중고마켓 8 + 주거 2)에 톤 변형 적용

#### 2-2. 7가지 기능 상세

**(1) 랜덤 예시 뽑기** — 슬롯머신 애니메이션(80ms x 10회), 예시가 여러 개면 랜덤 선택

**(2) 톤/스타일 선택기** — 4개 톤(깔끔/친근/급매/유머) 칩 버튼, 제목/본문만 변형, `applyTone()` 함수

**(3) 완성도 점수 프로그레스 바** — 0~100점, 구간별 라벨/색상, 다음 단계 힌트

| 항목 | 점수 |
|------|------|
| 제목 10자+ | +15 |
| 가격 입력 | +10 |
| 내용 100자+ | +20 |
| 내용 300자+ | +10 추가 |
| 사진 1장+ | +15 |
| 사진 3장+ | +10 추가 |
| 태그 1개+ | +10 |
| 거래 장소 | +5 |
| 연락 방법 | +5 |

**(4) 시즌/시기 맞춤** — 월 기반 시즌 감지(신학기/시험/축제/방학), 배지+힌트 표시

**(5) 빈칸만 스마트 채우기** — 비어있는 필드만 채움, 토스트 알림, 필드 하이라이트(1.5초)

**(6) 실시간 미리보기** — 바텀시트로 실제 게시글 형태 렌더링(이미지/제목/가격/본문/태그/장소/작성자)

**(7) 인기 태그 자동 추천** — 카테고리별 인기 태그 칩, 클릭 즉시 추가, 5개 도달 시 숨김

---

## 현재 진행 상황

```
[완료] 캠톡 univPrefix 수정
[완료] categoryExamples.ts 데이터 구조 확장 (46개 카테고리)
[완료] write/page.tsx 7가지 기능 통합 구현
[완료] npm run build 성공 (TypeScript 에러 없음)
[완료] GitHub 저장소 생성 + 초기 커밋 푸시
[미푸시] 인기태그/하이라이트/미리보기 추가분 + NOTES.md (로컬에만 있음)
```

### 빌드 상태

- `npm run build` 성공 (TypeScript 에러 없음)
- Next.js 16.1.6 (Turbopack)
- 정적 페이지 13개 생성 완료

---

## 다음 할 일 (TODO)

### 우선순위 높음

- [ ] 최신 변경사항 GitHub 푸시 (인기태그/하이라이트/미리보기 + NOTES.md)
- [ ] 캠퍼스 선택 기능 점검 — 회원가입/프로필 편집에서 캠퍼스 선택이 정상 작동하는지 확인
- [ ] 실제 사용 테스트 — `npm run dev`로 글쓰기 페이지에서 7가지 기능 직접 확인
  - 각 카테고리에서 랜덤 뽑기 -> 다양한 예시 출력?
  - 톤 변경 -> 제목/본문 변경?
  - 빈칸만 채우기 -> 이미 입력된 필드 보존?
  - 완성도 점수 -> 필드 채울수록 점수 상승?
  - 인기 태그 클릭 -> 태그 추가?
  - 미리보기 -> 실제 게시글 형태?
  - 시즌 배지 -> 현재 2월이므로 "신학기 맞춤" 표시?

### 우선순위 중간

- [ ] Supabase 연동 — Mock Auth/Data를 실제 Supabase로 전환
- [ ] 이미지 업로드 — 현재 base64 로컬 저장 -> Supabase Storage 연동
- [ ] 채팅(캠톡) 실시간 기능 — 현재 Mock -> Supabase Realtime
- [ ] 검색 기능 고도화 — 현재 로컬 필터 -> 전문 검색(Full-text search)
- [ ] 알림(캠노티) 구현 — 현재 UI만 있음

### 우선순위 낮음 / 개선 아이디어

- [ ] 글쓰기 예시 데이터 검수 — 46개 카테고리 예시 문구 품질 확인/수정
- [ ] 톤 변형 카테고리 확장 — 현재 10개 -> 전체 46개로 확대
- [ ] 미리보기 바텀시트 애니메이션 개선 — `animate-in` 클래스가 실제 작동하는지 확인
- [ ] 다크모드 대응 점검 — 미리보기 바텀시트 등 새 UI의 다크모드 색상
- [ ] PWA / 모바일 최적화
- [ ] SEO 메타태그 설정
- [ ] 배포 (Vercel)

---

## 참고 사항

- `categoryExamples` (기존)과 `categoryExampleSets` (신규) 두 개의 export가 공존함 — 기존 코드 하위 호환 유지
- User 타입에서 이름 필드는 `name`이 아닌 `nickname`임 (주의)
- 글쓰기 폼의 `fillTemplate()`은 `{{prefix}}`, `{{university}}`, `{{department}}`, `{{memberType}}` 플레이스홀더 지원
- 톤 변형은 `title`과 `body`만 오버라이드, `price`/`tags`/`location`은 기본 예시 그대로
