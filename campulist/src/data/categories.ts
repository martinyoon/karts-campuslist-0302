import type { Category, CategoryGroup } from '@/lib/types';

export const categories: Category[] = [
  // 대분류
  { id: 1, name: '중고마켓', slug: 'market', parentId: null, icon: '📦', sortOrder: 1 },
  { id: 2, name: '주거', slug: 'housing', parentId: null, icon: '🏠', sortOrder: 2 },
  { id: 3, name: '일자리', slug: 'jobs', parentId: null, icon: '💼', sortOrder: 3 },
  { id: 4, name: '커뮤니티', slug: 'community', parentId: null, icon: '👥', sortOrder: 4 },
  { id: 5, name: '서비스', slug: 'services', parentId: null, icon: '🛠️', sortOrder: 5 },
  { id: 6, name: '캠퍼스라이프', slug: 'campus-life', parentId: null, icon: '🏪', sortOrder: 6 },
  { id: 7, name: '긱·의뢰', slug: 'gigs', parentId: null, icon: '📣', sortOrder: 7 },

  // 마켓 소분류
  { id: 11, name: '전공서적·교양도서', slug: 'textbooks', parentId: 1, icon: '📚', sortOrder: 1 },
  { id: 12, name: '전자기기', slug: 'electronics', parentId: 1, icon: '💻', sortOrder: 2 },
  { id: 13, name: '가구/생활용품', slug: 'furniture', parentId: 1, icon: '🪑', sortOrder: 3 },
  { id: 14, name: '의류/패션', slug: 'fashion', parentId: 1, icon: '👕', sortOrder: 4 },
  { id: 15, name: '티켓/쿠폰', slug: 'tickets', parentId: 1, icon: '🎫', sortOrder: 5 },
  { id: 16, name: '무료나눔', slug: 'free', parentId: 1, icon: '🎁', sortOrder: 6 },
  { id: 17, name: '기타', slug: 'etc', parentId: 1, icon: '📋', sortOrder: 7 },
  { id: 18, name: '구합니다', slug: 'wanted', parentId: 1, icon: '🔎', sortOrder: 8 },

  // 주거 소분류
  { id: 21, name: '원룸/자취방', slug: 'studio', parentId: 2, icon: '🚪', sortOrder: 1 },
  { id: 22, name: '룸메이트', slug: 'roommate', parentId: 2, icon: '👫', sortOrder: 2 },
  { id: 23, name: '하숙/고시원', slug: 'boarding', parentId: 2, icon: '🏨', sortOrder: 3 },
  { id: 24, name: '단기임대', slug: 'short-term', parentId: 2, icon: '📅', sortOrder: 4 },
  { id: 25, name: '양도', slug: 'transfer', parentId: 2, icon: '🔑', sortOrder: 5 },

  // 일자리 소분류
  { id: 31, name: '아르바이트', slug: 'part-time', parentId: 3, icon: '⏰', sortOrder: 1 },
  { id: 32, name: '과외', slug: 'tutoring', parentId: 3, icon: '📝', sortOrder: 2 },
  { id: 53, name: '레슨', slug: 'lesson', parentId: 3, icon: '🎵', sortOrder: 3 },
  { id: 33, name: '인턴', slug: 'intern', parentId: 3, icon: '🏢', sortOrder: 4 },
  { id: 34, name: '연구보조(RA/TA)', slug: 'research', parentId: 3, icon: '🔬', sortOrder: 5 },
  { id: 35, name: '프리랜서', slug: 'freelance', parentId: 3, icon: '💡', sortOrder: 6 },
  { id: 37, name: '구인', slug: 'hiring', parentId: 3, icon: '📢', sortOrder: 7 },
  { id: 36, name: '구직', slug: 'job-seeking', parentId: 3, icon: '🙋', sortOrder: 8 },

  // 커뮤니티 소분류
  { id: 41, name: '스터디/팀원', slug: 'study', parentId: 4, icon: '📖', sortOrder: 1 },
  { id: 42, name: '동아리/모임', slug: 'club', parentId: 4, icon: '🎯', sortOrder: 2 },
  { id: 43, name: '카풀/동행', slug: 'carpool', parentId: 4, icon: '🚗', sortOrder: 3 },
  { id: 44, name: '분실물', slug: 'lost-found', parentId: 4, icon: '🔍', sortOrder: 4 },
  { id: 45, name: '학술/세미나', slug: 'seminar', parentId: 4, icon: '🎓', sortOrder: 5 },
  { id: 46, name: '자유게시판', slug: 'free-board', parentId: 4, icon: '💬', sortOrder: 6 },
  { id: 47, name: '봉사활동', slug: 'volunteer', parentId: 4, icon: '🤝', sortOrder: 7 },

  // 서비스 소분류
  { id: 51, name: '이사/운송', slug: 'moving', parentId: 5, icon: '🚛', sortOrder: 1 },
  { id: 52, name: '수리/설치', slug: 'repair', parentId: 5, icon: '🔨', sortOrder: 2 },
  { id: 54, name: '대행', slug: 'agency', parentId: 5, icon: '🏃', sortOrder: 3 },
  { id: 55, name: '기타 서비스', slug: 'etc-service', parentId: 5, icon: '✨', sortOrder: 4 },
  { id: 56, name: 'IT/컴퓨터', slug: 'computer', parentId: 5, icon: '💻', sortOrder: 5 },
  { id: 57, name: '뷰티/미용', slug: 'beauty', parentId: 5, icon: '💇', sortOrder: 6 },
  { id: 58, name: '건강/운동', slug: 'health', parentId: 5, icon: '💪', sortOrder: 7 },
  { id: 59, name: '반려동물', slug: 'pet', parentId: 5, icon: '🐾', sortOrder: 8 },

  // 캠퍼스 비즈니스 소분류
  { id: 61, name: '맛집/카페', slug: 'restaurant', parentId: 6, icon: '🍽️', sortOrder: 1 },
  { id: 62, name: '할인/이벤트', slug: 'event', parentId: 6, icon: '🏷️', sortOrder: 2 },
  { id: 63, name: '신규오픈', slug: 'new-open', parentId: 6, icon: '🎉', sortOrder: 3 },
  { id: 64, name: '상인 구인', slug: 'biz-hiring', parentId: 6, icon: '📢', sortOrder: 4 },

  // 긱·의뢰 소분류
  { id: 71, name: '심부름/대행', slug: 'errand', parentId: 7, icon: '🏃', sortOrder: 1 },
  { id: 72, name: '번역/통역', slug: 'translation', parentId: 7, icon: '🌐', sortOrder: 2 },
  { id: 73, name: '디자인/창작', slug: 'creative', parentId: 7, icon: '🎨', sortOrder: 3 },
  { id: 74, name: '촬영/편집', slug: 'media', parentId: 7, icon: '📸', sortOrder: 4 },
  { id: 75, name: '설문/참여', slug: 'survey', parentId: 7, icon: '📊', sortOrder: 5 },
  { id: 76, name: '기타 의뢰', slug: 'etc-gig', parentId: 7, icon: '✨', sortOrder: 6 },
];

export const majorCategories = categories.filter(c => c.parentId === null);

export function getMinorCategories(majorId: number): Category[] {
  return categories.filter(c => c.parentId === majorId);
}

export function getCategoryGroups(): CategoryGroup[] {
  return majorCategories.map(major => ({
    major,
    minors: getMinorCategories(major.id),
  }));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
