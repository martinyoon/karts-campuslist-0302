// ============================================================
// 데이터 접근 레이어 — Phase A: Mock 데이터
// Phase B에서 이 파일만 Supabase 버전으로 교체하면 전환 완료
// ============================================================

import type { Post, PostListItem, PostDetail, PostFilters, PostStatus, User } from './types';
import { mockPosts, toPostListItem, getPostImages, getPostTags } from '@/data/posts';
import { universities } from '@/data/universities';
import { categories } from '@/data/categories';
import { getUserSummary, mockUsers } from '@/data/users';
import { STORAGE_KEYS } from './constants';

// localStorage에서 사용자 생성 게시글 가져오기
function getLocalPosts(): Post[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_POSTS);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

// localStorage에서 게시글 오버라이드 가져오기 (상태변경, 끌올 등)
function getPostOverrides(): Record<string, Partial<Post>> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.POST_OVERRIDES);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function savePostOverrides(overrides: Record<string, Partial<Post>>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POST_OVERRIDES, JSON.stringify(overrides));
  } catch { /* storage full */ }
}

// 모든 게시글 (mock + localStorage + 오버라이드 적용)
function getAllPosts(): Post[] {
  const posts = [...mockPosts, ...getLocalPosts()];
  const overrides = getPostOverrides();
  if (Object.keys(overrides).length === 0) return posts;
  return posts.map(p => {
    const override = overrides[p.id];
    return override ? { ...p, ...override } : p;
  });
}

export async function getPosts(filters?: PostFilters): Promise<PostListItem[]> {
  let posts = getAllPosts().filter(p => p.status === 'active');

  if (filters?.universitySlug) {
    const uni = universities.find(u => u.slug === filters.universitySlug);
    if (uni) posts = posts.filter(p => p.universityId === uni.id);
  }

  if (filters?.categoryMajorSlug) {
    const cat = categories.find(c => c.slug === filters.categoryMajorSlug && c.parentId === null);
    if (cat) posts = posts.filter(p => p.categoryMajorId === cat.id);
  }

  if (filters?.categoryMinorSlug) {
    const cat = categories.find(c => c.slug === filters.categoryMinorSlug && c.parentId !== null);
    if (cat) posts = posts.filter(p => p.categoryMinorId === cat.id);
  }

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    );
  }

  if (filters?.priceMin !== undefined) {
    const min = filters.priceMin;
    posts = posts.filter(p => p.price !== null && p.price >= min);
  }

  if (filters?.priceMax !== undefined) {
    const max = filters.priceMax;
    posts = posts.filter(p => p.price !== null && p.price <= max);
  }

  // 정렬
  const sortBy = filters?.sortBy || 'latest';
  switch (sortBy) {
    case 'latest':
      posts.sort((a, b) => new Date(b.bumpedAt).getTime() - new Date(a.bumpedAt).getTime());
      break;
    case 'price_asc':
      posts.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case 'price_desc':
      posts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case 'popular':
      posts.sort((a, b) => b.likeCount - a.likeCount);
      break;
  }

  // 페이지네이션
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const start = (page - 1) * limit;
  posts = posts.slice(start, start + limit);

  return posts.map(toPostListItem);
}

export async function getPostDetail(postId: string): Promise<PostDetail | null> {
  const post = getAllPosts().find(p => p.id === postId);
  if (!post) return null;

  const uni = universities.find(u => u.id === post.universityId);
  const major = categories.find(c => c.id === post.categoryMajorId);
  const minor = categories.find(c => c.id === post.categoryMinorId);
  if (!uni || !major || !minor) return null;

  return {
    ...post,
    author: getUserSummary(post.authorId),
    university: { id: uni.id, name: uni.name, slug: uni.slug },
    categoryMajor: { id: major.id, name: major.name, slug: major.slug, icon: major.icon },
    categoryMinor: { id: minor.id, name: minor.name, slug: minor.slug },
    images: getPostImages(post.id),
    tags: getPostTags(post.id),
    isLiked: getLikedPostIds().includes(postId),
  };
}

export async function getRelatedPosts(postId: string, limit = 4): Promise<PostListItem[]> {
  const allPosts = getAllPosts();
  const post = allPosts.find(p => p.id === postId);
  if (!post) return [];

  const active = allPosts.filter(p => p.id !== postId && p.status === 'active' && p.universityId === post.universityId);
  const byRecent = (a: typeof allPosts[0], b: typeof allPosts[0]) =>
    new Date(b.bumpedAt).getTime() - new Date(a.bumpedAt).getTime();

  // Tier 1: 같은 소분류 (가장 관련성 높음)
  const sameMinor = active
    .filter(p => p.categoryMinorId === post.categoryMinorId)
    .sort(byRecent);

  // Tier 2: 같은 대분류, 다른 소분류
  const sameMajor = active
    .filter(p => p.categoryMajorId === post.categoryMajorId && p.categoryMinorId !== post.categoryMinorId)
    .sort(byRecent);

  // Tier 3: 같은 대학, 다른 카테고리
  const sameUni = active
    .filter(p => p.categoryMajorId !== post.categoryMajorId)
    .sort(byRecent);

  const related = [...sameMinor, ...sameMajor, ...sameUni].slice(0, limit);
  return related.map(toPostListItem);
}

export async function getUniversityBySlug(slug: string) {
  return universities.find(u => u.slug === slug) || null;
}

export async function getAllUniversities() {
  return universities;
}

export async function getUserById(userId: string): Promise<User | null> {
  return mockUsers.find(u => u.id === userId) || null;
}

export async function getUserPosts(userId: string): Promise<PostListItem[]> {
  const posts = getAllPosts()
    .filter(p => p.authorId === userId && p.status !== 'hidden')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return posts.map(toPostListItem);
}

// 동기 함수: 클라이언트 컴포넌트용
export function getMyPosts(userId: string): PostListItem[] {
  return getAllPosts()
    .filter(p => p.authorId === userId && p.status !== 'hidden')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(toPostListItem);
}

export function getPostsByIds(postIds: string[]): PostListItem[] {
  return getAllPosts()
    .filter(p => postIds.includes(p.id) && p.status !== 'hidden')
    .map(toPostListItem);
}

// 수정용 게시글 조회
export function getPostForEdit(postId: string): (Post & { tags: string[] }) | null {
  const post = getAllPosts().find(p => p.id === postId);
  if (!post) return null;
  return { ...post, tags: getPostTags(postId) };
}

// 게시글 수정
export function updatePost(postId: string, input: {
  title: string;
  body: string;
  universityId: number;
  categoryMajorId: number;
  categoryMinorId: number;
  price: number | null;
  priceNegotiable: boolean;
  locationDetail: string | null;
  contactMethods?: import('./types').ContactMethods;
  tags?: string[];
  images?: string[];
  status?: PostStatus;
}): void {
  const now = new Date().toISOString();
  // localStorage 게시글: 직접 수정
  if (postId.startsWith('local-')) {
    const localPosts = getLocalPosts();
    const idx = localPosts.findIndex(p => p.id === postId);
    if (idx >= 0) {
      const { tags: _tags, images: _images, ...postInput } = input;
      localPosts[idx] = { ...localPosts[idx], ...postInput, updatedAt: now };
      localStorage.setItem(STORAGE_KEYS.USER_POSTS, JSON.stringify(localPosts));
    }
  } else {
    // mock 게시글: 오버라이드
    const { tags: _tags, images: _images, ...postInput } = input;
    const overrides = getPostOverrides();
    overrides[postId] = { ...overrides[postId], ...postInput, updatedAt: now };
    savePostOverrides(overrides);
  }

  // 태그 저장
  if (input.tags) {
    try {
      const savedTags = localStorage.getItem(STORAGE_KEYS.POST_TAGS);
      const allTags: Record<string, string[]> = savedTags ? JSON.parse(savedTags) : {};
      allTags[postId] = input.tags;
      localStorage.setItem(STORAGE_KEYS.POST_TAGS, JSON.stringify(allTags));
    } catch { /* storage full */ }
  }

  // 이미지 저장
  if (input.images) {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEYS.POST_IMAGES);
      const allImages: Record<string, string[]> = savedImages ? JSON.parse(savedImages) : {};
      allImages[postId] = input.images;
      localStorage.setItem(STORAGE_KEYS.POST_IMAGES, JSON.stringify(allImages));
    } catch { /* storage full */ }
  }
}

// 게시글 삭제
export function deletePost(postId: string): void {
  // localStorage 게시글: 완전 삭제
  if (postId.startsWith('local-')) {
    const localPosts = getLocalPosts();
    const filtered = localPosts.filter(p => p.id !== postId);
    localStorage.setItem(STORAGE_KEYS.USER_POSTS, JSON.stringify(filtered));
    return;
  }
  // mock 게시글: hidden 처리
  updatePostStatus(postId, 'hidden');
}

// 게시글 생성 (localStorage에 저장)
export function createPost(input: {
  title: string;
  body: string;
  authorId: string;
  universityId: number;
  categoryMajorId: number;
  categoryMinorId: number;
  price: number | null;
  priceNegotiable: boolean;
  locationDetail: string | null;
  contactMethods?: import('./types').ContactMethods;
  tags: string[];
  images?: string[];
}): Post {
  const now = new Date().toISOString();
  const post: Post = {
    id: `local-${Date.now()}`,
    title: input.title,
    body: input.body,
    authorId: input.authorId,
    universityId: input.universityId,
    categoryMajorId: input.categoryMajorId,
    categoryMinorId: input.categoryMinorId,
    price: input.price,
    priceNegotiable: input.priceNegotiable,
    isPremium: false,
    status: 'active',
    locationDetail: input.locationDetail,
    contactMethods: input.contactMethods,
    viewCount: 0,
    likeCount: 0,
    bumpedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const saved = getLocalPosts();
    saved.push(post);
    localStorage.setItem(STORAGE_KEYS.USER_POSTS, JSON.stringify(saved));
  } catch { /* storage full */ }

  // 태그 저장
  if (input.tags.length > 0) {
    try {
      const savedTags = localStorage.getItem(STORAGE_KEYS.POST_TAGS);
      const allTags: Record<string, string[]> = savedTags ? JSON.parse(savedTags) : {};
      allTags[post.id] = input.tags;
      localStorage.setItem(STORAGE_KEYS.POST_TAGS, JSON.stringify(allTags));
    } catch { /* storage full */ }
  }

  // 이미지 저장
  if (input.images && input.images.length > 0) {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEYS.POST_IMAGES);
      const allImages: Record<string, string[]> = savedImages ? JSON.parse(savedImages) : {};
      allImages[post.id] = input.images;
      localStorage.setItem(STORAGE_KEYS.POST_IMAGES, JSON.stringify(allImages));
    } catch { /* storage full */ }
  }

  return post;
}

// A1: 게시글 상태 변경 (localStorage 오버라이드)
export function updatePostStatus(postId: string, status: PostStatus): void {
  const overrides = getPostOverrides();
  overrides[postId] = { ...overrides[postId], status, updatedAt: new Date().toISOString() };
  savePostOverrides(overrides);
}

// A2: 게시글 끌어올리기
export function bumpPost(postId: string): void {
  const now = new Date().toISOString();
  const overrides = getPostOverrides();
  overrides[postId] = { ...overrides[postId], bumpedAt: now, updatedAt: now };
  savePostOverrides(overrides);
}

// A3: 찜한 게시글 ID 목록 조회
export function getLikedPostIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKED_POSTS) || '[]');
  } catch { return []; }
}

// A4: 찜 토글 (likeCount ±1 + LIKED_POSTS 배열 업데이트)
export function toggleLike(postId: string): { liked: boolean; count: number } {
  const likedPosts = getLikedPostIds();
  const isCurrentlyLiked = likedPosts.includes(postId);

  // LIKED_POSTS 배열 업데이트
  const updatedIds = isCurrentlyLiked
    ? likedPosts.filter(id => id !== postId)
    : [...likedPosts, postId];
  localStorage.setItem(STORAGE_KEYS.LIKED_POSTS, JSON.stringify(updatedIds));

  // likeCount 오버라이드 저장
  const post = getAllPosts().find(p => p.id === postId);
  const currentCount = post?.likeCount ?? 0;
  const newCount = isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

  const overrides = getPostOverrides();
  overrides[postId] = { ...overrides[postId], likeCount: newCount };
  savePostOverrides(overrides);

  return { liked: !isCurrentlyLiked, count: newCount };
}

// 클라이언트 전용: 필터링된 로컬 게시글 (Server Component에서는 빈 배열 반환)
export function getFilteredLocalPosts(filters?: {
  universityId?: number;
  categoryMajorId?: number;
  categoryMinorId?: number;
  query?: string;
  authorId?: string;
  priceMin?: number;
  priceMax?: number;
}): PostListItem[] {
  // getAllPosts에서 로컬 게시글 + 오버라이드 적용된 것만 추출
  let posts = getAllPosts().filter(p => p.id.startsWith('local-') && p.status === 'active');
  if (filters?.universityId) posts = posts.filter(p => p.universityId === filters.universityId);
  if (filters?.categoryMajorId) posts = posts.filter(p => p.categoryMajorId === filters.categoryMajorId);
  if (filters?.categoryMinorId) posts = posts.filter(p => p.categoryMinorId === filters.categoryMinorId);
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q));
  }
  if (filters?.authorId) posts = posts.filter(p => p.authorId === filters.authorId);
  if (filters?.priceMin !== undefined) posts = posts.filter(p => p.price !== null && p.price >= filters.priceMin!);
  if (filters?.priceMax !== undefined) posts = posts.filter(p => p.price !== null && p.price <= filters.priceMax!);
  return posts.map(toPostListItem);
}

// 조회수 증가 (세션당 1회만)
export function incrementViewCount(postId: string): number {
  if (typeof window === 'undefined') return 0;
  // sessionStorage로 중복 방지
  const sessionKey = `viewed_${postId}`;
  const post = getAllPosts().find(p => p.id === postId);
  if (!post) return 0;
  if (sessionStorage.getItem(sessionKey)) return post.viewCount;
  sessionStorage.setItem(sessionKey, '1');

  const newCount = post.viewCount + 1;
  const overrides = getPostOverrides();
  overrides[postId] = { ...overrides[postId], viewCount: newCount };
  savePostOverrides(overrides);
  return newCount;
}

// 최근 본 게시글
export function addRecentViewed(postId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_VIEWED);
    let recent: string[] = saved ? JSON.parse(saved) : [];
    recent = recent.filter(id => id !== postId);
    recent.unshift(postId);
    if (recent.length > 20) recent = recent.slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.RECENT_VIEWED, JSON.stringify(recent));
  } catch { /* ignore */ }
}

export function getRecentViewedPosts(): PostListItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_VIEWED);
    const ids: string[] = saved ? JSON.parse(saved) : [];
    if (ids.length === 0) return [];
    const posts = getAllPosts().filter(p => ids.includes(p.id) && p.status !== 'hidden');
    return ids
      .map(id => posts.find(p => p.id === id))
      .filter((p): p is Post => !!p)
      .map(toPostListItem);
  } catch { return []; }
}
