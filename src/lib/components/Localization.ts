import enUs from "#wayz/languages/enUs";
import idId from "#wayz/languages/idId";

type Langs = "enUs" | "idId";

/**
 * Default type for all the definition
 * infered from default language
 */
export type LocalizationLibrary = typeof enUs;

/**
 * Just Localization handling
 */
export default class Localization {
    /**
     * the stores for prefered language
     */
    #stores = new Map<string, Langs>();

    /**
     * the default language if jid didnt exist in stores
     */
    #defaultLang = "enUs" as Langs;

    /**
     * add prefered language chosed by jid into stores
     *
     * @param jid - the remoteJid
     * @param lang - the prefered language
     */
    public addLanguage(jid: string, lang: Langs): void {
        this.#stores.set(jid, lang);
    }

    /**
     * get prefered language from the stores
     *
     * @param jid - the remoteJid
     */
    public getLanguage(jid: string): Langs {
        return this.#stores.get(jid) ?? this.#defaultLang;
    }

    /**
     * get localization library
     *
     * @param jid - the remoteJid
     */
    public getLocalization(jid: string): LocalizationLibrary {
        switch (this.getLanguage(jid)) {
            case "idId": return idId;
            default: return enUs;
        }
    }
}
