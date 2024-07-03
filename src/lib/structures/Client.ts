import { useMultiFileAuthState, makeWASocket, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import MainLogger from "@whiskeysockets/baileys/lib/Utils/logger.js";
import CommandLoader from "#wayz/lib/components/CommandLoader";
import EventLoader from "#wayz/lib/components/EventLoader";
import Localization from "#wayz/lib/components/Localization";

const logger = MainLogger.default.child({});

export type Option = {
    commandsPath: string;
    eventsPath: string;
    prefixes: string[];
    ownersPhoneNumber: string[];
    selfbot?: boolean;
};

export default class Client {
    public option;
    public commandLoader;
    public event;
    public constructor(option: Option) {
        this.option = option;
        this.commandLoader = new CommandLoader(option.commandsPath);
        this.event = new EventLoader(this, option.eventsPath);
    }

    public localization = new Localization();
    public logger = MainLogger.default.child({});
    public sock?: ReturnType<typeof makeWASocket>;

    public async init(): Promise<void> {
        await this.commandLoader.exec();
        await this.prepareSock();
        await this.event.exec();
    }

    public async reconnect(): Promise<void> {
        await this.prepareSock();
        await this.event.exec();
    }

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
