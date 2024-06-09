import type ArgumentParserOption from "#wayz/lib/structures/ArgumentParserOption";

export default class ArgumentResult {
  public constructor(private argument: string, private type: keyof ArgumentParserOption.TypeCollection) {}

  public exec() {
    switch (this.type) {
      case "string": return this.parseString();
      case "number": return this.parseNumber();
    }
  }

  private parseString() {
    return this.argument;
  }

  private parseNumber() {
    const result = parseInt(this.argument);
    if (isNaN(result)) throw TypeError("ARGS_TYPE_ISNT_MATCH");
    return result;
  }
}
