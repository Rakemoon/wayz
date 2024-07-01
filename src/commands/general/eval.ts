import { inspect } from "node:util";
import Command from "#wayz/lib/structures/Command";

export default new Command()
    .setName("eval")
    .setDescription("Evaluate Javascript Code")
    .addAlias("e", "ev", "code")
    .addArgument(build => build
        .setName("code")
        .setType("string")
        .setMatch("rest"))
    .setExec(async (msg, { code }) => {
        try {
            // eslint-disable-next-line typescript/no-unsafe-assignment, no-eval
            const result = await eval(code);
            await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text: inspect(result) });
        } catch (error) {
            await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text: (error as Error).toString() });
        }
    });
