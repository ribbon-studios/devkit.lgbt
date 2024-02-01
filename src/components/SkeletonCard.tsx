import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode, useMemo } from 'react';
import { Skeleton } from './ui/skeleton';

export type SkeletonCardProps = {
  title: string;
  children: ReactNode;
  loading?: boolean;
  skeleton?: boolean;
  className?: string;
  lines: number;
};

export function SkeletonCard({ title, children, loading, skeleton, className, lines }: SkeletonCardProps) {
  const computedLines = useMemo(() => {
    return Array(lines)
      .fill(null)
      .map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 my-1"
          style={{
            width: `${((i % 2) + 1) * 200}px`,
          }}
        />
      ));
  }, [lines]);

  const skeletonsVisible = loading || skeleton;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="relative">
          {skeletonsVisible && (
            <Skeleton
              className="absolute h-5 rounded-full pointer-events-none"
              style={{
                width: `${title.length * 0.8}rem`,
              }}
            />
          )}
          <div className={cn('transition-opacity', loading && 'opacity-0 pointer-events-none')}>{title}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn('relative flex flex-col gap-2', className)}>
        {skeletonsVisible && <div className="flex flex-col gap-2 absolute pointer-events-none">{computedLines}</div>}
        <div className={cn('flex flex-col gap-2', loading && 'opacity-0 pointer-events-none')}>{children}</div>
      </CardContent>
    </Card>
  );
}
