import Link from 'next/link';

interface EmptyStateProps {
  message: string;
  sub?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ message, sub, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="px-4 py-16 text-center text-muted-foreground">
      <p>{message}</p>
      {sub && <p className="mt-1 text-sm">{sub}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-3 inline-block text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
