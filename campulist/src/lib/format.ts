export function formatPrice(price: number | null): string {
  if (price === null) return '가격 미정';
  if (price === 0) return '무료나눔';
  return price.toLocaleString('ko-KR') + '원';
}

export function formatPriceKorean(price: number | null): string {
  if (price === null || price === 0) return '';
  const comma = (n: number) => n.toLocaleString('ko-KR');
  const eok = Math.floor(price / 100000000);
  const man = Math.floor((price % 100000000) / 10000);
  const rest = price % 10000;
  let result = '';
  if (eok > 0) result += `${comma(eok)}억`;
  if (man > 0) result += `${comma(man)}만`;
  if (rest > 0) result += comma(rest);
  return result + '원';
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return date.toLocaleDateString('ko-KR');
}
