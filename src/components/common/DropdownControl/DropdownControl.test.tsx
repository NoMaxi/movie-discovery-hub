import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { DropdownControl, DropdownControlProps } from "./DropdownControl";

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
                        data-testid={`context-menu-${action.label.toLowerCase()}-button`}
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

describe("DropdownControl", () => {
    type TestOption = "option1" | "option2" | "option3";
    const testOptions: readonly TestOption[] = ["option1", "option2", "option3"] as const;
    let onSelectionChangeMock: jest.Mock;
    let user: UserEvent;

    const defaultProps: DropdownControlProps<TestOption> = {
        label: "Test Label",
        options: testOptions,
        currentSelection: "option1",
        onSelectionChange: jest.fn(),
    };

    beforeEach(() => {
        onSelectionChangeMock = jest.fn();
        user = userEvent.setup();
    });

    const renderComponent = (props: Partial<DropdownControlProps<TestOption>> = {}) => {
        const mergedProps = { ...defaultProps, onSelectionChange: onSelectionChangeMock, ...props };
        return render(<DropdownControl {...mergedProps} />);
    };

    describe("Initial Rendering", () => {
        test("Should render correctly with initial selection", () => {
            const { asFragment } = renderComponent();

            expect(screen.getByText("Test Label")).toBeInTheDocument();
            expect(screen.getByText("Test Label")).toHaveClass("dropdown-control-label", "opacity-60");

            const selectionButton = screen.getByRole("button", { name: /option1/i });
            expect(selectionButton).toBeInTheDocument();
            expect(selectionButton).toHaveTextContent("option1");
            expect(selectionButton).toHaveClass("dropdown-control-button");

            expect(screen.getByTestId("select-arrow")).toBeInTheDocument();
            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
            expect(asFragment()).toMatchSnapshot();
        });

        test("Should apply custom classes correctly", () => {
            renderComponent({
                className: "custom-dropdown",
                buttonClassName: "custom-button",
                dropdownClassName: "custom-dropdown-menu",
                testId: "custom-dropdown-test",
            });

            const dropdownControl = screen.getByTestId("custom-dropdown-test");
            expect(dropdownControl).toHaveClass("custom-dropdown");

            const button = screen.getByRole("button");
            expect(button).toHaveClass("custom-button");
        });

        test("Should render with testId when provided", () => {
            renderComponent({ testId: "test-dropdown" });

            expect(screen.getByTestId("test-dropdown")).toBeInTheDocument();
        });

        test("Should render with uppercase styling for label and button text", () => {
            renderComponent({ label: "sort by", currentSelection: "option1" });

            const label = screen.getByText("sort by");
            expect(label).toBeInTheDocument();
            expect(label).toHaveClass("uppercase");

            const button = screen.getByText("option1");
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass("uppercase");
        });
    });

    describe("Dropdown Toggle Functionality", () => {
        test("Should open context menu when selection button is clicked", async () => {
            renderComponent();
            const selectionButton = screen.getByRole("button", { name: /option1/i });

            await user.click(selectionButton);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-option1-button")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-option2-button")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-option3-button")).toBeInTheDocument();
        });

        test("Should close context menu when selection button is clicked while open", async () => {
            renderComponent();
            const selectionButton = screen.getByRole("button", { name: /option1/i });

            await user.click(selectionButton);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            await user.click(selectionButton);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });
    });

    describe("Option Selection", () => {
        test("Should call onSelectionChange with correct value when menu option is clicked", async () => {
            renderComponent();
            const selectionButton = screen.getByRole("button", { name: /option1/i });

            await user.click(selectionButton);

            const option2Button = screen.getByTestId("context-menu-option2-button");
            await user.click(option2Button);

            expect(onSelectionChangeMock).toHaveBeenCalledTimes(1);
            expect(onSelectionChangeMock).toHaveBeenCalledWith("option2");
        });

        test("Should close context menu after option is selected", async () => {
            renderComponent();
            const selectionButton = screen.getByRole("button", { name: /option1/i });

            await user.click(selectionButton);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            const option3Button = screen.getByTestId("context-menu-option3-button");
            await user.click(option3Button);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });

        test("Should work with different option types", async () => {
            const stringOptions = ["apple", "banana", "cherry"] as const;
            const stringProps: DropdownControlProps<(typeof stringOptions)[number]> = {
                label: "Fruits",
                options: stringOptions,
                currentSelection: "apple",
                onSelectionChange: onSelectionChangeMock,
            };

            render(<DropdownControl {...stringProps} />);
            const button = screen.getByRole("button", { name: /apple/i });

            await user.click(button);
            const bananaButton = screen.getByTestId("context-menu-banana-button");
            await user.click(bananaButton);

            expect(onSelectionChangeMock).toHaveBeenCalledWith("banana");
        });
    });

    describe("Click Outside Behavior", () => {
        test("Should close context menu when clicking outside the component", async () => {
            renderComponent();
            const selectionButton = screen.getByRole("button", { name: /option1/i });

            await user.click(selectionButton);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            await user.click(document.body);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });

        test("Should not close context menu when clicking inside the component", async () => {
            renderComponent();
            const selectionButton = screen.getByRole("button", { name: /option1/i });

            await user.click(selectionButton);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            const contextMenu = screen.getByTestId("context-menu");
            await user.click(contextMenu);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
        });

        test("Should close context menu when close button is clicked", async () => {
            renderComponent();
            const selectionButton = screen.getByRole("button", { name: /option1/i });

            await user.click(selectionButton);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();

            const closeButton = screen.getByTestId("context-menu-close-button");
            await user.click(closeButton);

            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
            expect(onSelectionChangeMock).not.toHaveBeenCalled();
        });
    });

    describe("Props Updates", () => {
        test("Should display updated selection when currentSelection prop changes", () => {
            const { rerender } = renderComponent({ currentSelection: "option1" });

            expect(screen.getByRole("button", { name: /option1/i })).toBeInTheDocument();

            rerender(
                <DropdownControl
                    {...defaultProps}
                    currentSelection="option2"
                    onSelectionChange={onSelectionChangeMock}
                />,
            );

            expect(screen.getByRole("button", { name: /option2/i })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: /option1/i })).not.toBeInTheDocument();
        });

        test("Should update options when options prop changes", () => {
            const newOptions: readonly TestOption[] = ["option2", "option3"] as const;
            const { rerender } = renderComponent();

            rerender(
                <DropdownControl
                    {...defaultProps}
                    options={newOptions}
                    currentSelection="option2"
                    onSelectionChange={onSelectionChangeMock}
                />,
            );

            expect(screen.getByRole("button", { name: /option2/i })).toBeInTheDocument();
        });

        test("Should update label when label prop changes", () => {
            const { rerender } = renderComponent({ label: "Original Label" });

            expect(screen.getByText("Original Label")).toBeInTheDocument();

            rerender(
                <DropdownControl {...defaultProps} label="Updated Label" onSelectionChange={onSelectionChangeMock} />,
            );

            expect(screen.getByText("Updated Label")).toBeInTheDocument();
            expect(screen.queryByText("Original Label")).not.toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        test("Should have proper button role and text", () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /option1/i });

            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute("type", "button");
        });

        test("Should have proper focus styles", () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /option1/i });

            expect(button).toHaveClass("focus:outline-none");
        });

        test("Should be keyboard accessible", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /option1/i });

            button.focus();

            expect(button).toHaveFocus();

            await user.keyboard("{Enter}");

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
        });

        test("Should support Space key activation", async () => {
            renderComponent();
            const button = screen.getByRole("button", { name: /option1/i });

            button.focus();
            await user.keyboard(" ");

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        test("Should handle empty options array gracefully", () => {
            const emptyProps: DropdownControlProps<never> = {
                label: "Empty",
                options: [],
                currentSelection: "" as never,
                onSelectionChange: onSelectionChangeMock,
            };

            render(<DropdownControl {...emptyProps} />);

            expect(screen.getByText("Empty")).toBeInTheDocument();
            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        test("Should handle single option correctly", async () => {
            const singleOptionProps: DropdownControlProps<"single"> = {
                label: "Single",
                options: ["single"],
                currentSelection: "single",
                onSelectionChange: onSelectionChangeMock,
            };

            render(<DropdownControl {...singleOptionProps} />);
            const button = screen.getByRole("button", { name: /single/i });

            await user.click(button);

            expect(screen.getByTestId("context-menu")).toBeInTheDocument();
            expect(screen.getByTestId("context-menu-single-button")).toBeInTheDocument();
        });

        test("Should handle long option names properly", () => {
            const longOptions = ["very-long-option-name-that-might-overflow"] as const;
            const longProps: DropdownControlProps<(typeof longOptions)[number]> = {
                label: "Long Options",
                options: longOptions,
                currentSelection: "very-long-option-name-that-might-overflow",
                onSelectionChange: onSelectionChangeMock,
            };

            render(<DropdownControl {...longProps} />);

            expect(screen.getByText("very-long-option-name-that-might-overflow")).toBeInTheDocument();
        });

        test("Should handle special characters in options", async () => {
            const specialOptions = ["option & symbol", "option / slash", "option @ at"] as const;
            type SpecialOption = (typeof specialOptions)[number];
            const specialProps: DropdownControlProps<SpecialOption> = {
                label: "Special",
                options: specialOptions,
                currentSelection: "option & symbol",
                onSelectionChange: onSelectionChangeMock,
            };

            render(<DropdownControl {...specialProps} />);
            const button = screen.getByRole("button", { name: /option & symbol/i });

            await user.click(button);
            const slashButton = screen.getByTestId("context-menu-option / slash-button");
            await user.click(slashButton);

            expect(onSelectionChangeMock).toHaveBeenCalledWith("option / slash");
        });
    });

    describe("Component Structure", () => {
        test("Should have correct CSS classes", () => {
            renderComponent({ testId: "test-dropdown" });

            const dropdown = screen.getByTestId("test-dropdown");
            expect(dropdown).toHaveClass("dropdown-control", "relative", "inline-block", "text-left");

            const label = screen.getByText("Test Label");
            expect(label).toHaveClass("dropdown-control-label", "text-[16px]", "uppercase", "opacity-60");

            const button = screen.getByRole("button");
            expect(button).toHaveClass(
                "dropdown-control-button",
                "inline-flex",
                "items-center",
                "justify-center",
                "gap-x-2",
                "min-w-[140px]",
            );
        });

        test("Should apply correct CSS classes for positioning", async () => {
            renderComponent({ dropdownClassName: "custom-position" });
            const button = screen.getByRole("button");

            await user.click(button);
            const contextMenu = screen.getByTestId("context-menu");

            expect(contextMenu).toHaveClass(
                "dropdown-control-dropdown",
                "absolute",
                "right-0",
                "mt-2",
                "w-44",
                "origin-top-right",
                "rounded",
                "custom-position",
            );
        });
    });

    describe("Performance", () => {
        test("Should not cause unnecessary re-renders when props don't change", () => {
            const { rerender } = renderComponent();
            const initialButton = screen.getByRole("button");

            rerender(<DropdownControl {...defaultProps} onSelectionChange={onSelectionChangeMock} />);

            const buttonAfterRerender = screen.getByRole("button");
            expect(buttonAfterRerender).toBe(initialButton);
        });
    });
});
