import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import GenreSelect from "./GenreSelect";

const meta = {
    component: GenreSelect,
    args: {
        onSelect: fn(),
    },
} satisfies Meta<typeof GenreSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        genres: ["All", "Comedy", "Horror", "Documentary"],
        selectedGenre: "Horror",
    },
};
