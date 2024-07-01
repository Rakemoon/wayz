import type { WAProto } from "@whiskeysockets/baileys";
import { getContentType } from "@whiskeysockets/baileys";
import Event from "#wayz/lib/structures/Event";

export default new Event("messages.upsert")
    .addExec((client, messages) => {
        if (messages.type !== "notify") return;
        for (const msg of messages.messages) {
            if (msg.key.fromMe ?? false) {
                let content = getContentFromMsg(msg);
                if (content.startsWith("!")) {
                    content = content.slice(1);
                    const [cmd, ...rawArgs] = content.split(" ");
                    const command = client.commandLoader.stores.get(cmd);
                    Reflect.set(msg, "client", client);
                    Reflect.set(msg, "content", content);
                    Reflect.set(msg, "localize", client.localization.getLocalization(msg.key.remoteJid!));
                    if (command?.exec) void command.exec(msg as unknown, rawArgs.join(" "));
                }
            }
        }
    });

function getContentFromMsg(msg: WAProto.IWebMessageInfo): string {
    switch (getContentType(msg.message!)) {
        case "conversation": return msg.message?.conversation ?? "";
        case "imageMessage": return msg.message?.imageMessage?.caption ?? "";
        case "documentMessage": return msg.message?.documentMessage?.caption ?? "";
        case "videoMessage": return msg.message?.videoMessage?.caption ?? "";
        case "extendedTextMessage": return msg.message?.extendedTextMessage?.text ?? "";
        case "listResponseMessage": return msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ?? "";
        case "buttonsMessage": return msg.message?.buttonsResponseMessage?.selectedButtonId ?? "";
        case "templateButtonReplyMessage": return msg.message?.templateButtonReplyMessage?.selectedId ?? "";
        default: return "";
    }
}
