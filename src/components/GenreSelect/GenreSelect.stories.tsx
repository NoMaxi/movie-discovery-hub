import { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { GenreSelect } from "./GenreSelect";
import { Genre } from "@/types/common";
import { useState } from "react";

const ALL_GENRES: Genre[] = ["All", "Comedy", "Crime", "Documentary", "Horror"];

const meta = {
    title: "Components/GenreSelect",
    component: GenreSelect,
    argTypes: {
        genres: {
            control: { type: "object" },
            description: "Array of genre strings to be displayed as selectable options.",
        },
        selectedGenre: {
            control: { type: "select" },
            options: ALL_GENRES,
            description: "Currently selected genre",
        },
        onSelect: {
            description: "Callback function triggered when a genre is selected",
        },
    },
    args: {
        onSelect: fn(),
    },
} satisfies Meta<typeof GenreSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        genres: ALL_GENRES,
        selectedGenre: "Comedy",
    },
};

export const Interactive: StoryFn<typeof GenreSelect> = () => {
    const [selectedGenre, setSelectedGenre] = useState<Genre>("All");

    return <GenreSelect genres={ALL_GENRES} selectedGenre={selectedGenre} onSelect={setSelectedGenre} />;
};
