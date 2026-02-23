'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toggleLike, getLikedPostIds } from '@/lib/api';

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}

export default function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setLiked(getLikedPostIds().includes(postId));
  }, [postId]);

  const handleToggle = () => {
    const result = toggleLike(postId);
    setLiked(result.liked);
    setCount(result.count);
  };

  return (
    <Button variant="outline" className="shrink-0 gap-1.5 px-3" onClick={handleToggle}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        className={liked ? 'text-red-500' : ''}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count > 0 && <span className="text-sm">{count}</span>}
    </Button>
  );
}
