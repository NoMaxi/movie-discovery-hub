import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ContextMenu } from "./ContextMenu";

interface ContextMenuAction {
    label: string;
    onClick: () => void;
}

const defaultMockActions: ContextMenuAction[] = [
    { label: "Edit", onClick: fn() },
    { label: "Delete", onClick: fn() },
];

const meta = {
    component: ContextMenu,
    argTypes: {
        isOpen: {
            control: "boolean",
            description: "Controls whether the context menu is visible",
            table: { defaultValue: { summary: 'false' } },
        },
        onClose: {
            description: "Callback function triggered when the menu requests to be closed (via close button or action click)",
        },
        actions: {
            control: "object",
            description: "Array of action objects ({ label: string, onClick: () => void })",
        },
        className: {
            control: "text",
            description: "Optional additional CSS classes for the container",
        },
        withCloseButton: {
            control: "boolean",
            description: "If true, shows a close (×) button in the top-right corner",
            table: { defaultValue: { summary: 'false' } },
        },
    },
    args: {
        isOpen: true,
        actions: defaultMockActions,
        onClose: fn(),
    },
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const InitiallyClosed: Story = {
    args: {
        isOpen: false,
    },
};

export const WithCloseButton: Story = {
    args: {
        withCloseButton: true,
    },
};

export const MultipleActions: Story = {
    args: {
        actions: [
            { label: "Copy Link", onClick: fn() },
            { label: "Share", onClick: fn() },
            { label: "Rename", onClick: fn() },
            { label: "Archive", onClick: fn() },
            { label: "Delete", onClick: fn() },
        ],
    },
};

export const WithCustomClasses: Story = {
    args: {
        className: "ring-2 ring-offset-2 ring-indigo-500 w-[200px]",
    },
};
