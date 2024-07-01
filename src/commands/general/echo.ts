import Command from "#wayz/lib/structures/Command";

export default new Command()
    .setName("echo")
    .setDescription(msg => msg.localize.commands.echo.description)
    .addAlias("e", "say")
    .addArgument(build => build
        .setName("text")
        .setType("string")
        .setMatch("rest"))
    .setExec(async (msg, { text }) => {
        await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text });
    });
