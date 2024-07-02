import type { WAProto } from "@whiskeysockets/baileys";
import type enUs from "#wayz/languages/enUs";
import ArgumentParser from "#wayz/lib/components/ArgumentParser";
import { Builder } from "#wayz/lib/structures/ArgumentParserOption";
import type { BuilderExtends, Convert } from "#wayz/lib/structures/ArgumentParserOption";
import type Client from "#wayz/lib/structures/Client";
import type { UnionToTuple } from "#wayz/lib/util/TypeUtility";

export type Message = WAProto.IWebMessageInfo & {
    content: string;
    client: Client;
    localize: typeof enUs;
};

type BuilderCallback = (build: BuilderExtends) => BuilderExtends;
type AddArgumentUnion = (BuilderCallback | BuilderExtends)[] | BuilderCallback | BuilderExtends;
type MapCallBackBuilder<Arr extends AddArgumentUnion[], Result extends BuilderExtends[] = []> =
    Arr extends [infer First, ...infer Rest]
        ? Rest extends AddArgumentUnion[]
            ? First extends (build: BuilderExtends) => infer Return
                ? Return extends BuilderExtends
                    ? MapCallBackBuilder<Rest, [...Result, Return]>
                    : never
                : First extends BuilderExtends
                    ? MapCallBackBuilder<Rest, [...Result, First]>
                    : First extends (infer InsideUnion)[]
                        ? UnionToTuple<InsideUnion> extends [...infer Insides]
                            ? Insides extends (BuilderCallback | BuilderExtends)[]
                                ? MapCallBackBuilder<[...Insides, ...Rest], [...Result]>
                                : never
                            : never
                        : never
            : never
        : Result;

export default class Command<Argument extends BuilderExtends[] = []> {
    public name: string = "";
    public aliases: string[] = [];
    public description: string | ((msg: Message) => string) = "";
    public args: Argument = [] as unknown as Argument;

    #exec: (...args: unknown[]) => Promise<unknown> = async function error() {
        await Promise.resolve();
        throw new ReferenceError(".setExec must be used");
    };

    public async exec(msg: Message, rawArgs: string): Promise<void> {
        try {
            const args = new ArgumentParser(msg, rawArgs, this.args).exec();
            await this.#exec(msg, args);
        } catch (error) {
            if (error instanceof Error) {
                void msg.client.sock?.sendMessage(msg.key.remoteJid!, { text: error.message });
                msg.client.sock?.logger.error(error);
            }
        }
    }

    public setName(name: string): this {
        this.name = name;
        return this;
    }

    public setDescription(description: string | ((msg: Message) => string)): this {
        this.description = description;
        return this;
    }

    public addAlias(...aliases: string[] | string[][]): this {
        this.aliases.push(...aliases.flat(2));
        return this;
    }

    public addArgument <A extends AddArgumentUnion[]>(...args: A): Command<[...Argument, ...MapCallBackBuilder<A>]> {
        this.args.push(...args.flat(2).map(x => (x instanceof Builder ? x : x(new Builder()))));
        return this as unknown as Command<[...Argument, ...MapCallBackBuilder<A>]>;
    }

    // eslint-disable-next-line promise/prefer-await-to-callbacks
    public setExec(callback: (msg: Message, args: Convert<Argument>) => Promise<unknown>): this {
        this.#exec = callback as unknown as (...args: unknown[]) => Promise<unknown>;
        return this;
    }
}
