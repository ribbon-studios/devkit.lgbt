import { ListItem } from '@/components/ListItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Storage, Todo } from '@/storage';
import { useCachedState } from '@rain-cafe/react-utils';
import { Flame } from 'lucide-react';
import { useMemo } from 'react';
import { Link, LoaderFunctionArgs, Navigate, redirect, useLoaderData } from 'react-router-dom';

export function TodoList() {
  const externalList = useLoaderData() as Todo.List;
  const [list, setList] = useCachedState<Todo.List>(() => externalList, [externalList]);
  const allDone = useMemo(() => {
    return list?.items.every((item) => item.done);
  }, [list?.items]);

  const onChange = async (updatedList: Todo.List) => {
    setList(updatedList);
    await Storage.set(Storage.Keys.LISTS, updatedList.id, updatedList);
  };

  if (!list) return <Navigate to="/todo" />;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="flex text-2xl pb-2 gap-2">
        <Link className="hover:underline" to="/todo">
          Todo
        </Link>
        <span>&gt;</span>
        <span>{list.label}</span>
      </h1>
      <div className="flex items-center gap-4">
        <Checkbox
          className="shrink-0"
          checked={allDone}
          onClick={() => {
            onChange({
              ...list,
              items: list.items.map((item) => ({
                ...item,
                done: !allDone,
              })),
            });
          }}
        />
        <Input
          value={list.label}
          onChange={(e) =>
            onChange({
              ...list,
              label: e.target.value,
            })
          }
        />
        <Button
          className="shrink-0"
          variant="destructive"
          size="icon"
          onClick={async () => {
            setList(undefined);
            await Storage.delete(Storage.Keys.LISTS, list.id);
          }}
        >
          <Flame />
        </Button>
      </div>
      <Separator />
      <ListItem
        placeholder="Add a new item..."
        onChange={(item) => {
          onChange({
            ...list,
            items: [item, ...list.items],
          });
        }}
        blank
      />
      {list.items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          onChange={(updatedItem) => {
            onChange({
              ...list,
              items: list.items.map((item) => {
                if (item.id !== updatedItem.id) return item;

                return updatedItem;
              }),
            });
          }}
          onDelete={(deletedItem) => {
            onChange({
              ...list,
              items: list.items.filter((item) => item.id !== deletedItem.id),
            });
          }}
        />
      ))}
    </div>
  );
}

export namespace TodoList {
  export async function loader({ params }: LoaderFunctionArgs<any>) {
    if (!params.id) return redirect('/');

    const list = await Storage.get<Todo.List>(Storage.Keys.LISTS, params.id);

    if (!list) return redirect('/todo');

    return list;
  }
}
