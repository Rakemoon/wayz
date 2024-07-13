import { Buffer } from "node:buffer";
import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import Command from "#wayz/lib/structures/Command";
import { Nyxs, Telegraph } from "#wayz/lib/util/api";

export default new Command()
    .setName("into-anime")
    .addAlias("turn-anime")
    .setDescription("turn image youve sended into anime")
    .setCooldown(2 * 1e3)
    .setExec(async msg => {
        if (!msg.message?.imageMessage) throw new Error("Only image are allowed");
        const stream = await downloadContentFromMessage(msg.message.imageMessage, "image");
        const buffer = await bufferToStream(stream);
        const url = await new Telegraph("upload", {
            input: buffer,
            contentType: "image/jpeg"
        }).exec().then(x => x[0].src);
        const arrayBuffer = await new Nyxs("into-anime", { url }).exec();
        const image = Buffer.from(arrayBuffer);
        const strImage = image.toString();
        await (strImage.includes("Api nya lagi capek bang, coba lagi nanti yak. coba di check itu image link nya bener kagak") ||
            strImage.includes("<!DOCTYPE html>")
            ? msg.client.sock?.sendMessage(msg.key.remoteJid!, { text: "The server cannot process your image right now" })
            : msg.client.sock?.sendMessage(msg.key.remoteJid!, { image }));
    });

async function bufferToStream(stream: Awaited<ReturnType<typeof downloadContentFromMessage>>): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunk: Buffer[] = [];
        stream.on("data", x => chunk.push(x as Buffer));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunk)));
    });
}
