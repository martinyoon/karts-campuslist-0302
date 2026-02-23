import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: '개인정보처리방침 | 캠퍼스리스트',
};

export default function PrivacyPage() {
  return (
    <div className="px-4 py-6">
      <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; 서비스 소개
      </Link>
      <h1 className="mt-4 text-2xl font-bold">개인정보처리방침</h1>
      <Separator className="my-6" />
      <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
        <p>캠퍼스리스트 개인정보처리방침은 현재 준비 중입니다.</p>
        <p>서비스 정식 출시 전까지 아래 기본 원칙이 적용됩니다:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>수집하는 개인정보: 학교 이메일, 닉네임, 게시글/캠톡 내용</li>
          <li>개인정보는 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다.</li>
          <li>사용자는 언제든지 계정 삭제를 요청할 수 있으며, 삭제 시 모든 개인정보가 파기됩니다.</li>
          <li>보안을 위해 비밀번호는 암호화하여 저장합니다.</li>
        </ul>
        <p className="text-muted-foreground">정식 개인정보처리방침은 서비스 출시 시 공지됩니다.</p>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">&copy; 2026 Campulist. All rights reserved.</p>
    </div>
  );
}
