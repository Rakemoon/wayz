import {
    useMultiFileAuthState,
    makeWASocket,
    makeCacheableSignalKeyStore,
    getContentType,
    WAProto,
    DisconnectReason,
    proto
} from "@whiskeysockets/baileys";
import MainLogger from "@whiskeysockets/baileys/lib/Utils/logger.js";
import ArgumentParser from "#wayz/lib/components/ArgumentParser";
import CommandLoader from "#wayz/lib/components/CommandLoader";

const logger = MainLogger.default.child({});

export async function connectToWhatsapp() {
    const commandLoader = new CommandLoader("./src/commands");
    await commandLoader.exec();
    const { state, saveCreds } = await useMultiFileAuthState("baileys_auth_info");
    const sock = makeWASocket({
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", update => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = (lastDisconnect?.error as unknown as { output: { statusCode: number; }; }).output.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWhatsapp();
        } else if (connection === "open") {
            console.log("Connection Open");
        }
    });

    sock.ev.on("messages.upsert", messages => {
        if (messages.type !== "notify") return;
        for (const msg of messages.messages) {
            if (msg.key.fromMe) {
                let content = getContentFromMsg(msg);
                if (content?.startsWith("!")) {
                    content = content.slice(1);
                    const [cmd, ...rawArgs] = content.split(" ");
                    const command = commandLoader.stores.get(cmd);
                    Reflect.set(msg, "sock", sock);
                    Reflect.set(msg, "content", content);
                    if (command && command.exec) {
                        const args = new ArgumentParser(rawArgs.join(" "), command.args).exec();
                        /* eslint-disable promise/prefer-await-to-then */
                        command.exec(msg as unknown, args).catch(console.error);
                    }
                }
            }
        }
    });
}

function getContentFromMsg(msg: WAProto.IWebMessageInfo) {
    switch (getContentType(msg.message as proto.IMessage)) {
        case "conversation": return msg.message?.conversation;
        case "imageMessage": return msg.message?.imageMessage?.caption;
        case "documentMessage": return msg.message?.documentMessage?.caption;
        case "videoMessage": return msg.message?.videoMessage?.caption;
        case "extendedTextMessage": return msg.message?.extendedTextMessage?.text;
        case "listResponseMessage": return msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId;
        case "buttonsMessage": return msg.message?.buttonsResponseMessage?.selectedButtonId;
        case "templateButtonReplyMessage": return msg.message?.templateButtonReplyMessage?.selectedId;
        default: return "";
    }
}
