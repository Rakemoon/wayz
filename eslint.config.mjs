import { common, stylistic, node, modules } from "@rakemoon/eslint-config";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/*"
        ]
    },
    ...common,
    ...stylistic,
    ...modules,
    ...node,
    ...tseslint.configs.strict
);
