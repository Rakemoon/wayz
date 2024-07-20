import process from "node:process";
import type { DefineUnionNumber } from "#wayz/lib/util/TypeUtility";

let CachedToken: Token | undefined;

export type Token = {
    value: string;
    type: string;
    expire: number;
};

export type TrackArtist = {
    id: string;
};

export type TrackFiles = {
    id: string;
    format: string;
    quality: string;
    node: string;
};

export type Track = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    images: string[];
    duration: number;
    isrc?: string;
    artists: TrackArtist[];
    files: TrackFiles[];
};

export type TrackStreamUrl = {
    createdAt: Date;
    updatedAt: Date;
    format: string;
    quality: number;
    url: string;
    expiredAt: number;
};

export type ErrorResponse = {
    statusCode?: number;
    error?: string;
    message?: string;
};

export default class GroovieApi {
    readonly #baseUrl;
    readonly #secret;
    readonly #clientid;
    public constructor(options?: { baseUrl?: string; secret?: string; clientid?: string; }) {
        this.#baseUrl = options?.baseUrl ?? "https://api.groovies.my.id/";
        this.#secret = options?.secret ?? process.env.GROOVIE_SECRET!;
        this.#clientid = options?.clientid ?? process.env.GROOVIE_CLIENTID!;
    }

    public async getTrackInfo(id: string): Promise<ErrorResponse & Track> {
        const raw = await this.fetch(`tracks/${id}`).then(async x => x.json());
        const data = Reflect.get(raw as object, "data") as object | undefined;
        return (data === undefined ? raw : this.serializeTrack(data)) as Track;
    }

    public async searchTracks(query: string): Promise<ErrorResponse & Omit<Track, "files">[]> {
        const raw = await this.fetch("tracks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        }).then(async x => x.json());
        const data = Reflect.get(raw as object, "data") as { tracks: object[]; } | undefined;
        return (data === undefined ? raw : data.tracks.map(x => this.serializeTrack(x))) as Track[];
    }

    public async getRandomTracks<N extends number = 10>(amount = 10 as N): Promise<N extends DefineUnionNumber<10> ? never : ErrorResponse & Omit<Track, "files">[]> {
        const raw = await this.fetch(`tracks/random?limit=${amount}`).then(async x => x.json());
        const data = Reflect.get(raw as object, "data") as { tracks: object[]; } | undefined;
        return (data === undefined ? raw : data.tracks.map(x => this.serializeTrack(x))) as never;
    }

    public async resolveTrack(id: string): Promise<TrackStreamUrl> {
        const raw = await this.fetch(`tracks/storage-resolver?/${id}`).then(async x => x.json());
        const data = Reflect.get(raw as object, "data") as object[] | undefined;
        return (data === undefined ? raw : this.serializeTrackStreamUrl(data)) as never;
    }

    private async syncToken(): Promise<void> {
        const now = Date.now();
        if ((CachedToken?.expire ?? 0) > now) return;
        const raw = await fetch(`${this.#baseUrl}token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clientId: this.#clientid,
                secret: this.#secret
            })
        }).then(async x => x.json());
        const data = Reflect.get(raw as object, "data") as object | undefined;
        if (!data) return;
        // eslint-disable-next-line require-atomic-updates
        CachedToken = {
            expire: now + Reflect.get(data, "expires_in") as number,
            type: Reflect.get(data, "type") as string,
            value: Reflect.get(data, "access_token") as string
        };
    }

    private serializeTrackStreamUrl(data: object): TrackStreamUrl {
        return {
            createdAt: new Date(Reflect.get(data, "created_at") as string),
            updatedAt: new Date(Reflect.get(data, "updated_at") as string),
            url: Reflect.get(data, "url") as string,
            format: Reflect.get(data, "format") as string,
            quality: Reflect.get(data, "quality") as number,
            expiredAt: Reflect.get(data, "expired_at") as number
        };
    }

    private serializeTrack(data: object): Track {
        return {
            id: Reflect.get(data, "id") as string,
            createdAt: new Date(Reflect.get(data, "created_at") as string),
            updatedAt: new Date(Reflect.get(data, "updated_at") as string),
            title: Reflect.get(data, "title") as string,
            images: Reflect.get(data, "images") as string[],
            duration: Reflect.get(data, "duration") as number,
            isrc: Reflect.get(data, "isrc") as string,
            files: Reflect.get(data, "files") as TrackFiles[],
            artists: Reflect.get(data, "artists") as TrackArtist[]
        };
    }

    // eslint-disable-next-line no-undef
    private async fetch(path: string, init?: FetchRequestInit): Promise<Response> {
        await this.syncToken();
        return fetch(this.#baseUrl + path, {
            ...init,
            headers: {
                ...init?.headers,
                Authorization: `Bearer ${CachedToken?.value}`
            }
        });
    }
}
