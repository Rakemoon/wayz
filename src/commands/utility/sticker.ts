import Command from "#wayz/lib/structures/Command";

export default new Command()
    .setName("sticker")
    .addAlias("s")
    .setDescription("create image to sticker")
    .setCooldown(2 * 1e3)
    .addArgument(build => build
        .setName("image")
        .setType("string")
        .setMatch("single"))
    .setExec(async (msg, arg) => {
        await msg.client.sock?.sendMessage(msg.key.remoteJid!, { sticker: { url: arg.image } });
    });
