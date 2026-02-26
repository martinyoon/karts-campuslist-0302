'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { STORAGE_KEYS } from '@/lib/constants';

interface Suggestion {
  id: string;
  category: 'bug' | 'feature' | 'inconvenience' | 'other';
  title: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}

const CATEGORIES = [
  { value: 'bug', label: '버그 신고' },
  { value: 'feature', label: '기능 제안' },
  { value: 'inconvenience', label: '불편사항' },
  { value: 'other', label: '기타' },
] as const;

export default function SuggestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!category) e.category = '분류를 선택해주세요';
    if (title.trim().length < 2) e.title = '제목을 2자 이상 입력해주세요';
    if (title.trim().length > 50) e.title = '제목은 50자 이하로 입력해주세요';
    if (content.trim().length < 10) e.content = '내용을 10자 이상 입력해주세요';
    if (content.trim().length > 1000) e.content = '내용은 1000자 이하로 입력해주세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !user) return;
    setSubmitting(true);

    try {
      const suggestion: Suggestion = {
        id: crypto.randomUUID(),
        category: category as Suggestion['category'],
        title: title.trim(),
        content: content.trim(),
        userId: user.id,
        userName: user.nickname,
        createdAt: new Date().toISOString(),
      };

      let prev: Suggestion[] = [];
      try { prev = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUGGESTIONS) || '[]'); } catch { /* corrupted data */ }
      prev.unshift(suggestion);
      localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(prev));

      toast('건의가 접수되었습니다. 감사합니다!');
      router.push('/my');
    } catch {
      toast('건의 제출에 실패했습니다. 다시 시도해주세요.');
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl px-4 py-4">
        <h1 className="text-lg font-bold">건의함</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          기능 요청, 불편사항, 버그 신고 등을 자유롭게 건의해주세요.
        </p>

        <div className="mt-4 space-y-4">
          {/* 분류 */}
          <div>
            <label className="mb-1 block text-sm font-medium">분류</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="분류를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          {/* 제목 */}
          <div>
            <label className="mb-1 block text-sm font-medium">제목</label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              maxLength={50}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.title ? (
                <p className="text-xs text-red-500">{errors.title}</p>
              ) : <span />}
              <span className="text-xs text-muted-foreground">{title.length}/50</span>
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="mb-1 block text-sm font-medium">내용</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="건의 내용을 상세히 적어주세요"
              maxLength={1000}
              rows={6}
              className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.content ? (
                <p className="text-xs text-red-500">{errors.content}</p>
              ) : <span />}
              <span className="text-xs text-muted-foreground">{content.length}/1000</span>
            </div>
          </div>

          {/* 제출 */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? '제출 중...' : '건의하기'}
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}
