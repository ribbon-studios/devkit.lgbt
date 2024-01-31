import { ListItem } from '@/components/ListItem';
import { Storage, StorageKeys, Todo } from '@/storage';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';

export type ListItemsProps = {
  items: Todo.Item[];
  onChange: (updatedItems: Todo.Item[]) => void;
  onUnnestRequested?: (updatedItem: Todo.Item, source: boolean) => void;
};

export function ListItems({ items, onChange, onUnnestRequested }: ListItemsProps) {
  return (
    <>
      {items.map((item, i) => (
        <ListItem
          key={item.id}
          item={item}
          onChange={(updatedItem) => {
            onChange(
              items.map((item) => {
                if (item.id !== updatedItem.id) return item;

                return updatedItem;
              })
            );
          }}
          onDelete={(deletedItem) => {
            onChange(items.filter((item) => item.id !== deletedItem.id));
          }}
          onNestRequested={(updatedItem) => {
            const previousItem = items[i - 1];

            if (!previousItem) return;

            onChange(
              items
                .filter((item) => item.id !== updatedItem.id)
                .map((item) => {
                  if (item.id !== previousItem.id) return item;

                  const subItems = item.subItems ?? [];
                  subItems.push(updatedItem);

                  return {
                    ...item,
                    subItems,
                  };
                })
            );
          }}
          onUnnestRequested={(updatedItem, source) => {
            if (source) {
              onUnnestRequested?.(updatedItem, source);
            } else {
              onChange([
                ...items.slice(0, i),
                {
                  ...item,
                  subItems: item.subItems.filter(({ id }) => id !== updatedItem.id),
                },
                updatedItem,
                ...items.slice(i + 1),
              ]);
            }
          }}
        />
      ))}
    </>
  );
}

export namespace TodoListPage {
  export async function loader({ params }: LoaderFunctionArgs<any>) {
    if (!params.id) return redirect('/');

    const list = await Storage.get(StorageKeys.LISTS, params.id);

    if (!list) return redirect('/todo');

    return list;
  }
}
