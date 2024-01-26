import { useCachedState } from '@rain-cafe/react-utils';
import { useLoaderData } from 'react-router-dom';

export function useBetterLoaderData<T>(): [T, React.Dispatch<T>] {
  const loaderData = useLoaderData() as T;
  return useCachedState(() => loaderData, [loaderData]);
}
