import enUs from "#wayz/languages/enUs";
import idId from "#wayz/languages/idId";

type Langs = "enUs" | "idId";

export type LocalizationLibrary = typeof enUs;

export default class Localization {
    #stores = new Map<string, Langs>();
    #defaultLang = "enUs" as Langs;

    public addLanguage(jid: string, lang: Langs): void {
        this.#stores.set(jid, lang);
    }

    public getLanguage(jid: string): Langs {
        return this.#stores.get(jid) ?? this.#defaultLang;
    }

    public getLocalization(jid: string): LocalizationLibrary {
        switch (this.getLanguage(jid)) {
            case "idId": return idId;
            default: return enUs;
        }
    }
}
