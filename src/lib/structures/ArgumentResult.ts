import type { TypeCollection } from "#wayz/lib/structures/ArgumentParserOption";

export default class ArgumentResult {
    #argument;
    #type;

    public constructor(argument: string, type: keyof TypeCollection) {
        this.#argument = argument;
        this.#type = type;
    }

    public exec() {
        switch (this.#type) {
            case "string": return this.parseString();
            case "number": return this.parseNumber();
            default: return "";
        }
    }

    private parseString() {
        return this.#argument;
    }

    private parseNumber() {
        const result = Number.parseInt(this.#argument, 10);
        if (Number.isNaN(result)) throw new TypeError("ARGS_TYPE_ISNT_MATCH");
        return result;
    }
}
