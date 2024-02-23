export function refocus(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      element.focus();
      resolve();
    });
  });
}
