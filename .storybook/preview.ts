import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: "dark",
            values: [
                { name: "dark", value: "#232323" },
                { name: "light", value: "#ffffff" },
            ],
        },
    },
    tags: ["autodocs"],
};

export default preview;
