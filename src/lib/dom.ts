export function refocus(element: HTMLElement) {
  window.requestAnimationFrame(() => element.focus());
}
