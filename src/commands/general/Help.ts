import Command from "#wayz/lib/structures/Command";

export default new Command()
    .setName("help")
    .setDescription(msg => msg.localize.commands.help.description)
    .addAlias("h")
    .addArgument(build => build
        .setName("cmd")
        .setMatch("single")
        .setType("string")
        .setOptional())
    .setExec(async (msg, { cmd }) => {
        if (cmd === undefined) {
            const commmands = msg.client.commandLoader.stores.values();
            const formatDesc = (desc: Command["description"]): string => (typeof desc === "function" ? desc(msg) : desc);
            const visited = new Set<string>();
            let formated: string | undefined;
            for (const command of commmands) {
                if (visited.has(command.name)) continue;
                visited.add(command.name);
                const fmt = `- *${command.name}*: ${formatDesc(command.description)}`;
                if (formated === undefined) formated = fmt;
                else formated += `\n${fmt}`;
            }
            const text = msg.localize.commands.help.commandHelpAll(formated!);
            await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text });
        } else {
            await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text: `comming soon! ${cmd} ${cmd.length}` });
        }
    });
