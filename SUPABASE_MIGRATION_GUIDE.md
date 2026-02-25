# 캠퍼스리스트 Supabase 연동 — Claude Code 지시사항 가이드

> UI 완료 후, 이 문서의 지시사항을 **순서대로** Claude Code에 전달하면 됩니다.
> 각 단계는 독립적으로 테스트 가능하도록 설계되어 있습니다.

---

## 목차

1. [사전 준비](#1-사전-준비)
2. [Supabase 테이블 생성](#2-supabase-테이블-생성)
3. [인증 시스템 전환](#3-인증-시스템-전환)
4. [게시글 CRUD 전환](#4-게시글-crud-전환)
5. [이미지 업로드 전환](#5-이미지-업로드-전환)
6. [찜/조회수/검색 전환](#6-찜조회수검색-전환)
7. [캠퍼스톡 실시간 채팅 전환](#7-캠퍼스톡-실시간-채팅-전환)
8. [캠노티 알림 전환](#8-캠노티-알림-전환)
9. [RLS 보안 정책](#9-rls-보안-정책)
10. [최종 정리 및 배포](#10-최종-정리-및-배포)

---

## 1. 사전 준비

### Claude Code 지시사항

```
캠퍼스리스트 프로젝트에 Supabase를 연동하려고 합니다.

1. @supabase/supabase-js 패키지를 설치해줘
2. campulist/src/lib/supabase.ts 파일을 만들어서 Supabase 클라이언트를 초기화해줘
3. .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 넣을 수 있도록 설정해줘
4. 기존 api.ts는 건드리지 말고, 새로 supabase-api.ts를 만들어서 점진적으로 전환할 수 있게 해줘
```

### 참고: 현재 프로젝트 구조

```
campulist/src/
├── lib/
│   ├── api.ts              ← 현재 Mock API (이 파일을 supabase 버전으로 교체)
│   ├── auth.ts             ← 현재 Mock Auth
│   ├── types.ts            ← TypeScript 타입 (유지)
│   ├── constants.ts        ← STORAGE_KEYS, LIMITS (일부 유지)
│   ├── camtalk.ts          ← 현재 localStorage 채팅
│   └── camnotif.ts         ← 현재 localStorage 알림
├── contexts/
│   └── AuthContext.tsx      ← 인증 컨텍스트 (Supabase로 교체)
└── data/
    ├── universities.ts     ← 대학 데이터 (DB 시드 데이터로 전환)
    ├── categories.ts       ← 카테고리 데이터 (DB 시드 데이터로 전환)
    ├── posts.ts            ← Mock 게시글 (삭제 예정)
    ├── users.ts            ← Mock 유저 (삭제 예정)
    └── categoryExamples.ts ← 글쓰기 예시 (로컬 유지)
```

---

## 2. Supabase 테이블 생성

### Claude Code 지시사항

```
캠퍼스리스트의 Supabase 테이블을 생성하는 SQL 마이그레이션 파일을 만들어줘.
campulist/supabase/migrations/ 폴더에 저장해줘.

아래 테이블이 필요합니다:

### 테이블 1: universities (대학교)
- id: serial primary key
- name: text not null (예: '서울대학교')
- slug: text unique not null (예: 'snu')
- name_en: text
- domain: text not null (예: 'snu.ac.kr')
- region: text
- logo_url: text
- is_active: boolean default true
- created_at: timestamptz default now()

### 테이블 2: campuses (캠퍼스 — universities와 1:N)
- id: serial primary key
- university_id: integer references universities(id)
- name: text not null (예: '관악캠퍼스')
- region: text (예: '서울 관악구')

### 테이블 3: categories (카테고리 — 자기참조)
- id: serial primary key
- name: text not null
- slug: text unique not null
- parent_id: integer references categories(id) (null이면 대분류)
- icon: text (이모지)
- sort_order: integer default 0

### 테이블 4: profiles (사용자 프로필 — auth.users와 1:1)
- id: uuid primary key references auth.users(id) on delete cascade
- email: text unique not null
- nickname: text unique not null
- avatar_url: text
- role: text default 'user' check (role in ('user', 'business', 'admin'))
- member_type: text not null check (member_type in ('undergraduate', 'graduate', 'professor', 'staff', 'alumni', 'merchant', 'general'))
- university_id: integer references universities(id)
- campus: text
- department: text
- is_verified: boolean default false
- verified_at: timestamptz
- manner_temp: numeric(4,1) default 36.5
- trade_count: integer default 0
- created_at: timestamptz default now()

### 테이블 5: posts (게시글)
- id: uuid primary key default gen_random_uuid()
- title: text not null
- body: text not null
- author_id: uuid references profiles(id) on delete cascade
- university_id: integer references universities(id)
- category_major_id: integer references categories(id)
- category_minor_id: integer references categories(id)
- price: integer (null 허용 — 가격미정)
- price_negotiable: boolean default false
- is_premium: boolean default false
- status: text default 'active' check (status in ('active', 'reserved', 'completed', 'hidden'))
- location_detail: text
- contact_methods: jsonb default '{"chat": true}'
- view_count: integer default 0
- like_count: integer default 0
- bumped_at: timestamptz default now()
- created_at: timestamptz default now()
- updated_at: timestamptz default now()

### 테이블 6: post_images (게시글 이미지 — posts와 1:N)
- id: uuid primary key default gen_random_uuid()
- post_id: uuid references posts(id) on delete cascade
- url: text not null
- sort_order: integer default 0
- created_at: timestamptz default now()

### 테이블 7: post_tags (게시글 태그 — posts와 1:N)
- id: uuid primary key default gen_random_uuid()
- post_id: uuid references posts(id) on delete cascade
- tag: text not null
- UNIQUE(post_id, tag)

### 테이블 8: post_likes (찜 — posts + profiles M:N)
- user_id: uuid references profiles(id) on delete cascade
- post_id: uuid references posts(id) on delete cascade
- created_at: timestamptz default now()
- PRIMARY KEY (user_id, post_id)

### 테이블 9: camtalk_rooms (채팅방)
- id: uuid primary key default gen_random_uuid()
- user1_id: uuid references profiles(id) on delete cascade
- user2_id: uuid references profiles(id) on delete cascade
- last_message: text
- last_message_at: timestamptz
- created_at: timestamptz default now()
- UNIQUE(user1_id, user2_id) — 중복 방지 (user1_id < user2_id로 정규화)

### 테이블 10: camtalk_messages (채팅 메시지)
- id: uuid primary key default gen_random_uuid()
- room_id: uuid references camtalk_rooms(id) on delete cascade
- sender_id: uuid references profiles(id) on delete cascade
- content: text not null
- is_read: boolean default false
- created_at: timestamptz default now()

### 테이블 11: notifications (알림)
- id: uuid primary key default gen_random_uuid()
- recipient_id: uuid references profiles(id) on delete cascade
- type: text not null check (type in ('camtalk', 'system', 'like', 'comment'))
- title: text not null
- body: text
- link: text
- is_read: boolean default false
- created_at: timestamptz default now()

### 테이블 12: recent_viewed (최근 본 게시글)
- user_id: uuid references profiles(id) on delete cascade
- post_id: uuid references posts(id) on delete cascade
- viewed_at: timestamptz default now()
- PRIMARY KEY (user_id, post_id)

### 인덱스
- posts: (university_id), (category_major_id), (category_minor_id), (author_id), (status, bumped_at DESC)
- post_likes: (user_id), (post_id)
- camtalk_rooms: (user1_id), (user2_id)
- camtalk_messages: (room_id, created_at)
- notifications: (recipient_id, is_read, created_at DESC)
- recent_viewed: (user_id, viewed_at DESC)

### 시드 데이터
- src/data/universities.ts의 5개 대학교 + 캠퍼스 데이터를 INSERT문으로 만들어줘
- src/data/categories.ts의 52개 카테고리 데이터를 INSERT문으로 만들어줘

### 중요
- 모든 테이블에 created_at 컬럼 포함
- snake_case 컨벤션 사용 (TypeScript에서는 camelCase로 매핑)
- posts.updated_at은 트리거로 자동 갱신되도록 함수 만들어줘
```

### 참고: 현재 타입과 DB 컬럼 매핑

| TypeScript (현재) | Supabase 컬럼 | 비고 |
|---|---|---|
| `User.id` (string: 'u1') | `profiles.id` (uuid) | ID 형식 변경 |
| `User.nickname` | `profiles.nickname` | name이 아닌 nickname |
| `User.memberType` (camelCase) | `profiles.member_type` (snake_case) | 케이스 변환 필요 |
| `Post.categoryMajorId` | `posts.category_major_id` | 케이스 변환 필요 |
| `Post.bumpedAt` | `posts.bumped_at` | 케이스 변환 필요 |
| `Post.contactMethods` (object) | `posts.contact_methods` (jsonb) | JSON으로 저장 |
| `CamTalkRoom.participants` (array) | `camtalk_rooms.user1_id + user2_id` | 구조 변경 |
| `CamTalkRoom.unread` (object) | `camtalk_messages.is_read` | 계산 방식 변경 |

---

## 3. 인증 시스템 전환

### Claude Code 지시사항

```
캠퍼스리스트의 인증 시스템을 Supabase Auth로 전환해줘.

### 현재 상태
- campulist/src/lib/auth.ts — Mock 인증 (localStorage 기반)
- campulist/src/contexts/AuthContext.tsx — Mock AuthContext
- 비밀번호: 하드코딩 '1234'
- 이메일 도메인(.ac.kr)으로 대학교 자동 매칭

### 전환 요구사항

1. auth.ts를 supabase-auth.ts로 새로 만들어줘 (기존 파일 보존)
2. Supabase Auth의 signUp, signInWithPassword, signOut 사용
3. 회원가입 시:
   - supabase.auth.signUp()으로 auth.users 생성
   - 성공 후 profiles 테이블에 프로필 정보 INSERT
   - 이메일 도메인으로 university_id 자동 매칭 (현재 로직 유지)
   - .ac.kr 도메인이면 is_verified = true 자동 설정
4. 로그인 시:
   - supabase.auth.signInWithPassword() 사용
   - 성공 후 profiles 테이블에서 사용자 프로필 조회
5. AuthContext.tsx 수정:
   - supabase.auth.onAuthStateChange() 리스너 사용
   - user 상태를 Supabase 세션에서 가져오기
   - profiles 테이블에서 추가 정보(nickname, memberType 등) 조회
6. 프로필 수정:
   - profiles 테이블 직접 UPDATE
7. 계정 삭제:
   - profiles 행 삭제 → cascade로 관련 데이터 정리
   - supabase.auth.admin.deleteUser()는 서버사이드에서만 가능하므로,
     프로필만 삭제하고 auth.users는 남겨두거나 Edge Function 사용

### 현재 User 타입 (유지)
interface User {
  id: string;
  email: string;
  nickname: string;        // name이 아닌 nickname 주의!
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

### 주의사항
- Supabase의 snake_case → TypeScript의 camelCase 변환 유틸 함수 만들어줘
- 기존 MEMBER_TYPE_SHORT, MEMBER_TYPE_LABEL 상수는 그대로 유지
- localStorage의 CURRENT_USER, REGISTERED_USERS 키는 더 이상 사용하지 않음
- 로그인 유지는 Supabase 세션(쿠키/토큰)으로 자동 처리됨
```

---

## 4. 게시글 CRUD 전환

### Claude Code 지시사항

```
캠퍼스리스트의 게시글 API를 Supabase로 전환해줘.

### 현재 상태
- campulist/src/lib/api.ts — Mock API (mockPosts + localStorage)
- 게시글 생성: localStorage에 'local-{timestamp}' ID로 저장
- 게시글 수정: mock은 POST_OVERRIDES, local은 직접 수정
- 게시글 삭제: mock은 status='hidden', local은 배열에서 제거

### 전환할 함수 목록 (api.ts → supabase 버전)

1. getPosts(filters) → Supabase query
   - .from('posts').select('*, profiles!author_id(nickname, avatar_url, manner_temp)')
   - 필터: university_id, category_major_id, category_minor_id
   - 검색: title ilike '%query%' or body ilike '%query%'
   - 가격: price >= min, price <= max
   - 정렬: bumped_at desc (latest), price asc/desc, like_count desc (popular)
   - 페이지네이션: .range(start, end)

2. getPostDetail(postId) → Supabase query
   - posts + profiles(author) + universities + categories + post_images + post_tags 조인
   - post_likes에서 현재 사용자의 찜 여부 확인

3. createPost(input) → Supabase insert
   - posts 테이블 INSERT
   - post_images 테이블에 이미지 URL들 INSERT
   - post_tags 테이블에 태그들 INSERT
   - 트랜잭션으로 묶어줘 (하나라도 실패하면 롤백)

4. updatePost(postId, input) → Supabase update
   - posts 테이블 UPDATE
   - post_images: 기존 삭제 후 새로 INSERT
   - post_tags: 기존 삭제 후 새로 INSERT

5. deletePost(postId) → Supabase update
   - status를 'hidden'으로 변경 (soft delete)

6. getRelatedPosts(postId, limit) → Supabase query
   - 같은 소분류 → 같은 대분류 → 같은 대학 순서 로직 유지

7. getMyPosts(userId) → Supabase query
8. getUserPosts(userId) → Supabase query
9. getPostForEdit(postId) → Supabase query (tags 포함)

### 중요
- 기존 PostListItem, PostDetail 타입 구조를 유지해줘
- toPostListItem() 변환 로직은 Supabase select문에서 필요한 필드만 가져오는 방식으로 대체
- Supabase 응답의 snake_case를 camelCase로 변환하는 유틸 사용
- Post.id 형식이 'p1' 같은 문자열에서 UUID로 바뀌므로 관련 코드 체크
- 로컬 게시글('local-*') 관련 분기 코드는 삭제
- POST_OVERRIDES localStorage 로직 삭제
```

---

## 5. 이미지 업로드 전환

### Claude Code 지시사항

```
캠퍼스리스트의 이미지 업로드를 Supabase Storage로 전환해줘.

### 현재 상태
- 이미지를 base64 데이터URL로 localStorage에 저장 중
- Mock 게시글은 picsum.photos 외부 URL 사용
- campulist/src/app/write/page.tsx의 handleImageUpload에서 처리

### 전환 요구사항

1. Supabase Storage에 'post-images' 버킷 생성 (public)
2. 이미지 업로드 함수 만들어줘:
   - uploadPostImage(file: File, postId: string): Promise<string>
   - 경로: post-images/{postId}/{timestamp}-{random}.{ext}
   - 업로드 후 public URL 반환
3. 이미지 삭제 함수:
   - deletePostImage(url: string): Promise<void>
4. write/page.tsx의 handleImageUpload 수정:
   - 현재: FileReader로 base64 변환 → setImages
   - 변경: Supabase Storage에 업로드 → URL 저장
   - 단, 게시글 제출 전에는 임시 경로에 업로드하고,
     제출 시 최종 경로로 이동하거나 정리
5. 이미지 리사이즈 로직 유지:
   - 현재 compressImage() 함수가 있음 — 업로드 전 리사이즈는 클라이언트에서 유지
   - 최대 너비 1200px, JPEG quality 0.8

### 주의사항
- MAX_IMAGES: 10 제한 유지
- 게시글 삭제 시 Storage의 이미지도 삭제
- 게시글 수정 시 제거된 이미지는 Storage에서도 삭제
- RLS: 인증된 사용자만 업로드 가능, 읽기는 public
```

---

## 6. 찜/조회수/검색 전환

### Claude Code 지시사항

```
캠퍼스리스트의 찜, 조회수, 최근 본 게시글, 검색 기능을 Supabase로 전환해줘.

### 찜 (Like) 기능

현재: localStorage의 LIKED_POSTS 배열 + POST_OVERRIDES의 likeCount
변경:
1. toggleLike(postId) → post_likes 테이블 INSERT/DELETE
2. like_count는 posts 테이블의 컬럼으로 유지하되, DB 트리거로 자동 계산
   - post_likes에 INSERT → posts.like_count + 1
   - post_likes에서 DELETE → posts.like_count - 1
3. getLikedPostIds(userId) → post_likes에서 user_id로 조회
4. 게시글 상세에서 isLiked 여부 → post_likes에서 확인

### 조회수 (View Count)

현재: sessionStorage로 중복 방지 + POST_OVERRIDES
변경:
1. incrementViewCount → posts 테이블 직접 UPDATE (view_count + 1)
2. 중복 방지: sessionStorage 방식 유지 (클라이언트에서 체크)
   또는 recent_viewed 테이블을 활용하여 서버사이드 중복 체크

### 최근 본 게시글

현재: localStorage의 RECENT_VIEWED 배열 (최대 20개)
변경:
1. addRecentViewed → recent_viewed 테이블 UPSERT
2. getRecentViewedPosts → recent_viewed JOIN posts (최근 20개, viewed_at DESC)

### 검색 기능

현재: 클라이언트사이드 title/body.includes(query)
변경:
1. posts 테이블에 full-text search 인덱스 추가:
   - ALTER TABLE posts ADD COLUMN fts tsvector
     GENERATED ALWAYS AS (to_tsvector('simple', title || ' ' || body)) STORED;
   - CREATE INDEX posts_fts_idx ON posts USING gin(fts);
2. 검색 쿼리: .textSearch('fts', query)
3. 최근 검색어는 localStorage 유지 (개인 디바이스 전용이므로 DB 불필요)

### 끌어올리기 (Bump)

현재: POST_OVERRIDES에 bumpedAt 갱신
변경:
1. bumpPost → posts 테이블 bumped_at UPDATE

### 게시글 상태 변경

현재: POST_OVERRIDES에 status 갱신
변경:
1. updatePostStatus → posts 테이블 status UPDATE
```

---

## 7. 캠퍼스톡 실시간 채팅 전환

### Claude Code 지시사항

```
캠퍼스리스트의 캠퍼스톡(1:1 채팅)을 Supabase Realtime으로 전환해줘.

### 현재 상태
- campulist/src/lib/camtalk.ts — localStorage 기반
- window.dispatchEvent('camtalkUpdate')로 UI 갱신
- 기능: 방 생성, 메시지 전송, 읽음 처리, 안 읽은 메시지 수

### 전환 요구사항

1. camtalk_rooms 테이블 사용:
   - startCamTalk(me, partner, firstMessage?) → rooms UPSERT + messages INSERT
   - user1_id < user2_id로 정규화하여 중복 방 방지
   - getMyRooms(userId) → user1_id = userId OR user2_id = userId

2. camtalk_messages 테이블 사용:
   - sendMessage(roomId, senderId, content) → messages INSERT + rooms.last_message UPDATE
   - getMessages(roomId) → messages WHERE room_id ORDER BY created_at ASC

3. 읽음 처리:
   - markRead(roomId, userId) → messages UPDATE SET is_read = true WHERE room_id AND sender_id != userId
   - 안 읽은 수: messages WHERE room_id AND sender_id != userId AND is_read = false COUNT

4. Supabase Realtime 구독:
   - 채팅방 목록: camtalk_rooms 테이블 변경 구독
   - 채팅 메시지: camtalk_messages 테이블에서 room_id 필터로 구독
   - 구독 설정:
     supabase.channel('room-{roomId}')
       .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'camtalk_messages', filter: `room_id=eq.${roomId}` }, callback)
       .subscribe()

5. camtalk/page.tsx 수정:
   - 기존 'camtalkUpdate' 이벤트 리스너 → Supabase Realtime 구독으로 대체
   - useEffect에서 구독, cleanup에서 unsubscribe

6. camtalk/[id]/page.tsx 수정:
   - 메시지 실시간 수신
   - 입장 시 markRead 호출
   - 스크롤 자동 이동

### 주의사항
- Realtime 구독은 컴포넌트 마운트 시 시작, 언마운트 시 해제
- 방 목록에서 상대방 정보는 profiles 테이블 조인으로 가져오기
- 현재 CamTalkParticipant 타입의 univPrefix 로직 유지
```

---

## 8. 캠노티 알림 전환

### Claude Code 지시사항

```
캠퍼스리스트의 알림(캠노티)을 Supabase로 전환해줘.

### 현재 상태
- campulist/src/lib/camnotif.ts — localStorage 기반
- 알림 타입: 'camtalk' | 'system'
- window.dispatchEvent('camnotifUpdate')로 UI 갱신

### 전환 요구사항

1. notifications 테이블 사용
2. 함수 전환:
   - getMyNotifs(userId) → SELECT WHERE recipient_id ORDER BY created_at DESC
   - getMyUnreadCount(userId) → SELECT COUNT WHERE recipient_id AND is_read = false
   - markRead(notifId) → UPDATE SET is_read = true
   - markAllRead(userId) → UPDATE SET is_read = true WHERE recipient_id
   - createCamNotif(input) → INSERT

3. 알림 생성 트리거 (DB 함수):
   - 새 채팅 메시지 → 수신자에게 'camtalk' 알림 자동 생성
   - 새 찜 → 게시글 작성자에게 'like' 알림 자동 생성 (선택)

4. Realtime 구독:
   - notifications 테이블에서 recipient_id 필터로 구독
   - 새 알림 도착 시 UI 배지 숫자 갱신

5. camnotif/page.tsx 수정:
   - 'camnotifUpdate' 이벤트 → Realtime 구독으로 대체

### 주의사항
- 알림은 30일 후 자동 삭제하는 정책 고려 (DB cron job)
- 알림 생성은 DB 트리거 또는 Edge Function으로 서버사이드에서 처리
```

---

## 9. RLS 보안 정책

### Claude Code 지시사항

```
캠퍼스리스트의 Supabase RLS(Row Level Security) 정책을 설정해줘.

### profiles 테이블
- SELECT: 모든 인증 사용자가 모든 프로필 조회 가능
- INSERT: auth.uid() = id인 경우만 (자기 프로필만 생성)
- UPDATE: auth.uid() = id인 경우만 (자기 프로필만 수정)
- DELETE: auth.uid() = id인 경우만

### posts 테이블
- SELECT: 모두 가능 (비인증 포함 — 게시글 목록은 공개)
- INSERT: 인증된 사용자 + author_id = auth.uid()
- UPDATE: author_id = auth.uid()인 경우만
- DELETE: 없음 (soft delete만 사용)

### post_images 테이블
- SELECT: 모두 가능
- INSERT: 인증된 사용자 (해당 post의 author인지 확인)
- DELETE: 해당 post의 author만

### post_tags 테이블
- SELECT: 모두 가능
- INSERT/DELETE: 해당 post의 author만

### post_likes 테이블
- SELECT: 인증된 사용자 (자기 찜 목록)
- INSERT: auth.uid() = user_id
- DELETE: auth.uid() = user_id

### camtalk_rooms 테이블
- SELECT: user1_id = auth.uid() OR user2_id = auth.uid()
- INSERT: 인증된 사용자 + 자신이 참여자인 경우

### camtalk_messages 테이블
- SELECT: 해당 room의 참여자만
- INSERT: sender_id = auth.uid() + 해당 room의 참여자

### notifications 테이블
- SELECT: recipient_id = auth.uid()
- UPDATE: recipient_id = auth.uid() (읽음 처리)
- INSERT: 서버사이드만 (service_role key 사용)

### recent_viewed 테이블
- SELECT: user_id = auth.uid()
- INSERT/UPDATE: user_id = auth.uid()

### Storage (post-images 버킷)
- SELECT: 모두 가능 (public)
- INSERT: 인증된 사용자
- DELETE: 파일 소유자만
```

---

## 10. 최종 정리 및 배포

### Claude Code 지시사항

```
Supabase 연동이 완료되면 다음을 정리해줘:

### 삭제할 파일
- campulist/src/data/posts.ts (Mock 게시글)
- campulist/src/data/users.ts (Mock 유저)
- campulist/src/lib/auth.ts (Mock 인증) — supabase-auth.ts로 대체 완료 후

### 삭제할 localStorage 키 사용처
- CURRENT_USER → Supabase 세션으로 대체
- REGISTERED_USERS → Supabase Auth로 대체
- USER_POSTS → Supabase posts 테이블로 대체
- POST_OVERRIDES → 직접 DB 수정으로 대체
- POST_TAGS → post_tags 테이블로 대체
- POST_IMAGES → post_images 테이블 + Storage로 대체
- LIKED_POSTS → post_likes 테이블로 대체
- RECENT_VIEWED → recent_viewed 테이블로 대체
- PROFILE_OVERRIDES → profiles 직접 수정으로 대체

### 유지할 localStorage 키
- WRITE_DRAFT → 임시저장은 로컬 유지 (오프라인 지원)
- RECENT_SEARCHES → 개인 검색 기록은 로컬 유지
- SHOW_ICONS → UI 설정은 로컬 유지

### 유지할 파일
- campulist/src/data/universities.ts → DB 시드 참조용으로 보존
- campulist/src/data/categories.ts → DB 시드 참조용으로 보존
- campulist/src/data/categoryExamples.ts → 글쓰기 예시 (DB 불필요, 로컬 유지)
- campulist/src/lib/types.ts → 타입 정의 유지

### 환경변수 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

### Vercel 배포 시
- Vercel 환경변수에 위 2개 추가
- Supabase 대시보드에서 Vercel 도메인을 Site URL에 등록
```

---

## 전환 순서 요약

```
단계 1: 사전 준비 ─────────── 패키지 설치 + 클라이언트 초기화
  │
단계 2: 테이블 생성 ─────────── SQL 마이그레이션 + 시드 데이터
  │
단계 3: 인증 전환 ──────────── Auth + profiles (가장 먼저, 다른 기능의 기반)
  │  └─ 테스트: 회원가입 → 로그인 → 프로필 수정 → 로그아웃
  │
단계 4: 게시글 CRUD ─────────── posts + images + tags
  │  └─ 테스트: 글쓰기 → 목록 → 상세 → 수정 → 삭제
  │
단계 5: 이미지 업로드 ────────── Storage 버킷 + 업로드 함수
  │  └─ 테스트: 이미지 첨부 글쓰기 → 수정 시 이미지 교체
  │
단계 6: 찜/조회수/검색 ───────── 보조 기능들
  │  └─ 테스트: 찜 토글 → 조회수 → 검색 → 최근 본 게시글
  │
단계 7: 캠퍼스톡 Realtime ────────── 실시간 채팅 (가장 복잡)
  │  └─ 테스트: 대화 시작 → 메시지 전송 → 실시간 수신 → 읽음 처리
  │
단계 8: 캠노티 ──────────────── 알림
  │  └─ 테스트: 알림 수신 → 읽음 처리 → 전체 읽음
  │
단계 9: RLS 보안 ────────────── Row Level Security 정책
  │  └─ 테스트: 다른 사용자 데이터 접근 차단 확인
  │
단계 10: 정리 + 배포 ─────────── Mock 코드 삭제 + Vercel 배포
```

---

## 주의사항 총정리

| 항목 | 주의사항 |
|------|----------|
| User.nickname | `name`이 아니라 `nickname` — Supabase에서도 동일하게 |
| ID 형식 변경 | 'p1', 'u1', 'local-xxx' → UUID로 전부 변경 |
| snake_case 변환 | Supabase는 snake_case, TypeScript는 camelCase — 변환 유틸 필수 |
| contactMethods | jsonb로 저장, 타입 검증은 클라이언트에서 |
| 캠퍼스톡 방 정규화 | user1_id < user2_id로 항상 정렬하여 중복 방지 |
| 이미지 base64 | localStorage base64 → Supabase Storage URL로 완전 전환 |
| 드래프트 | localStorage 유지 (오프라인 지원) |
| 카테고리 예시 | categoryExamples.ts는 DB 불필요, 로컬 파일 유지 |
| Realtime 구독 | 컴포넌트 언마운트 시 반드시 unsubscribe |
| 트랜잭션 | 게시글 생성(post + images + tags)은 하나의 트랜잭션으로 |
