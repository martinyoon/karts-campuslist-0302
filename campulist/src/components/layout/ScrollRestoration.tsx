'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** 페이지 이동 시 항상 최상단으로 스크롤 */
export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
