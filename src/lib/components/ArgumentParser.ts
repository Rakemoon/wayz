import type { Convert, BuilderExtends } from "#wayz/lib/structures/ArgumentParserOption";
import ArgumentResult from "#wayz/lib/structures/ArgumentResult";
import type { Message } from "#wayz/lib/structures/Command";
import type Command from "#wayz/lib/structures/Command";
import CustomError from "#wayz/lib/structures/CustomError";
import type { UnionToTuple } from "#wayz/lib/util/TypeUtility";

/**
 * Just a simple argument parser nothing special
 */
export default class ArgumentParser<T extends BuilderExtends[]> {
    readonly #raw;
    readonly #payload;
    readonly #message;

    /**
     * To Build Argument Parser instance
     *
     * @param msg - the Message
     * @param raw - the collections of strings raw to be parsed
     * @param payload - the Payload Builder
     */
    public constructor(msg: Message, raw: string[], payload: T) {
        this.#raw = raw;
        this.#payload = payload;
        this.#message = msg;
    }

    /**
     * exec the current parse
     *
     * @param command - the command param determine the spliter
     */
    public exec(command: Command): Convert<T extends (infer U)[] ? UnionToTuple<U> : never> {
        const args = command.spliter === " " ? this.#raw : this.#raw.join(" ").split(command.spliter);
        const results: Record<string, unknown> = {};
        for (const payload of this.#payload) {
            if (args.length === 0 && !payload.optional!) {
                throw new CustomError("ArgsError", "ArgumentLess", {
                    expected: this.#payload.filter(x => !x.optional!).length,
                    found: args.filter(x => x.length > 0).length
                });
            }
            const arg: string[] = [];
            switch (payload.match) {
                case "rest": while (args.length > 0) arg.push(args.shift()!); break;
                case "single": arg.push(args.shift()!); break;
                default: break;
            }
            const result = new ArgumentResult(this.#message, arg.join(" "), payload.type!).exec();
            if (result === undefined && !payload.optional!) {
                throw new CustomError("ArgsError", "ArgumentLess", {
                    expected: this.#payload.filter(x => !x.optional!).length,
                    found: args.filter(x => x.length > 0).length
                });
            }
            results[payload.name!] = result ?? payload.default;
        }
        return results as Convert<T extends (infer U)[] ? UnionToTuple<U> : never>;
    }
}
