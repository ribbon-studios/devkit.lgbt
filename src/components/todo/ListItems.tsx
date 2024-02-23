import { Todo } from '@/storage';
import { ListItem } from './ListItem';

export type ListItemsProps = {
  autoFocus?: boolean;
  parentItem?: Todo.Item;
  items: Todo.Item[];
  onChange: (updatedItems: Todo.Item[]) => void;
  onUnnest?: (updatedItem: Todo.Item, parentItem: Todo.Item) => void;
};

export function ListItems({ autoFocus, parentItem, items, onChange, onUnnest }: ListItemsProps) {
  return (
    <>
      {items.map((item, i) => (
        <ListItem
          autoFocus={autoFocus}
          key={item.id}
          item={item}
          previousItem={items[i - 1]}
          parentItem={parentItem}
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
          onNest={(updatedItem, previousItem) => {
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
          onUnnest={(updatedItem, parentItem) => {
            // Not our problem, forward it further up
            if (item !== parentItem) {
              return onUnnest?.(updatedItem, parentItem);
            }

            onChange([
              ...items.slice(0, i),
              {
                ...item,
                subItems: item.subItems.filter(({ id }) => id !== updatedItem.id),
              },
              updatedItem,
              ...items.slice(i + 1),
            ]);
          }}
        />
      ))}
    </>
  );
}
