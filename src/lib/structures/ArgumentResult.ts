import type { TypeCollection } from "#wayz/lib/structures/ArgumentParserOption";

export default class ArgumentResult<T extends keyof TypeCollection> {
    readonly #argument;
    readonly #type;

    public constructor(argument: string, type: T) {
        this.#argument = argument;
        this.#type = type;
    }

    public exec(): TypeCollection[T] | undefined {
        if (this.#argument.length === 0) return undefined;
        switch (this.#type) {
            case "string": return this.parseString() as TypeCollection[T];
            case "number": return this.parseNumber() as TypeCollection[T];
            default: return undefined;
        }
    }

    private parseString(): string {
        return this.#argument;
    }

    private parseNumber(): number {
        const result = Number.parseInt(this.#argument, 10);
        if (Number.isNaN(result)) throw new TypeError("ARGS_TYPE_ISNT_MATCH");
        return result;
    }
}
