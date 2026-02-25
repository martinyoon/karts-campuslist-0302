import type { ReactNode } from 'react';

interface UniversityBannerProps {
  name: string;
  subtitle: string;
  children?: ReactNode;
}

export default function UniversityBanner({ name, subtitle, children }: UniversityBannerProps) {
  return (
    <div className="bg-blue-950/30 px-4 py-2 dark:bg-blue-950/40">
      {children ? (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">{name}</h1>
            <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">{subtitle}</p>
          </div>
          {children}
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">{name}</h1>
          <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">{subtitle}</p>
        </>
      )}
    </div>
  );
}
