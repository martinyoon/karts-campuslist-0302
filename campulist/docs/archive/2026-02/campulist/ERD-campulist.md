# 캠푸리스트 DB 스키마 설계 (ERD)

> **Database Design Document v1.0**
> 작성일: 2026-02-20
> DB: PostgreSQL (Supabase)
> 기준: PRD-campulist.md v1.0

---

## 1. ERD 다이어그램

```
┌─────────────────┐       ┌─────────────────────┐
│   universities   │       │       users          │
├─────────────────┤       ├─────────────────────┤
│ PK id           │◄──┐   │ PK id (UUID)         │
│    name         │   │   │    email             │
│    slug         │   │   │    nickname          │
│    domain       │   │   │    avatar_url        │
│    region       │   │   │    role              │
│    is_active    │   ├───│ FK university_id     │
│    created_at   │   │   │    department        │
└─────────────────┘   │   │    is_verified       │
                      │   │    verified_at       │
                      │   │    manner_temp       │
                      │   │    created_at        │
                      │   └──────────┬──────────┘
                      │              │
                      │              │ 1:N
                      │              ▼
                      │   ┌─────────────────────┐
                      │   │      posts           │
                      │   ├─────────────────────┤
                      │   │ PK id (UUID)         │
                      │   │    title             │
                      │   │    body              │
                      │   │ FK author_id         │───► users
                      │   │ FK university_id     │───► universities
                      │   │ FK category_major_id │───► categories
                      │   │ FK category_minor_id │───► categories
                      │   │    price             │
                      │   │    price_negotiable  │
                      │   │    status            │
                      │   │    location_detail   │
                      │   │    view_count        │
                      │   │    like_count        │
                      │   │    bumped_at         │
                      │   │    created_at        │
                      │   │    updated_at        │
                      │   └──────────┬──────────┘
                      │              │
                      │     ┌────────┼────────┐
                      │     │        │        │
                      │     ▼        ▼        ▼
                      │  images    tags    post_likes
                      │
┌─────────────────┐   │   ┌─────────────────────┐
│   categories     │   │   │    chat_rooms        │
├─────────────────┤   │   ├─────────────────────┤
│ PK id           │   │   │ PK id (UUID)         │
│    name         │   │   │ FK post_id           │───► posts
│    slug         │   │   │ FK buyer_id          │───► users
│ FK parent_id    │───┘   │ FK seller_id         │───► users
│    icon         │       │    last_message      │
│    sort_order   │       │    last_message_at   │
│    is_active    │       │    created_at        │
└─────────────────┘       └──────────┬──────────┘
                                     │ 1:N
                                     ▼
                          ┌─────────────────────┐
                          │    chat_messages      │
                          ├─────────────────────┤
                          │ PK id (UUID)         │
                          │ FK room_id           │───► chat_rooms
                          │ FK sender_id         │───► users
                          │    content           │
                          │    image_url         │
                          │    is_read           │
                          │    created_at        │
                          └─────────────────────┘

┌─────────────────────┐   ┌─────────────────────┐
│     reviews          │   │   notifications      │
├─────────────────────┤   ├─────────────────────┤
│ PK id (UUID)        │   │ PK id (UUID)         │
│ FK post_id          │   │ FK user_id           │───► users
│ FK reviewer_id      │   │    type              │
│ FK reviewee_id      │   │    title             │
│    rating (1~5)     │   │    body              │
│    content          │   │    link              │
│    created_at       │   │    is_read           │
└─────────────────────┘   │    created_at        │
                          └─────────────────────┘

┌─────────────────────┐   ┌─────────────────────┐
│    reports           │   │  business_accounts   │
├─────────────────────┤   ├─────────────────────┤
│ PK id (UUID)        │   │ PK id (UUID)         │
│ FK post_id          │   │ FK user_id           │───► users
│ FK reporter_id      │   │    business_name     │
│    reason           │   │    plan              │
│    detail           │   │    is_active         │
│    status           │   │    started_at        │
│    created_at       │   │    expires_at        │
└─────────────────────┘   │    created_at        │
                          └─────────────────────┘

┌─────────────────────┐
│  keyword_alerts      │
├─────────────────────┤
│ PK id (UUID)        │
│ FK user_id          │───► users
│ FK university_id    │───► universities (nullable)
│    keyword          │
│    category_major   │
│    is_active        │
│    created_at       │
└─────────────────────┘
```

---

## 2. 테이블 상세 명세

### 2.1 universities (대학교)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | SERIAL | PK | 자동 증가 |
| name | VARCHAR(100) | NOT NULL, UNIQUE | 대학 이름 (서울대학교) |
| slug | VARCHAR(50) | NOT NULL, UNIQUE | URL 슬러그 (snu) |
| name_en | VARCHAR(100) | | 영문명 (Seoul National University) |
| domain | VARCHAR(100) | NOT NULL | 이메일 도메인 (snu.ac.kr) |
| region | VARCHAR(50) | NOT NULL | 지역 (서울 관악) |
| logo_url | TEXT | | 로고 이미지 URL |
| is_active | BOOLEAN | DEFAULT true | 서비스 활성 여부 |
| created_at | TIMESTAMPTZ | DEFAULT now() | 등록일 |

### 2.2 users (사용자)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Supabase Auth와 연동 |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 이메일 |
| nickname | VARCHAR(30) | NOT NULL, UNIQUE | 닉네임 (2~30자) |
| avatar_url | TEXT | | 프로필 이미지 |
| role | user_role ENUM | DEFAULT 'user' | user / business / admin |
| university_id | INT | FK → universities | 소속 대학 |
| department | VARCHAR(100) | | 학과 |
| is_verified | BOOLEAN | DEFAULT false | 학교 인증 완료 여부 |
| verified_at | TIMESTAMPTZ | | 인증 완료 시각 |
| manner_temp | DECIMAL(3,1) | DEFAULT 36.5 | 매너 온도 |
| trade_count | INT | DEFAULT 0 | 거래 횟수 |
| created_at | TIMESTAMPTZ | DEFAULT now() | 가입일 |
| updated_at | TIMESTAMPTZ | DEFAULT now() | 수정일 |

### 2.3 categories (카테고리)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | SERIAL | PK | 자동 증가 |
| name | VARCHAR(50) | NOT NULL | 카테고리명 (중고교재) |
| slug | VARCHAR(50) | NOT NULL | URL 슬러그 (textbooks) |
| parent_id | INT | FK → categories, NULLABLE | 상위 카테고리 (NULL=대분류) |
| icon | VARCHAR(10) | | 이모지 아이콘 |
| sort_order | INT | DEFAULT 0 | 정렬 순서 |
| is_active | BOOLEAN | DEFAULT true | 활성 여부 |

**초기 데이터:**

```
대분류 (parent_id = NULL)
├── 1: 마켓 (market) 📦
├── 2: 주거 (housing) 🏠
├── 3: 일자리 (jobs) 💼
├── 4: 커뮤니티 (community) 👥
├── 5: 서비스 (services) 🔧
└── 6: 캠퍼스 비즈니스 (business) 🏪

소분류 (parent_id = 대분류 ID)
마켓(1) → 중고교재(11), 전자기기(12), 가구생활(13), 의류패션(14), 티켓쿠폰(15), 무료나눔(16), 기타(17)
주거(2) → 원룸자취방(21), 룸메이트(22), 하숙고시원(23), 단기임대(24), 양도(25)
일자리(3) → 아르바이트(31), 과외튜터링(32), 인턴취업(33), 연구보조(34), 프리랜서(35), 구직(36)
커뮤니티(4) → 스터디팀원(41), 동아리모임(42), 카풀동행(43), 분실물(44), 학술세미나(45), 자유게시판(46)
서비스(5) → 이사운송(51), 수리설치(52), 레슨(53), 대행(54), 기타서비스(55)
비즈니스(6) → 맛집카페(61), 할인이벤트(62), 신규오픈(63), 상인구인(64)
```

### 2.4 posts (게시글) — 핵심 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 게시글 ID |
| title | VARCHAR(100) | NOT NULL | 제목 (2~100자) |
| body | TEXT | NOT NULL | 본문 (최대 5,000자) |
| author_id | UUID | FK → users, NOT NULL | 작성자 |
| university_id | INT | FK → universities, NOT NULL | 소속 대학 |
| category_major_id | INT | FK → categories, NOT NULL | 대분류 |
| category_minor_id | INT | FK → categories, NOT NULL | 소분류 |
| price | INT | NULLABLE | 가격 (원), NULL=가격 미정 |
| price_negotiable | BOOLEAN | DEFAULT false | 가격 협의 가능 |
| status | post_status ENUM | DEFAULT 'active' | active/reserved/completed/hidden |
| location_detail | VARCHAR(200) | | 상세 위치 |
| view_count | INT | DEFAULT 0 | 조회수 |
| like_count | INT | DEFAULT 0 | 찜 수 |
| is_premium | BOOLEAN | DEFAULT false | 프리미엄 노출 여부 |
| bumped_at | TIMESTAMPTZ | DEFAULT now() | 끌어올리기 시각 |
| created_at | TIMESTAMPTZ | DEFAULT now() | 작성일 |
| updated_at | TIMESTAMPTZ | DEFAULT now() | 수정일 |

### 2.5 post_images (게시글 이미지)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| post_id | UUID | FK → posts, NOT NULL | 게시글 |
| image_url | TEXT | NOT NULL | 이미지 URL |
| sort_order | INT | DEFAULT 0 | 정렬 순서 (0=대표) |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

### 2.6 post_tags (게시글 태그)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| post_id | UUID | FK → posts, NOT NULL | 게시글 |
| tag | VARCHAR(30) | NOT NULL | 태그명 |

**제약**: post_id + tag UNIQUE (중복 태그 방지), 게시글당 최대 5개 (앱 레벨)

### 2.7 post_likes (찜하기)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| post_id | UUID | FK → posts, NOT NULL | 게시글 |
| user_id | UUID | FK → users, NOT NULL | 사용자 |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**제약**: post_id + user_id UNIQUE (1인 1찜)

### 2.8 chat_rooms (채팅방)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| post_id | UUID | FK → posts, NOT NULL | 관련 게시글 |
| buyer_id | UUID | FK → users, NOT NULL | 구매자(문의자) |
| seller_id | UUID | FK → users, NOT NULL | 판매자(작성자) |
| last_message | TEXT | | 마지막 메시지 미리보기 |
| last_message_at | TIMESTAMPTZ | | 마지막 메시지 시각 |
| buyer_left | BOOLEAN | DEFAULT false | 구매자 나감 |
| seller_left | BOOLEAN | DEFAULT false | 판매자 나감 |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**제약**: post_id + buyer_id UNIQUE (동일 게시글에 동일 유저 1채팅방)

### 2.9 chat_messages (채팅 메시지)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| room_id | UUID | FK → chat_rooms, NOT NULL | 채팅방 |
| sender_id | UUID | FK → users, NOT NULL | 보낸 사람 |
| content | TEXT | | 메시지 내용 |
| image_url | TEXT | | 이미지 URL (이미지 메시지) |
| is_read | BOOLEAN | DEFAULT false | 읽음 여부 |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

### 2.10 reviews (거래 후기)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| post_id | UUID | FK → posts, NOT NULL | 거래 게시글 |
| reviewer_id | UUID | FK → users, NOT NULL | 후기 작성자 |
| reviewee_id | UUID | FK → users, NOT NULL | 후기 대상자 |
| rating | SMALLINT | NOT NULL, CHECK(1~5) | 별점 |
| content | TEXT | | 후기 내용 (최대 500자) |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**제약**: post_id + reviewer_id UNIQUE (거래당 1후기)

### 2.11 reports (신고)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| post_id | UUID | FK → posts, NOT NULL | 신고 게시글 |
| reporter_id | UUID | FK → users, NOT NULL | 신고자 |
| reason | report_reason ENUM | NOT NULL | spam/fraud/inappropriate/other |
| detail | TEXT | | 상세 사유 |
| status | report_status ENUM | DEFAULT 'pending' | pending/reviewed/resolved |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

### 2.12 notifications (알림)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| user_id | UUID | FK → users, NOT NULL | 수신자 |
| type | notification_type ENUM | NOT NULL | chat/like/keyword/review/system |
| title | VARCHAR(100) | NOT NULL | 알림 제목 |
| body | TEXT | | 알림 내용 |
| link | TEXT | | 클릭 시 이동 경로 |
| is_read | BOOLEAN | DEFAULT false | 읽음 여부 |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

### 2.13 business_accounts (비즈니스 계정)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| user_id | UUID | FK → users, NOT NULL, UNIQUE | 사용자 |
| business_name | VARCHAR(100) | NOT NULL | 상호명 |
| business_number | VARCHAR(20) | | 사업자등록번호 |
| plan | biz_plan ENUM | NOT NULL | basic/pro/premium |
| phone | VARCHAR(20) | | 연락처 |
| address | TEXT | | 주소 |
| description | TEXT | | 업체 소개 |
| logo_url | TEXT | | 로고 이미지 |
| is_active | BOOLEAN | DEFAULT true | 구독 활성 |
| started_at | TIMESTAMPTZ | DEFAULT now() | 구독 시작 |
| expires_at | TIMESTAMPTZ | NOT NULL | 구독 만료 |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

### 2.14 keyword_alerts (키워드 알림)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| user_id | UUID | FK → users, NOT NULL | 사용자 |
| university_id | INT | FK → universities, NULLABLE | 대학 필터 (NULL=전체) |
| keyword | VARCHAR(50) | NOT NULL | 알림 키워드 |
| category_major_id | INT | FK → categories, NULLABLE | 카테고리 필터 |
| is_active | BOOLEAN | DEFAULT true | 활성 여부 |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

### 2.15 email_verifications (이메일 인증 코드)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| user_id | UUID | FK → users, NOT NULL | 사용자 |
| email | VARCHAR(255) | NOT NULL | 인증 대상 이메일 |
| code | VARCHAR(6) | NOT NULL | 6자리 인증 코드 |
| attempts | INT | DEFAULT 0 | 시도 횟수 |
| expires_at | TIMESTAMPTZ | NOT NULL | 만료 시각 (10분) |
| verified_at | TIMESTAMPTZ | | 인증 완료 시각 |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

---

## 3. ENUM 타입 정의

```sql
CREATE TYPE user_role AS ENUM ('user', 'business', 'admin');
CREATE TYPE post_status AS ENUM ('active', 'reserved', 'completed', 'hidden');
CREATE TYPE report_reason AS ENUM ('spam', 'fraud', 'inappropriate', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved');
CREATE TYPE notification_type AS ENUM ('chat', 'like', 'keyword', 'review', 'system');
CREATE TYPE biz_plan AS ENUM ('basic', 'pro', 'premium');
```

---

## 4. 인덱스 설계

### 핵심 쿼리 기반 인덱스

```sql
-- posts: 가장 빈번한 쿼리 패턴별 인덱스
-- 1) 대학+카테고리+최신순 (메인 목록)
CREATE INDEX idx_posts_univ_cat_created
  ON posts(university_id, category_major_id, created_at DESC)
  WHERE status = 'active';

-- 2) 대학+카테고리+끌어올리기순 (기본 정렬)
CREATE INDEX idx_posts_univ_cat_bumped
  ON posts(university_id, category_major_id, bumped_at DESC)
  WHERE status = 'active';

-- 3) 대학+소분류+최신순
CREATE INDEX idx_posts_univ_minor_created
  ON posts(university_id, category_minor_id, created_at DESC)
  WHERE status = 'active';

-- 4) 작성자별 게시글 (마이페이지)
CREATE INDEX idx_posts_author
  ON posts(author_id, created_at DESC);

-- 5) 가격 범위 검색
CREATE INDEX idx_posts_price
  ON posts(price)
  WHERE status = 'active' AND price IS NOT NULL;

-- 6) 풀텍스트 검색 (한국어)
CREATE INDEX idx_posts_search
  ON posts USING gin(to_tsvector('simple', title || ' ' || body));

-- chat_messages: 채팅방별 최신 메시지
CREATE INDEX idx_chat_messages_room
  ON chat_messages(room_id, created_at DESC);

-- chat_rooms: 사용자별 채팅 목록
CREATE INDEX idx_chat_rooms_buyer
  ON chat_rooms(buyer_id, last_message_at DESC);
CREATE INDEX idx_chat_rooms_seller
  ON chat_rooms(seller_id, last_message_at DESC);

-- notifications: 사용자별 최신 알림
CREATE INDEX idx_notifications_user
  ON notifications(user_id, created_at DESC)
  WHERE is_read = false;

-- post_likes: 사용자 찜 목록
CREATE INDEX idx_post_likes_user
  ON post_likes(user_id, created_at DESC);

-- post_tags: 태그 검색
CREATE INDEX idx_post_tags_tag
  ON post_tags(tag);
```

---

## 5. RLS (Row Level Security) 정책

```sql
-- posts: 누구나 active 게시글 읽기 가능, 작성자만 수정/삭제
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select" ON posts
  FOR SELECT USING (status != 'hidden' OR author_id = auth.uid());

CREATE POLICY "posts_insert" ON posts
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "posts_update" ON posts
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "posts_delete" ON posts
  FOR DELETE USING (author_id = auth.uid());

-- chat_messages: 채팅방 참여자만 읽기/쓰기
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_messages_select" ON chat_messages
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

CREATE POLICY "chat_messages_insert" ON chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- notifications: 본인 알림만 접근
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE USING (user_id = auth.uid());
```

---

## 6. 핵심 쿼리 패턴

### 게시글 목록 (메인 화면)

```sql
-- 서울대 + 마켓 카테고리 + 끌어올리기순 + 20개
SELECT
  p.id, p.title, p.price, p.price_negotiable,
  p.status, p.view_count, p.like_count,
  p.created_at, p.bumped_at,
  u.nickname, u.avatar_url, u.is_verified,
  cm.slug AS category_minor_slug,
  cm.name AS category_minor_name,
  (SELECT image_url FROM post_images pi
   WHERE pi.post_id = p.id ORDER BY sort_order LIMIT 1) AS thumbnail
FROM posts p
JOIN users u ON p.author_id = u.id
JOIN categories cm ON p.category_minor_id = cm.id
WHERE p.university_id = 1          -- 서울대
  AND p.category_major_id = 1      -- 마켓
  AND p.status = 'active'
ORDER BY p.bumped_at DESC
LIMIT 20 OFFSET 0;
```

### 게시글 검색

```sql
-- "맥북" 검색 + 서울대 + 마켓
SELECT p.*, u.nickname, u.is_verified
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.university_id = 1
  AND p.category_major_id = 1
  AND p.status = 'active'
  AND (p.title ILIKE '%맥북%' OR p.body ILIKE '%맥북%')
ORDER BY p.bumped_at DESC
LIMIT 20;
```

### 채팅 목록

```sql
-- 내 채팅방 목록 (최신 메시지순)
SELECT
  cr.id, cr.last_message, cr.last_message_at,
  p.title AS post_title, p.price,
  CASE
    WHEN cr.buyer_id = $1 THEN seller.nickname
    ELSE buyer.nickname
  END AS other_nickname,
  (SELECT COUNT(*) FROM chat_messages cm
   WHERE cm.room_id = cr.id
   AND cm.sender_id != $1
   AND cm.is_read = false) AS unread_count
FROM chat_rooms cr
JOIN posts p ON cr.post_id = p.id
JOIN users buyer ON cr.buyer_id = buyer.id
JOIN users seller ON cr.seller_id = seller.id
WHERE cr.buyer_id = $1 OR cr.seller_id = $1
ORDER BY cr.last_message_at DESC;
```

---

## 7. 엔티티 관계 요약

| 관계 | 설명 |
|------|------|
| users 1:N posts | 사용자는 여러 게시글 작성 |
| users N:1 universities | 사용자는 하나의 대학 소속 |
| posts N:1 categories (x2) | 게시글은 대분류+소분류 각 1개 |
| posts 1:N post_images | 게시글에 여러 이미지 |
| posts 1:N post_tags | 게시글에 여러 태그 |
| posts 1:N post_likes | 게시글에 여러 찜 |
| posts 1:N chat_rooms | 게시글에 여러 채팅방 |
| chat_rooms 1:N chat_messages | 채팅방에 여러 메시지 |
| users 1:N reviews (reviewer) | 사용자가 작성한 후기 |
| users 1:N reviews (reviewee) | 사용자가 받은 후기 |
| users 1:1 business_accounts | 비즈니스 계정 (선택) |
| users 1:N keyword_alerts | 키워드 알림 설정 |
| users 1:N notifications | 사용자 알림 |

---

## 8. 테이블 수 및 규모 예측

| 테이블 | MVP (3개월) | 성장 (12개월) |
|--------|------------|--------------|
| universities | 3 | 30 |
| users | 3,000 | 50,000 |
| categories | 40 (고정) | 50 |
| posts | 15,000 | 300,000 |
| post_images | 30,000 | 600,000 |
| post_tags | 30,000 | 600,000 |
| post_likes | 10,000 | 500,000 |
| chat_rooms | 5,000 | 100,000 |
| chat_messages | 50,000 | 2,000,000 |
| reviews | 2,000 | 50,000 |
| notifications | 20,000 | 1,000,000 |

**총 레코드**: MVP ~16만건, 성장 ~520만건 → PostgreSQL 충분히 처리 가능
