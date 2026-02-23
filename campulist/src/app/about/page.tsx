import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold">캠퍼스리스트</h1>
      <p className="text-xs text-muted-foreground">Campu(s)+list+.com = Campulist.com</p>
      <p className="mt-1 text-muted-foreground">대학생을 위한 캠퍼스 생활 플랫폼</p>

      <Separator className="my-6" />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">서비스 소개</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            캠퍼스리스트(Campulist)는 대학교 재학생, 교직원, 캠퍼스 주변 상인을 위한 로컬 커뮤니티 플랫폼입니다.
            중고거래/나눔, 방찾기/양도, 알바/과외/취업, 스터디/모임/게시판, 이사/수리/대행, 맛집/할인/이벤트까지 — 대학 생활에 필요한 모든 것을 한 곳에서 해결하세요.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold">주요 기능</h2>
          <ul className="mt-2 space-y-2 text-sm text-foreground/80">
            <li className="flex gap-2"><span>📦</span> 중고 교재, 전자기기, 생활용품 거래</li>
            <li className="flex gap-2"><span>🏠</span> 원룸 양도, 룸메이트, 단기임대 정보</li>
            <li className="flex gap-2"><span>💼</span> 아르바이트, 과외, 인턴, 연구보조 모집</li>
            <li className="flex gap-2"><span>👥</span> 스터디, 동아리, 카풀, 분실물 게시판</li>
            <li className="flex gap-2"><span>🏪</span> 캠퍼스 주변 맛집, 할인 이벤트, 신규 오픈</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold">대학 인증</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            학교 이메일(.ac.kr)로 인증하면 해당 대학 전용 게시판을 이용할 수 있습니다.
            인증된 사용자끼리만 거래할 수 있어 더 안전합니다.
          </p>
        </div>
      </section>

      <Separator className="my-6" />

      <section className="space-y-3 text-sm text-muted-foreground">
        <Link href="/terms" className="block hover:text-foreground">이용약관</Link>
        <Link href="/privacy" className="block hover:text-foreground">개인정보처리방침</Link>
        <p>문의하기: support@campulist.com</p>
      </section>

      <p className="mt-6 text-xs text-muted-foreground">
        &copy; 2026 Campulist. All rights reserved.
      </p>
    </div>
  );
}
