import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostDetail, getRelatedPosts } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import LocalPostView from '@/components/post/LocalPostView';
import PostDetailContent from '@/components/post/PostDetailContent';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostDetail(id);
  if (!post) return { title: id.startsWith('local-') ? '게시글 | 캠퍼스리스트' : '게시글을 찾을 수 없습니다 | 캠퍼스리스트' };
  const price = post.price !== null ? formatPrice(post.price) : '';
  return {
    title: `${post.title}${price ? ` - ${price}` : ''} | ${post.university.name} | 캠퍼스리스트`,
    description: post.body.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.body.slice(0, 160),
      images: post.images.length > 0 ? [post.images[0]] : undefined,
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const [post, relatedPosts] = await Promise.all([
    getPostDetail(id),
    getRelatedPosts(id, 4),
  ]);
  if (!post) {
    // local-* 게시글은 localStorage에 저장되어 서버에서 접근 불가 → 클라이언트 렌더링
    if (id.startsWith('local-')) {
      return <LocalPostView id={id} />;
    }
    notFound();
  }

  return <PostDetailContent post={post} relatedPosts={relatedPosts} />;
}
