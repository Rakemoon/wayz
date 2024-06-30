import { useMultiFileAuthState, makeWASocket, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import MainLogger from "@whiskeysockets/baileys/lib/Utils/logger.js";
import CommandLoader from "#wayz/lib/components/CommandLoader";
import Localization from "#wayz/lib/components/Localization";
import EventLoader from "#wayz/lib/components/EventLoader";

const logger = MainLogger.default.child({});

export default class Client {
    public commandLoader = new CommandLoader("./src/commands");
    public localization = new Localization();
    public logger = MainLogger.default.child({});
    public event = new EventLoader(this, "./src/events");

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
