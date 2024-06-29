import type { Convert, TypeCollection, BuilderExtends } from "#wayz/lib/structures/ArgumentParserOption";
import ArgumentResult from "#wayz/lib/structures/ArgumentResult";
import type { UnionToTuple } from "#wayz/lib/util/TypeUtility";

export default class ArgumentParser<T extends BuilderExtends[]> {
    #separator = " ";
    #raw;
    #payload;
    public constructor(raw: string, payload: T) {
        this.#raw = raw;
        this.#payload = payload;
    }

    public exec() {
        const args = this.#raw.split(this.#separator);
        const results: Record<string, unknown> = {};
        for (const payload of this.#payload) {
            if (args.length === 0 && !payload.optional) throw new Error("ARGS_LESS");
            const arg: string[] = [];
            switch (payload.match) {
                case "rest": while (args.length > 0) arg.push(args.shift() as string); break;
                case "single": arg.push(args.shift() as string); break;
                default: break;
            }
            results[payload.name as string] = new ArgumentResult(arg.join(" "), payload.type as keyof TypeCollection).exec();
        }
        return results as Convert<T extends Array<infer U> ? UnionToTuple<U> : never>;
    }
}
