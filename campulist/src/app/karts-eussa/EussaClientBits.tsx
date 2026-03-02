'use client';

import { useMemo } from 'react';

const CHEER_MESSAGES = [
  '시험 화이팅! 💪',
  '오늘도 수고했어! ✨',
  '넌 할 수 있어! 🌟',
  '졸업작품 파이팅! 🎨',
  '공연 대박 나자! 🎭',
  '연습은 배신하지 않아! 🎵',
  '꿈을 향해 한 걸음 더! 🚀',
  '함께라서 힘이 나! 🤝',
  '오디션 잘 될 거야! 🎤',
  '전시 준비 응원해! 🖼️',
  '합평 잘 마무리하자! 📝',
  '레슨 열심히! 🎹',
  '창작의 고통을 이겨내자! ✍️',
  '예술하는 너, 멋져! 🌈',
];

const SEARCH_PLACEHOLDERS = [
  '졸업 작품 응원 찾기...',
  '시험 화이팅 글 검색...',
  '공연 준비 으쌰으쌰...',
  '오디션 응원 글 찾기...',
  '전시 준비 파이팅...',
  '연습 응원 메시지 검색...',
];

interface Props {
  query: string;
  sort?: string;
}

export default function EussaClientBits({ query, sort }: Props) {
  const cheerMessage = useMemo(
    () => CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)],
    [],
  );
  const placeholder = useMemo(
    () => SEARCH_PLACEHOLDERS[Math.floor(Math.random() * SEARCH_PLACEHOLDERS.length)],
    [],
  );

  return (
    <>
      {/* 랜덤 응원 한마디 */}
      <div className="bg-orange-50 px-4 py-2 text-center dark:bg-orange-950/30">
        <p className="text-base font-medium text-orange-700 dark:text-orange-300">
          {cheerMessage}
        </p>
      </div>

      {/* 중앙 검색창 */}
      <div className="border-b border-border px-4 py-3">
        <form action="/karts-eussa" className="mx-auto flex max-w-lg gap-2">
          {sort && sort !== 'latest' && <input type="hidden" name="sort" value={sort} />}
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={`🔥 ${placeholder}`}
            aria-label="으쌰으쌰 검색"
            className="flex h-10 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            검색
          </button>
        </form>
        {query && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            &ldquo;{query}&rdquo; 검색 결과
          </p>
        )}
      </div>
    </>
  );
}
