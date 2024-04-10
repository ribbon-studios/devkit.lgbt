import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { List } from '@/components/todo/List';
import { Button } from '@/components/ui/button';
import { Storage, StorageKeys, Todo } from '@/storage';
import { createId } from '@paralleldrive/cuid2';
import { useCachedState } from '@ribbon-studios/react-utils';
import { BadgePlus } from 'lucide-react';
import { useLoaderData } from 'react-router-dom';

export async function loader() {
  return await Storage.get(StorageKeys.LISTS);
}

export function Component() {
  const externalList = useLoaderData() as Todo.List[];
  const [lists, setLists] = useCachedState<Todo.List[]>(() => externalList, [externalList]);

  if (!lists) return null;

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
            Storage.set(StorageKeys.LISTS, list);
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
            {lists.map((list) => (
              <List
                key={list.id}
                list={list}
                onDelete={async () => {
                  setLists(lists.filter(({ id }) => id !== list.id));
                  await Storage.delete(StorageKeys.LISTS, list.id);
                }}
              />
            ))}
          </>
        )}
      </PageContent>
    </>
  );
}

Component.displayName = 'TodoListsPage';
