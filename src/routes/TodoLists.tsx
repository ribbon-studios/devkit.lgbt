import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Storage, Todo } from '@/storage';
import { createId } from '@paralleldrive/cuid2';
import { useCachedState } from '@rain-cafe/react-utils';
import { BadgePlus, Flame, ListTodo } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

export function TodoLists() {
  const externalList = useLoaderData() as Todo.List[];
  const [search, setSearch] = useState<string>('');
  const [lists, setLists] = useCachedState<Todo.List[]>(() => externalList, [externalList]);
  const filteredLists = useMemo(() => {
    return search ? lists?.filter((list) => list.label.includes(search)) : lists;
  }, [lists, search]);

  if (!lists || !filteredLists) return null;

  return (
    <>
      <PageHeader className="justify-between">
        <h1 className="text-2xl leading-none">Todo</h1>
        <Button
          className="shrink-0"
          size="icon"
          variant="ghost"
          onClick={() => {
            const list: Todo.List = {
              id: createId(),
              label: 'Unnamed List',
              items: [],
            };

            setLists([list, ...lists]);
            Storage.set(Storage.Keys.LISTS, list);
          }}
        >
          <BadgePlus />
        </Button>
      </PageHeader>
      <PageContent>
        {lists.length === 0 ? (
          <div className="text-md italic flex flex-col items-center gap-2">
            <span>It looks like you don't have any lists!</span>
            <span>Click the add button in the top right to create one!</span>
          </div>
        ) : (
          <>
            {filteredLists.map(({ id, label, items }) => (
              <div className="flex gap-2" key={id}>
                <Button className="flex flex-1 justify-start gap-2" asChild variant="secondary">
                  <Link to={`/todo/${id}`}>
                    <ListTodo />
                    {label}
                  </Link>
                </Button>
                <div className="flex bg-secondary h-10 px-4 items-center justify-center rounded-md">
                  {items.length} Items
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setLists(lists.filter((list) => list.id !== id));
                    Storage.delete(Storage.Keys.LISTS, id);
                  }}
                >
                  <Flame />
                </Button>
              </div>
            ))}
          </>
        )}
      </PageContent>
    </>
  );
}

export namespace TodoLists {
  export async function loader() {
    return await Storage.get(Storage.Keys.LISTS);
  }
}
