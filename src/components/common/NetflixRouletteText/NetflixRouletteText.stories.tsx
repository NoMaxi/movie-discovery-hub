import type { Meta, StoryObj } from "@storybook/react";
import { NetflixRouletteText } from "./NetflixRouletteText";

const meta = {
    title: "Common/NetflixRouletteText",
    component: NetflixRouletteText,
} satisfies Meta<typeof NetflixRouletteText>;

export default meta;

type Story = StoryObj<typeof NetflixRouletteText>;

export const Default: Story = {};
