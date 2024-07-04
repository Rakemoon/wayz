import Command from "#wayz/lib/structures/Command";
import { Hastebin } from "#wayz/lib/util/api";

export default new Command()
    .setName("hastebin")
    .setDescription(msg => msg.localize.commands.hastebin.description)
    .addAlias("haste")
    .setCooldown(5 * 1e4)
    .addArgument(build => build
        .setName("haste")
        .setType("string")
        .setMatch("rest"))
    .setExec(async (msg, arg) => {
        const haste = new Hastebin(arg.haste);
        await haste.create();
        await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text: haste.toString() });
    });
