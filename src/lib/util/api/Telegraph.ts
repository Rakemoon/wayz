import type { Buffer } from "node:buffer";

export type TelegraphPathRequest = {
    upload: {
        payload: { input: Buffer; contentType: string; };
        response: { src: string; }[];
    };
};

export default class TelegraphApi<Path extends keyof TelegraphPathRequest> {
    readonly #baseUrl = "https://telegra.ph/";

    private readonly path;
    private readonly input;
    public constructor(path: Path, input: TelegraphPathRequest[Path]["payload"]) {
        this.path = path;
        this.input = input;
    }

    public async exec(): Promise<TelegraphPathRequest[Path]["response"]> {
        switch (this.path) {
            case "upload": return this.upload();
            default: throw new Error("Not found");
        }
    }

    private async upload(): Promise<TelegraphPathRequest[Path]["response"]> {
        const payload = this.input as unknown as TelegraphPathRequest["upload"]["payload"];
        const body = new FormData();
        body.append("photo", new Blob([payload.input], { type: payload.contentType }), "blob");
        const response = await this.fetch("upload", {
            method: "POST",
            body
        });

        const res = await response.json() as TelegraphPathRequest[Path]["response"];
        return res.map(x => ({ src: x.src.replace("/", this.#baseUrl) }));
    }

    // eslint-disable-next-line no-undef
    private async fetch(path: string, init?: FetchRequestInit): Promise<Response> {
        return fetch(this.#baseUrl + path, init);
    }
}
