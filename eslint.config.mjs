import { common, stylistic, node, modules } from "@rakemoon/eslint-config";
import tseslint from "typescript-eslint";

export default tseslint.config(
    ...common,
    ...stylistic,
    ...modules,
    ...node,
    ...tseslint.configs.strict
);
