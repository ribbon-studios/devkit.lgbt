import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { ListStatus, getStatus, getStatusCount } from '@/lib/items';
import { cn } from '@/lib/utils';
import { Storage, StorageKeys, Todo } from '@/storage';
import { CheckCircle, CircleDot, Flame, ListTodo, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

export type ListProps = {
  list: Todo.List;
  onDelete: () => void;
};

const LIST_ICONS: Record<ListStatus, React.ElementType> = {
  [ListStatus.NOT_STARTED]: () => <XCircle className="text-red-700" />,
  [ListStatus.IN_PROGRESS]: () => <CircleDot className="text-yellow-500" />,
  [ListStatus.DONE]: () => <CheckCircle className="text-green-700" />,
};

export function List({ list, onDelete }: ListProps) {
  const { done, total } = useMemo(() => getStatusCount(list.items), [list.items]);
  const status = getStatus({ done, total });
  const Icon = LIST_ICONS[status];

  return (
    <div className="flex gap-2">
      <Button className="flex flex-1 justify-start gap-2 overflow-hidden" asChild variant="secondary">
        <Link to={`/todo/${list.id}`}>
          <ListTodo />
          <div className={cn('truncate', status === ListStatus.DONE && 'line-through')}>{list.label}</div>
        </Link>
      </Button>
      <div className="hidden md:flex gap-2 bg-secondary h-10 px-4 items-center justify-center rounded-md">
        <div>
          {done} / {total}
        </div>
        <Icon />
      </div>
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

export namespace TodoListsPage {
  export async function loader() {
    return await Storage.get(StorageKeys.LISTS);
  }
}
