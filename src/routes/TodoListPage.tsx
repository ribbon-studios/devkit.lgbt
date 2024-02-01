import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { ListItem } from '@/components/todo/ListItem';
import { ListItems } from '@/components/todo/ListItems';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { setDone } from '@/lib/items';
import { Storage, StorageKeys, Todo } from '@/storage';
import { useCachedState } from '@rain-cafe/react-utils';
import { Flame } from 'lucide-react';
import { useMemo } from 'react';
import { Link, LoaderFunctionArgs, Navigate, redirect, useLoaderData } from 'react-router-dom';
import { useIsFirstRender } from 'usehooks-ts';

export async function loader({ params }: LoaderFunctionArgs<any>) {
  if (!params.id) return redirect('/');

  const list = await Storage.get(StorageKeys.LISTS, params.id);

  if (!list) return redirect('/todo');

  return list;
}

export function Component() {
  const isFirstRender = useIsFirstRender();
  const externalList = useLoaderData() as Todo.List;
  const [list, setList] = useCachedState<Todo.List>(() => externalList, [externalList]);
  const allDone = useMemo(() => {
    return Boolean(list?.items.length) && list?.items.every((item) => item.done);
  }, [list?.items]);

  const onChange = async (updatedList: Todo.List) => {
    setList(updatedList);
    await Storage.set(StorageKeys.LISTS, updatedList);
  };

  if (!list) return <Navigate to="/todo" />;

  return (
    <>
      <PageHeader className="text-2xl">
        <Link className="hover:underline" to="/todo">
          Todo
        </Link>
        <div>&gt;</div>
        <div className="truncate">{list.label}</div>
      </PageHeader>
      <PageContent className="px-0">
        <div className="flex items-center">
          <div className="flex h-[100%] aspect-square items-center justify-center">
            <Checkbox
              className="shrink-0"
              checked={allDone}
              disabled={list.items.length === 0}
              onClick={() => {
                onChange({
                  ...list,
                  items: setDone(list.items, !allDone),
                });
              }}
            />
          </div>
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
            description="This action cannot be undone. This will permanently delete this list."
            onSubmit={async () => {
              setList(undefined);
              await Storage.delete(StorageKeys.LISTS, list.id);
            }}
          >
            <Button className="shrink-0 mx-2" variant="destructive" size="icon">
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
          autoFocus
          blank
        />
        <ListItems
          autoFocus={!isFirstRender}
          items={list.items}
          onChange={(updatedItems) => {
            onChange({
              ...list,
              items: updatedItems,
            });
          }}
        />
      </PageContent>
    </>
  );
}

Component.displayName = 'TodoListPage';
