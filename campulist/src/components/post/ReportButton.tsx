'use client';

import { useState } from 'react';
import ReportDialog from './ReportDialog';

interface ReportButtonProps {
  postId: string;
}

export default function ReportButton({ postId }: ReportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-muted-foreground hover:text-destructive"
        aria-label="게시글 신고하기"
      >
        신고
      </button>
      {open && <ReportDialog postId={postId} onClose={() => setOpen(false)} />}
    </>
  );
}
