import { Notes } from '@/storage';
import { useMemo } from 'react';

export function useTitle({ text }: Notes.List): string {
  return useMemo(() => {
    const [rawHeader] = text.split('\n');

    if (rawHeader) {
      return rawHeader.replace(/[#*_]/g, '').trim();
    }

    return 'Unnamed Note';
  }, [text]);
}
