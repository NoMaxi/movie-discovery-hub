import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { MovieTile } from "./MovieTile";

const meta = {
    component: MovieTile,
    argTypes: {
        movie: {
            control: "object",
            description: "Movie data object",
        },
        onClick: {
            description: "Callback function triggered on tile click",
        },
        onEdit: {
            description: "Callback function triggered on Edit button click",
        },
        onDelete: {
            description: "Callback function triggered on Delete button click",
        },
    },
    args: {
        onClick: fn(),
        onEdit: fn(),
        onDelete: fn(),
    },
} satisfies Meta<typeof MovieTile>;

export default meta;

type Story = StoryObj<typeof MovieTile>;

export const Default: Story = {
    args: {
        movie: {
            id: "1",
            title: "Pulp Fiction",
            releaseYear: 1994,
            genres: ["All", "Horror"],
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
        },
    },
};

export const LongTitleAndGenres: Story = {
    args: {
        movie: {
            id: "2",
            title: "The Lord of the Rings: The Return of the King",
            releaseYear: 2003,
            genres: ["All", "Horror", "Comedy", "Crime", "Documentary"],
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/El_Se%C3%B1or_de_los_Anillos_lectura.jpg",
        },
    },
};

export const NoImageAvailable: Story = {
    args: {
        movie: {
            id: "3",
            title: "Movie With Broken Image",
            releaseYear: 1994,
            genres: ["Crime", "Documentary"],
            imageUrl: "https://invalid-url-will-cause-error.abc",
        },
    },
};
