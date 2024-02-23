import { Todo } from '@/storage';
import { describe, expect, it } from 'vitest';
import { isDone, setDone } from '../items';

describe('Item Utils', () => {
  describe('fn(isDone)', () => {
    it.each([true, false])('should check if a simple item being done is %s', (expectedDone) => {
      const item: Todo.Item = {
        id: '',
        label: '',
        done: expectedDone,
        subItems: [],
      };

      expect(isDone(item)).toEqual(expectedDone);
    });

    it.each([true, false])('should check if a item with nested items being done is %s', (expectedDone) => {
      const item: Todo.Item = {
        id: '',
        label: '',
        done: false,
        subItems: [
          {
            id: '',
            label: '',
            done: expectedDone,
            subItems: [],
          },
        ],
      };

      expect(isDone(item)).toEqual(expectedDone);
    });

    it('should support a simple item not being done', () => {
      const item: Todo.Item = {
        id: '',
        label: '',
        done: false,
        subItems: [],
      };

      expect(isDone(item)).toEqual(false);
    });

    it('should support a simple item being done', () => {
      const item: Todo.Item = {
        id: '',
        label: '',
        done: true,
        subItems: [],
      };

      expect(isDone(item)).toEqual(true);
    });
  });

  describe('fn(setDone)', () => {
    it('should set an items done value to true', () => {
      const item: Todo.Item = {
        id: '',
        label: '',
        done: false,
        subItems: [],
      };

      expect(setDone(item, true)).toEqual({
        ...item,
        done: true,
      });
    });

    it('should support nested items', () => {
      const nestedItem: Todo.Item = {
        id: '',
        label: '',
        done: false,
        subItems: [],
      };

      const item: Todo.Item = {
        id: '',
        label: '',
        done: false,
        subItems: [nestedItem],
      };

      expect(setDone(item, true)).toEqual({
        ...item,
        done: true,
        subItems: [
          {
            ...nestedItem,
            done: true,
          },
        ],
      });
    });

    it('should support an array of items', () => {
      const item: Todo.Item = {
        id: '',
        label: '',
        done: false,
        subItems: [],
      };

      expect(setDone([item], true)).toEqual([
        {
          ...item,
          done: true,
        },
      ]);
    });
  });
});
