import ArgumentParserOption from "./ArgumentParserOption.ts";

export default class Command
<
Argument extends ArgumentParserOption.Builder<any, any, any, any>[] = []
> {
  public name: string = "";
  public aliases: string[] = [];
  public description: string = "";
  public args: Argument = [] as unknown as Argument;
  public exec: unknown;

  public setName(name: string) {
    this.name = name;
    return this;
  }

  public setDescription(description: string) {
    this.description = description;
    return this;
  }

  public addAlias(alias: string) {
    this.aliases.push(alias);
    return this;
  }

  public addArgument<T extends ArgumentParserOption.Builder<any, any, any, any>>
  (build: T) {
    this.args.push(build);
    return this as unknown as Command<[...Argument, T]>;
  }

  public setExec(callback: (msg: null, args: ArgumentParserOption.Convert<Argument>) => any) {
    this.exec = callback;
    return this;
  }
}
