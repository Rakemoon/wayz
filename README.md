# wayz

A ~~Multipurposes whatsapp bot~~ built on top of [@whiskeysockets/baileys]
written in [Typescript]

## Features

- **Command Handler**: done by [CommandLoader] it will watch command file on command path recursively.
- **Event Handler**: done by [EventLoader] it will watch event file on event path recursively.
- **Argument Parser**: done by [ArgumentParser] it will iterate your payload to parse the message argument.
- **Command Based**: the [Command] structures allow you to config your command as much as you want it to be.
- **Localization**: done by [Localization] it will check through the languages dir to match remoteJid prefered language.
- **Type Safety**: thanks to [Typescript] Turing Completed type system, it allow to write complex type to enforces type safety.
- **Code Lint**: done by [Eslint] as linter and formatter by config [@rakemoon/eslint-config]

## Project structures

```ls
src\
| -- commands\          # collections of commands files
| -- events\            # collections of event files
| -- languages\         # collections of languages
| -- lib\
      | -- components\  # collections of components for run the task
      | -- structures\  # a classes based structures for creating new instance
      | -- util\        # and utilities stuff for many things.
```

## Setup

### Requirements

- [Node.JS]: Javascript runtime to run the project.
- [Bun]: For dependencies management soon we will use this as runtime too.

### Installing Dependencies

```bash
bun install
```

### Compile

Because [Node.JS] only support Javascript, we must compile `.ts` file into `.js`.

```bash
bun run build
```

### Running

```bash
bash run start
```

## Development

### Initializing Client

Its simple as piece of cake you can define it like this.

```ts
import Client from "#wayz/lib/structures/Client";

const client = new Client({
    // path to event files
    eventsPath: "./src/events",

    // path to command files
    commandsPath: "./src/commands",

    // collections of client prefix
    prefixes: ["!", "wayz"],

    // collections of owners phone number
    // exp: 6288xxxxxxx22
    ownersPhoneNumber: [process.env.BOTS_OWNER_1!],

    // are yourselft going to be a bot or another acccount ?
    // when its set to true, that mean your account will run the client
    // and it will just replying to your command
    // good for selft use when you dont have any phone numbers
    selfbot: true
});

// then use Client#init to initialize the client
await client.init();
```

### Creating Command

You can create the command in your command path and magically it will be watched by [CommnadLoader]

Example:

```ts
// Import the structure from structures collections
import Command from "#wayz/lib/structures/Command";

// This function allow you to omit some whitespace from template literal string
import { stripIndent } from "#wayz/lib/util/string";

// we initialice new instance Command and export it as default import
// NOTE: CommandLoader will not recognice it if itsn't imported as default
export default new Command()
    .setName("addition") // We set the command name, the command will invoked by the name.
    .setDescription("add between two numbers") // Add the description to display in help command.
    .addAlias("add", "a") // Add aliases or short-hand to invoke the command.
    .setCooldown(5 * 1_000) // the set cooldown recive time in milis. so user can use this command if 5 seconds has passed.
    .setOwnerOnly(false) // Is command just want invoked by owners ? if yes set it to true
    .addArgument([  // adding argument, this can recieve function with parameter Argument.Builder or the Argument.Builder instance itself
        build => build
            .setName("numberOne") //set the key to the numberOne
            .setType("number") // set the type to number
            .setMatch("single") // set the match to single
            .setOptional(false), // set as mandatory
        build => build
            .setName("numberTwo")
            .setType("number")
            .setMatch("single")
            .setOptional(false)
    ])
    .setExec(async (msg, args) => { // this recive function with parameter Message and Argument we've defined earliear.
        // addition between two arguments
        const result = args.numberOne + args.numberTwo;

        // this text we will send.
        const text = stripIndent`
            You've running the holy \`additon\` command!
            So the additon of *${args.numberOne}* by *${args.numberTwo}*,
            is equal to *${result}*

            > ${args.numberOne} + ${args.numberTwo} = ${result}
        `;

        //send it!
        await msg.client.sock?.sendMessage(msg.key.remoteJid!, { text });
    })
```



[@whiskeysockets/baileys]:  https://github.com/WhiskeySockets/Baileys
[Typescript]:               https://www.typescriptlang.org/
[CommandLoader]:            src/lib/components/CommandLoader.ts
[EventLoader]:              src/lib/components/EventLoader.ts
[ArgumentParser]:           src/lib/components/ArgumentParser.ts
[Command]:                  src/lib/structures/Command.ts
[Localization]:             src/lib/components/Localization.ts
[Eslint]:                   https://eslint.org/
[@rakemoon/eslint-config]:  https://www.npmjs.com/package/@rakemoon/eslint-config
