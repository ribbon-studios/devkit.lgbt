import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Todo } from '@/storage';
import { createId } from '@paralleldrive/cuid2';
import { useCachedState } from '@rain-cafe/react-utils';
import { Flame } from 'lucide-react';
import { ListItems } from './ListItems';
import { Button } from './ui/button';

export type ListItemProps = {
  className?: string;
  item?: Todo.Item;
  placeholder?: string;
  blank?: boolean;
  onChange: (item: Todo.Item) => void;
  onDelete?: (item: Todo.Item) => void;
  onNestRequested?: (item: Todo.Item) => void;
  onUnnestRequested?: (item: Todo.Item) => void;
};

export function ListItem({
  className,
  item: externalItem,
  placeholder,
  blank,
  onChange,
  onDelete,
  onNestRequested,
  onUnnestRequested,
}: ListItemProps) {
  const [item, setItem] = useCachedState<Todo.Item>(
    () =>
      externalItem ?? {
        id: createId(),
        label: '',
        done: false,
        subItems: [],
      },
    [externalItem]
  );

  if (!item) return null;

  const onSubmit = (updatedItem: Todo.Item) => {
    if (!updatedItem.label) return;

    onChange(updatedItem);

    if (blank) {
      setItem({
        id: createId(),
        label: '',
        done: false,
        subItems: [],
      });
    } else {
      setItem(updatedItem);
    }
  };

  return (
    <>
      <div className={cn('flex gap-4 items-center', className)}>
        <Checkbox
          className="shrink-0"
          checked={item.done}
          disabled={blank}
          onClick={() => {
            onSubmit({
              ...item,
              done: !item.done,
            });
          }}
        />
        <Input
          className={cn(item.done && 'line-through')}
          placeholder={placeholder}
          value={item.label}
          onChange={(e) => {
            setItem({
              ...item,
              label: e.target.value,
            });
          }}
          onBlur={() => onSubmit(item)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit(item);
            } else if (e.key === 'Tab') {
              e.preventDefault();

              if (blank) return;

              if (e.shiftKey) {
                onUnnestRequested?.(item);
              } else {
                onNestRequested?.(item);
              }
            }
          }}
        />
        <Button
          className="shrink-0"
          variant="destructive"
          size="icon"
          tabIndex={-1}
          disabled={blank}
          onClick={() => onDelete?.(item)}
        >
          <Flame />
        </Button>
      </div>
      {item.subItems.length > 0 && (
        <div className="flex flex-col gap-2 ml-11">
          <ListItem
            placeholder="Add a new item..."
            onChange={(newItem) => {
              onChange({
                ...item,
                subItems: [newItem, ...item.subItems],
              });
            }}
            blank
          />
          <ListItems
            items={item.subItems}
            onChange={(updatedItems) => {
              onSubmit({
                ...item,
                subItems: updatedItems,
              });
            }}
          />
        </div>
      )}
    </>
  );
}
