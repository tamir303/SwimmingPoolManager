export const addItem = <T>(array: T[], item: T): T[] => [...array, item];
export const removeItem = <T>(array: T[], item: T): T[] =>
  array.filter((i) => i !== item);
