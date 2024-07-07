import type { Message } from "#wayz/lib/structures/Command";
import type Command from "#wayz/lib/structures/Command";
import Event from "#wayz/lib/structures/Event";
import { getParticipant, getContentFromMsg, getPrefixes, allowCommandExecuted, allowCommandTranspile } from "#wayz/lib/util/proto";

export default new Event("messages.upsert")
    .setExec((client, messages) => {
        if (messages.type !== "notify") return;
        for (const msg of messages.messages) {
            if (!allowCommandTranspile(client, msg)) continue;

            let content = getContentFromMsg(msg);
            const prefix = getPrefixes(content, client.option.prefixes);

            if (prefix === undefined) continue;

            content = content.slice(prefix.length);
            const [cmd, ...rawArgs] = content.trim().split(" ");
            const command = client.commandLoader.stores.get(cmd);

            if (!command?.exec) continue;

            if (!allowCommandExecuted(client, msg, command as Command)) continue;

            Reflect.set(msg, "client", client);
            Reflect.set(msg, "content", content);
            Reflect.set(msg, "localize", client.localization.getLocalization(msg.key.remoteJid!));
            Reflect.set(msg, "prefix", prefix);

            const message = msg as Message;
            const cooldown = command.getCooldown(getParticipant(message)!);

            if (cooldown > 0) {
                const text = message.localize.cmdExecutor.cooldown(`${cooldown}ms`);
                void message.client.sock?.sendMessage(message.key.remoteJid!, { text });
                continue;
            }

            void command.exec(message, rawArgs);
        }
    });
