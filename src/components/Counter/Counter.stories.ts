import type { Meta, StoryObj } from "@storybook/react";
import Counter from "./Counter";

const meta = {
    component: Counter,
} satisfies Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithInitialValue: Story = {
    args: {
        initialValue: 10,
    },
};

export const WithoutInitialValue: Story = {
    args: {},
};
