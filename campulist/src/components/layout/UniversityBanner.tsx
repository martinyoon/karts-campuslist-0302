import type { ReactNode } from 'react';

interface UniversityBannerProps {
  name: string;
  subtitle: string;
  children?: ReactNode;
}

export default function UniversityBanner({ name, subtitle, children }: UniversityBannerProps) {
  return (
    <div className="bg-blue-950/30 px-4 py-px dark:bg-blue-950/40">
      {children ? (
        <div className="flex items-center justify-between">
          <h1 className="flex min-w-0 items-baseline gap-2 overflow-hidden text-xl font-bold text-blue-400 dark:text-blue-300">
            <span className="shrink-0">{name}</span>
            <span className="truncate text-sm font-normal text-blue-500 dark:text-blue-400">{subtitle}</span>
          </h1>
          {children}
        </div>
      ) : (
        <h1 className="flex items-baseline gap-2 overflow-hidden text-xl font-bold text-blue-400 dark:text-blue-300">
          <span className="shrink-0">{name}</span>
          <span className="truncate text-sm font-normal text-blue-500 dark:text-blue-400">{subtitle}</span>
        </h1>
      )}
    </div>
  );
}
