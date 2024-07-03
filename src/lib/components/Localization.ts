import enUs from "#wayz/languages/enUs";

type Langs = "enUs";

export type LocalizationLibrary = typeof enUs;

export default class Localization {
    #stores = new Map<string, Langs>();
    #defaultLang = "enUs";

    public addLanguage(jid: string, lang: Langs): void {
        this.#stores.set(jid, lang);
    }

    public getLanguage(jid: string): string {
        return this.#stores.get(jid) ?? this.#defaultLang;
    }

    public getLocalization(jid: string): typeof enUs {
        switch (this.getLanguage(jid)) {
            default: return enUs;
        }
    }
}
