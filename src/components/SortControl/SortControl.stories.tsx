import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SortOption } from "@/types/common";
import SortControl from "./SortControl";

const SORT_OPTIONS: SortOption[] = ["Release Date", "Title"];

const meta = {
    component: SortControl,
    argTypes: {
        currentSelection: {
            control: "select",
            options: SORT_OPTIONS,
            description: "Currently selected sorting option",
        },
        onSelectionChange: {
            description: "Callback function triggered on sort option selection",
        },
    },
    args: {
        onSelectionChange: fn(),
    },
} satisfies Meta<typeof SortControl>;

export default meta;

type Story = StoryObj<typeof SortControl>;

export const ReleaseDateSelected: Story = {
    args: {
        currentSelection: "Release Date",
    },
};

export const TitleSelected: Story = {
    args: {
        currentSelection: "Title",
    },
};

export const OpenedDropdown: Story = {
    args: {
        currentSelection: "Release Date",
    },
    parameters: {
        componentState: {
            isOpen: true,
        },
    },
};
