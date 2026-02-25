interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = '로딩 중...' }: LoadingSpinnerProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
