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
    }
};

const cmdExecutor = {
    cooldown(remain: string): string {
        return `Please wait patiently, you can use command in ${remain}`;
    }
};

export default {
    commands,
    cmdExecutor
};
