import { opendir } from "node:fs/promises";
import path from "node:path";
import type { BuilderExtends } from "#wayz/lib/structures/ArgumentParserOption";
import Command from "#wayz/lib/structures/Command";

export default class CommandLoader {
    public stores = new Map<string, Command<BuilderExtends[]>>();

    readonly #directory;
    public constructor(directory: string) {
        this.#directory = directory;
    }

    public async exec(): Promise<void> {
        for await (const dir of this.walk(this.#directory)) await this.register(dir);
    }

    private replaceDir(dir: string): string {
        return dir
            .replace("src", "#wayz")
            .replace(".ts", "")
            .replaceAll("\\", "/");
    }

    private async register(dir: string): Promise<void> {
        const imported = await import(this.replaceDir(dir)) as { default: unknown; };
        if (imported.default instanceof Command) {
            const command = imported.default as Command;
            for (const alias of command.aliases) this.stores.set(alias, command);
            this.stores.set(command.name, command);
        }
    }

    private async * walk(directory: string): AsyncIterableIterator<string> {
        const dirs = await opendir(directory);
        for await (const item of dirs) {
            if (item.isFile()) yield path.join(directory, item.name);
            else if (item.isDirectory()) yield * this.walk(path.join(directory, item.name));
        }
    }
}
