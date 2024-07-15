import { oneLineMerge } from "#wayz/lib/util/string";

export type NyxsPathRequest = {
    "ai-character": {
        payload: {
            input: string;
            prompt: string;
        };
        response: { result: string; };
    };
    "into-anime": {
        payload: {
            url: string;
        };
        response: ArrayBuffer;
    };
};

/**
 * The Nyxs Api class
 */
export default class NyxsApi<Path extends keyof NyxsPathRequest> {
    readonly #baseUrl = "https://api.nyxs.pw/";

    private readonly path;
    private readonly input;

    /**
     * To create new instance of NyxsApi
     *
     * @param path - The path to be used
     * @param input - The input to be used
     */
    public constructor(path: Path, input: NyxsPathRequest[Path]["payload"]) {
        this.path = path;
        this.input = input as Record<string, string>;
    }

    /**
     * Create request based on current path and input
     */
    public async exec(): Promise<NyxsPathRequest[Path]["response"]> {
        switch (this.path) {
            case "ai-character": return this.AiCharacter(this.input.input, this.input.prompt);
            case "into-anime": return this.IntoAnime(this.input.url);
            default: throw new Error("Not found");
        }
    }

    /**
     * Path for `ai-character`
     * chat with ai based on characted yove prompted
     *
     * @param input - The input text
     * @param prompt - The prompt to shape the character
     */
    private async AiCharacter(input: string, prompt: string): Promise<NyxsPathRequest[Path]["response"]> {
        const uri = oneLineMerge`
            ai/character-ai
            ?prompt=${encodeURIComponent(input)}
            &gaya=${encodeURIComponent(prompt)}
        `;
        const response = await this.fetch(uri);
        return response.json() as Promise<NyxsPathRequest[Path]["response"]>;
    }

    /**
     * Path for `into-anime`
     * animeify your image
     *
     * @param url - the url image
     */
    private async IntoAnime(url: string): Promise<NyxsPathRequest[Path]["response"]> {
        const uri = oneLineMerge`
            ai-image/jadianime
            ?url=${encodeURIComponent(url)}
        `;
        const response = await this.fetch(uri);
        return response.arrayBuffer() as Promise<NyxsPathRequest[Path]["response"]>;
    }

    // eslint-disable-next-line no-undef
    private async fetch(path: string, init?: FetchRequestInit): Promise<Response> {
        return fetch(this.#baseUrl + path, init);
    }
}
