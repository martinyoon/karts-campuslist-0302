import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: '이용약관 | 캠퍼스리스트',
};

export default function TermsPage() {
  return (
    <div className="px-4 py-6">
      <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; 서비스 소개
      </Link>
      <h1 className="mt-4 text-2xl font-bold">이용약관</h1>
      <Separator className="my-6" />
      <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
        <p>캠퍼스리스트 이용약관은 현재 준비 중입니다.</p>
        <p>서비스 정식 출시 전까지 아래 기본 원칙이 적용됩니다:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>캠퍼스리스트는 대학교 재학생, 교직원, 캠퍼스 주변 상인을 위한 커뮤니티 플랫폼입니다.</li>
          <li>허위 정보, 사기, 스팸 게시글은 사전 통보 없이 삭제될 수 있습니다.</li>
          <li>타인의 권리를 침해하는 행위는 금지됩니다.</li>
          <li>거래 관련 분쟁은 당사자 간 해결을 원칙으로 하며, 캠퍼스리스트는 중개 플랫폼으로서 직접적인 거래 책임을 지지 않습니다.</li>
        </ul>
        <p className="text-muted-foreground">정식 이용약관은 서비스 출시 시 공지됩니다.</p>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">&copy; 2026 Campulist. All rights reserved.</p>
    </div>
  );
}
