import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-muted-foreground/30">404</p>
      <h2 className="mt-4 text-xl font-bold">페이지를 찾을 수 없습니다</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 삭제되었습니다.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
