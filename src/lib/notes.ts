import { Notes } from '@/storage';
import { useMemo } from 'react';

export function useTitle({ text }: Notes.List): string {
  return useMemo(() => {
    const [rawHeader] = text.split('\n');

    if (rawHeader) {
      const [_, match] = rawHeader.match(/([\d\w\s]+)/) ?? [];

      return match.trim();
    }

    return 'Unnamed Note';
  }, [text]);
}
