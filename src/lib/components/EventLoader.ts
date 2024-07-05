import type Client from "#wayz/lib/structures/Client";
import Event from "#wayz/lib/structures/Event";
import { translate, walk } from "#wayz/lib/util/directory";

/**
 * Just event loader not much
 */
export default class EventLoader {
    public client;

    readonly #directory;

    /**
     * Create the new instance
     *
     * @param client - The client
     * @param directory - Path to the event files
     */
    public constructor(client: Client, directory: string) {
        this.client = client;
        this.#directory = directory;
    }

    /**
     * execute the operation
     */
    public async exec(): Promise<void> {
        for await (const dir of walk(this.#directory)) await this.register(dir);
    }

    /**
     * register the event
     *
     * @param directory - path to the event file
     */
    public async register(directory: string): Promise<void> {
        const imported = await import(translate(directory)) as { default: unknown; };
        if (imported.default instanceof Event) {
            const event = imported.default;
            if (event.exec) this.client.sock?.ev.on(event.name, event.exec.bind(event, this.client));
        }
    }
}
