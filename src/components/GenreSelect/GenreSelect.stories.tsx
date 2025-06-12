import { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { GenreSelect } from "./GenreSelect";
import { GenreFilter } from "@/types/common";
import { useState } from "react";

const meta = {
    title: "Components/GenreSelect",
    component: GenreSelect,
    argTypes: {
        selectedGenre: {
            control: { type: "select" },
            options: [
                "All",
                "Drama",
                "Comedy",
                "Action",
                "Horror",
                "Adventure",
                "Animation",
                "Crime",
                "Documentary",
                "Family",
                "Fantasy",
                "History",
                "Music",
                "Mystery",
                "Romance",
                "Science Fiction",
                "Thriller",
                "TV Movie",
                "War",
                "Western",
            ],
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
        selectedGenre: "Comedy",
    },
};

export const Interactive: StoryFn<typeof GenreSelect> = () => {
    const [selectedGenre, setSelectedGenre] = useState<GenreFilter>("All");

    return <GenreSelect selectedGenre={selectedGenre} onSelect={setSelectedGenre} />;
};
