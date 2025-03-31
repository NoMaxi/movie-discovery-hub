import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import SearchForm from "./SearchForm";

const meta = {
    component: SearchForm,
    args: {
        onSearch: fn(),
    },
} satisfies Meta<typeof SearchForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithoutInitialQuery: Story = {
    args: {},
};

export const WithInitialQuery: Story = {
    args: {
        initialQuery: "Star Wars",
    },
};
