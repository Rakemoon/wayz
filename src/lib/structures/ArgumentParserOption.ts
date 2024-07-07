import type Command from "#wayz/lib/structures/Command";
import type { ArrayIndex, Equal } from "#wayz/lib/util/TypeUtility";

/**
 * The collection of argument match
 *
 * rest: take all remain argument
 * single: just take one argument
 */
export type MatchCollection = "rest" | "single";

/**
 * The collection of argument type
 */
export type TypeCollection = {
    string: string;
    number: number;
    command: Command<BuilderExtends[]>;
};

/**
 * Literally Argument Builder
 */
export class Builder<
    Name extends string,
    Type extends keyof TypeCollection,
    Match extends MatchCollection,
    Optional extends boolean,
    Default extends TypeCollection[keyof TypeCollection] | undefined
> {
    /**
     * The name of this argument
     */
    public name?: Name;

    /**
     * The type of this argument
     */
    public type?: Type;

    /**
     * The match of this argument
     */
    public match?: Match;

    /**
     * The condition argument are optional or mandatory
     */
    public optional?: Optional;

    /**
     * The default value if argument doesnt provided
     */
    public default?: Default;

    /**
     * Set the name of this argument, used to be a key
     *
     * @param name - the argument name
     */
    public setName<T extends Name>(name: T): Builder<T, Type, Match, Optional, Default> {
        this.name = name;
        return this as unknown as Builder<T, Type, Match, Optional, Default>;
    }

    /**
     * Set the type of this argument
     *
     * @param type - the argument type
     */
    public setType<T extends Type>(type: T): Builder<Name, T, Match, Optional, Default> {
        this.type = type;
        return this as unknown as Builder<Name, T, Match, Optional, Default>;
    }

    /**
     * Set the match for this argument
     *
     * @param match - the argument match
     */
    public setMatch<T extends Match>(match: T): Builder<Name, Type, T, Optional, Default> {
        this.match = match;
        return this as unknown as Builder<Name, Type, T, Optional, Default>;
    }

    /**
     * Set the argument optional or mandatory, its mandatory by defaut
     *
     * @param optional - set the argument optionality
     */
    public setOptional(): Builder<Name, Type, Match, true, Default>;
    public setOptional<T extends boolean>(optional: T): Builder<Name, Type, Match, T, Default>;
    public setOptional<T extends boolean>(optional?: T): Builder<Name, Type, Match, T, Default> {
        this.optional = (optional ?? true) as unknown as Optional;
        return this as unknown as Builder<Name, Type, Match, T, Default>;
    }

    /**
     * Set the default value if argument doesnt provided
     * Argument will be set to optional if this provided
     *
     * @param value - the default value
     */
    public setDefault<T extends TypeCollection[Type]>(value: T): Builder<Name, Type, Match, true, T> {
        this.setOptional();
        this.default = value as unknown as Default;
        return this as unknown as Builder<Name, Type, Match, true, T>;
    }
}

/**
 * This type purpose for building type thats needed Builder default value
 */
export type BuilderExtends = Builder<string, keyof TypeCollection, MatchCollection, boolean, TypeCollection[keyof TypeCollection] | undefined>;

/**
 * Convert the `BuilderExtends` into Records like
 */
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

