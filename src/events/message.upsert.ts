import type { WAProto } from "@whiskeysockets/baileys";
import { getContentType } from "@whiskeysockets/baileys";
import type Client from "#wayz/lib/structures/Client";
import type { Message } from "#wayz/lib/structures/Command";
import type Command from "#wayz/lib/structures/Command";
import Event from "#wayz/lib/structures/Event";

export default new Event("messages.upsert")
    .addExec((client, messages) => {
        if (messages.type !== "notify") return;
        for (const msg of messages.messages) {
            if (!allowCommandTranspile(client, msg)) continue;

            let content = getContentFromMsg(msg);
            const prefix = getPrefixes(content, client.option.prefixes);

            if (prefix === undefined) continue;

            content = content.slice(prefix.length);
            const [cmd, ...rawArgs] = content.trim().split(" ");
            const command = client.commandLoader.stores.get(cmd);

            if (!command?.exec) continue;

            if (!allowCommandExecuted(client, msg, command as Command)) continue;

            Reflect.set(msg, "client", client);
            Reflect.set(msg, "content", content);
            Reflect.set(msg, "localize", client.localization.getLocalization(msg.key.remoteJid!));
            Reflect.set(msg, "prefix", prefix);

            void command.exec(msg as Message, rawArgs.join(" "));
        }
    });

function getPrefixes(content: string, prefixes: string[]): string | undefined {
    for (const prefix of prefixes) if (content.startsWith(prefix)) return prefix;
    return undefined;
}

function executedByOwner(ownersPhoneNumber: string[], remoteJid: string): boolean {
    for (const phoneNumber of ownersPhoneNumber) if (remoteJid.startsWith(phoneNumber)) return true;
    return false;
}

function allowCommandTranspile(client: Client, msg: WAProto.IWebMessageInfo): boolean {
    const isSelfbot = client.option.selfbot ?? false;
    const isFromMe = msg.key.fromMe ?? false;

    if ((isSelfbot && !isFromMe) || (!isSelfbot && isFromMe)) return false;
    return true;
}

function allowCommandExecuted(client: Client, msg: WAProto.IWebMessageInfo, command: Command): boolean {
    const participant = msg.key.participant ?? msg.key.remoteJid;
    if (command.ownerOnly && !executedByOwner(client.option.ownersPhoneNumber, participant!)) return false;
    return true;
}

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
