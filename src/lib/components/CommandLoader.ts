import type { BuilderExtends } from "#wayz/lib/structures/ArgumentParserOption";
import Command from "#wayz/lib/structures/Command";
import { walk, translate } from "#wayz/lib/util/directory";

/**
 * Just a command loader not much
 */
export default class CommandLoader {
    /**
     * A command stores to stores registered commands
     */
    public stores = new Map<string, Command<BuilderExtends[]>>();

    readonly #directory;

    /**
     * Initialize new command loader
     *
     * @param directory - path to command directory
     */
    public constructor(directory: string) {
        this.#directory = directory;
    }

    /**
     * execute the load operation
     */
    public async exec(): Promise<void> {
        for await (const dir of walk(this.#directory)) await this.register(dir);
    }

    /**
     * To registering the command to the `{@link CommandLoader#stores}`
     *
     * @param dir - the path to command file
     */
    private async register(dir: string): Promise<void> {
        const imported = await import(translate(dir)) as { default: unknown; };
        if (imported.default instanceof Command) {
            const command = imported.default as Command;
            for (const alias of command.aliases) this.stores.set(alias, command);
            this.stores.set(command.name, command);
        }
    }
}
