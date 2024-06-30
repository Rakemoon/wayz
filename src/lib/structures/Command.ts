import type { WAProto, makeWASocket } from "@whiskeysockets/baileys";
import type enUs from "#wayz/languages/enUs";
import type { BuilderExtends, Convert } from "#wayz/lib/structures/ArgumentParserOption";

type Message = WAProto.IWebMessageInfo & {
    content: string;
    sock: ReturnType<typeof makeWASocket>;
    localize: typeof enUs;
};

export default class Command<
    Argument extends BuilderExtends[] = []
> {
    public name: string = "";
    public aliases: string[] = [];
    public description: string = "";
    public args: Argument = [] as unknown as Argument;

    #exec: (...args: unknown[]) => Promise<unknown> = async function error() {
        await Promise.resolve();
        throw new ReferenceError(".setExec must be used");
    };

    public async exec(...args: unknown[]): Promise<void> {
        try {
            await this.#exec(...args);
        } catch (error) {
            if (error instanceof Error) {
                const msg = args[0] as Message;
                void msg.sock.sendMessage(msg.key.remoteJid!, { text: error.message });
                console.error(error);
            }
        }
    }

    public setName(name: string): this {
        this.name = name;
        return this;
    }

    public setDescription(description: string): this {
        this.description = description;
        return this;
    }

    public addAlias(alias: string): this {
        this.aliases.push(alias);
        return this;
    }

    public addArgument<T extends BuilderExtends>(build: T): Command<[...Argument, T]> {
        this.args.push(build);
        return this as unknown as Command<[...Argument, T]>;
    }

    // eslint-disable-next-line promise/prefer-await-to-callbacks
    public setExec(callback: (msg: Message, args: Convert<Argument>) => Promise<unknown>): this {
        this.#exec = callback as unknown as (...args: unknown[]) => Promise<unknown>;
        return this;
    }
}
