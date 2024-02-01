import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { ListStatus, getStatus, getStatusCount } from '@/lib/items';
import { cn } from '@/lib/utils';
import { Todo } from '@/storage';
import { Flame, ListTodo } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ListCount } from './ListCount';

export type ListProps = {
  list: Todo.List;
  onDelete: () => void;
};

export function List({ list, onDelete }: ListProps) {
  const count = useMemo(() => getStatusCount(list.items), [list.items]);
  const status = getStatus(count);

  return (
    <div className="flex gap-2">
      <Button className="flex flex-1 justify-start gap-2 overflow-hidden" asChild variant="secondary">
        <Link to={`/todo/${list.id}`}>
          <ListTodo />
          <div className={cn('truncate', status === ListStatus.DONE && 'line-through')}>{list.label}</div>
        </Link>
      </Button>
      <ListCount count={count} status={status} />
      <ConfirmDialog
        description="This action cannot be undone. This will permanently delete this list."
        onSubmit={onDelete}
      >
        <Button className="shrink-0" variant="destructive" size="icon">
          <Flame />
        </Button>
      </ConfirmDialog>
    </div>
  );
}
