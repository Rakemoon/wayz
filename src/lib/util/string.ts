/**
 * trim indentation in template literal strings
 *
 * @example
 * ```ts
 * import { stripIndent } from "#wayz/lib/util/string";
 *
 * const str = stripIndent`
 *  Oh my string
 *  You can write like this
 *  and ignore the indentation
 * `;
 * ```
 */
export function stripIndent<T extends unknown[]>(template: TemplateStringsArray, ...values: T): string {
    return String.raw(template, ...values)
        .split("\n")
        .map(x => x.trim())
        .join("\n")
        .replaceAll(/^\n|\n$/gu, "");
}

/**
 * to ignore the lf and make in one liner
 *
 * @example
 * ```ts
 * import { oneLineMerge } from "#wayz/lib/util/string";
 *
 * const str = oneLineMerge`
 *  Merge
 *  The
 *  String
 * `
 *
 * // will return into
 * // "MergeTheString"
 * ```
 */
export function oneLineMerge<T extends unknown[]>(template: TemplateStringsArray, ...values: T): string {
    return String.raw(template, ...values)
        .split("\n")
        .map(x => x.trim())
        .join("");
}
