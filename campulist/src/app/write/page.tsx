'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { universities } from '@/data/universities';
import { STORAGE_KEYS } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { createPost, getPostForEdit, updatePost, deletePost, getPosts, getPostDetail } from '@/lib/api';
import type { PostListItem } from '@/lib/types';
import { getPostImages } from '@/data/posts';
import { LIMITS } from '@/lib/constants';
import type { PostStatus, MemberType } from '@/lib/types';
import { CAMPUS_MEMBER_TYPES } from '@/lib/types';
import WriteUniversityTabs from '@/components/write/WriteUniversityTabs';
import WriteCategoryGrid from '@/components/write/WriteCategoryGrid';
import { categoryExamples, categoryExampleSets } from '@/data/categoryExamples';
import type { ToneType } from '@/data/categoryExamples';
import { getCategoryBySlug, getMinorCategories, majorCategories, categories } from '@/data/categories';
import type { User } from '@/lib/types';

interface WriteDraft {
  title: string;
  body: string;
  price: string;
  priceNegotiable: boolean;
  universityId: number;
  majorId: number | null;
  minorId: number | null;
  tags: string[];
  location: string;
  savedAt: string;
}

type WriteStep = 'major' | 'minor' | 'form';

const MEMBER_TYPE_SHORT: Record<MemberType, string> = {
  undergraduate: '학부생',
  graduate: '대학원생',
  professor: '교수',
  staff: '교직원',
  alumni: '졸업생',
  merchant: '인근상인',
  general: '일반인',
};

function fillTemplate(template: string, user: User, targetUniversityId: number): string {
  const targetUni = universities.find(u => u.id === targetUniversityId);
  const targetShort = targetUni?.name.replace('대학교', '대') || '대학';
  const userUni = universities.find(u => u.id === user.universityId);
  const userShort = userUni?.name.replace('대학교', '대') || '대학';
  const typeLabel = MEMBER_TYPE_SHORT[user.memberType] || '';
  const dept = user.department || '본인학과';

  return template
    .replace(/\{\{prefix\}\}/g, `[${userShort}][${typeLabel}]`)
    .replace(/\{\{university\}\}/g, targetShort)
    .replace(/\{\{department\}\}/g, dept)
    .replace(/\{\{memberType\}\}/g, typeLabel);
}


const TONE_OPTIONS: { value: ToneType; label: string; icon: string }[] = [
  { value: 'clean', label: '깔끔', icon: '📋' },
  { value: 'friendly', label: '친근', icon: '😊' },
  { value: 'urgent', label: '급매', icon: '🔥' },
  { value: 'humor', label: '유머', icon: '😂' },
];

function WritePageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState<WriteStep>('major');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [universityId, setUniversityId] = useState(universities[0]?.id ?? 1);
  const [majorId, setMajorId] = useState<number | null>(null);
  const [minorId, setMinorId] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus>('active');
  const [images, setImages] = useState<string[]>([]);
  const [contactPhone, setContactPhone] = useState('');
  const [contactPhoneCall, setContactPhoneCall] = useState(true);
  const [contactPhoneSms, setContactPhoneSms] = useState(true);
  const [contactKakao, setContactKakao] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const initialized = useRef(false);
  const uniFromUrl = useRef(false);
  const isEditRef = useRef(false);

  // ── 7가지 개선 기능 상태 ──
  const [selectedTone, setSelectedTone] = useState<ToneType>('clean');
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showLocked, setShowLocked] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'title' | 'price' | 'body' | 'delete' | null>(null);
  const [showOtherPosts, setShowOtherPosts] = useState(false);
  const [otherPosts, setOtherPosts] = useState<PostListItem[]>([]);
  const [loadingOthers, setLoadingOthers] = useState(false);
  // 확장 예시 세트
  const exSet = minorId ? categoryExampleSets[minorId] : null;
  const exExamples = exSet?.examples ?? (minorId && categoryExamples[minorId] ? [categoryExamples[minorId]] : []);

  // 현재 선택된 대학/카테고리 정보
  const selectedUni = universities.find(u => u.id === universityId);
  const selectedMajor = majorId ? majorCategories.find(c => c.id === majorId) ?? null : null;
  const currentMinors = majorId ? getMinorCategories(majorId) : [];
  const selectedMinor = minorId ? currentMinors.find(c => c.id === minorId) ?? null : null;
  const isCampusMember = user ? CAMPUS_MEMBER_TYPES.includes(user.memberType) : true;

  // 완성도 점수
  const completionScore = useMemo(() => {
    let s = 0;
    if (title.trim().length >= 10) s += 15;
    if (price) s += 10;
    if (body.trim().length >= 100) s += 20;
    if (body.trim().length >= 300) s += 10;
    if (images.length >= 1) s += 15;
    if (images.length >= 3) s += 10;
    if (tags.length >= 1) s += 10;
    if (location.trim()) s += 5;
    if (contactPhone || contactKakao || contactEmail) s += 5;
    return s;
  }, [title, price, body, images, tags, location, contactPhone, contactKakao, contactEmail]);

  const scoreLabel = completionScore >= 90 ? '🔥 완벽한 글' : completionScore >= 70 ? '✨ 매력적인 글' : completionScore >= 40 ? '📝 기본 완성' : '✏️ 작성 중';

  const nextHint = useMemo(() => {
    if (!title.trim() || title.trim().length < 10) return '제목을 10자 이상 입력해보세요';
    if (!body.trim() || body.trim().length < 100) return '내용을 100자 이상 작성하면 신뢰도가 올라가요';
    if (images.length === 0) return '📸 사진을 추가하면 조회수가 3배 높아져요!';
    if (tags.length === 0) return '🏷️ 태그를 추가하면 검색에 잘 노출돼요';
    if (!location.trim()) return '📍 거래 장소를 적으면 빠른 거래가 가능해요';
    if (images.length < 3) return '📸 사진 3장 이상이면 더 많은 관심을 받아요';
    return '🎉 훌륭한 글이에요! 등록해보세요';
  }, [title, body, images, tags, location]);

  // 인기 태그 추천
  const suggestedTags = useMemo(() => {
    if (!exSet) return [];
    return exSet.popularTags.filter(t => !tags.includes(t));
  }, [exSet, tags]);

  async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let w = img.width;
        let h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) { h = (h / w) * MAX_DIM; w = MAX_DIM; }
          else { w = (w / h) * MAX_DIM; h = MAX_DIM; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error('이미지 로드 실패')); };
      img.src = URL.createObjectURL(file);
    });
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = LIMITS.MAX_IMAGES - images.length;
    const selected = Array.from(files).slice(0, remaining);
    try {
      const compressed = await Promise.all(selected.map(compressImage));
      setImages(prev => [...prev, ...compressed]);
    } catch {
      toast('일부 이미지를 처리할 수 없습니다.');
    }
    e.target.value = '';
  };

  // 수정 모드 또는 임시저장 불러오기
  useEffect(() => {
    if (initialized.current) return;

    // URL에서 edit 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const editParam = params.get('edit');

    // campus 카테고리 접근 차단 체크 (비캠퍼스 회원)
    const isCampusBlocked = (mId: number) => {
      const minor = categories.find(c => c.id === mId);
      return minor?.postAccess === 'campus' && user && !CAMPUS_MEMBER_TYPES.includes(user.memberType);
    };

    if (editParam) {
      // user 로드 전이면 대기
      if (!user) return;
      const post = getPostForEdit(editParam);
      if (post && post.authorId === user.id) {
        // campus 카테고리 게시글 수정 차단
        if (isCampusBlocked(post.categoryMinorId)) {
          initialized.current = true;
          toast('이 카테고리는 대학 소속 인증 회원만 이용 가능합니다');
          router.push(`/post/${editParam}`);
          return;
        }
        initialized.current = true;
        isEditRef.current = true;
        setEditId(editParam);
        setIsEditMode(true);
        setTitle(post.title);
        setBody(post.body);
        setPrice(post.price?.toString() || '');
        setPriceNegotiable(post.priceNegotiable);
        setUniversityId(post.universityId);
        setMajorId(post.categoryMajorId);
        setMinorId(post.categoryMinorId);
        setTags(post.tags);
        setLocation(post.locationDetail || '');
        setPostStatus(post.status);
        setImages(getPostImages(editParam));
        if (post.contactMethods) {
          if (post.contactMethods.phone) {
            setContactPhone(post.contactMethods.phone);
            setContactPhoneCall(post.contactMethods.phoneCall ?? true);
            setContactPhoneSms(post.contactMethods.phoneSms ?? true);
          }
          if (post.contactMethods.kakaoLink) setContactKakao(post.contactMethods.kakaoLink);
          if (post.contactMethods.email) setContactEmail(post.contactMethods.email);
        }
        setStep('form');
        return;
      }
    }

    // URL에서 대학교 파라미터 확인 (브레드크럼 기반 자동 선택)
    const uniParam = params.get('uni');
    if (uniParam) {
      const uni = universities.find(u => u.slug === uniParam);
      if (uni) {
        setUniversityId(uni.id);
        uniFromUrl.current = true;
      }
    }

    // URL에서 major/minor 카테고리 파라미터 확인 (카테고리 페이지에서 진입 시)
    const majorParam = params.get('major');
    if (majorParam) {
      const majorCat = getCategoryBySlug(majorParam);
      if (majorCat && majorCat.parentId === null) {
        initialized.current = true;
        setMajorId(majorCat.id);
        const minorParam = params.get('minor');
        if (minorParam) {
          const minorCat = getCategoryBySlug(minorParam);
          if (minorCat && minorCat.parentId === majorCat.id) {
            if (isCampusBlocked(minorCat.id)) {
              toast('이 카테고리는 대학 소속 인증 회원만 이용 가능합니다');
              setStep('major');
            } else {
              setMinorId(minorCat.id);
              setStep('form');
            }
          } else {
            setStep('minor');
          }
        } else {
          setStep('minor');
        }
        return;
      }
    }

    // uni 파라미터만 있는 경우 (대학교 페이지에서 진입)
    if (uniFromUrl.current && !majorParam) {
      initialized.current = true;
      return;
    }

    // 새 글쓰기: 임시저장 불러오기
    initialized.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WRITE_DRAFT);
      if (saved) {
        const draft: WriteDraft = JSON.parse(saved);
        setTitle(draft.title || '');
        setBody(draft.body || '');
        setPrice(draft.price || '');
        setPriceNegotiable(draft.priceNegotiable || false);
        setUniversityId(draft.universityId || 1);
        setMajorId(draft.majorId);
        // campus 카테고리 드래프트 → minorId 무시
        if (draft.minorId && isCampusBlocked(draft.minorId)) {
          setMinorId(null);
        } else {
          setMinorId(draft.minorId);
        }
        setTags(draft.tags || []);
        setLocation(draft.location || '');
        setLastSaved(draft.savedAt);
        setDraftLoaded(true);
        // 드래프트 카테고리 상태에 따라 step 결정
        if (draft.majorId && draft.minorId && !isCampusBlocked(draft.minorId)) {
          setStep('form');
        }
        // majorId만 있으면 대분류부터 시작 (선택값은 유지됨)
      }
    } catch { /* ignore parse errors */ }
  }, [user]);

  // 사용자 대학교를 기본값으로 설정 + 제목 접두어 자동 삽입
  useEffect(() => {
    if (user && !isEditMode && !draftLoaded && !isEditRef.current) {
      if (!uniFromUrl.current) {
        setUniversityId(user.universityId);
      }
      if (!title) {
        const uni = universities.find(u => u.id === user.universityId);
        const uniShort = uni ? uni.name.replace('대학교', '대') : '';
        const typeLabel = MEMBER_TYPE_SHORT[user.memberType] || '';
        setTitle(`[${uniShort}][${typeLabel}] `);
      }
    }
  }, [user, isEditMode, draftLoaded]);

  useEffect(() => {
    document.title = isEditMode ? '글 수정 | 캠퍼스리스트' : '글쓰기 | 캠퍼스리스트';
  }, [isEditMode]);

  // 자동 임시저장 (1초 디바운스, 수정 모드에서는 비활성)
  const saveDraft = useCallback(() => {
    if (isEditMode) return;
    const draft: WriteDraft = {
      title, body, price, priceNegotiable,
      universityId, majorId, minorId, tags, location,
      savedAt: new Date().toISOString(),
    };
    // 모든 필드가 비어있으면 저장하지 않음
    if (!title && !body && !price && !location && tags.length === 0 && !majorId) return;
    try {
      localStorage.setItem(STORAGE_KEYS.WRITE_DRAFT, JSON.stringify(draft));
      setLastSaved(draft.savedAt);
    } catch { /* storage full — ignore */ }
  }, [isEditMode, title, body, price, priceNegotiable, universityId, majorId, minorId, tags, location]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [saveDraft]);

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEYS.WRITE_DRAFT);
    setLastSaved(null);
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChangeCategory = () => {
    setMinorId(null);
    setStep('major');
  };

  const handleMajorSelect = (id: number) => {
    setMajorId(id);
    setMinorId(null);
    if (step === 'form') setStep('major');
  };

  const handleMinorSelect = (id: number) => {
    const minor = categories.find(c => c.id === id);
    if (minor?.postAccess === 'campus' && user && !CAMPUS_MEMBER_TYPES.includes(user.memberType)) {
      toast('이 카테고리는 대학 소속 인증 회원만 이용 가능합니다');
      return;
    }
    setMajorId(minor?.parentId ?? majorId);
    setMinorId(id);
    setStep('form');
  };

  const handleReset = () => {
    clearDraft();
    setTitle(''); setBody(''); setPrice(''); setPriceNegotiable(false);
    setUniversityId(1); setMajorId(null); setMinorId(null);
    setTags([]); setLocation(''); setImages([]); setDraftLoaded(false);
    setStep('major');
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && tags.length < 5 && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  // ── 예시 채우기 (스마트 버전) ──
  const hasExample = !isEditMode && exExamples.length > 0;

  // 톤 적용: 선택된 톤의 title/body가 있으면 사용
  const applyTone = (ex: typeof exExamples[0], tone: ToneType) => {
    if (tone === 'clean' || !exSet?.tones?.[tone]) return ex;
    const tv = exSet.tones[tone]!;
    return { ...ex, title: tv.title, body: tv.body };
  };

  const fillTitleExample = () => {
    if (!user || exExamples.length === 0) return;
    const uniShort = universities.find(u => u.id === user.universityId)?.name.replace('대학교', '대') || '';
    const prefixOnly = `[${uniShort}][${MEMBER_TYPE_SHORT[user.memberType]}] `;
    if (title.trim() && title.trim() !== prefixOnly.trim()) {
      setConfirmAction('title');
      return;
    }
    const ex = applyTone(exExamples[0], selectedTone);
    const ft = fillTemplate(ex.title, user, user.universityId);
    const pfx = `[${uniShort}][${MEMBER_TYPE_SHORT[user.memberType]}]`;
    setTitle(ft.startsWith(pfx) ? ft : `${pfx} ${ft}`);
  };

  const fillPriceExample = () => {
    if (!user || exExamples.length === 0) return;
    if (price) {
      setConfirmAction('price');
      return;
    }
    const ex = exExamples[0];
    setPrice(ex.price);
    setPriceNegotiable(ex.negotiable);
  };

  const fillBodyExample = () => {
    if (!user || exExamples.length === 0) return;
    if (body.trim()) {
      setConfirmAction('body');
      return;
    }
    const ex = applyTone(exExamples[0], selectedTone);
    setBody(fillTemplate(ex.body, user, user.universityId));
  };

  const handleConfirmAction = () => {
    if (!user || exExamples.length === 0) { setConfirmAction(null); return; }
    switch (confirmAction) {
      case 'title': {
        const ex = applyTone(exExamples[0], selectedTone);
        const ft = fillTemplate(ex.title, user, user.universityId);
        const uniS = universities.find(u => u.id === user.universityId)?.name.replace('대학교', '대') || '대학';
        const pfx = `[${uniS}][${MEMBER_TYPE_SHORT[user.memberType]}]`;
        setTitle(ft.startsWith(pfx) ? ft : `${pfx} ${ft}`);
        break;
      }
      case 'price': {
        const ex = exExamples[0];
        setPrice(ex.price);
        setPriceNegotiable(ex.negotiable);
        break;
      }
      case 'body': {
        const ex = applyTone(exExamples[0], selectedTone);
        setBody(fillTemplate(ex.body, user, user.universityId));
        break;
      }
      case 'delete': {
        if (editId) {
          deletePost(editId);
          toast('게시글이 삭제되었습니다');
          router.push('/my');
        }
        break;
      }
    }
    setConfirmAction(null);
  };

  // 샘플 채우기: 매번 모든 필드를 새 샘플로 교체 (prefix 자동 유지)
  const fillSmartExamples = (idx: number) => {
    if (!user || exExamples.length === 0) return;
    const raw = exExamples[idx % exExamples.length];
    const ex = applyTone(raw, selectedTone);

    const filledTitle = fillTemplate(ex.title, user, user.universityId);
    const uniShort2 = universities.find(u => u.id === user.universityId)?.name.replace('대학교', '대') || '대학';
    const prefix = `[${uniShort2}][${MEMBER_TYPE_SHORT[user.memberType]}]`;
    setTitle(filledTitle.startsWith(prefix) ? filledTitle : `${prefix} ${filledTitle}`);
    if (raw.price) {
      setPrice(raw.price);
      setPriceNegotiable(raw.negotiable);
    }
    setBody(fillTemplate(ex.body, user, user.universityId));
    if (raw.tags.length > 0) {
      setTags(raw.tags.slice(0, 5).map(t => fillTemplate(t, user, user.universityId)));
    }
    if (raw.location) {
      setLocation(fillTemplate(raw.location, user, user.universityId));
    }

    toast('샘플로 채워졌어요!');
    setHighlightedFields(['제목', '가격', '내용', '태그', '장소']);
    setTimeout(() => setHighlightedFields([]), 1500);
  };

  // 랜덤 예시 뽑기 (슬롯머신 애니메이션)
  const spinnerRef = useRef<HTMLSpanElement>(null);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastExampleIdxRef = useRef<number>(-1);

  // 컴포넌트 언마운트 시 interval 정리
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    };
  }, []);

  const fillRandomExample = () => {
    if (!user || exExamples.length === 0) return;
    if (exExamples.length === 1) { fillSmartExamples(0); return; }
    const capturedUser = user;
    setIsSpinning(true);
    let count = 0;
    spinIntervalRef.current = setInterval(() => {
      if (spinnerRef.current) {
        const randEx = exExamples[Math.floor(Math.random() * exExamples.length)];
        spinnerRef.current.textContent = fillTemplate(randEx.title, capturedUser, capturedUser.universityId).slice(0, 30) + '...';
      }
      count++;
      if (count > 10) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
        let finalIdx = Math.floor(Math.random() * exExamples.length);
        for (let i = 0; i < 5 && finalIdx === lastExampleIdxRef.current && exExamples.length > 1; i++) {
          finalIdx = Math.floor(Math.random() * exExamples.length);
        }
        lastExampleIdxRef.current = finalIdx;
        fillSmartExamples(finalIdx);
        setIsSpinning(false);
      }
    }, 80);
  };

  // 다른 사람들 글 가져오기: 같은 소분류 게시글 조회
  const fetchOtherPosts = async () => {
    if (!minorId || !user) return;
    setLoadingOthers(true);
    const minor = categories.find(c => c.id === minorId);
    if (!minor) { setLoadingOthers(false); return; }

    const posts = await getPosts({
      categoryMinorSlug: minor.slug,
      sortBy: 'popular',
      limit: 20,
    });
    const filtered = posts.filter(p => p.author.id !== user.id).slice(0, 10);
    setOtherPosts(filtered);
    setLoadingOthers(false);
    setShowOtherPosts(true);
  };

  // 선택한 글로 필드 채우기 (prefix 유지)
  const fillFromOtherPost = async (postId: string) => {
    const detail = await getPostDetail(postId);
    if (!detail || !user) return;

    const uniShort = universities.find(u => u.id === user.universityId)?.name.replace('대학교', '대') || '';
    const typeLabel = MEMBER_TYPE_SHORT[user.memberType] || '';
    const prefix = `[${uniShort}][${typeLabel}] `;
    const rawTitle = detail.title.replace(/^\[.*?\]\[.*?\]\s*/, '');
    setTitle(prefix + rawTitle + ' — 제목을 내 것으로 고쳐주세요!');

    setBody(detail.body + '\n\n— 다른 사람의 글입니다. 내용을 내 것으로 고쳐주세요!');
    if (detail.price !== null) {
      setPrice(String(detail.price));
      setPriceNegotiable(detail.priceNegotiable);
    }
    if (detail.tags.length > 0) {
      setTags(detail.tags.slice(0, 5));
    }
    if (detail.locationDetail) {
      setLocation(detail.locationDetail + ' — 장소를 내 것으로 고쳐주세요!');
    }

    setShowOtherPosts(false);
    toast('가져온 글을 자유롭게 수정하세요!');
    setHighlightedFields(['제목', '가격', '내용', '태그', '장소']);
    setTimeout(() => setHighlightedFields([]), 1500);
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = '제목을 입력해주세요';
    if (!body.trim()) errs.body = '내용을 입력해주세요';
    if (!minorId) errs.category = '카테고리를 선택해주세요';
    if (price && Number(price) < 0) errs.price = '올바른 가격을 입력해주세요';
    return errs;
  };

  // 등록 버튼 → validate 후 미리보기 열기
  const handlePreviewBeforeSubmit = () => {
    if (submitting) return;
    if (minorId) {
      const minor = categories.find(c => c.id === minorId);
      if (minor?.postAccess === 'campus' && user && !CAMPUS_MEMBER_TYPES.includes(user.memberType)) {
        toast('이 카테고리는 대학 소속 인증 회원만 이용할 수 있습니다.');
        return;
      }
    }
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstErrorKey = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setShowPreview(true);
  };

  const handleSubmit = () => {
    if (submitting) return;

    // postAccess 기반 권한 검증: campus 소분류는 대학 소속 회원만
    if (minorId) {
      const minor = categories.find(c => c.id === minorId);
      if (minor?.postAccess === 'campus' && user && !CAMPUS_MEMBER_TYPES.includes(user.memberType)) {
        toast('이 카테고리는 대학 소속 인증 회원만 이용할 수 있습니다.');
        return;
      }
    }

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // 첫 번째 에러 필드로 자동 스크롤
      const firstErrorKey = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    const contactMethods = {
      chat: true,
      ...(contactPhone.trim() && { phone: contactPhone.trim(), phoneCall: contactPhoneCall, phoneSms: contactPhoneSms }),
      ...(contactKakao.trim() && { kakaoLink: contactKakao.trim() }),
      ...(contactEmail.trim() && { email: contactEmail.trim() }),
    };

    const postData = {
      title: title.trim(),
      body: body.trim(),
      universityId,
      categoryMajorId: majorId!,
      categoryMinorId: minorId!,
      price: price ? Number(price) : null,
      priceNegotiable,
      locationDetail: location.trim() || null,
      contactMethods,
    };

    if (isEditMode && editId) {
      updatePost(editId, { ...postData, tags, images, status: postStatus });
      toast('게시글이 수정되었습니다!');
      router.push(`/post/${editId}`);
    } else {
      const post = createPost({ ...postData, authorId: user!.id, tags, images });
      clearDraft();
      toast('게시글이 등록되었습니다!');
      // 카테고리 목록으로 이동 (내 글이 최상단에 보이는지 확인 가능)
      const uni = universities.find(u => u.id === universityId);
      const major = categories.find(c => c.id === majorId);
      const minor = categories.find(c => c.id === minorId);
      if (uni && major) {
        const minorQuery = minor ? `?minor=${minor.slug}` : '';
        router.push(`/${uni.slug}/${major.slug}${minorQuery}`);
      } else {
        router.push(`/post/${post.id}`);
      }
    }
  };

  const handleDelete = () => {
    if (!editId) return;
    setConfirmAction('delete');
  };

  return (
    <div>
      {/* 대학 탭 */}
      <WriteUniversityTabs selectedId={universityId} onSelect={setUniversityId} />

      {/* 대학 정보 배너 */}
      {/* 간격 압축: py-4 → py-2 */}
      <div className="bg-blue-950/30 px-4 py-2 dark:bg-blue-950/40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">{selectedUni?.name || '대학교'}</h1>
            <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">{selectedUni?.region} · {selectedUni?.nameEn}</p>
          </div>
          {/* 간격 압축: gap-2 → gap-1.5 */}
          <div className="flex items-center gap-1.5">
            {lastSaved && <span className="text-xs text-blue-400/60">임시저장됨</span>}
            {draftLoaded && (
              <button onClick={handleReset} className="text-xs text-blue-400/60 hover:text-blue-300 hover:underline">초기화</button>
            )}
          </div>
        </div>
      </div>

      {/* 브레드크럼 */}
      {/* 간격 압축: py-2 → py-1 */}
      <div className="border-b border-border px-4 py-1">
        {/* 간격 압축: gap-2 → gap-1.5 */}
        <nav aria-label="브레드크럼" className="flex items-center gap-1.5 text-base text-muted-foreground">
          <span className="text-orange-400">모든 대학</span>
          <span className="text-orange-300">›</span>
          <span className="text-orange-400">{selectedUni?.name || '대학'}</span>
          <span className="text-orange-300">›</span>
          {selectedMajor ? (
            <>
              {selectedMinor ? (
                <button onClick={handleChangeCategory} className="text-orange-400 hover:text-orange-300 hover:underline">
                  <span className="cat-icon">{selectedMajor.icon} </span>{selectedMajor.name}
                </button>
              ) : (
                <span className="font-semibold text-orange-400">
                  <span className="cat-icon">{selectedMajor.icon} </span>{selectedMajor.name}
                </span>
              )}
              {selectedMinor && (
                <>
                  <span className="text-orange-300">›</span>
                  <span className="font-semibold text-orange-400">{selectedMinor.name}</span>
                </>
              )}
            </>
          ) : (
            <span className="font-semibold text-orange-400">{isEditMode ? '글 수정' : '카테고리 선택'}</span>
          )}
        </nav>
      </div>

      {/* 카테고리 아이콘 그리드 */}
      <WriteCategoryGrid activeId={majorId} onSelect={handleMajorSelect} />

      {/* 소분류 배지 */}
      {/* 간격 압축: gap-2 → gap-1.5, py-3 → py-1.5 */}
      {majorId && (
        <div className="flex gap-1.5 overflow-x-auto px-4 py-1.5 scrollbar-hide">
          {currentMinors.map(m => {
            const isLocked = m.postAccess === 'campus' && !isCampusMember;
            const isActive = minorId === m.id;
            return (
              <button key={m.id} onClick={() => handleMinorSelect(m.id)} disabled={isLocked}>
                <Badge
                  variant="outline"
                  className={`shrink-0 cursor-pointer text-sm px-3 py-1 ${
                    isActive
                      ? 'border-2 border-orange-500 text-orange-600 font-bold dark:text-orange-300'
                      : isLocked
                        ? 'border-border text-muted-foreground/50 cursor-not-allowed'
                        : 'border-orange-400 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950'
                  }`}
                >
                  {isLocked && '🔒 '}<span className="cat-icon">{m.icon} </span>{m.name}
                </Badge>
              </button>
            );
          })}
        </div>
      )}

      {/* 비캠퍼스 회원 안내 */}
      {/* 간격 압축: pb-2 → pb-1 */}
      {majorId && !isCampusMember && currentMinors.some(m => m.postAccess === 'campus') && step !== 'form' && (
        <div className="px-4 pb-1">
          <p className="text-xs text-muted-foreground">🔒 표시는 대학 소속 인증 회원 전용 카테고리입니다</p>
        </div>
      )}

      {/* 카테고리 미선택 시 안내 */}
      {/* 간격 압축: py-8 → py-4 */}
      {!majorId && step !== 'form' && (
        <div className="px-4 py-4 text-center">
          <p className="text-muted-foreground">대분류를 선택해주세요</p>
        </div>
      )}

      {/* 소분류 미선택 시 안내 */}
      {/* 간격 압축: py-6 → py-3 */}
      {majorId && !minorId && step !== 'form' && (
        <div className="px-4 py-3 text-center">
          <p className="text-muted-foreground">소분류를 선택하면 글쓰기를 시작합니다</p>
        </div>
      )}

      {/* 글쓰기 폼 */}
      {/* 간격 압축: py-4 → py-2, space-y-5 → space-y-2.5 */}
      {step === 'form' && (
        <div className="px-4 py-2">
          <div className="space-y-2.5">
            {/* 완성도 점수 — 1줄 압축 */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2 py-1.5">
              <span className="shrink-0 text-sm font-bold">{scoreLabel} {completionScore}점</span>
              <div className="h-2 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    completionScore >= 90 ? 'bg-green-500' : completionScore >= 70 ? 'bg-blue-500' : completionScore >= 40 ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${completionScore}%` }}
                />
              </div>
              <span className="truncate text-sm text-muted-foreground">{nextHint}</span>
            </div>

            {/* 예시 채우기 영역: 간격 압축: space-y-2.5 → space-y-1.5, p-3 → p-1.5 */}
            {hasExample && (
              <div className="space-y-1.5 rounded-lg border border-blue-500/20 bg-blue-500/5 p-1.5">
                {/* 섹션 안내 */}
                <p className="text-sm font-medium text-foreground">글 제목·내용을 어떻게 채울지 막막하다면?</p>


                {/* 문체 선택기 — 소분류 Badge 스타일 (오렌지 톤) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-foreground">문체:</span>
                  {TONE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedTone(opt.value)}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        selectedTone === opt.value
                          ? 'border-2 border-orange-500 font-bold text-orange-600 dark:text-orange-300'
                          : 'border-orange-400 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950'
                      }`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>

                {/* 예시 채우기 + 다른 글 가져오기 — 1줄 가로 배치 */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={fillRandomExample}
                    disabled={isSpinning}
                    className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full border-2 border-orange-500 bg-transparent px-3 py-1 text-[clamp(0.65rem,2.8vw,1rem)] font-bold text-orange-600 dark:text-orange-300 transition-colors hover:bg-orange-50 dark:hover:bg-orange-950 disabled:opacity-60"
                  >
                    {isSpinning ? (
                      <>
                        <span className="animate-spin">✨</span>
                        <span ref={spinnerRef} className="truncate max-w-[200px]">샘플 고르는 중...</span>
                      </>
                    ) : (
                      '샘플 채우기 · 랜덤!'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={fetchOtherPosts}
                    disabled={loadingOthers}
                    className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full border-2 border-orange-500 bg-transparent px-3 py-1 text-[clamp(0.65rem,2.8vw,1rem)] font-bold text-orange-600 dark:text-orange-300 transition-colors hover:bg-orange-50 dark:hover:bg-orange-950 disabled:opacity-60"
                  >
                    {loadingOthers ? '불러오는 중...' : '다른 글 가져와 고치기'}
                  </button>
                </div>
              </div>
            )}

            {/* 거래 상태 (수정 모드만) */}
            {isEditMode && (
              <div>
                {/* 간격 압축: mb-2 → mb-1 */}
                <label className="mb-1 block text-sm font-medium">거래 상태</label>
                {/* 간격 압축: gap-2 → gap-1.5 */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPostStatus('active')}
                    className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      postStatus === 'active'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    판매중
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostStatus('reserved')}
                    className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      postStatus === 'reserved'
                        ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    예약중
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostStatus('completed')}
                    className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      postStatus === 'completed'
                        ? 'border-green-500 bg-green-500/10 text-green-500'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    거래완료
                  </button>
                </div>
              </div>
            )}

            {/* 제목 */}
            <div id="field-title">
              {/* 간격 압축: mb-1.5 → mb-1 */}
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium">제목 <span className="text-red-500">*</span></label>
                {hasExample && (
                  <button type="button" onClick={fillTitleExample} className="text-xs text-blue-500 hover:underline">💡 예시</button>
                )}
              </div>
              <Input
                placeholder="제목을 입력하세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={100}
                className={highlightedFields.includes('제목') ? 'ring-2 ring-blue-400 transition-all' : 'transition-all'}
              />
              {/* 간격 압축: mt-1 → mt-0.5 */}
              <div className="mt-0.5 flex items-center justify-between">
                {errors.title ? <p className="text-xs text-red-500">{errors.title}</p> : <span />}
                <p className="text-xs text-muted-foreground">{title.length}/100</p>
              </div>
            </div>

            {/* 가격 */}
            <div id="field-price">
              {/* 간격 압축: mb-1.5 → mb-1 */}
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium">가격</label>
                {hasExample && (
                  <button type="button" onClick={fillPriceExample} className="text-xs text-blue-500 hover:underline">💡 예시</button>
                )}
              </div>
              {/* 간격 압축: gap-2 → gap-1.5 */}
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min="0"
                  placeholder="가격 입력 (없으면 비워두세요)"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className={`flex-1 ${highlightedFields.includes('가격') ? 'ring-2 ring-blue-400 transition-all' : 'transition-all'}`}
                />
                <span className="text-sm text-muted-foreground">원</span>
              </div>
              {/* 간격 압축: mt-2 → mt-1, gap-2 → gap-1.5 */}
              <label className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={priceNegotiable}
                  onChange={e => setPriceNegotiable(e.target.checked)}
                  className="rounded"
                />
                가격 협의 가능
              </label>
              {/* 간격 압축: mt-1 → mt-0.5 */}
              {errors.price && <p className="mt-0.5 text-xs text-red-500">{errors.price}</p>}
            </div>

            {/* 본문 */}
            <div id="field-body">
              {/* 간격 압축: mb-1.5 → mb-1 */}
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium">내용 <span className="text-red-500">*</span></label>
                {hasExample && (
                  <button type="button" onClick={fillBodyExample} className="text-xs text-blue-500 hover:underline">💡 예시</button>
                )}
              </div>
              <textarea
                placeholder="내용을 입력하세요"
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={8}
                maxLength={5000}
                className={`w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ${highlightedFields.includes('내용') ? 'ring-2 ring-blue-400 transition-all' : 'transition-all'}`}
              />
              {/* 간격 압축: mt-1 → mt-0.5 */}
              <p className="mt-0.5 text-right text-xs text-muted-foreground">{body.length}/5,000</p>
              {/* 간격 압축: mt-1 → mt-0.5 */}
              {errors.body && <p className="mt-0.5 text-xs text-red-500">{errors.body}</p>}
            </div>

            {/* 이미지 */}
            <div>
              {/* 간격 압축: mb-1.5 → mb-1 */}
              <label className="mb-1 block text-sm font-medium">사진 (최대 {LIMITS.MAX_IMAGES}장)</label>
              {/* 간격 압축: gap-2 → gap-1.5, pb-2 → pb-1 */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((src, i) => (
                  <div key={i} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                    >
                      &times;
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 py-0.5 text-center text-xs font-medium text-white">대표</span>
                    )}
                  </div>
                ))}
                {images.length < LIMITS.MAX_IMAGES && (
                  <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-blue-500 hover:text-blue-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                    <span className="mt-1 text-xs">{images.length}/{LIMITS.MAX_IMAGES}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>
              {/* 간격 압축: mt-1 → mt-0.5 */}
              {images.length === 0 && (
                <p className="mt-0.5 text-xs text-muted-foreground">사진을 추가하면 관심을 더 많이 받을 수 있어요.</p>
              )}
            </div>

            {/* 태그 */}
            <div>
              {/* 간격 압축: mb-1.5 → mb-1 */}
              <label className="mb-1 block text-sm font-medium">태그 (최대 5개)</label>
              {/* 간격 압축: gap-2 → gap-1.5 */}
              <div className="flex gap-1.5">
                <Input
                  placeholder="태그 입력 후 Enter"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button variant="outline" onClick={addTag}>추가</Button>
              </div>
              {/* 간격 압축: mt-2 → mt-1, gap-2 → gap-1.5 */}
              {tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-0.5 text-muted-foreground hover:text-foreground">&times;</button>
                    </Badge>
                  ))}
                </div>
              )}
              {/* 인기 태그 추천: 간격 압축: mt-2 → mt-1 */}
              {suggestedTags.length > 0 && tags.length < 5 && (
                <div className="mt-1">
                  <span className="text-xs text-muted-foreground">인기 태그: </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {suggestedTags.slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => { if (tags.length < 5 && !tags.includes(tag)) setTags([...tags, tag]); }}
                        className="rounded-full border border-dashed border-blue-500/40 px-2 py-0.5 text-xs text-blue-500 transition-colors hover:border-blue-500 hover:bg-blue-500/10"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 거래 장소 */}
            <div>
              {/* 간격 압축: mb-1.5 → mb-1 */}
              <label className="mb-1 block text-sm font-medium">거래 희망 장소 (선택)</label>
              <Input
                placeholder="예: 서울대 정문 GS25 앞"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className={highlightedFields.includes('장소') ? 'ring-2 ring-blue-400 transition-all' : 'transition-all'}
              />
            </div>

            {/* 연락 방법 */}
            <div>
              {/* 간격 압축: mb-2 → mb-1 */}
              <label className="mb-1 block text-sm font-medium">연락 방법</label>
              {/* 간격 압축: space-y-3 → space-y-1.5, p-4 → p-2 */}
              <div className="space-y-1.5 rounded-xl border border-border p-2">
                {/* 캠퍼스리스트 캠톡 (항상 활성) */}
                {/* 간격 압축: gap-2.5 → gap-1.5 */}
                <label className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked disabled className="rounded" />
                  <span className="font-medium text-foreground">캠퍼스리스트 캠톡</span>
                  <span className="text-xs text-muted-foreground">(기본)</span>
                </label>

                {/* 전화번호 */}
                <div>
                  {/* 간격 압축: gap-2.5 → gap-1.5 */}
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!!contactPhone}
                      onChange={e => { if (!e.target.checked) { setContactPhone(''); setContactPhoneCall(true); setContactPhoneSms(true); } else { setContactPhone(' '); } }}
                      className="rounded"
                    />
                    <span className="text-foreground">전화번호 공개</span>
                  </label>
                  {/* 간격 압축: mt-2 → mt-1, space-y-2 → space-y-1 */}
                  {!!contactPhone && (
                    <div className="mt-1 ml-7 space-y-1">
                      <Input
                        type="tel"
                        placeholder="010-0000-0000"
                        value={contactPhone.trim()}
                        onChange={e => setContactPhone(e.target.value)}
                        className="max-w-xs"
                      />
                      {/* 간격 압축: gap-4 → gap-2 */}
                      <div className="flex gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <input type="checkbox" checked={contactPhoneCall} onChange={e => setContactPhoneCall(e.target.checked)} className="rounded" />
                          전화 OK
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <input type="checkbox" checked={contactPhoneSms} onChange={e => setContactPhoneSms(e.target.checked)} className="rounded" />
                          문자 OK
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* 카카오 오픈채팅 */}
                <div>
                  {/* 간격 압축: gap-2.5 → gap-1.5 */}
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!!contactKakao}
                      onChange={e => { if (!e.target.checked) setContactKakao(''); else setContactKakao(' '); }}
                      className="rounded"
                    />
                    <span className="text-foreground">카카오 오픈채팅</span>
                  </label>
                  {/* 간격 압축: mt-2 → mt-1 */}
                  {!!contactKakao && (
                    <div className="mt-1 ml-7">
                      <Input
                        type="url"
                        placeholder="https://open.kakao.com/o/..."
                        value={contactKakao.trim()}
                        onChange={e => setContactKakao(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                  )}
                </div>

                {/* 이메일 */}
                <div>
                  {/* 간격 압축: gap-2.5 → gap-1.5 */}
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!!contactEmail}
                      onChange={e => { if (!e.target.checked) setContactEmail(''); else setContactEmail(user?.email || ' '); }}
                      className="rounded"
                    />
                    <span className="text-foreground">이메일 공개</span>
                  </label>
                  {/* 간격 압축: mt-2 → mt-1 */}
                  {!!contactEmail && (
                    <div className="mt-1 ml-7">
                      <Input
                        type="email"
                        placeholder="example@university.ac.kr"
                        value={contactEmail.trim()}
                        onChange={e => setContactEmail(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 다른 사람들 글 가져오기 Sheet */}
            <Sheet open={showOtherPosts} onOpenChange={setShowOtherPosts}>
              <SheetContent side="bottom" className="max-h-[60vh] overflow-y-auto rounded-t-2xl" showCloseButton={false}>
                <SheetHeader className="pb-1">
                  <SheetTitle className="text-sm font-normal text-muted-foreground">같은 카테고리의 다른 글</SheetTitle>
                </SheetHeader>
                <div className="space-y-1.5 px-4 pb-3">
                  {otherPosts.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      같은 카테고리에 다른 글이 없어요
                    </p>
                  ) : (
                    otherPosts.map(post => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => fillFromOtherPost(post.id)}
                        className="w-full rounded-lg border p-2.5 text-left transition-colors hover:bg-muted"
                      >
                        <p className="truncate text-sm font-medium">{post.title}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{post.bodySnippet}</p>
                        <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                          <span>{post.author.nickname}</span>
                          {post.price !== null && <span>{post.price.toLocaleString()}원</span>}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* 미리보기 Sheet */}
            <Sheet open={showPreview} onOpenChange={setShowPreview}>
              <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl" showCloseButton={false}>
                <SheetHeader className="pb-0.5">
                  <SheetTitle className="rounded-lg border-4 border-white px-3 py-1.5 text-center text-xl font-bold text-white">미리보기 화면입니다 — 하단의 버튼을 눌러, 수정 또는 최종 등록 해주세요</SheetTitle>
                </SheetHeader>
                <div className="space-y-1 overflow-y-auto px-4 pb-2" style={{ maxHeight: 'calc(85vh - 100px)' }}>
                  {/* 이미지 미리보기 */}
                  {images.length > 0 && (
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                      {images.map((src, i) => (
                        <img key={i} src={src} alt="" className="h-28 w-28 shrink-0 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                  {/* 제목 */}
                  <h2 className="text-base font-bold leading-tight">{title.trim() || '(제목 없음)'}</h2>
                  {/* 가격 */}
                  {price && (
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">{Number(price).toLocaleString()}원</span>
                      {priceNegotiable && <Badge variant="secondary" className="text-xs">협의가능</Badge>}
                    </div>
                  )}
                  {/* 본문 */}
                  <div className="whitespace-pre-wrap text-base text-amber-600 leading-relaxed dark:text-amber-400">
                    {body.trim() || '(내용 없음)'}
                  </div>
                  {/* 태그 + 장소 (1줄로 합침) */}
                  {(tags.length > 0 || location.trim()) && (
                    <div className="flex flex-wrap items-center gap-1">
                      {tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">#{tag}</Badge>
                      ))}
                      {location.trim() && <span className="text-[10px] text-muted-foreground">📍 {location}</span>}
                    </div>
                  )}
                  {/* 작성자 */}
                  <div className="flex items-center gap-1.5 border-t border-border pt-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-500">
                      {user?.nickname?.charAt(0) || '?'}
                    </div>
                    <p className="text-xs font-medium">{user?.nickname || '사용자'}</p>
                    <span className="text-[10px] text-muted-foreground">{universities.find(u => u.id === universityId)?.name} · 방금 전</span>
                  </div>
                </div>
                {/* 닫기/수정 버튼 (스크롤 영역 밖 고정) */}
                <div className="flex gap-2 px-4 pb-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowPreview(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowPreview(false); handleSubmit(); }}
                    className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    {isEditMode ? '최종 수정!' : '최종 등록!'}
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            {/* 등록 버튼 (누르면 미리보기 → 최종 등록) */}
            <div>
              <Button
                onClick={handlePreviewBeforeSubmit}
                disabled={!title || !minorId || submitting}
                className="w-full bg-blue-600 py-3 text-base font-bold hover:bg-blue-700"
              >
                {submitting ? '처리 중...' : isEditMode ? '미리보기 후 수정' : '미리보기 후 등록'}
              </Button>
              {/* 간격 압축: mt-2 → mt-1 */}
              {(!title || !minorId) && (
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  {!minorId && !title
                    ? '카테고리를 선택하고 제목을 입력해주세요'
                    : !minorId
                      ? '카테고리를 선택해주세요'
                      : '제목을 입력해주세요'}
                </p>
              )}
              {/* 간격 압축: mt-3 → mt-1.5, py-2.5 → py-1.5 */}
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="mt-1.5 w-full rounded-lg border border-red-500/30 bg-red-500/5 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/15"
                >
                  삭제하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 확인 Sheet (예시 대체 / 삭제 공용) */}
      <Sheet open={!!confirmAction} onOpenChange={open => { if (!open) setConfirmAction(null); }}>
        <SheetContent side="bottom" className="rounded-t-2xl" showCloseButton={false}>
          {/* 간격 압축: pb-2 → pb-1 */}
          <SheetHeader className="pb-1">
            <SheetTitle className={`text-lg ${confirmAction === 'delete' ? 'text-destructive' : ''}`}>
              {confirmAction === 'delete' ? '게시글 삭제' : '예시로 대체'}
            </SheetTitle>
          </SheetHeader>
          {/* 간격 압축: space-y-4 → space-y-2, pb-6 → pb-3 */}
          <div className="space-y-2 px-4 pb-3">
            <p className="text-sm text-muted-foreground">
              {confirmAction === 'title' && '기존 제목을 예시로 대체할까요?'}
              {confirmAction === 'price' && '기존 가격을 예시로 대체할까요?'}
              {confirmAction === 'body' && '기존 내용을 예시로 대체할까요?'}
              {confirmAction === 'delete' && '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'}
            </p>
            {/* 간격 압축: gap-3 → gap-1.5 */}
            <div className="flex gap-1.5">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmAction(null)}>
                취소
              </Button>
              <Button
                className={`flex-1 ${confirmAction === 'delete' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={handleConfirmAction}
              >
                {confirmAction === 'delete' ? '삭제' : '대체하기'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function WritePage() {
  return (
    <AuthGuard>
      <WritePageContent />
    </AuthGuard>
  );
}
