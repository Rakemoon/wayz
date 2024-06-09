import ArgumentParserOption from "#wayz/lib/structures/ArgumentParserOption";
import ArgumentResult from "#wayz/lib/structures/ArgumentResult";
import type { UnionToTuple } from "#wayz/lib/util/TypeUtility"

export default class ArgumentParser<T extends ArgumentParserOption.Builder<any, any, any, any>[]> {
  private separator = " ";
  public constructor(private raw: string, private payload: T) {}

  public exec() {
    const args = this.raw.split(this.separator);
    const results: Record<string, unknown> = {};
    for (const payload of this.payload) {
      if (args.length < 1 && !payload.optional) throw Error("ARGS_LESS");
      const arg: string[] = [];
      switch(payload.match) {
        case "rest": while(args.length) arg.push(args.shift()!); break;
        case "single": arg.push(args.shift()!); break;
      }
      results[payload.name] = new ArgumentResult(arg.join(" "), payload.type).exec();
    }
    return results as ArgumentParserOption.Convert<T extends Array<infer U> ? UnionToTuple<U> : never>;
  }
}
