import { majorCategories } from '@/data/categories';
import { universities } from '@/data/universities';

const majorSlugs = new Set(majorCategories.map(c => c.slug));
const universitySlugs = new Set(universities.map(u => u.slug));

/**
 * 현재 pathname + searchParams 기반으로 글쓰기 URL 생성.
 * 대학교/카테고리 페이지에 있으면 ?uni=&major=&minor= 파라미터를 자동 추가.
 */
export function getWriteUrl(pathname: string, searchParams?: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const writeParams = new URLSearchParams();

  // /ad 프리픽스 감지 — 광고 게시판에서 글쓰기 버튼 누른 경우
  let offset = 0;
  if (segments[0] === 'ad') {
    writeParams.set('board', 'ad');
    offset = 1;
  }

  if (segments.length >= 1 + offset && universitySlugs.has(segments[offset])) {
    writeParams.set('uni', segments[offset]);
  }

  if (segments.length >= 2 + offset) {
    const catSlug = segments[1 + offset];
    if (majorSlugs.has(catSlug)) {
      writeParams.set('major', catSlug);
      const sp = new URLSearchParams(searchParams || '');
      const minor = sp.get('minor');
      if (minor) writeParams.set('minor', minor);
    }
  }

  const qs = writeParams.toString();
  return qs ? `/write?${qs}` : '/write';
}
