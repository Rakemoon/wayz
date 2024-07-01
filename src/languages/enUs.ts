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
        }
    },
    echo: {
        description: "say back what youve sayed"
    }
};

export default {
    commands
};
