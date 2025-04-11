import type { Meta, StoryObj } from "@storybook/react";
import { GenreMultiSelect } from "./GenreMultiSelect";

const meta = {
    title: "Components/GenreMultiSelect",
    component: GenreMultiSelect,
    argTypes: {
        id: {
            control: "text",
            description: "Unique identifier for the select component",
        },
        name: {
            control: "text",
            description: "Name attribute for the hidden input field",
        },
        preselectedGenres: {
            control: "object",
            description: "Array of preselected genres",
        },
        ariaDescribedby: {
            control: "text",
            description: "ID of the element that describes this select for accessibility",
        },
    },
    args: {
        id: "genre-select",
        name: "genres",
    },
} satisfies Meta<typeof GenreMultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoSelectedGenres: Story = {
    args: {},
};

export const PreselectedGenres: Story = {
    args: {
        preselectedGenres: ["Comedy", "Horror"],
    },
};

export const AllGenresPreselected: Story = {
    args: {
        preselectedGenres: ["Comedy", "Crime", "Documentary", "Horror"],
    },
};

export const WithAriaDescription: Story = {
    args: {
        preselectedGenres: ["Comedy"],
        ariaDescribedby: "genre-description",
    },
    decorators: [
        (Story) => (
            <div>
                <Story />
                <div id="genre-description" className="mb-2 text-sm text-gray-500">
                    Select one or more movie genres
                </div>
            </div>
        ),
    ],
};
