import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
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
            globals: globals.jest
        },
        rules: {
            ...testingLibrary.configs.react.rules,
            "testing-library/await-async-queries": "error",
            "testing-library/no-await-sync-queries": "error",
            "testing-library/no-debugging-utils": "warn",
            "testing-library/no-dom-import": "off",
        },
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
