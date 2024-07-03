import type { BuilderExtends, TypeCollection } from "#wayz/lib/structures/ArgumentParserOption";
import type { Message } from "#wayz/lib/structures/Command";
import type Command from "#wayz/lib/structures/Command";
import CustomError from "#wayz/lib/structures/CustomError";

export default class ArgumentResult<T extends keyof TypeCollection> {
    readonly #argument;
    readonly #type;
    readonly #message;

    public constructor(msg: Message, argument: string, type: T) {
        this.#argument = argument;
        this.#type = type;
        this.#message = msg;
    }

    public exec(): TypeCollection[T] | undefined {
        if (this.#argument.length === 0) return undefined;
        switch (this.#type) {
            case "string": return this.parseString() as TypeCollection[T];
            case "number": return this.parseNumber() as TypeCollection[T];
            case "command": return this.parseCommand() as TypeCollection[T];
            default: return undefined;
        }
    }

    private parseString(): string {
        return this.#argument;
    }

    private parseNumber(): number {
        const result = Number.parseInt(this.#argument, 10);
        if (Number.isNaN(result)) throw new CustomError("ArgsError", "ArgumentTypeNotMatch", { expected: this.#type });
        return result;
    }

    private parseCommand(): Command<BuilderExtends[]> {
        const command = this.#message.client.commandLoader.stores.get(this.#argument);
        if (!command) throw new CustomError("CollectionError", "NotFound", { from: "Command", where: this.#argument });
        return command;
    }
}
