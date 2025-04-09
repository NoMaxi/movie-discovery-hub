import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { mockMovieInfo } from "@/mocks/MovieData";
import { MovieForm } from "@/components/MovieForm/MovieForm";
import { Dialog } from "./Dialog";

const meta = {
    title: "Common/Dialog",
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

export const StringTitle: Story = {
    args: {
        title: "Default Dialog Title",
        children: <p>This is the default body content for the dialog. You can put any JSX here.</p>,
    },
};

export const EmptyStringTitle: Story = {
    args: {
        title: "",
        children: <p>This is the default body content for the dialog. You can put any JSX here.</p>,
    },
};

export const JSXTitle: Story = {
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

export const ComplexChildren: Story = {
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
                    <label htmlFor="item-name" className="form-label block mb-2 text-[var(--color-text)]">
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
                    <label htmlFor="item-desc" className="form-label block mb-2 text-[var(--color-text)]">
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
                    <button type="reset" className="btn btn-outline mr-5">
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

export const LongContent: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 700,
            },
        },
    },
    args: {
        title: "Dialog Scrollable Content",
        children: (
            <div className="overflow-y-auto">
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
        className: "max-h-[90vh]",
    },
};

export const CustomClasses: Story = {
    parameters: {
        docs: {
            story: {
                iframeHeight: 700,
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

export const AddMovieForm: Story = {
    parameters: {
        docs: {
            story: {
                iframeHeight: 950,
            },
        },
    },
    args: {
        title: "ADD MOVIE",
        children: <MovieForm onSubmit={fn().mockName("movieFormSubmit")} />,
    },
};

export const EditMovieForm: Story = {
    parameters: {
        docs: {
            story: {
                iframeHeight: 950,
            },
        },
    },
    args: {
        title: "EDIT MOVIE",
        children: <MovieForm initialMovieInfo={mockMovieInfo} onSubmit={fn().mockName("movieFormSubmit")} />,
    },
};

export const DeleteConfirmation: Story = {
    parameters: {
        docs: {
            story: {
                iframeHeight: 500,
            },
        },
    },
    args: {
        title: "DELETE MOVIE",
        children: (
            <div className="flex flex-col">
                <p className="text-[var(--color-text)] opacity-80 mb-16 text-left text-2xl">
                    Are you sure you want to delete this movie?
                </p>
                <div className="flex justify-end">
                    <button type="button" className="btn" onClick={fn().mockName("confirmDeleteClick")}>
                        Confirm
                    </button>
                </div>
            </div>
        ),
        className: "max-w-[686px]",
    },
};
