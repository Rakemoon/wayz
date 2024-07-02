import type Command from "#wayz/lib/structures/Command";
import type { ArrayIndex, Equal } from "#wayz/lib/util/TypeUtility";

export type MatchCollection = "rest" | "single";

export type TypeCollection = {
    string: string;
    number: number;
    command: Command<BuilderExtends[]>;
};

export class Builder<
    Name extends string,
    Type extends keyof TypeCollection,
    Match extends MatchCollection,
    Optional extends boolean,
    Default extends TypeCollection[keyof TypeCollection] | undefined
> {
    public name?: Name;
    public type?: Type;
    public match?: Match;
    public optional?: Optional;
    public default?: Default;

    public setName<T extends Name>(name: T): Builder<T, Type, Match, Optional, Default> {
        this.name = name;
        return this as unknown as Builder<T, Type, Match, Optional, Default>;
    }

    public setType<T extends Type>(type: T): Builder<Name, T, Match, Optional, Default> {
        this.type = type;
        return this as unknown as Builder<Name, T, Match, Optional, Default>;
    }

    public setMatch<T extends Match>(match: T): Builder<Name, Type, T, Optional, Default> {
        this.match = match;
        return this as unknown as Builder<Name, Type, T, Optional, Default>;
    }

    public setOptional(): Builder<Name, Type, Match, true, Default>;
    public setOptional<T extends boolean>(optional: T): Builder<Name, Type, Match, T, Default>;
    public setOptional<T extends boolean>(optional?: T): Builder<Name, Type, Match, T, Default> {
        this.optional = (optional ?? true) as unknown as Optional;
        return this as unknown as Builder<Name, Type, Match, T, Default>;
    }

    public setDefault<T extends TypeCollection[Type]>(value: T): Builder<Name, Type, Match, true, T> {
        this.setOptional();
        this.default = value as unknown as Default;
        return this as unknown as Builder<Name, Type, Match, true, T>;
    }
}

export type BuilderExtends = Builder<string, keyof TypeCollection, MatchCollection, boolean, TypeCollection[keyof TypeCollection] | undefined>;

export type Convert<T extends BuilderExtends[]> = {
    [K in ArrayIndex<T> as NonNullable<T[K]["name"]>]: T[K]["type"] extends infer U | undefined
        ? U extends keyof TypeCollection
            ? Equal<T[K]["optional"], true | undefined> extends true
                ? Equal<T[K]["default"], TypeCollection[U] | undefined> extends false
                    ? TypeCollection[U] | undefined
                    : TypeCollection[U]
                : TypeCollection[U]
            : never
        : never;
};

