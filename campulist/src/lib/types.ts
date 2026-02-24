// ============================================================
// 캠퍼스리스트 (Campulist) — TypeScript 타입 정의
// ============================================================

export type UserRole = 'user' | 'business' | 'admin';
export type PostStatus = 'active' | 'reserved' | 'completed' | 'hidden';

export type BizPlan = 'basic' | 'pro' | 'premium';
export type ReportReason = 'spam' | 'fraud' | 'inappropriate' | 'duplicate' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type MemberType = 'undergraduate' | 'graduate' | 'professor' | 'staff' | 'alumni' | 'merchant' | 'general';
// 소분류별 글쓰기 접근 권한
export type PostAccess = 'campus' | 'open';

// 캠퍼스 전용 소분류 글쓰기 가능 회원 유형
export const CAMPUS_MEMBER_TYPES: MemberType[] = ['undergraduate', 'graduate', 'professor', 'staff', 'alumni'];

export interface Campus {
  name: string;
  region: string;
}

export interface University {
  id: number;
  name: string;
  slug: string;
  nameEn: string;
  nameKo?: string;
  domain: string;
  region: string;
  campuses: Campus[];
  logoUrl: string | null;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
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

export interface UserSummary {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  isVerified: boolean;
  mannerTemp: number;
  tradeCount: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  icon: string;
  sortOrder: number;
  postAccess?: PostAccess;
}

export interface CategoryGroup {
  major: Category;
  minors: Category[];
}

export interface ContactMethods {
  chat: boolean;         // 인앱 채팅 (항상 true)
  phone?: string;        // 전화번호 (선택)
  phoneCall?: boolean;   // 전화 허용
  phoneSms?: boolean;    // 문자 허용
  kakaoLink?: string;    // 카카오 오픈채팅 링크 (선택)
  email?: string;        // 이메일 (선택)
}

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
  isPremium: boolean;
  status: PostStatus;
  locationDetail: string | null;
  contactMethods?: ContactMethods;
  viewCount: number;
  likeCount: number;
  bumpedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostListItem {
  id: string;
  title: string;
  price: number | null;
  priceNegotiable: boolean;
  status: PostStatus;
  thumbnail: string | null;
  bodySnippet: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  bumpedAt: string;
  author: UserSummary;
  university: Pick<University, 'id' | 'name' | 'slug'>;
  categoryMinor: Pick<Category, 'id' | 'name' | 'slug'>;
}

export interface PostDetail extends Post {
  author: UserSummary;
  university: Pick<University, 'id' | 'name' | 'slug'>;
  categoryMajor: Pick<Category, 'id' | 'name' | 'slug' | 'icon'>;
  categoryMinor: Pick<Category, 'id' | 'name' | 'slug'>;
  images: string[];
  tags: string[];
  isLiked: boolean;
}

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


export interface PostImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Review {
  id: string;
  postId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Report {
  id: string;
  postId: string | null;
  userId: string | null;
  reporterId: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  createdAt: string;
}

export interface BusinessAccount {
  id: string;
  userId: string;
  businessName: string;
  businessNumber: string;
  plan: BizPlan;
  isActive: boolean;
  createdAt: string;
}

export interface KeywordAlert {
  id: string;
  userId: string;
  keyword: string;
  universityId: number | null;
  categoryId: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostCreateInput {
  title: string;
  body: string;
  universityId: number;
  categoryMajorId: number;
  categoryMinorId: number;
  price: number | null;
  priceNegotiable: boolean;
  locationDetail: string | null;
  contactMethods?: ContactMethods;
  tags: string[];
  images: File[];
}
