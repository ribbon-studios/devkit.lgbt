export async function refocus(element?: HTMLElement): Promise<void> {
  if (!element) return;

  await new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      element.focus();
      resolve();
    });
  });
}
