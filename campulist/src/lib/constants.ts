// ============================================================
// 캠퍼스리스트 — 상수 정의
// localStorage 키, 기본값 등 매직 스트링 중앙 관리
// ============================================================

export const STORAGE_KEYS = {
  LIKED_POSTS: 'campulist_liked_posts',
  WRITE_DRAFT: 'campulist_write_draft',
  RECENT_SEARCHES: 'campulist_recent_searches',
  USER_POSTS: 'campulist_user_posts',
  POST_OVERRIDES: 'campulist_post_overrides',
  RECENT_VIEWED: 'campulist_recent_viewed',
  REPORTS: 'campulist_reports',
  POST_TAGS: 'campulist_post_tags',
  CURRENT_USER: 'campulist_current_user',
  REGISTERED_USERS: 'campulist_registered_users',
  POST_IMAGES: 'campulist_post_images',
  SHOW_ICONS: 'campulist_show_icons',
  PROFILE_OVERRIDES: 'campulist_profile_overrides',
} as const;

export const LIMITS = {
  MAX_TAGS: 5,
  MAX_IMAGES: 10,
  TITLE_MAX_LENGTH: 100,
  BODY_MAX_LENGTH: 5000,
  DRAFT_SAVE_DELAY: 1000,
} as const;

export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'popular', label: '인기순' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export const MEMBER_TYPE_LABELS: Record<import('./types').MemberType, string> = {
  undergraduate: '🎓 학부생/예술사(한예종)',
  graduate: '📚 대학원생/전문사(한예종)',
  professor: '👨‍🏫 교수',
  staff: '🏢 교직원',
  alumni: '🎒 졸업생',
  merchant: '🏪 비지니스 회원',
  general: '👤 일반인 회원',
};
