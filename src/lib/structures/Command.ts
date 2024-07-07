import type { WAProto } from "@whiskeysockets/baileys";
import ArgumentParser from "#wayz/lib/components/ArgumentParser";
import type { LocalizationLibrary } from "#wayz/lib/components/Localization";
import { Builder } from "#wayz/lib/structures/ArgumentParserOption";
import type { BuilderExtends, Convert } from "#wayz/lib/structures/ArgumentParserOption";
import type Client from "#wayz/lib/structures/Client";
import CustomError from "#wayz/lib/structures/CustomError";
import type { UnionToTuple } from "#wayz/lib/util/TypeUtility";
import { getParticipant } from "#wayz/lib/util/proto";

/**
 * A modified `IWebMessageInfo` for shorthand purposes
 */
export type Message = WAProto.IWebMessageInfo & {
    content: string;
    client: Client;
    localize: LocalizationLibrary;
    prefix: string;
};

/**
 * The type definition to modify type generic Argument in `Command` constructor
 */
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

/**
 * The Command constructor
 */
export default class Command<Argument extends BuilderExtends[] = []> {
    /**
     * The name of the command
     */
    public name: string = "";

    /**
     * The aliases of the command
     */
    public aliases: string[] = [];

    /**
     * The description of the command
     */
    public description: string | ((msg: Message) => string) = "";

    /**
     * The argument of the commands
     */
    public args: Argument = [] as unknown as Argument;

    /**
     * The condition where command can only invoked by owner client
     */
    public ownerOnly: boolean = false;

    /**
     * The spliter for raw arguments, space the default
     */
    public spliter: RegExp | string = " ";

    /**
     * The command cooldown, in milis
     */
    public cooldown: number = 0;

    #cooldowns = new Map<string, number>();

    #exec: (...args: unknown[]) => Promise<unknown> = async function error() {
        await Promise.resolve();
        throw new ReferenceError(".setExec must be used");
    };

    /**
     * To invoke this command
     *
     * @param msg - The Message instance
     * @param rawArgs - The collection of raw arguments
     */
    public async exec(msg: Message, rawArgs: string[]): Promise<void> {
        try {
            this.#cooldowns.set(getParticipant(msg)!, Date.now());
            const args = new ArgumentParser(msg, rawArgs, this.args).exec(this as unknown as Command);
            await this.#exec(msg, args);
        } catch (error) {
            this.#cooldowns.delete(getParticipant(msg)!);
            if (error instanceof CustomError) {
                const text = error.toLocalizeString(msg.localize);
                void msg.client.sock?.sendMessage(msg.key.remoteJid!, { text });
            } else if (error instanceof Error) {
                void msg.client.sock?.sendMessage(msg.key.remoteJid!, { text: error.message });
                msg.client.sock?.logger.error(error);
            }
        }
    }

    /**
     * To set the name for this command
     *
     * @param name - the command name
     */
    public setName(name: string): this {
        this.name = name;
        return this;
    }

    /**
     * To set the description for this command
     *
     * @param description - the description name
     */
    public setDescription(description: string | ((msg: Message) => string)): this {
        this.description = description;
        return this;
    }

    /**
     * To adding aliases to this command
     *
     * @param aliases - the aliases
     */
    public addAlias(...aliases: string[] | string[][]): this {
        this.aliases.push(...aliases.flat(2));
        return this;
    }

    /**
     * To adding argument to this command
     *
     * @param args - the Argument.Builder instance
     */
    public addArgument <A extends AddArgumentUnion[]>(...args: A): Command<[...Argument, ...MapCallBackBuilder<A>]> {
        this.args.push(...args.flat(2).map(x => (x instanceof Builder ? x : x(new Builder()))));
        return this as unknown as Command<[...Argument, ...MapCallBackBuilder<A>]>;
    }

    /**
     * To set the execution when this command get invoked
     *
     * @param fn - the execution function
     */
    public setExec(fn: (msg: Message, args: Convert<Argument>) => Promise<unknown>): this {
        this.#exec = fn as unknown as (...args: unknown[]) => Promise<unknown>;
        return this;
    }

    /**
     * To set the command only work for client owner
     *
     * @param value - the boolean to be set
     */
    public setOwnerOnly(value = true): this {
        this.ownerOnly = value;
        return this;
    }

    /**
     * To set cooldown for command
     *
     * @param value - time in milis
     */
    public setCooldown(value: number): this {
        this.cooldown = value;
        return this;
    }

    /**
     * To set spliter for argument parser
     *
     * @param value - set the spliter for Argument.Builder
     */
    public setSpliter(value: RegExp | string): this {
        this.spliter = value;
        return this;
    }

    /**
     * To get remaining cooldown
     *
     * @param participant - the remoteJid
     */
    public getCooldown(participant: string): number {
        const since = this.#cooldowns.get(participant) ?? 0;
        const cooldown = since + this.cooldown;
        const remain = cooldown - Date.now();
        if (remain < 1) {
            this.#cooldowns.delete(participant);
            return 0;
        }
        return remain;
    }
}
