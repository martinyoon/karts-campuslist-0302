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

  if (segments.length >= 1 && universitySlugs.has(segments[0])) {
    writeParams.set('uni', segments[0]);
  }

  if (segments.length >= 2) {
    const catSlug = segments[1];
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
