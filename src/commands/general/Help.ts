import Command from "#wayz/lib/structures/Command";

const helpCommand = new Command()
    .setName("help")
    .setDescription("A help commnad")
    .addAlias("h")
    .setExec(async msg => {
        await msg.sock.sendMessage(msg.key.remoteJid!, { text: msg.localize.commands.help });
    });

export default helpCommand;
