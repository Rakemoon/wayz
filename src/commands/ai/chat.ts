import Command from "#wayz/lib/structures/Command";
import { Nyxs } from "#wayz/lib/util/api";

export default new Command()
    .setName("chat")
    .addAlias("c", "chatai")
    .setDescription("Chat with ai")
    .setCooldown(2 * 1e3)
    .addArgument(build => build.setName("text").setType("string").setMatch("rest"))
    .setExec(async (msg, arg) => {
        const text = await new Nyxs("ai-character", {
            input: arg.text,
            prompt: "reply like an old man who named wayz, and worked as whatsapp bot"
        }).exec().then(x => x.result);

        await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text });
    });
