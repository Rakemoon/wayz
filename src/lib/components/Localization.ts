import enUs from "#wayz/languages/enUs";

type Langs = "enUs";

export default class Localization {
    #stores = new Map<string, Langs>();
    #defaultLang = "enUs";

    public addLanguage(jid: string, lang: Langs) {
        this.#stores.set(jid, lang);
    }

    public getLanguage(jid: string) {
        return this.#stores.get(jid) ?? this.#defaultLang;
    }

    public getLocalization(jid: string) {
        switch (this.getLanguage(jid)) {
            default: return enUs;
        }
    }
}
