import type { ArrayIndex } from "#wayz/lib/util/TypeUtility";

export type MatchCollection = "rest" | "single";

export interface TypeCollection {
    string: string;
    number: number;
}

export class Builder<
    Name extends string,
    Type extends keyof TypeCollection,
    Match extends MatchCollection,
    Optional extends boolean
> {
    public name?: Name;
    public type?: Type;
    public match?: Match;
    public optional?: Optional;

    setName<T extends Name>(name: T) {
        this.name = name;
        return this as unknown as Builder<T, Type, Match, Optional>;
    }

    setType<T extends Type>(type: T) {
        this.type = type;
        return this as unknown as Builder<Name, T, Match, Optional>;
    }

    setMatch<T extends Match>(match: T) {
        this.match = match;
        return this as unknown as Builder<Name, Type, T, Optional>;
    }

    setOptional<T extends boolean>(optional: T) {
        this.optional = optional as unknown as Optional;
        return this as unknown as Builder<Name, Type, Match, T>;
    }
}

export type BuilderExtends = Builder<string, keyof TypeCollection, MatchCollection, boolean>;

export type Convert<T extends BuilderExtends[]> = {

    // @ts-expect-error 2332 this something i cant figure it out to exlude the undefined type from Builder["type"] uniones
    [K in ArrayIndex<T> as T[K]["name"]]: T[K]["type"] extends infer U | undefined
        ? U extends keyof TypeCollection
            ? TypeCollection[U]
            : never
        : never;
};

