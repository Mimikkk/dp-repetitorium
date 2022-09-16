export const range = (start: number, end: number) =>
  new Array(end - start).fill(0).map((_, i) => i + start);

export const omit = <T, Y>(array: (T | Y)[], element: Y): (T | Y)[] => [];
export const map = <T extends object, Y extends Set<T> | Array<T>>(
  item: Y,
  key: keyof T,
): Y extends Set<T> ? Set<Pick<T, keyof T>> : Pick<T, keyof T>[] => [] as any;

export const waitfor = async (predicate: () => boolean) => {};

export const delay = async (ms: number) => {};

export const issubsetof = <T>(self: Set<any>, of: Set<any>): boolean => false;
export const pickany = <T>(items: Set<T>): T => ({}) as any;
export const pickmany = <T>(items: Set<T> | T[], n: number): Set<T> => ({}) as any;
export const random = (threshold: number): boolean => ({}) as any;