import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Dialog } from "./Dialog";

const meta = {
    component: Dialog,
    argTypes: {
        title: {
            control: "text",
            description: "The title content for the dialog header. Can be a string or JSX.",
        },
        children: {
            control: false,
            description: "The main content of the dialog body.",
        },
        onClose: {
            description: "Callback function triggered when the close button (x) is clicked.",
        },
    },
    args: {
        onClose: fn(),
        className: "max-w-[976px]",
    },
    parameters: {
        layout: "fullscreen",
        docs: {
            story: {
                inline: false,
                iframeHeight: 300,
            },
        },
    },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithStringTitle: Story = {
    args: {
        title: "Default Dialog Title",
        children: <p>This is the default body content for the dialog. You can put any JSX here.</p>,
    },
};

export const WithEmptyStringTitle: Story = {
    args: {
        title: "",
        children: <p>This is the default body content for the dialog. You can put any JSX here.</p>,
    },
};

export const WithJSXTitle: Story = {
    args: {
        title: (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Info Icon" style={{ fontSize: "24px" }}>
                    ℹ️
                </span>
                <span style={{ fontWeight: "bold", color: "var(--color-primary)" }}>Important Information</span>
            </div>
        ),
        children: (
            <p>
                This dialog uses a custom JSX element for its title, allowing for more complex header content like icons
                or styled text.
            </p>
        ),
    },
};

export const WithComplexBody: Story = {
    parameters: {
        layout: "fullscreen",
        docs: {
            story: {
                inline: false,
                iframeHeight: 600,
            },
        },
    },
    args: {
        title: "Add New Item",
        children: (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    alert("Form Submitted!");
                }}
            >
                <div className="mb-4">
                    <label htmlFor="item-name" className="block mb-2 text-[var(--color-text)]">
                        Item Name
                    </label>
                    <input
                        type="text"
                        id="item-name"
                        placeholder="Enter item name"
                        className="
                            input-field
                            w-full p-3 border border-[var(--color-gray)]
                            rounded-md bg-[var(--color-background-light)]
                        "
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="item-desc" className="block mb-2 text-[var(--color-text)]">
                        Description
                    </label>
                    <textarea
                        id="item-desc"
                        rows={3}
                        placeholder="Describe the item"
                        className="
                            input-field
                            w-full p-3 border border-[var(--color-gray)]
                            rounded-md bg-[var(--color-background-light)]
                        "
                    ></textarea>
                </div>
                <div className="text-right mt-6">
                    <button
                        type="reset"
                        className="
                            h-[57px] min-w-[180px] mr-5
                            border-none rounded cursor-pointer
                            bg-[var(--color-gray-lighter)] hover:brightness-80
                            transition-all duration-300
                        "
                    >
                        Reset
                    </button>
                    <button type="submit" className="btn">
                        Submit
                    </button>
                </div>
            </form>
        ),
    },
};

export const WithLongContent: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 600,
            },
        },
    },
    args: {
        title: "Dialog With Scrollable Content",
        children: (
            <div>
                <p>
                    This dialog contains a lot of content to demonstrate the vertical scrolling behavior when the
                    content exceeds the maximum height defined by `max-h-[90vh]` and `overflow-y-auto`.
                </p>
                {[...Array(25)].map((_, i) => (
                    <p key={i} style={{ margin: "1rem 0", lineHeight: "1.6" }}>
                        This is paragraph number {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                        laborum.
                    </p>
                ))}
            </div>
        ),
    },
};

export const WithCustomClasses: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 600,
            },
        },
    },
    args: {
        title: "Custom Styled Dialog",
        children: (
            <p>
                This dialog has custom classes applied to it. You can use this feature to style the dialog according to
                your design requirements.
            </p>
        ),
        className:
            "max-w-[500px] h-[600px] ring-4 ring-offset-4 ring-indigo-500 text-[var(--color-text-light)] rounded-lg shadow-lg",
    },
};
