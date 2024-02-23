import { Todo } from '@/storage';

export function isDone(items?: Todo.Item[] | Todo.Item): boolean {
  if (items === undefined) return false;

  if (Array.isArray(items)) {
    return items.every((item) => isDone(item));
  }

  return items.subItems.length === 0 ? items.done : isDone(items.subItems);
}

export function setDone(items: Todo.Item, done: boolean): Todo.Item;
export function setDone(items: Todo.Item[], done: boolean): Todo.Item[];
export function setDone(items: Todo.Item[] | Todo.Item, done: boolean): Todo.Item[] | Todo.Item {
  if (Array.isArray(items)) {
    return items.map((item) => setDone(item, done));
  }

  return {
    ...items,
    done,
    subItems: setDone(items.subItems, done),
  };
}
