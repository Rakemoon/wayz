import ArgumentParserOption from "#wayz/lib/structures/ArgumentParserOption";
import Command from "#wayz/lib/structures/Command";

const firstArg = new ArgumentParserOption.Builder()
  .setName("wowl")
  .setType("string")
  .setMatch("rest");

const helpCommand = new Command()
  .setName("help")
  .setDescription("A help command")
  .addAlias("h")
  .addArgument(firstArg)
  .setExec((msg, args) => {
    args.wowl
  });

export default helpCommand;
