'use client';

import { Fragment } from 'react';
import Link from 'next/link';

export interface BreadcrumbSegment {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string;
  suffix?: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
  showTrailingSeparator?: boolean;
}

export default function Breadcrumb({ segments, showTrailingSeparator = false }: BreadcrumbProps) {
  return (
    <div className="border-b border-border px-4 py-px">
      <nav aria-label="브레드크럼" className="flex items-center gap-2 text-base text-muted-foreground">
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          const content = (
            <>
              {seg.icon && <span className="cat-icon">{seg.icon} </span>}
              {seg.label}{seg.suffix ? ` ${seg.suffix}` : ''}
            </>
          );

          return (
            <Fragment key={i}>
              {seg.href ? (
                <Link href={seg.href} className="text-orange-400 hover:text-orange-300 hover:underline">
                  {content}
                </Link>
              ) : seg.onClick ? (
                <button onClick={seg.onClick} className="text-orange-400 hover:text-orange-300 hover:underline">
                  {content}
                </button>
              ) : (
                <span className="font-semibold text-orange-400">{content}</span>
              )}
              {(!isLast || showTrailingSeparator) && (
                <span className="text-orange-300">›</span>
              )}
            </Fragment>
          );
        })}
      </nav>
    </div>
  );
}
