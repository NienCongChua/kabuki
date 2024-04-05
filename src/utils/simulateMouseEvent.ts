export const simulateMouseEvent = (element: HTMLElement, event: string) => {
  return element.dispatchEvent(
    new MouseEvent(event, {
      view: window,
      bubbles: true,
      cancelable: true,
    }),
  );
};
