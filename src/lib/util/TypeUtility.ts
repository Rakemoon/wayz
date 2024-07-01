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
  // eslint-disable-next-line typescript/no-unused-vars
    = T extends [infer _, ...infer R]
        ? ArrayIndex<R, R["length"] | Result>
        : Result;

export type Equal<L, R>
    = (<T>(...args: unknown[]) => T extends L ? 1 : 0) extends (<T>(...args: unknown[]) => T extends R ? 1 : 0)
        ? true
        : false;
