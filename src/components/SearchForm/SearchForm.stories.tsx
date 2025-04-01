import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import SearchForm from "./SearchForm";

const meta = {
    component: SearchForm,
    argTypes: {
        initialQuery: {
            control: "text",
            description: "Initial search query to be displayed in the input field",
        },
        onSearch: {
            control: false,
            description: "Callback function triggered when search is submitted",
        },
    },
    args: {
        onSearch: fn(),
    },
} satisfies Meta<typeof SearchForm>;

export default meta;

type Story = StoryObj<typeof SearchForm>;

export const WithoutInitialQuery: Story = {
    args: {
        initialQuery: "",
    },
};

export const WithInitialQuery: Story = {
    args: {
        initialQuery: "Star Wars",
    },
};

export const LongQuery: Story = {
    args: {
        initialQuery: "This is a very long search query that should fit the input field anyway",
    },
};
