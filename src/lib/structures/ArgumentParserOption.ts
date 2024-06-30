import type { ArrayIndex } from "#wayz/lib/util/TypeUtility";

export type MatchCollection = "rest" | "single";

export type TypeCollection = {
    string: string;
    number: number;
};

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

    public setName<T extends Name>(name: T): Builder<T, Type, Match, Optional> {
        this.name = name;
        return this as unknown as Builder<T, Type, Match, Optional>;
    }

    public setType<T extends Type>(type: T): Builder<Name, T, Match, Optional> {
        this.type = type;
        return this as unknown as Builder<Name, T, Match, Optional>;
    }

    public setMatch<T extends Match>(match: T): Builder<Name, Type, T, Optional> {
        this.match = match;
        return this as unknown as Builder<Name, Type, T, Optional>;
    }

    public setOptional<T extends boolean>(optional: T): Builder<Name, Type, Match, T> {
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

