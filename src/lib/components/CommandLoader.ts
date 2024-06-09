import { opendir } from "fs/promises";
import { join } from "path";
import Command from "#wayz/lib/structures/Command";

export default class CommandLoader {
  public stores = new Map<string, Command<any>>;

  public constructor(private directory: string) {}

  public async exec() {
    const dirs = await this.walk(this.directory);
    return await this.openfiles(dirs);
  }

  private async openfiles(dirs: string[]) {
    for (const dir of dirs) {
      const imported = await import(dir.replace("src", "#wayz").replace(".ts", "").replace(/\\/g, "/"));
      if (imported.default instanceof Command) this.stores.set(imported.default.name, imported.default);
    }
  }

  private async walk(directory: string) {
    const results: string[] = [];
    const dirs = await opendir(directory);

    loopdir:
    for await (const item of dirs) {
      switch(true) {
        case item.isFile(): results.push(join(directory, item.name)); break;
        case item.isDirectory(): results.push(...await this.walk(join(directory, item.name))); break;
        default: continue loopdir;
      }
    }
    return results;
  }
}
