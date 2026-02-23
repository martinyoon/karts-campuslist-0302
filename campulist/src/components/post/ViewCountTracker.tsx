'use client';

import { useEffect, useState } from 'react';
import { incrementViewCount, addRecentViewed } from '@/lib/api';

interface ViewCountTrackerProps {
  postId: string;
  initialCount: number;
}

export default function ViewCountTracker({ postId, initialCount }: ViewCountTrackerProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const newCount = incrementViewCount(postId);
    if (newCount > 0) setCount(newCount);
    addRecentViewed(postId);
  }, [postId]);

  return <>{count}</>;
}
