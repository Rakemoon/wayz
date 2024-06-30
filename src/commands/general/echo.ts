import { Builder } from "#wayz/lib/structures/ArgumentParserOption";
import Command from "#wayz/lib/structures/Command";

const firstArg = new Builder()
    .setName("echo")
    .setType("string")
    .setMatch("rest");

const sayCommand = new Command()
    .setName("echo")
    .setDescription("A command to make you say wow")
    .addAlias("e")
    .addAlias("say")
    .addArgument(firstArg)
    .setExec(async (msg, { echo }) => {
        await msg.sock.sendMessage(msg.key.remoteJid!, { text: echo });
    });

export default sayCommand;
