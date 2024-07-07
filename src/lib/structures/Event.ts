import type { BaileysEventMap } from "@whiskeysockets/baileys";
import type Client from "#wayz/lib/structures/Client";

/**
 * the event constructor
 */
export default class Event<T extends keyof BaileysEventMap> {
    /**
     * the name of the event
     */
    public name;

    public exec?: (client: Client, arg: BaileysEventMap[T]) => void;

    /**
     * to create new event instance
     *
     * @param name - the name of the event
     */
    public constructor(name: T) {
        this.name = name;
    }

    /**
     * to set the executed operation when event get invoked
     *
     * @param fn - the executed operation
     */
    public addExec(fn: (client: Client, arg: BaileysEventMap[T]) => void): this {
        this.exec = fn;
        return this;
    }
}
