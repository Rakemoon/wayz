import { DisconnectReason } from "@whiskeysockets/baileys";
import Event from "#wayz/lib/structures/Event";

export default new Event("connection.update")
    .addExec((client, update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const error = lastDisconnect?.error as unknown as {
                output?: {
                    statusCode?: number;
                };
            } | undefined;
            const shouldReconnect = error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) void client.reconnect();
        } else if (connection === "open") {
            client.logger.info("Connection On");
        }
    });
