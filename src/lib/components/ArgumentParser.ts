import type { Convert, BuilderExtends } from "#wayz/lib/structures/ArgumentParserOption";
import ArgumentResult from "#wayz/lib/structures/ArgumentResult";
import type { Message } from "#wayz/lib/structures/Command";
import type { UnionToTuple } from "#wayz/lib/util/TypeUtility";

export default class ArgumentParser<T extends BuilderExtends[]> {
    #separator = " ";
    readonly #raw;
    readonly #payload;
    readonly #message;
    public constructor(msg: Message, raw: string, payload: T) {
        this.#raw = raw;
        this.#payload = payload;
        this.#message = msg;
    }

    public exec(): Convert<T extends (infer U)[] ? UnionToTuple<U> : never> {
        const args = this.#raw.split(this.#separator);
        const results: Record<string, unknown> = {};
        for (const payload of this.#payload) {
            if (args.length === 0 && !payload.optional!) throw new Error("ARGS_LESS");
            const arg: string[] = [];
            switch (payload.match) {
                case "rest": while (args.length > 0) arg.push(args.shift()!); break;
                case "single": arg.push(args.shift()!); break;
                default: break;
            }
            const result = new ArgumentResult(this.#message, arg.join(" "), payload.type!).exec();
            if (result === undefined && !payload.optional!) throw new Error("ARGS_LESS");
            results[payload.name!] = result;
        }
        return results as Convert<T extends (infer U)[] ? UnionToTuple<U> : never>;
    }
}
