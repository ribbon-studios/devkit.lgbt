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

export function hasChanged(updatedItem: Todo.Item, originalItem?: Todo.Item): boolean {
  if (updatedItem !== originalItem) return true;

  return Object.keys(updatedItem).some((key) => {
    return updatedItem[key as keyof Todo.Item] !== originalItem[key as keyof Todo.Item];
  });
}

export function hasNotChanged(updatedItem: Todo.Item, originalItem?: Todo.Item): boolean {
  return !hasChanged(updatedItem, originalItem);
}

export type StatusCountResult = {
  done: number;
  total: number;
};

// TODO(Refactor): Likely a way cleaner way to do this that my brain just isn't coming up with at the moment
export function getStatusCount(items: Todo.Item | Todo.Item[]): StatusCountResult {
  if (items === undefined)
    return {
      done: 0,
      total: 0,
    };

  if (Array.isArray(items)) {
    return items.reduce(
      (output, item) => {
        const count = getStatusCount(item);

        return {
          done: output.done + count.done,
          total: output.total + count.total,
        };
      },
      {
        done: 0,
        total: 0,
      }
    );
  }

  if (items.subItems.length > 0) {
    return getStatusCount(items.subItems);
  }

  if (!items.done) {
    return {
      done: 0,
      total: 1,
    };
  }

  return {
    done: 1,
    total: 1,
  };
}

export enum ListStatus {
  NOT_STARTED,
  IN_PROGRESS,
  DONE,
}

export function getStatus({ done, total }: StatusCountResult): ListStatus {
  if (done === 0) return ListStatus.NOT_STARTED;

  if (done === total) return ListStatus.DONE;

  return ListStatus.IN_PROGRESS;
}
