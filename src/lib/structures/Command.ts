import type { WAProto } from "@whiskeysockets/baileys";
import type enUs from "#wayz/languages/enUs";
import ArgumentParser from "#wayz/lib/components/ArgumentParser";
import { Builder } from "#wayz/lib/structures/ArgumentParserOption";
import type { BuilderExtends, Convert } from "#wayz/lib/structures/ArgumentParserOption";
import type Client from "#wayz/lib/structures/Client";

type Message = WAProto.IWebMessageInfo & {
    content: string;
    client: Client;
    localize: typeof enUs;
};

export default class Command<
    Argument extends BuilderExtends[] = []
> {
    public name: string = "";
    public aliases: string[] = [];
    public description: string | ((msg: Message) => string) = "";
    public args: Argument = [] as unknown as Argument;

    #exec: (...args: unknown[]) => Promise<unknown> = async function error() {
        await Promise.resolve();
        throw new ReferenceError(".setExec must be used");
    };

    public async exec(ms: unknown, rawArgs: string): Promise<void> {
        try {
            const args = new ArgumentParser(rawArgs, this.args).exec();
            await this.#exec(ms, args);
        } catch (error) {
            if (error instanceof Error) {
                const msg = ms as Message;
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

    public addArgument: <R extends BuilderExtends> (arg: R | ((build: BuilderExtends) => R)) => Command<[...Argument, R]> = arg => {
        this.args.push(arg instanceof Builder ? arg : arg(new Builder()));
        // eslint-disable-next-line typescript/no-unsafe-return
        return this as any;
    };

    // eslint-disable-next-line promise/prefer-await-to-callbacks
    public setExec(callback: (msg: Message, args: Convert<Argument>) => Promise<unknown>): this {
        this.#exec = callback as unknown as (...args: unknown[]) => Promise<unknown>;
        return this;
    }
}
