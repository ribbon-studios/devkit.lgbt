import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { refocus } from '@/lib/dom';
import { hasNotChanged, isDone, setDone } from '@/lib/items';
import { cn } from '@/lib/utils';
import { Todo } from '@/storage';
import { createId } from '@paralleldrive/cuid2';
import { useCachedState } from '@rain-cafe/react-utils';
import { ArrowLeftToLine, ArrowRightToLine, Flame } from 'lucide-react';
import { SyntheticEvent, useMemo } from 'react';
import { Button } from '../ui/button';
import { ListItems } from './ListItems';

export type ListItemProps = {
  item?: Todo.Item;
  placeholder?: string;
  autoFocus?: boolean;
  blank?: boolean;
  parentItem?: Todo.Item;
  previousItem?: Todo.Item;
  onChange: (item: Todo.Item) => void;
  onDelete?: (item: Todo.Item) => void;
  onNest?: (item: Todo.Item, previousItem: Todo.Item) => void;
  onUnnest?: (item: Todo.Item, parentItem: Todo.Item) => void;
};

export function ListItem({
  item: externalItem,
  placeholder,
  autoFocus,
  blank,
  parentItem,
  previousItem,
  onChange,
  onDelete,
  onNest,
  onUnnest,
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
  const done = useMemo(() => isDone(item), [item]);
  const isNestDisabled = blank || previousItem === undefined;
  const isUnnestDisabled = blank || parentItem === undefined;

  if (!item) return null;

  const onSubmit = (updatedItem: Todo.Item, e?: SyntheticEvent<HTMLElement>) => {
    if (!updatedItem.label || hasNotChanged(updatedItem, externalItem)) return;

    onChange(updatedItem);

    if (blank) {
      setItem({
        id: createId(),
        label: '',
        done: false,
        subItems: [],
      });

      refocus(e?.currentTarget);
    } else {
      setItem(updatedItem);
    }
  };

  const onNestRequested = (item: Todo.Item) => {
    if (isNestDisabled || !onNest) return;

    onNest(item, previousItem);
  };

  const onUnnestRequested = (item: Todo.Item, forwardedParentItem?: Todo.Item) => {
    if (isUnnestDisabled || !onUnnest) return;

    onUnnest(item, forwardedParentItem ?? parentItem);
  };

  return (
    <>
      <div className={'flex items-center'}>
        <div className="flex aspect-square h-[100%] items-center justify-center">
          <Checkbox
            className="shrink-0"
            tabIndex={-1}
            checked={done}
            disabled={blank}
            onClick={() => {
              onSubmit(setDone(item, !done));
            }}
          />
        </div>
        <Input
          autoFocus={autoFocus}
          className={cn(done && 'line-through')}
          placeholder={placeholder}
          value={item.label}
          onChange={(e) => {
            setItem({
              ...item,
              label: e.target.value,
            });
          }}
          onBlur={(e) => onSubmit(item, e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              return onSubmit(item, e);
            }

            if (blank) return;

            if (e.ctrlKey && e.key === 'a') {
              e.preventDefault();

              onUnnestRequested(item, parentItem);
            } else if (e.ctrlKey && e.key === 'd') {
              e.preventDefault();

              onNestRequested(item);
            }
          }}
        />
        <div className="flex gap-2 mx-2">
          <div className="hidden sm:flex">
            <Button
              className="rounded-r-none border-r border-r-black/30 pl-2"
              tabIndex={-1}
              size="slimIcon"
              disabled={isUnnestDisabled}
              onClick={() => onUnnestRequested(item, parentItem)}
            >
              <ArrowLeftToLine />
            </Button>
            <Button
              className="rounded-l-none pr-2"
              tabIndex={-1}
              size="slimIcon"
              disabled={isNestDisabled}
              onClick={() => onNestRequested(item)}
            >
              <ArrowRightToLine />
            </Button>
          </div>
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
      </div>
      {item.subItems.length > 0 && (
        <div className="flex flex-col gap-2 bg-white/10 py-2 sm:py-0 sm:bg-transparent sm:ml-11">
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
            parentItem={item}
            items={item.subItems}
            onChange={(updatedItems) => {
              onSubmit({
                ...item,
                subItems: updatedItems,
              });
            }}
            onUnnest={onUnnest}
          />
        </div>
      )}
    </>
  );
}
