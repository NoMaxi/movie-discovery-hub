import js from "@eslint/js";
import globals from "globals";
import pluginQuery from "@tanstack/eslint-plugin-query";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist", "coverage"] },

    // Base JS/TS/React/Query config
    {
        files: ["**/*.{ts,tsx}"],
        extends: [js.configs.recommended, ...tseslint.configs.recommended, pluginQuery.configs["flat/recommended"]],
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

    // Testing Library React config
    {
        ...testingLibrary.configs["flat/react"],
        ignores: ["**/*.cy.{ts,tsx}"],
    },

    // Testing Library DOM config
    {
        ...testingLibrary.configs["flat/dom"],
        ignores: ["**/*.cy.{ts,tsx}"],
    },

    // Custom Jest/Testing Library overrides
    {
        files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
        languageOptions: {
            globals: globals.jest,
        },
        rules: {
            "testing-library/await-async-queries": "error",
            "testing-library/no-await-sync-queries": "error",
            "testing-library/no-debugging-utils": "warn",
            "testing-library/no-dom-import": "off",
            "testing-library/prefer-screen-queries": "error",
        },
    },

    // Cypress config
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
            "testing-library/await-async-queries": "off",
            "testing-library/prefer-screen-queries": "off",
            "testing-library/no-await-sync-queries": "off",
        },
    },
);
