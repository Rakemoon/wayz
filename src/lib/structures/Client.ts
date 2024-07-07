import { useMultiFileAuthState, makeWASocket, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import MainLogger from "@whiskeysockets/baileys/lib/Utils/logger.js";
import CommandLoader from "#wayz/lib/components/CommandLoader";
import EventLoader from "#wayz/lib/components/EventLoader";
import Localization from "#wayz/lib/components/Localization";

const logger = MainLogger.default.child({});

/**
 * the client option type
 */
export type Option = {
    commandsPath: string;
    eventsPath: string;
    prefixes: string[];
    ownersPhoneNumber: string[];
    selfbot?: boolean;
};

/**
 * the client constructor
 */
export default class Client {
    /**
     * this client `Option`
     */
    public option;

    /**
     * this client `CommandLoader`
     */
    public commandLoader;

    /**
     * this client `EventLoader`
     */
    public event;

    /**
     * To create new client instance
     *
     * @param option - the client option
     */
    public constructor(option: Option) {
        this.option = option;
        this.commandLoader = new CommandLoader(option.commandsPath);
        this.event = new EventLoader(this, option.eventsPath);
    }

    /**
     * this client localization
     */
    public localization = new Localization();

    /**
     * this client logger
     */
    public logger = MainLogger.default.child({});

    /**
     * this client whatsapp socket
     */
    public sock?: ReturnType<typeof makeWASocket>;

    /**
     * to initialize the client
     */
    public async init(): Promise<void> {
        await this.commandLoader.exec();
        await this.prepareSock();
        await this.event.exec();
    }

    /**
     * to reconnect the client
     */
    public async reconnect(): Promise<void> {
        await this.prepareSock();
        await this.event.exec();
    }

    /**
     * to preparing whatsapp socket
     */
    private async prepareSock(): Promise<void> {
        const { state, saveCreds } = await useMultiFileAuthState("baileys_auth_info");
        this.sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger)
            },
            printQRInTerminal: true
        });
        this.sock.ev.on("creds.update", saveCreds);
    }
}
