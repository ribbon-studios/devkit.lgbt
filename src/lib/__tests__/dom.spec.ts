import { describe, expect, it, vi } from 'vitest';
import { refocus } from '../dom';

describe('Dom Utils', () => {
  describe('fn(refocus)', () => {
    it('should refocus the element...', async () => {
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((fn) => {
        setTimeout(() => fn(0));

        return 0;
      });

      const element = {
        focus: vi.fn(),
      } as unknown as HTMLElement;

      const promise = refocus(element);

      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(element.focus).not.toHaveBeenCalled();

      await promise;

      expect(element.focus).toHaveBeenCalledTimes(1);
    });
  });
});
