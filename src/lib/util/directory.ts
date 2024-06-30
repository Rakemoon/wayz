import { opendir } from "node:fs/promises";
import path from "node:path";

export async function * walk(directory: string): AsyncIterableIterator<string> {
    const dirs = await opendir(directory);
    for await (const item of dirs) {
        if (item.isFile()) yield path.join(directory, item.name);
        else if (item.isDirectory()) yield * walk(path.join(directory, item.name));
    }
}

export function translate(dir: string): string {
    return dir
        .replace("src", "#wayz")
        .replace(".ts", "")
        .replaceAll("\\", "/");
}
