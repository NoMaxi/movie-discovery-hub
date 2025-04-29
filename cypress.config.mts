import { defineConfig } from "cypress";

export default defineConfig({
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
        specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: "cypress/support/component.ts",
    },
    e2e: {
        baseUrl: "http://localhost:5173",
        defaultCommandTimeout: 10000,
        experimentalRunAllSpecs: true,
        specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
        setupNodeEvents() {},
    },
});
