'use client';

import type { ContactMethods } from '@/lib/types';

interface Props {
  contactMethods?: ContactMethods;
}

export default function ContactMethodsDisplay({ contactMethods }: Props) {
  if (!contactMethods) return null;

  const hasExtra = contactMethods.phone || contactMethods.kakaoLink || contactMethods.email;
  if (!hasExtra) return null;

  return (
    <div className="mt-4 rounded-xl border border-border p-3.5">
      <p className="mb-2.5 text-sm font-medium">연락 방법</p>
      <div className="space-y-2">
        {contactMethods.phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/10 text-green-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </span>
            <span className="font-medium">{contactMethods.phone}</span>
            <span className="text-xs text-muted-foreground">
              {[
                contactMethods.phoneCall && '전화',
                contactMethods.phoneSms && '문자',
              ].filter(Boolean).join(' · ')}
            </span>
          </div>
        )}
        {contactMethods.kakaoLink && (
          <a
            href={contactMethods.kakaoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm transition-colors hover:text-yellow-600"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.65 6.6l-.96 3.56c-.08.31.26.56.52.38l4.2-2.8c.52.07 1.05.11 1.59.11 5.52 0 10-3.58 10-7.85C22 6.58 17.52 3 12 3z" /></svg>
            </span>
            <span className="font-medium">카카오 오픈채팅</span>
            <span className="ml-auto text-xs text-muted-foreground">열기 ›</span>
          </a>
        )}
        {contactMethods.email && (
          <div className="flex items-center gap-2.5 text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            </span>
            <span className="font-medium">{contactMethods.email}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(contactMethods.email!); }}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            >
              복사
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
