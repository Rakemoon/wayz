export function stripIndent<T extends unknown[]>(template: TemplateStringsArray, ...values: T): string {
    return String.raw(template, ...values)
        .split("\n")
        .map(x => x.trim())
        .join("\n")
        .replaceAll(/^\n|\n$/gu, "");
}

export function oneLineMerge<T extends unknown[]>(template: TemplateStringsArray, ...values: T): string {
    return String.raw(template, ...values)
        .split("\n")
        .map(x => x.trim())
        .join("");
}
