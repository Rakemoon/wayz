type HasteDocsResponse = {
    POST: {
        key: string;
    };
};

const hasteServers = ["hst.sh", "hastebin.skyra.pw"] as const;

export default class Hastebin {
    readonly #text;

    #key?: string;
    #choosed?: typeof hasteServers[number];
    public constructor(text: string) {
        this.#text = text;
    }

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

    public toString(extension = "js"): string {
        if (this.#key === undefined || this.#choosed === undefined) throw new ReferenceError("Use Hastebin#create first before make it to String");
        return `https://${this.#choosed}/${this.#key}.${extension}`;
    }
}
