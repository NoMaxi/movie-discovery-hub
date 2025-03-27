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
        setupNodeEvents() {},
    },
});
