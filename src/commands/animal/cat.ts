import Command from "#wayz/lib/structures/Command";

export default new Command()
    .setName("cat")
    .addAlias("car")
    .setDescription(msg => msg.localize.commands.cat.description)
    .setCooldown(2 * 1e3)
    .setExec(async msg => {
        const response = await fetch("https://random.cat").then(async x => x.text());
        const base = response.match(/(?!<img[^>]+)src="(?:[^">]+)"/gu)![0];
        const url = base.slice(5, -1);

        await msg.client.sock?.sendMessage(msg.key.remoteJid!, { image: { url } });
    });
