import type { WAProto } from "@whiskeysockets/baileys";
import { getContentType } from "@whiskeysockets/baileys";
import type Client from "#wayz/lib/structures/Client";
import type Command from "#wayz/lib/structures/Command";

export function getParticipant(msg: WAProto.IWebMessageInfo): string | null | undefined {
    return msg.key.participant ?? msg.key.remoteJid;
}

export function getContentFromMsg(msg: WAProto.IWebMessageInfo): string {
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

export function getPrefixes(content: string, prefixes: string[]): string | undefined {
    for (const prefix of prefixes) if (content.startsWith(prefix)) return prefix;
    return undefined;
}

export function executedByOwner(ownersPhoneNumber: string[], remoteJid: string): boolean {
    for (const phoneNumber of ownersPhoneNumber) if (remoteJid.startsWith(phoneNumber)) return true;
    return false;
}

export function allowCommandTranspile(client: Client, msg: WAProto.IWebMessageInfo): boolean {
    const isSelfbot = client.option.selfbot ?? false;
    const isFromMe = msg.key.fromMe ?? false;

    if ((isSelfbot && !isFromMe) || (!isSelfbot && isFromMe)) return false;
    return true;
}

export function allowCommandExecuted(client: Client, msg: WAProto.IWebMessageInfo, command: Command): boolean {
    const participant = getParticipant(msg);
    if (command.ownerOnly && !executedByOwner(client.option.ownersPhoneNumber, participant!)) return false;
    return true;
}
