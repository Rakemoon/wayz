import type { BuilderExtends } from "#wayz/lib/structures/ArgumentParserOption";
import Command from "#wayz/lib/structures/Command";
import { walk, translate } from "#wayz/lib/util/directory";

export default class CommandLoader {
    public stores = new Map<string, Command<BuilderExtends[]>>();

    readonly #directory;
    public constructor(directory: string) {
        this.#directory = directory;
    }

    public async exec(): Promise<void> {
        for await (const dir of walk(this.#directory)) await this.register(dir);
    }

    private async register(dir: string): Promise<void> {
        const imported = await import(translate(dir)) as { default: unknown; };
        if (imported.default instanceof Command) {
            const command = imported.default as Command;
            for (const alias of command.aliases) this.stores.set(alias, command);
            this.stores.set(command.name, command);
        }
    }
}
