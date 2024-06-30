import { common, stylistic, node, modules, typescript, ignores } from "@rakemoon/eslint-config";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [...ignores, ...common, ...modules, ...node, ...stylistic, {
    ...typescript[0],
    rules: {
        ...typescript[0].rules,
        "typescript/no-non-null-assertion": "off"
    }
}];
