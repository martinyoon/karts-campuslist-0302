-- ============================================================
-- 캠푸리스트 (Campulist) — Supabase 초기 마이그레이션
-- ============================================================
-- Phase B에서 Supabase 연결 시 실행
-- 실행 순서: 이 파일 → 002-seed.sql
-- ============================================================

-- UUID 확장
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pg_trgm 확장 (한국어 부분 매칭 + 유사 검색)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =========================
-- ENUM 타입
-- =========================

CREATE TYPE user_role AS ENUM ('user', 'business', 'admin');
CREATE TYPE member_type AS ENUM ('undergraduate', 'graduate', 'professor', 'staff', 'alumni', 'merchant', 'general');
CREATE TYPE post_status AS ENUM ('active', 'reserved', 'completed', 'hidden');
CREATE TYPE report_reason AS ENUM ('spam', 'fraud', 'inappropriate', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved');
CREATE TYPE notification_type AS ENUM ('chat', 'like', 'keyword', 'review', 'system');
CREATE TYPE biz_plan AS ENUM ('basic', 'pro', 'premium');

-- =========================
-- 테이블
-- =========================

-- 1. universities
CREATE TABLE universities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  name_en VARCHAR(100),
  domain VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. users (Supabase Auth 연동)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(30) NOT NULL UNIQUE,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'user',
  member_type member_type NOT NULL DEFAULT 'general',
  university_id INT REFERENCES universities(id),
  department VARCHAR(100),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  manner_temp DECIMAL(3,1) NOT NULL DEFAULT 36.5,
  trade_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. categories (자기참조 - 대분류/소분류)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  parent_id INT REFERENCES categories(id),
  icon VARCHAR(10),
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(slug, parent_id)
);

-- 4. posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  university_id INT NOT NULL REFERENCES universities(id),
  category_major_id INT NOT NULL REFERENCES categories(id),
  category_minor_id INT NOT NULL REFERENCES categories(id),
  price INT,
  price_negotiable BOOLEAN NOT NULL DEFAULT false,
  status post_status NOT NULL DEFAULT 'active',
  location_detail VARCHAR(200),
  contact_methods JSONB NOT NULL DEFAULT '{"chat": true}'::jsonb,
  view_count INT NOT NULL DEFAULT 0,
  like_count INT NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  bumped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. post_images
CREATE TABLE post_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. post_tags
CREATE TABLE post_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag VARCHAR(30) NOT NULL,
  UNIQUE(post_id, tag)
);

-- 7. post_likes
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- 8. chat_rooms
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  buyer_left BOOLEAN NOT NULL DEFAULT false,
  seller_left BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, buyer_id)
);

-- 9. chat_messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT,
  image_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, reviewer_id)
);

-- 11. reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id),
  reporter_id UUID NOT NULL REFERENCES users(id),
  reason report_reason NOT NULL,
  detail TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  type notification_type NOT NULL,
  title VARCHAR(100) NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. business_accounts
CREATE TABLE business_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  business_name VARCHAR(100) NOT NULL,
  business_number VARCHAR(20),
  plan biz_plan NOT NULL DEFAULT 'basic',
  phone VARCHAR(20),
  address TEXT,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. keyword_alerts
CREATE TABLE keyword_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  university_id INT REFERENCES universities(id),
  keyword VARCHAR(50) NOT NULL,
  category_major_id INT REFERENCES categories(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. email_verifications
CREATE TABLE email_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- 인덱스
-- =========================

-- posts 핵심 인덱스
CREATE INDEX idx_posts_univ_major_bumped
  ON posts(university_id, category_major_id, bumped_at DESC)
  WHERE status = 'active';

CREATE INDEX idx_posts_univ_minor_bumped
  ON posts(university_id, category_minor_id, bumped_at DESC)
  WHERE status = 'active';

CREATE INDEX idx_posts_author
  ON posts(author_id, created_at DESC);

CREATE INDEX idx_posts_price
  ON posts(price)
  WHERE status = 'active' AND price IS NOT NULL;

CREATE INDEX idx_posts_search
  ON posts USING gin(to_tsvector('simple', title || ' ' || body));

-- 한국어 부분 문자열 매칭 + 유사 검색 (pg_trgm)
-- to_tsvector('simple')은 공백 기준 토큰화만 수행하여 한국어에 불충분
-- pg_trgm은 3-gram 기반으로 "맥북프로" 검색 시 "맥북 프로"도 매칭 가능
CREATE INDEX idx_posts_title_trgm
  ON posts USING gin(title gin_trgm_ops);

CREATE INDEX idx_posts_body_trgm
  ON posts USING gin(body gin_trgm_ops);

-- 인기글 정렬용 (홈페이지 인기글 섹션: sortBy='popular')
CREATE INDEX idx_posts_popular
  ON posts(like_count DESC, bumped_at DESC)
  WHERE status = 'active';

-- 전체 대학 최신글 (홈페이지, /all/ 페이지)
CREATE INDEX idx_posts_all_latest
  ON posts(bumped_at DESC)
  WHERE status = 'active';

-- 관련 게시글 쿼리 최적화 (3-tier 관련 게시글)
CREATE INDEX idx_posts_related
  ON posts(university_id, category_minor_id, bumped_at DESC)
  WHERE status = 'active';

-- chat 인덱스
CREATE INDEX idx_chat_messages_room
  ON chat_messages(room_id, created_at DESC);

CREATE INDEX idx_chat_rooms_buyer
  ON chat_rooms(buyer_id, last_message_at DESC NULLS LAST);

CREATE INDEX idx_chat_rooms_seller
  ON chat_rooms(seller_id, last_message_at DESC NULLS LAST);

-- 기타 인덱스
CREATE INDEX idx_notifications_user
  ON notifications(user_id, created_at DESC)
  WHERE is_read = false;

CREATE INDEX idx_post_likes_user
  ON post_likes(user_id, created_at DESC);

CREATE INDEX idx_post_tags_tag
  ON post_tags(tag);

-- 태그 유사 검색 (pg_trgm)
CREATE INDEX idx_post_tags_trgm
  ON post_tags USING gin(tag gin_trgm_ops);

-- 채팅 안읽음 메시지 카운트 최적화
CREATE INDEX idx_chat_messages_unread
  ON chat_messages(room_id, is_read)
  WHERE is_read = false;

-- 키워드 알림 매칭 (새 게시글 등록 시 알림 대상 조회)
CREATE INDEX idx_keyword_alerts_active
  ON keyword_alerts(keyword, university_id)
  WHERE is_active = true;

CREATE INDEX idx_post_images_post
  ON post_images(post_id, sort_order);

-- =========================
-- RLS (Row Level Security)
-- =========================

-- posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_read" ON posts
  FOR SELECT USING (status != 'hidden' OR author_id = auth.uid());

CREATE POLICY "posts_create" ON posts
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "posts_update" ON posts
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "posts_delete" ON posts
  FOR DELETE USING (author_id = auth.uid());

-- post_images
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_images_read" ON post_images
  FOR SELECT USING (true);

CREATE POLICY "post_images_create" ON post_images
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM posts WHERE id = post_id AND author_id = auth.uid())
  );

-- post_likes
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_likes_read" ON post_likes
  FOR SELECT USING (true);

CREATE POLICY "post_likes_create" ON post_likes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "post_likes_delete" ON post_likes
  FOR DELETE USING (user_id = auth.uid());

-- chat_rooms
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_rooms_read" ON chat_rooms
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "chat_rooms_create" ON chat_rooms
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_messages_read" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE id = room_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

CREATE POLICY "chat_messages_create" ON chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_read" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_read" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_create" ON reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- users (공개 프로필)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read" ON users
  FOR SELECT USING (true);

CREATE POLICY "users_update" ON users
  FOR UPDATE USING (id = auth.uid());

-- post_tags
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_tags_read" ON post_tags
  FOR SELECT USING (true);

CREATE POLICY "post_tags_create" ON post_tags
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM posts WHERE id = post_id AND author_id = auth.uid())
  );

CREATE POLICY "post_tags_delete" ON post_tags
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM posts WHERE id = post_id AND author_id = auth.uid())
  );

-- post_images (DELETE 정책 추가)
CREATE POLICY "post_images_delete" ON post_images
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM posts WHERE id = post_id AND author_id = auth.uid())
  );

-- business_accounts
ALTER TABLE business_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "biz_read" ON business_accounts
  FOR SELECT USING (true);

CREATE POLICY "biz_update" ON business_accounts
  FOR UPDATE USING (user_id = auth.uid());

-- keyword_alerts
ALTER TABLE keyword_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alerts_read" ON keyword_alerts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "alerts_create" ON keyword_alerts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "alerts_update" ON keyword_alerts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "alerts_delete" ON keyword_alerts
  FOR DELETE USING (user_id = auth.uid());

-- email_verifications
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "verify_read" ON email_verifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "verify_create" ON email_verifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- reports (신고는 본인만 조회 가능)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_read" ON reports
  FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "reports_create" ON reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

-- =========================
-- 트리거: updated_at 자동 갱신
-- =========================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================
-- DB 함수 (Stored Procedures)
-- =========================

-- 관련 게시글 조회 (3-tier 관련성)
-- 현재 api.ts의 getRelatedPosts()는 O(n³)이지만,
-- 이 함수는 인덱스를 활용하여 O(log n)으로 처리
CREATE OR REPLACE FUNCTION get_related_posts(
  p_post_id UUID,
  p_university_id INT,
  p_major_id INT,
  p_minor_id INT,
  p_limit INT DEFAULT 4
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(100),
  body TEXT,
  author_id UUID,
  university_id INT,
  category_major_id INT,
  category_minor_id INT,
  price INT,
  price_negotiable BOOLEAN,
  status post_status,
  view_count INT,
  like_count INT,
  bumped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  tier INT
) AS $$
BEGIN
  RETURN QUERY
  WITH ranked AS (
    -- Tier 1: 같은 소분류 (가장 관련성 높음)
    (SELECT p.id, p.title, p.body, p.author_id, p.university_id,
            p.category_major_id, p.category_minor_id, p.price,
            p.price_negotiable, p.status, p.view_count, p.like_count,
            p.bumped_at, p.created_at, 1 AS tier
     FROM posts p
     WHERE p.id != p_post_id
       AND p.status = 'active'
       AND p.university_id = p_university_id
       AND p.category_minor_id = p_minor_id
     ORDER BY p.bumped_at DESC
     LIMIT p_limit)
    UNION ALL
    -- Tier 2: 같은 대분류, 다른 소분류
    (SELECT p.id, p.title, p.body, p.author_id, p.university_id,
            p.category_major_id, p.category_minor_id, p.price,
            p.price_negotiable, p.status, p.view_count, p.like_count,
            p.bumped_at, p.created_at, 2 AS tier
     FROM posts p
     WHERE p.id != p_post_id
       AND p.status = 'active'
       AND p.university_id = p_university_id
       AND p.category_major_id = p_major_id
       AND p.category_minor_id != p_minor_id
     ORDER BY p.bumped_at DESC
     LIMIT p_limit)
    UNION ALL
    -- Tier 3: 같은 대학, 다른 카테고리
    (SELECT p.id, p.title, p.body, p.author_id, p.university_id,
            p.category_major_id, p.category_minor_id, p.price,
            p.price_negotiable, p.status, p.view_count, p.like_count,
            p.bumped_at, p.created_at, 3 AS tier
     FROM posts p
     WHERE p.id != p_post_id
       AND p.status = 'active'
       AND p.university_id = p_university_id
       AND p.category_major_id != p_major_id
     ORDER BY p.bumped_at DESC
     LIMIT p_limit)
  )
  SELECT * FROM ranked
  ORDER BY tier, bumped_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- 검색 함수 (trgm + tsvector 병행)
-- ILIKE는 pg_trgm GIN 인덱스를 활용하여 효율적으로 처리
CREATE OR REPLACE FUNCTION search_posts(
  p_query TEXT,
  p_university_id INT DEFAULT NULL,
  p_category_major_id INT DEFAULT NULL,
  p_price_min INT DEFAULT NULL,
  p_price_max INT DEFAULT NULL,
  p_sort TEXT DEFAULT 'latest',
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(100),
  body TEXT,
  price INT,
  price_negotiable BOOLEAN,
  status post_status,
  view_count INT,
  like_count INT,
  bumped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  author_id UUID,
  university_id INT,
  category_minor_id INT,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.title, p.body, p.price, p.price_negotiable,
         p.status, p.view_count, p.like_count, p.bumped_at, p.created_at,
         p.author_id, p.university_id, p.category_minor_id,
         GREATEST(
           similarity(p.title, p_query),
           similarity(p.body, p_query) * 0.5
         ) AS relevance
  FROM posts p
  WHERE p.status = 'active'
    AND (p.title ILIKE '%' || p_query || '%' OR p.body ILIKE '%' || p_query || '%')
    AND (p_university_id IS NULL OR p.university_id = p_university_id)
    AND (p_category_major_id IS NULL OR p.category_major_id = p_category_major_id)
    AND (p_price_min IS NULL OR p.price >= p_price_min)
    AND (p_price_max IS NULL OR p.price <= p_price_max)
  ORDER BY
    CASE WHEN p_sort = 'latest' THEN p.bumped_at END DESC,
    CASE WHEN p_sort = 'popular' THEN p.like_count END DESC,
    CASE WHEN p_sort = 'price_asc' THEN p.price END ASC,
    CASE WHEN p_sort = 'price_desc' THEN p.price END DESC,
    CASE WHEN p_sort = 'relevance' THEN GREATEST(similarity(p.title, p_query), similarity(p.body, p_query) * 0.5) END DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;
