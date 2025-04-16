import js from "@eslint/js";
import globals from "globals";
import pluginQuery from "@tanstack/eslint-plugin-query";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist", "coverage"] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            "plugin:@tanstack/eslint-plugin-query/recommended",
        ],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "@tanstack/query": pluginQuery,
        },
        rules: {
            ...reactHooks.configs["recommended-latest"].rules,
            ...pluginQuery.configs["flat/recommended"],
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },
    },
    // Jest
    {
        files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
        plugins: {
            "testing-library": testingLibrary,
        },
        languageOptions: {
            globals: globals.jest,
        },
        rules: {
            ...testingLibrary.configs.react.rules,
            "testing-library/await-async-queries": "error",
            "testing-library/no-await-sync-queries": "error",
            "testing-library/no-debugging-utils": "warn",
            "testing-library/no-dom-import": "off",
        },
        ...testingLibrary.configs["flat/dom"],
        ...testingLibrary.configs["flat/react"],
    },
    // Cypress
    {
        files: ["cypress/**/*.ts", "cypress/**/*.tsx"],
        extends: [...tseslint.configs.recommended],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                Cypress: "readonly",
                cy: "readonly",
            },
            parserOptions: {
                project: "./cypress/tsconfig.json",
            },
        },
        rules: {
            "@typescript-eslint/no-namespace": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
);
