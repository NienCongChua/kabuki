export const randomNumber = (start: number, end: number): number => {
  return Math.round(Math.random() * (end - start) + start);
};
