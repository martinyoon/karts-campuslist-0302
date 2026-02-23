-- ============================================================
-- 캠푸리스트 (Campulist) — 초기 시드 데이터
-- ============================================================
-- 대학교, 카테고리 등 서비스 운영에 필요한 기본 데이터
-- ============================================================

-- =========================
-- 대학교 (MVP 3개 + 확장 대비 27개)
-- =========================

INSERT INTO universities (name, slug, name_en, domain, region) VALUES
-- MVP 대학 (3개)
('서울대학교', 'snu', 'Seoul National University', 'snu.ac.kr', '서울 관악'),
('연세대학교', 'yonsei', 'Yonsei University', 'yonsei.ac.kr', '서울 신촌'),
('고려대학교', 'korea', 'Korea University', 'korea.ac.kr', '서울 안암'),
-- Phase 2 확장 대학
('성균관대학교', 'skku', 'Sungkyunkwan University', 'skku.edu', '서울 혜화'),
('한양대학교', 'hanyang', 'Hanyang University', 'hanyang.ac.kr', '서울 왕십리'),
('중앙대학교', 'cau', 'Chung-Ang University', 'cau.ac.kr', '서울 흑석'),
('경희대학교', 'khu', 'Kyung Hee University', 'khu.ac.kr', '서울 회기'),
('서강대학교', 'sogang', 'Sogang University', 'sogang.ac.kr', '서울 신촌'),
('이화여자대학교', 'ewha', 'Ewha Womans University', 'ewha.ac.kr', '서울 신촌'),
('홍익대학교', 'hongik', 'Hongik University', 'hongik.ac.kr', '서울 합정'),
('건국대학교', 'konkuk', 'Konkuk University', 'konkuk.ac.kr', '서울 건대입구'),
('동국대학교', 'dongguk', 'Dongguk University', 'dongguk.edu', '서울 충무로'),
('숙명여자대학교', 'sookmyung', 'Sookmyung Women''s University', 'sookmyung.ac.kr', '서울 숙대입구'),
('국민대학교', 'kookmin', 'Kookmin University', 'kookmin.ac.kr', '서울 정릉'),
('세종대학교', 'sejong', 'Sejong University', 'sejong.ac.kr', '서울 어린이대공원'),
('KAIST', 'kaist', 'KAIST', 'kaist.ac.kr', '대전'),
('포항공과대학교', 'postech', 'POSTECH', 'postech.ac.kr', '포항'),
('부산대학교', 'pusan', 'Pusan National University', 'pusan.ac.kr', '부산'),
('경북대학교', 'knu', 'Kyungpook National University', 'knu.ac.kr', '대구'),
('전남대학교', 'jnu', 'Chonnam National University', 'jnu.ac.kr', '광주'),
('충남대학교', 'cnu', 'Chungnam National University', 'cnu.ac.kr', '대전'),
('전북대학교', 'jbnu', 'Jeonbuk National University', 'jbnu.ac.kr', '전주'),
('강원대학교', 'kangwon', 'Kangwon National University', 'kangwon.ac.kr', '춘천'),
('제주대학교', 'jeju', 'Jeju National University', 'jejunu.ac.kr', '제주'),
('인하대학교', 'inha', 'Inha University', 'inha.ac.kr', '인천'),
('아주대학교', 'ajou', 'Ajou University', 'ajou.ac.kr', '수원'),
('단국대학교', 'dankook', 'Dankook University', 'dankook.ac.kr', '용인'),
('숭실대학교', 'soongsil', 'Soongsil University', 'ssu.ac.kr', '서울 상도'),
('광운대학교', 'kwangwoon', 'Kwangwoon University', 'kw.ac.kr', '서울 월계'),
('명지대학교', 'myongji', 'Myongji University', 'mju.ac.kr', '서울/용인');

-- =========================
-- 카테고리 (대분류 6개 + 소분류 31개)
-- =========================

-- 대분류
INSERT INTO categories (id, name, slug, parent_id, icon, sort_order) VALUES
(1, '마켓', 'market', NULL, '📦', 1),
(2, '주거', 'housing', NULL, '🏠', 2),
(3, '일자리', 'jobs', NULL, '💼', 3),
(4, '커뮤니티', 'community', NULL, '👥', 4),
(5, '서비스', 'services', NULL, '🔧', 5),
(6, '캠퍼스 비즈니스', 'business', NULL, '🏪', 6);

-- 소분류: 마켓
INSERT INTO categories (name, slug, parent_id, icon, sort_order) VALUES
('중고교재', 'textbooks', 1, '📚', 1),
('전자기기', 'electronics', 1, '💻', 2),
('가구/생활용품', 'furniture', 1, '🪑', 3),
('의류/패션', 'fashion', 1, '👕', 4),
('티켓/쿠폰', 'tickets', 1, '🎫', 5),
('무료나눔', 'free', 1, '🎁', 6),
('기타', 'etc', 1, '📋', 7);

-- 소분류: 주거
INSERT INTO categories (name, slug, parent_id, icon, sort_order) VALUES
('원룸/자취방', 'studio', 2, '🚪', 1),
('룸메이트', 'roommate', 2, '👫', 2),
('하숙/고시원', 'boarding', 2, '🏨', 3),
('단기임대', 'short-term', 2, '📅', 4),
('양도', 'transfer', 2, '🔑', 5);

-- 소분류: 일자리
INSERT INTO categories (name, slug, parent_id, icon, sort_order) VALUES
('아르바이트', 'part-time', 3, '⏰', 1),
('과외/튜터링', 'tutoring', 3, '📝', 2),
('인턴/취업', 'intern', 3, '🏢', 3),
('연구보조(RA/TA)', 'research', 3, '🔬', 4),
('프리랜서', 'freelance', 3, '💡', 5),
('구직', 'job-seeking', 3, '🙋', 6);

-- 소분류: 커뮤니티
INSERT INTO categories (name, slug, parent_id, icon, sort_order) VALUES
('스터디/팀원', 'study', 4, '📖', 1),
('동아리/모임', 'club', 4, '🎯', 2),
('카풀/동행', 'carpool', 4, '🚗', 3),
('분실물', 'lost-found', 4, '🔍', 4),
('학술/세미나', 'seminar', 4, '🎓', 5),
('자유게시판', 'free-board', 4, '💬', 6);

-- 소분류: 서비스
INSERT INTO categories (name, slug, parent_id, icon, sort_order) VALUES
('이사/운송', 'moving', 5, '🚛', 1),
('수리/설치', 'repair', 5, '🔨', 2),
('레슨', 'lesson', 5, '🎵', 3),
('대행', 'agency', 5, '🏃', 4),
('기타 서비스', 'etc-service', 5, '✨', 5);

-- 소분류: 캠퍼스 비즈니스
INSERT INTO categories (name, slug, parent_id, icon, sort_order) VALUES
('맛집/카페', 'restaurant', 6, '🍽️', 1),
('할인/이벤트', 'event', 6, '🏷️', 2),
('신규오픈', 'new-open', 6, '🎉', 3),
('상인 구인', 'biz-hiring', 6, '📢', 4);
