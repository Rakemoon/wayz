/**
 * To make union type to intersection
 */
export type UnionToIntersection<T>
    = (T extends unknown ? (arg: T) => void : never) extends (arg: infer U) => void
        ? U
        : never;

/**
 * To get the last type in the union type
 */
export type LastInUnion<T>
    = UnionToIntersection<T extends unknown ? (arg: T) => void : never> extends (arg: infer U) => void
        ? U
        : never;

/**
 * To Convert union type to tupple
 * WARN: This is very likely dangerous, because union have opinionated sort
 */
export type UnionToTuple<T, Last = LastInUnion<T>>
    = [T] extends [never]
        ? []
        : [...UnionToTuple<Exclude<T, Last>>, Last];

/**
 * Get all index in the type array
 */
export type ArrayIndex<T extends unknown[], Result extends number = 0>
    // eslint-disable-next-line typescript/no-unused-vars
    = T extends [infer _, ...infer R]
        ? ArrayIndex<R, R["length"] | Result>
        : Result;

/**
 * is type equal to each other ?
 */
export type Equal<L, R>
    = (<T>(...args: unknown[]) => T extends L ? 1 : 0) extends (<T>(...args: unknown[]) => T extends R ? 1 : 0)
        ? true
        : false;

/**
 * convert string into tupple
 */
export type StrToTupple<S extends string, R extends string[] = []>
= S extends `${infer F}${infer U}`
    ? StrToTupple<U, [...R, F]>
    : R;
