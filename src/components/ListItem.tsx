import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Todo } from '@/storage';
import { createId } from '@paralleldrive/cuid2';
import { useCachedState } from '@rain-cafe/react-utils';
import { Flame } from 'lucide-react';
import { Button } from './ui/button';

export type ListItemProps = {
  item?: Todo.Item;
  placeholder?: string;
  blank?: boolean;
  onChange?: (item: Todo.Item) => void;
  onDelete?: (item: Todo.Item) => void;
};

export function ListItem({ item: externalItem, placeholder, blank, onChange, onDelete }: ListItemProps) {
  const [item, setItem] = useCachedState<Todo.Item>(
    () =>
      externalItem ?? {
        id: createId(),
        label: '',
        done: false,
      },
    [externalItem]
  );

  if (!item) return null;

  const onSubmit = (updatedItem: Todo.Item) => {
    if (!updatedItem.label) return;

    onChange?.(updatedItem);

    if (blank) {
      setItem({
        id: createId(),
        label: '',
        done: false,
      });
    } else {
      setItem(updatedItem);
    }
  };

  return (
    <div className="flex gap-4 items-center">
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
          if (!['Enter'].includes(e.key)) return;

          onSubmit(item);
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
  );
}
