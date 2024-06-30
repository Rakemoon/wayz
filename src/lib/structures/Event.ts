import type { BaileysEventMap } from "@whiskeysockets/baileys";
import type Client from "#wayz/lib/structures/Client";

export default class Event<T extends keyof BaileysEventMap> {
    public name;
    public exec?: (client: Client, arg: BaileysEventMap[T]) => void;
    public constructor(name: T) {
        this.name = name;
    }

    public addExec(fn: (client: Client, arg: BaileysEventMap[T]) => void): this {
        this.exec = fn;
        return this;
    }
}
