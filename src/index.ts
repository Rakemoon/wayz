import process from "node:process";
import Client from "#wayz/lib/structures/Client";

const client = new Client();

process.on("unhandledRejection", error => client.logger.error(error));
process.on("uncaughtException", error => client.logger.error(error));

await client.init();
