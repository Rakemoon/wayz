export type UnionToIntersection<T>
  = (T extends any ? (arg: T) => void : never) extends (arg: infer U) => void
  ? U
  : never;

export type LastInUnion<T>
  = UnionToIntersection<T extends any ? (arg: T) => void : never> extends (arg: infer U) => void
  ? U
  : never;

export type UnionToTuple<T, Last = LastInUnion<T>>
  = [T] extends [never]
  ? []
  : [...UnionToTuple<Exclude<T, Last>>, Last];

export type ArrayIndex<T extends any[], Result extends number = 0>
  = T extends [infer _F, ...infer R]
  ? ArrayIndex<R, Result | R["length"]>
  : Result;
