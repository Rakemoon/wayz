type HasteDocsResponse = {
    POST: {
        key: string;
    };
};

/**
 * The hastebin server ive known so far
 * NOTE: Open pull request for adding more haste servers into this
 */
const hasteServers = ["hst.sh", "hastebin.skyra.pw"] as const;

/**
 * The Hastebin classes
 */
export default class Hastebin {
    readonly #text;

    #key?: string;
    #choosed?: typeof hasteServers[number];

    /**
     * Make Hastebin instance
     *
     * @param text - the text to be passed into hastebin server
     */
    public constructor(text: string) {
        this.#text = text;
    }

    /**
     * Create post request to passed the current text
     * into possible hastebin server
     */
    public async create(): Promise<void> {
        for await (const haste of hasteServers) {
            try {
                const response = await fetch(`https://${haste}/documents`, {
                    method: "POST",
                    body: this.#text
                });
                if (!response.ok) continue;
                const body = await response.json() as HasteDocsResponse["POST"];
                this.#choosed = haste;
                this.#key = body.key;
                break;
            } catch {
                continue;
            }
        }
    }

    /**
     * Make readable string
     *
     * @example
     * https://hasteb.in/<keycode>.js
     */
    public toString(extension = "js"): string {
        if (this.#key === undefined || this.#choosed === undefined) throw new ReferenceError("Use Hastebin#create first before make it to String");
        return `https://${this.#choosed}/${this.#key}.${extension}`;
    }
}
