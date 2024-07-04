import Command from "#wayz/lib/structures/Command";

export default new Command()
    .setName("ping")
    .setDescription(msg => msg.localize.commands.ping.description)
    .setCooldown(5 * 1e3)
    .setExec(async msg => {
        const diff = Date.now();
        const message = await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text: "Ping...." });
        await msg.client.sock?.sendMessage(msg.key.remoteJid!, {
            text: `Pong ${Date.now() - diff}ms`,
            edit: message?.key
        });
    });
