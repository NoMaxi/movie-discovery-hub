import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { GenreMoreDropdown, GenreMoreDropdownProps } from "./GenreMoreDropdown";
import { Genre } from "@/types/common";

jest.mock("@/components/common/SelectArrow/SelectArrow", () => () => <svg data-testid="select-arrow"></svg>);
jest.mock("@/components/common/ContextMenu/ContextMenu", () => ({
    ContextMenu: ({
        isOpen,
        onClose,
        actions,
        className,
    }: {
        isOpen: boolean;
        onClose: () => void;
        actions: Array<{ label: string; onClick: () => void }>;
        className: string;
    }) =>
        isOpen ? (
            <div data-testid="context-menu" className={className} onClick={(e) => e.stopPropagation()}>
                <button data-testid="context-menu-close-button" onClick={onClose}>
                    ×
                </button>
                {actions.map((action: { label: string; onClick: () => void }, index: number) => (
                    <button
                        key={index}
                        data-testid={`context-menu-${action.label.toLowerCase().replace(/\s+/g, "-")}-button`}
                        onClick={() => {
                            action.onClick();
                            onClose();
                        }}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        ) : null,
}));

describe("GenreMoreDropdown", () => {
    const testGenres: readonly Genre[] = ["Drama", "Comedy", "Action", "Science Fiction"] as const;
    let onSelectionChangeMock: jest.Mock;
    let user: UserEvent;

    const defaultProps: GenreMoreDropdownProps = {
        options: testGenres,
        onSelectionChange: jest.fn(),
    };

    beforeEach(() => {
        onSelectionChangeMock = jest.fn();
        user = userEvent.setup();
    });

    const renderComponent = (props: Partial<GenreMoreDropdownProps> = {}) => {
        const mergedProps = { ...defaultProps, onSelectionChange: onSelectionChangeMock, ...props };
        return render(<GenreMoreDropdown {...mergedProps} />);
    };

    describe("Initial Rendering", () => {
        test("Should render correctly with default 'More' text when no genre is selected", () => {
            const { asFragment } = renderComponent();

            const button = screen.getByRole("button", { name: /more/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent("More");
            expect(button).toHaveClass("genre-more-button");
            expect(screen.getByTestId("select-arrow")).toBeInTheDocument();
            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
            expect(screen.getByTestId("genre-more-dropdown")).toBeInTheDocument();
            expect(asFragment()).toMatchSnapshot();
        });

        test("Should render correctly with selected genre", () => {
            renderComponent({ selectedGenre: "Drama" });

            const button = screen.getByRole("button", { name: /drama/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent("Drama");
        });

        test("Should apply custom classes correctly", () => {
            renderComponent({
                className: "custom-dropdown",
                buttonClassName: "custom-button",
            });

            const dropdown = screen.getByTestId("genre-more-dropdown");
            expect(dropdown).toHaveClass("custom-dropdown");

            const button = screen.getByRole("button");
            expect(button).toHaveClass("custom-button");
        });

        test("Should have proper default styling classes", () => {
            renderComponent();

            const dropdown = screen.getByTestId("genre-more-dropdown");
            expect(dropdown).toHaveClass("genre-more-dropdown", "relative", "inline-block", "text-left");

            const button = screen.getByRole("button");
            expect(button).toHaveClass(
                "genre-more-button",
                "inline-flex",
                "items-center",
                "justify-center",
                "gap-x-2",
                "min-w-[80px]",
                "px-2",
                "py-1",
                "text-lg",
                "font-medium",
                "uppercase",
                "cursor-pointer",
                "transition-colors",
                "duration-200",
                "focus:outline-none",
            );
        });

        test("Should render with uppercase styling for button text", () => {
            renderComponent({ selectedGenre: "Science Fiction" });

            const button = screen.getByText("Science Fiction");
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass("uppercase");
        });
    });

    describe("Dropdown Toggle Functionality", () => {
        test("Should open context menu when button is clicked", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-drama-button")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-comedy-button")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-action-button")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-science-fiction-button")).toBeInTheDocument();
        });

        test("Should close context menu when button is clicked while open", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            await user.click(button);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });
        test("Should display correct arrow rotation state", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            expect(button).toContainHTML('class="transform transition-transform rotate-0"');

            await user.click(button);

            expect(button).toContainHTML('class="transform transition-transform rotate-180"');

            await user.click(button);

            expect(button).toContainHTML('class="transform transition-transform rotate-0"');
        });
    });

    describe("Genre Selection", () => {
        test("Should call onSelectionChange with correct genre when menu option is clicked", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);

            const dramaButton = screen.getByTestId("context-menu-drama-button");
            await user.click(dramaButton);

            expect(onSelectionChangeMock).toHaveBeenCalledTimes(1);
            expect(onSelectionChangeMock).toHaveBeenCalledWith("Drama");
        });

        test("Should close context menu after genre is selected", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            const comedyButton = screen.getByTestId("context-menu-comedy-button");
            await user.click(comedyButton);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });

        test("Should handle genre with spaces correctly", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);

            const scienceFictionButton = screen.getByTestId("context-menu-science-fiction-button");
            await user.click(scienceFictionButton);

            expect(onSelectionChangeMock).toHaveBeenCalledWith("Science Fiction");
        });

        test("Should work with different genre types", async () => {
            const allGenres: readonly Genre[] = [
                "Drama",
                "Romance",
                "Animation",
                "Adventure",
                "Family",
                "Comedy",
                "Fantasy",
                "Science Fiction",
                "Action",
                "Thriller",
            ];

            renderComponent({ options: allGenres });
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);
            const adventureButton = screen.getByTestId("context-menu-adventure-button");
            await user.click(adventureButton);

            expect(onSelectionChangeMock).toHaveBeenCalledWith("Adventure");
        });
    });

    describe("Click Outside Behavior", () => {
        test("Should close context menu when clicking outside the component", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            await user.click(document.body);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });

        test("Should not close context menu when clicking inside the component", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);
            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            const contextMenu = screen.getByTestId("context-menu");
            await user.click(contextMenu);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
        });

        test("Should close context menu when close button is clicked", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            const closeButton = screen.getByTestId("context-menu-close-button");
            await user.click(closeButton);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
            expect(onSelectionChangeMock).not.toHaveBeenCalled();
        });
    });

    describe("Props Updates", () => {
        test("Should display updated selection when selectedGenre prop changes", () => {
            const { rerender } = renderComponent({ selectedGenre: "Drama" });

            expect(screen.getByRole("button", { name: /drama/i })).toBeInTheDocument();

            rerender(
                <GenreMoreDropdown
                    {...defaultProps}
                    selectedGenre="Comedy"
                    onSelectionChange={onSelectionChangeMock}
                />,
            );

            expect(screen.getByRole("button", { name: /comedy/i })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: /drama/i })).not.toBeInTheDocument();
        });

        test("Should revert to 'More' when selectedGenre becomes undefined", () => {
            const { rerender } = renderComponent({ selectedGenre: "Action" });

            expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();

            rerender(<GenreMoreDropdown {...defaultProps} onSelectionChange={onSelectionChangeMock} />);

            expect(screen.getByRole("button", { name: /more/i })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: /action/i })).not.toBeInTheDocument();
        });
        test("Should update options when options prop changes", async () => {
            const newGenres: readonly Genre[] = ["Horror", "Western", "Documentary"] as const;
            const { rerender } = renderComponent();

            const button = screen.getByRole("button");
            await user.click(button);
            expect(screen.getByTestId("context-menu-drama-button")).toBeInTheDocument();
            await user.click(button);

            rerender(
                <GenreMoreDropdown {...defaultProps} options={newGenres} onSelectionChange={onSelectionChangeMock} />,
            );

            await user.click(button);

            expect(screen.getByTestId("context-menu-horror-button")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-western-button")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-documentary-button")).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        test("Should have proper button role and text", () => {
            renderComponent({ selectedGenre: "Drama" });
            const button = screen.getByRole("button", { name: /drama/i });

            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute("type", "button");
        });

        test("Should have proper focus styles", () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            expect(button).toHaveClass("focus:outline-none");
        });

        test("Should be keyboard accessible with Enter key", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            button.focus();
            expect(button).toHaveFocus();

            await user.keyboard("{Enter}");
            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
        });

        test("Should be keyboard accessible with Space key", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /more/i });

            button.focus();
            await user.keyboard(" ");

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
        });

        test("Should have proper test id for accessibility testing", () => {
            renderComponent();

            expect(screen.getByTestId("genre-more-dropdown")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        test("Should handle empty options array gracefully", () => {
            renderComponent({ options: [] });

            expect(screen.getByRole("button", { name: /more/i })).toBeInTheDocument();
            expect(screen.getByTestId("genre-more-dropdown")).toBeInTheDocument();
        });

        test("Should handle single option correctly", async () => {
            const singleGenre: readonly Genre[] = ["Drama"];
            renderComponent({ options: singleGenre });

            const button = screen.getByRole("button", { name: /more/i });
            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-drama-button")).toBeInTheDocument();
        });

        test("Should handle all available genres", async () => {
            const allGenres: readonly Genre[] = [
                "Drama",
                "Romance",
                "Animation",
                "Adventure",
                "Family",
                "Comedy",
                "Fantasy",
                "Science Fiction",
                "Action",
                "Thriller",
                "History",
                "Crime",
                "Mystery",
                "Music",
                "War",
                "Horror",
                "Western",
                "TV Movie",
                "Documentary",
            ];

            renderComponent({ options: allGenres });
            const button = screen.getByRole("button", { name: /more/i });

            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-tv-movie-button")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-science-fiction-button")).toBeInTheDocument();
        });

        test("Should handle genre names with special formatting", async () => {
            const specialGenres: readonly Genre[] = ["TV Movie", "Science Fiction"];
            renderComponent({ options: specialGenres, selectedGenre: "TV Movie" });

            const button = screen.getByRole("button", { name: /tv movie/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent("TV Movie");

            await user.click(button);
            const scienceFictionButton = screen.getByTestId("context-menu-science-fiction-button");
            await user.click(scienceFictionButton);

            expect(onSelectionChangeMock).toHaveBeenCalledWith("Science Fiction");
        });
    });

    describe("Component Structure", () => {
        test("Should have correct CSS classes for dropdown structure", () => {
            renderComponent();

            const dropdown = screen.getByTestId("genre-more-dropdown");
            expect(dropdown).toHaveClass("genre-more-dropdown", "relative", "inline-block", "text-left");
        });

        test("Should apply correct CSS classes for context menu positioning", async () => {
            renderComponent();
            const button = screen.getByRole("button");

            await user.click(button);
            const contextMenu = screen.getByTestId("context-menu");

            expect(contextMenu).toHaveClass(
                "genre-more-dropdown-menu",
                "absolute",
                "right-0",
                "top-full",
                "mt-1",
                "w-44",
                "rounded",
                "max-h-[400px]",
                "overflow-y-auto",
                "overflow-x-hidden",
            );
        });

        test("Should have proper button sizing", () => {
            renderComponent();
            const button = screen.getByRole("button");

            expect(button).toHaveClass("min-w-[80px]");
        });
        test("Should include transition classes for smooth interactions", () => {
            renderComponent();
            const button = screen.getByRole("button");

            expect(button).toHaveClass("transition-colors", "duration-200");

            expect(button).toContainHTML('class="transform transition-transform rotate-0"');
        });
    });

    describe("Performance", () => {
        test("Should not cause unnecessary re-renders when props don't change", () => {
            const { rerender } = renderComponent();
            const initialButton = screen.getByRole("button");

            rerender(<GenreMoreDropdown {...defaultProps} onSelectionChange={onSelectionChangeMock} />);

            const buttonAfterRerender = screen.getByRole("button");
            expect(buttonAfterRerender).toBe(initialButton);
        });
        test("Should handle rapid clicks gracefully", async () => {
            renderComponent();
            const button = screen.getByRole("button");

            await user.click(button);
            await user.click(button);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });
    });

    describe("Integration", () => {
        test("Should work correctly with real genre selection flow", async () => {
            renderComponent({ selectedGenre: "Drama" });

            expect(screen.getByRole("button", { name: /drama/i })).toBeInTheDocument();

            const button = screen.getByRole("button");
            await user.click(button);

            const actionButton = screen.getByTestId("context-menu-action-button");
            await user.click(actionButton);

            expect(onSelectionChangeMock).toHaveBeenCalledWith("Action");
            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });
        test("Should maintain state consistency across interactions", async () => {
            renderComponent();

            const button = screen.getByRole("button");

            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            await user.click(document.body);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();

            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            const dramaButton = screen.getByTestId("context-menu-drama-button");

            await user.click(dramaButton);

            expect(onSelectionChangeMock).toHaveBeenCalledWith("Drama");
            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });
    });
});
