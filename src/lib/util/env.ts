/**
 * Most likely to import environtment variable from .env file,
 * that located on root project
 *
 * Just use simple notation
 *
 * @example
 * ```ts
 * import "#wayz/lib/util/env"
 * ```
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const buffer = await readFile(path.join(import.meta.dirname, "../../../.env"));
const envsData = buffer.toString().split("\n");
for (const raw of envsData) {
    const [env, ...values] = raw.split("=");
    Reflect.set(process.env, env, values.join("=").replaceAll(/^["']|["']$/gu, ""));
}
