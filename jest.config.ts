import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.test.json",
            },
        ],
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    // Coverage
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageReporters: ["text", "lcov", "html"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.test.{ts,tsx}",
        "!src/**/*.spec.{ts,tsx}",
        "!src/**/*.cy.{ts,tsx}",
        "!src/**/*.stories.{js,jsx,ts,tsx}",
        "!src/**/*.mocks.ts",
        "!src/**/*.mocks.tsx",
        "!src/**/index.{ts,tsx}",
        "!src/types/**",
        "!src/mocks/**",
        "!src/main.tsx",
        "!src/constants.ts",
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};

export default config;
