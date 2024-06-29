import type { WAProto, makeWASocket } from "@whiskeysockets/baileys";
import type { BuilderExtends, Convert } from "#wayz/lib/structures/ArgumentParserOption";

type Message = WAProto.IWebMessageInfo & {
    content: string;
    sock: ReturnType<typeof makeWASocket>;
};

export default class Command<
    Argument extends BuilderExtends[] = []
> {
    public name: string = "";
    public aliases: string[] = [];
    public description: string = "";
    public args: Argument = [] as unknown as Argument;
    public exec?: (...args: unknown[]) => Promise<unknown>;

    public setName(name: string) {
        this.name = name;
        return this;
    }

    public setDescription(description: string) {
        this.description = description;
        return this;
    }

    public addAlias(alias: string) {
        this.aliases.push(alias);
        return this;
    }

    public addArgument<T extends BuilderExtends>(build: T) {
        this.args.push(build);
        return this as unknown as Command<[...Argument, T]>;
    }

    // eslint-disable-next-line promise/prefer-await-to-callbacks
    public setExec(callback: (msg: Message, args: Convert<Argument>) => Promise<unknown>) {
        this.exec = callback as unknown as (...args: unknown[]) => Promise<unknown>;
        return this;
    }
}
