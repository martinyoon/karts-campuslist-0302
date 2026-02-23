'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PostListItem } from '@/lib/types';
import { formatPrice } from '@/lib/format';

interface Props {
  posts: PostListItem[];
}

export default function PopularPostsSection({ posts }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-muted/50"
      >
        <h2 className="text-xl font-bold">실시간 인기글</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">TOP {posts.length}</span>
          <span className="text-[13px] text-blue-500">{isOpen ? '접기' : '펴기'}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-muted-foreground transition-transform ${isOpen ? '' : '-rotate-180'}`}
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="w-60 shrink-0 rounded-xl border border-border p-3.5 transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-orange-500">{index + 1}</span>
                  <span className="text-sm text-blue-500">{post.categoryMinor.name}</span>
                </div>
                <h3 className="mt-1 truncate text-[15px] font-medium">{post.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.bodySnippet}</p>
                {post.price !== null && (
                  <p className="mt-1.5 text-base font-bold">{formatPrice(post.price)}</p>
                )}
                <div className="mt-1.5 flex items-center gap-1 text-[13px] text-muted-foreground">
                  <span>❤️ {post.likeCount}</span>
                  <span>· 조회 {post.viewCount}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
        </div>
      )}
    </section>
  );
}
