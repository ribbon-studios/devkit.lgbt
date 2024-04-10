import { useCachedState } from '@ribbon-studios/react-utils';
import { useLoaderData } from 'react-router-dom';

export function useBetterLoaderData<T>(): [T, React.Dispatch<T>];
export function useBetterLoaderData<T>(readOnly: false): [T, React.Dispatch<T>];
export function useBetterLoaderData<T>(readOnly: true): T;
export function useBetterLoaderData<T>(readOnly?: boolean): [T | undefined, React.Dispatch<T>] | T {
  const loaderData = useLoaderData() as T;

  if (readOnly) {
    return loaderData;
  }

  return useCachedState(() => loaderData, [loaderData]);
}
