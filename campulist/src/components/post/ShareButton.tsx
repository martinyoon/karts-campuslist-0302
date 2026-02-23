'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';

export default function ShareButton() {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('링크가 복사되었습니다');
    } catch {
      toast('링크 복사에 실패했습니다');
    }
  };

  return (
    <Button variant="outline" size="icon" className="shrink-0" onClick={handleShare} aria-label="링크 공유하기">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    </Button>
  );
}
