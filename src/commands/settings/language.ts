import Command from "#wayz/lib/structures/Command";

export default new Command()
    .setName("language")
    .setDescription(msg => msg.localize.commands.language.description)
    .addAlias("localization", "lang", "loc")
    .addArgument(build => build
        .setName("lang")
        .setType("string")
        .setMatch("rest")
        .setOptional())
    .setExec(async (msg, arg) => {
        if (arg.lang === undefined) {
            const text = msg.client.localization.getLanguage(msg.key.remoteJid!);
            await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text });
        } else {
            msg.client.localization.addLanguage(msg.key.remoteJid!, arg.lang as "idId");
            const text = msg.localize.commands.language.commandLanguageSet(arg.lang);
            await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text });
        }
    });
