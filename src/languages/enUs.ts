import { stripIndent } from "#wayz/lib/util/string";

const commands = {
    help: {
        description: "get a list of full command or single commnad",
        commandHelpAll(commandList: string): string {
            return stripIndent`
                Hello there ! how can i help you ?
                Please type one of these command to help your problem

                ${commandList}
            `;
        },
        commandHelpOne(name: string, description: string, argument: string): string {
            return stripIndent`
                Command: ${name}
                description: ${description}
                Arguments:
                ${argument}
            `;
        }
    },
    echo: {
        description: "say back what youve sayed"
    },
    eval: {
        description: "Evaluate Javascript Code"
    },
    language: {
        description: "set the current language",
        commandLanguageSet(lang: string): string {
            return `Language set to *${lang}*`;
        }
    },
    ping: {
        description: "check the bot if response or not"
    },
    hastebin: {
        description: "paste your text to haste server"
    }
};

const cmdExecutor = {
    cooldown(remain: string): string {
        return `Please wait patiently, you can use command in ${remain}`;
    }
};

const error = {
    argument: {
        less(expected: number, found: number): string {
            return `Argument is less than *${expected}*, found *${found}*`;
        },

        notmatch(type: string): string {
            return `Argument you provided isn't match with type *${type}*`;
        }
    },

    colllection: {
        notFound(from: string, where: string): string {
            return `Value *${where}* isn't found in *${from}*`;
        }
    }
};

export default {
    commands,
    cmdExecutor,
    error
};
