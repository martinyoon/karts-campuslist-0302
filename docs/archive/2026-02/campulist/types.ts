// ============================================================
// 캠푸리스트 (Campulist) — TypeScript 타입 정의
// ============================================================
// 시제품 Phase A: Mock 데이터 구조로 사용
// Phase B: Supabase DB 스키마와 1:1 매핑
// ============================================================

// --- ENUM ---

export type UserRole = 'user' | 'business' | 'admin';

export type PostStatus = 'active' | 'reserved' | 'completed' | 'hidden';

export type ReportReason = 'spam' | 'fraud' | 'inappropriate' | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export type NotificationType = 'chat' | 'like' | 'keyword' | 'review' | 'system';

export type BizPlan = 'basic' | 'pro' | 'premium';

// --- 대학교 ---

export interface University {
  id: number;
  name: string;
  slug: string;
  nameEn: string;
  domain: string;
  region: string;
  logoUrl: string | null;
  isActive: boolean;
}

// --- 사용자 ---

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  role: UserRole;
  universityId: number;
  department: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  mannerTemp: number;
  tradeCount: number;
  createdAt: string;
}

/** 게시글/채팅에서 표시되는 간략 사용자 정보 */
export interface UserSummary {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  isVerified: boolean;
  mannerTemp: number;
  tradeCount: number;
}

// --- 카테고리 ---

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  icon: string;
  sortOrder: number;
}

/** 대분류 + 소분류 묶음 */
export interface CategoryGroup {
  major: Category;
  minors: Category[];
}

// --- 게시글 ---

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  universityId: number;
  categoryMajorId: number;
  categoryMinorId: number;
  price: number | null;
  priceNegotiable: boolean;
  status: PostStatus;
  locationDetail: string | null;
  viewCount: number;
  likeCount: number;
  isPremium: boolean;
  bumpedAt: string;
  createdAt: string;
  updatedAt: string;
}

/** 게시글 목록 아이템 (목록 화면용) */
export interface PostListItem {
  id: string;
  title: string;
  price: number | null;
  priceNegotiable: boolean;
  status: PostStatus;
  thumbnail: string | null;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  bumpedAt: string;
  author: UserSummary;
  university: Pick<University, 'id' | 'name' | 'slug'>;
  categoryMinor: Pick<Category, 'id' | 'name' | 'slug'>;
}

/** 게시글 상세 (상세 화면용) */
export interface PostDetail extends Post {
  author: UserSummary;
  university: Pick<University, 'id' | 'name' | 'slug'>;
  categoryMajor: Pick<Category, 'id' | 'name' | 'slug' | 'icon'>;
  categoryMinor: Pick<Category, 'id' | 'name' | 'slug'>;
  images: PostImage[];
  tags: string[];
  isLiked: boolean;
}

export interface PostImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

// --- 게시글 필터/정렬 ---

export interface PostFilters {
  universitySlug?: string;
  categoryMajorSlug?: string;
  categoryMinorSlug?: string;
  query?: string;
  priceMin?: number;
  priceMax?: number;
  status?: PostStatus;
  sortBy?: 'latest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

// --- 채팅 ---

export interface ChatRoom {
  id: string;
  postId: string;
  postTitle: string;
  postPrice: number | null;
  postThumbnail: string | null;
  otherUser: UserSummary;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string | null;
  imageUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

// --- 후기 ---

export interface Review {
  id: string;
  postId: string;
  postTitle: string;
  reviewer: UserSummary;
  rating: number;
  content: string;
  createdAt: string;
}

// --- 알림 ---

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

// --- 비즈니스 ---

export interface BusinessAccount {
  id: string;
  userId: string;
  businessName: string;
  businessNumber: string | null;
  plan: BizPlan;
  phone: string | null;
  address: string | null;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  expiresAt: string;
}

// --- 신고 ---

export interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: ReportReason;
  detail: string | null;
  status: ReportStatus;
  createdAt: string;
}

// --- 키워드 알림 ---

export interface KeywordAlert {
  id: string;
  keyword: string;
  universityId: number | null;
  categoryMajorId: number | null;
  isActive: boolean;
}

// --- API 응답 공통 ---

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// --- 게시글 작성 폼 ---

export interface PostCreateInput {
  title: string;
  body: string;
  categoryMajorId: number;
  categoryMinorId: number;
  price: number | null;
  priceNegotiable: boolean;
  locationDetail: string | null;
  images: File[];
  tags: string[];
}
