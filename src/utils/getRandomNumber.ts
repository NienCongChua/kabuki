export const getRandomNumber = (start: number, end: number): number => {
  return Math.round(Math.random() * (end - start) + start);
};
