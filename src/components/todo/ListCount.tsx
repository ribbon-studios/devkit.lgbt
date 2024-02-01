import { ListStatus, StatusCountResult } from '@/lib/items';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { CheckCircle, CircleDot, LucideIcon, XCircle } from 'lucide-react';

const LIST_ICONS: Record<ListStatus, LucideIcon> = {
  [ListStatus.NOT_STARTED]: XCircle,
  [ListStatus.IN_PROGRESS]: CircleDot,
  [ListStatus.DONE]: CheckCircle,
};

const listCountVariants = cva(
  'flex gap-2 bg-secondary w-10 sm:w-auto h-10 sm:px-4 items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        [ListStatus.NOT_STARTED]: 'text-red-700',
        [ListStatus.IN_PROGRESS]: 'text-yellow-500',
        [ListStatus.DONE]: 'text-green-700',
      },
    },
  }
);

export interface ListCountProps {
  count: StatusCountResult;
  status: ListStatus;
  className?: string;
}

export function ListCount({ count, status, className }: ListCountProps) {
  const Icon = LIST_ICONS[status];

  return (
    <div className={cn(listCountVariants({ variant: status, className }))}>
      <div className="hidden sm:flex text-secondary-foreground">
        {count.done} / {count.total}
      </div>
      <Icon />
    </div>
  );
}
