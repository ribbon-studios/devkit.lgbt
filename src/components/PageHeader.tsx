import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type PageHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'sticky px-4 min-h-16 bg-background/80 shadow-sm shadow-indigo-950 top-0 leading-none flex items-center gap-2',
        className
      )}
    >
      {children}
    </div>
  );
}
