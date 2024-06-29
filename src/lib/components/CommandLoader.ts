import { opendir } from "node:fs/promises";
import path from "node:path";
import type { BuilderExtends } from "#wayz/lib/structures/ArgumentParserOption";
import Command from "#wayz/lib/structures/Command";

export default class CommandLoader {
    public stores = new Map<string, Command<BuilderExtends[]>>();

    #directory;
    public constructor(directory: string) {
        this.#directory = directory;
    }

    public async exec() {
        for await (const dir of this.walk(this.#directory)) await this.register(dir);
    }

    private async register(dir: string) {
        const imported = await import(dir.replace("src", "#wayz").replace(".ts", "").replaceAll("\\", "/"));
        if (imported.default instanceof Command) {
            for (const alias of imported.default.aliases) this.stores.set(alias, imported.default);
            this.stores.set(imported.default.name, imported.default);
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
