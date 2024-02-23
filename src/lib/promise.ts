export function timeout(ms?: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a promise that never resolves
 */
export function never(): Promise<void> {
  return new Promise(() => {});
}
