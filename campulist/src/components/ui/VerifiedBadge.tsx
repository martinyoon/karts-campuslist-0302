import { Badge } from '@/components/ui/badge';

interface VerifiedBadgeProps {
  label?: string;
  compact?: boolean;
}

export default function VerifiedBadge({ label = '인증됨', compact }: VerifiedBadgeProps) {
  return (
    <Badge variant="secondary" className={`gap-0.5 text-xs text-blue-500${compact ? ' h-5 px-1.5' : ''}`}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
      {label}
    </Badge>
  );
}
