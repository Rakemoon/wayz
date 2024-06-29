export type UnionToIntersection<T>
  = (T extends unknown ? (arg: T) => void : never) extends (arg: infer U) => void
      ? U
      : never;

export type LastInUnion<T>
  = UnionToIntersection<T extends unknown ? (arg: T) => void : never> extends (arg: infer U) => void
      ? U
      : never;

export type UnionToTuple<T, Last = LastInUnion<T>>
  = [T] extends [never]
      ? []
      : [...UnionToTuple<Exclude<T, Last>>, Last];

export type ArrayIndex<T extends unknown[], Result extends number = 0>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  = T extends [infer _, ...infer R]
      ? ArrayIndex<R, Result | R["length"]>
      : Result;
