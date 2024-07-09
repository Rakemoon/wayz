import { oneLineMerge } from "#wayz/lib/util/string";

export type NyxsPathRequest = {
    "ai-character": {
        payload: {
            input: string;
            prompt: string;
        };
        response: {
            result: string;
        };
    };
};

export default class NyxsApi<Path extends keyof NyxsPathRequest> {
    readonly #baseUrl = "https://api.nyxs.pw/";

    private readonly path;
    private readonly input;
    public constructor(path: Path, input: NyxsPathRequest[Path]["payload"]) {
        this.path = path;
        this.input = input as Record<string, string>;
    }

    public async exec(): Promise<NyxsPathRequest[Path]["response"]> {
        switch (this.path) {
            case "ai-character": return this.AiCharacter(this.input.input, this.input.prompt);
            default: throw new Error("Not found");
        }
    }

    private async AiCharacter(input: string, prompt: string): Promise<NyxsPathRequest[Path]["response"]> {
        const uri = oneLineMerge`
            ai/character-ai
            ?prompt=${encodeURIComponent(input)}
            &gaya=${encodeURIComponent(prompt)}
        `;
        const response = await this.fetch(uri);
        return response.json() as Promise<NyxsPathRequest[Path]["response"]>;
    }

    // eslint-disable-next-line no-undef
    private async fetch(path: string, init?: FetchRequestInit): Promise<Response> {
        return fetch(this.#baseUrl + path, init);
    }
}
