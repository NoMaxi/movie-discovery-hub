import type { Meta, StoryObj } from "@storybook/react";
import MovieDetails from "./MovieDetails";
import { mockMovieDetails } from "./MovieDetails.mocks";

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

