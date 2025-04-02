import type { Meta, StoryObj } from "@storybook/react";
import MovieDetails from "./MovieDetails";
import { MovieDetailsData } from "@/types/common";

const meta = {
    component: MovieDetails,
    argTypes: {
        details: {
            description: "Movie details data object",
            control: { type: "object" },
        },
    },
} satisfies Meta<typeof MovieDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockMovieDetails: MovieDetailsData = {
    id: "1",
    title: "Pulp Fiction",
    releaseYear: 1994,
    genres: ["Comedy", "Crime"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
    rating: 8.9,
    duration: 154,
    description:
        "Jules Winnfield (Samuel L. Jackson) and Vincent Vega (John Travolta) are two hit men who are out to retrieve a suitcase stolen from their employer, mob boss Marsellus Wallace (Ving Rhames). Wallace has also asked Vincent to take his wife Mia (Uma Thurman) out a few days later when Wallace himself will be out of town. Butch Coolidge (Bruce Willis) is an aging boxer who is paid by Wallace to lose his fight. The lives of these seemingly unrelated people are woven together comprising of a series of funny, bizarre and uncalled-for incidents.—Soumitra",
};

export const Default: Story = {
    args: {
        details: mockMovieDetails,
    },
};

export const ZeroDurationMovie: Story = {
    args: {
        details: { ...mockMovieDetails, duration: 0 },
    },
};
