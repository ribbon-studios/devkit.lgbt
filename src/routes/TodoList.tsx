import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ListItem } from '@/components/ListItem';
import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
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
    return list?.items.length && list?.items.every((item) => item.done);
  }, [list?.items]);

  const onChange = async (updatedList: Todo.List) => {
    setList(updatedList);
    await Storage.set(Storage.Keys.LISTS, updatedList);
  };

  if (!list) return <Navigate to="/todo" />;

  return (
    <>
      <PageHeader className="text-2xl">
        <Link className="hover:underline" to="/todo">
          Todo
        </Link>
        <span>&gt;</span>
        <span>{list.label}</span>
      </PageHeader>
      <PageContent>
        <div className="flex items-center gap-4">
          <Checkbox
            className="shrink-0"
            checked={allDone}
            disabled={list.items.length === 0}
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
          <ConfirmDialog
            description="This action cannot be undone. This will permanently this list."
            onSubmit={async () => {
              setList(undefined);
              await Storage.delete(Storage.Keys.LISTS, list.id);
            }}
          >
            <Button className="shrink-0" variant="destructive" size="icon">
              <Flame />
            </Button>
          </ConfirmDialog>
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
      </PageContent>
    </>
  );
}

export namespace TodoList {
  export async function loader({ params }: LoaderFunctionArgs<any>) {
    if (!params.id) return redirect('/');

    const list = await Storage.get(Storage.Keys.LISTS, params.id);

    if (!list) return redirect('/todo');

    return list;
  }
}
