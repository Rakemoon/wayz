import type { BuilderExtends, TypeCollection } from "#wayz/lib/structures/ArgumentParserOption";
import type { Message } from "#wayz/lib/structures/Command";
import type Command from "#wayz/lib/structures/Command";
import CustomError from "#wayz/lib/structures/CustomError";

/**
 * This for converting raw argument into provided type value
 */
export default class ArgumentResult<T extends keyof TypeCollection> {
    readonly #argument;
    readonly #type;
    readonly #message;

    /**
     * To create the new instances
     *
     * @param msg - The message instance
     * @param argument - The raw arguments
     * @param type - the argunent type
     */
    public constructor(msg: Message, argument: string, type: T) {
        this.#argument = argument;
        this.#type = type;
        this.#message = msg;
    }

    /**
     * to execute the operation
     */
    public exec(): TypeCollection[T] | undefined {
        if (this.#argument.length === 0) return undefined;
        switch (this.#type) {
            case "string": return this.parseString() as TypeCollection[T];
            case "number": return this.parseNumber() as TypeCollection[T];
            case "command": return this.parseCommand() as TypeCollection[T];
            default: return undefined;
        }
    }

    /**
     * to parse raw argument into a string
     */
    private parseString(): string {
        return this.#argument;
    }

    /**
     * to parse raw argument into a number
     */
    private parseNumber(): number {
        const result = Number.parseInt(this.#argument, 10);
        if (Number.isNaN(result)) throw new CustomError("ArgsError.NotMatch", { expected: this.#type });
        return result;
    }

    /**
     * to parse raw argument into a command
     */
    private parseCommand(): Command<BuilderExtends[]> {
        const command = this.#message.client.commandLoader.stores.get(this.#argument);
        if (!command) throw new CustomError("CollectionError.NotFound", { from: "Command", where: this.#argument });
        return command;
    }
}
