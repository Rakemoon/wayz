import { readFile } from "node:fs/promises";
import process from "node:process";

const buffer = await readFile("./.env");
const envsData = buffer.toString().split("\n");
for (const raw of envsData) {
    const [env, ...values] = raw.split("=");
    Reflect.set(process.env, env, values.join("="));
}
