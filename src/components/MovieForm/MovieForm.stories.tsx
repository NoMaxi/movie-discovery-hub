import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { InitialMovieInfo } from "@/types/common";
import { MovieForm } from "./MovieForm";

const meta = {
    component: MovieForm,
    argTypes: {
        initialMovieInfo: {
            control: "object",
            description:
                "Optional initial movie data to prefill the form (used for editing). Provide fields like id, title, release_date (YYYY-MM-DD), imageUrl, rating, duration, genres, description.",
        },
        onSubmit: {
            description: "Callback function triggered on valid form submission. Receives processed form data.",
        },
    },
    args: {
        onSubmit: fn(),
    },
} satisfies Meta<typeof MovieForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AddMovie: Story = {
    args: {},
};

const mockExistingMovieData: InitialMovieInfo = {
    id: "m1",
    title: "Pulp Fiction",
    releaseDate: "1994-10-14",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
    rating: 8.9,
    duration: 154,
    genres: ["Crime", "Documentary"],
    description:
        "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
};

export const EditMovie: Story = {
    args: {
        initialMovieInfo: mockExistingMovieData,
    },
};
