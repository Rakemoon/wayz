import process from "node:process";
import Client from "#wayz/lib/structures/Client";

import "#wayz/lib/util/env";

const client = new Client({
    eventsPath: "./src/events",
    commandsPath: "./src/commands",
    prefixes: ["!", "wayz"],
    ownersPhoneNumber: [process.env.OWNER_BOT_1!],
    selfbot: true
});

process.on("unhandledRejection", error => client.logger.error(error));
process.on("uncaughtException", error => client.logger.error(error));

await client.init();
