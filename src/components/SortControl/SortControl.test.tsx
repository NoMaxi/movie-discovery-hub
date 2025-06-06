import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SortOption } from "@/types/common";
import { SortControl } from "./SortControl";
import { DropdownControlProps } from "@/components/common/DropdownControl/DropdownControl";

jest.mock("@/components/common/DropdownControl/DropdownControl", () => ({
    DropdownControl: <T extends string>({
        label,
        options,
        currentSelection,
        onSelectionChange,
        testId,
        className,
    }: DropdownControlProps<T>) => (
        <div data-testid={testId} className={className}>
            <span data-testid="dropdown-label">{label}</span>
            <button
                data-testid="dropdown-button"
                onClick={() => {
                    const currentIndex = options.indexOf(currentSelection);
                    const nextIndex = (currentIndex + 1) % options.length;
                    onSelectionChange(options[nextIndex]);
                }}
            >
                {currentSelection}
            </button>
        </div>
    ),
}));

describe("SortControl", () => {
    let onSelectionChangeMock: jest.Mock;
    let user: UserEvent;

    beforeEach(() => {
        onSelectionChangeMock = jest.fn();
        user = userEvent.setup();
    });

    const renderComponent = (currentSelection: SortOption) => {
        return render(<SortControl currentSelection={currentSelection} onSelectionChange={onSelectionChangeMock} />);
    };

    test("Should render DropdownControl with correct props", () => {
        const currentSelection = "Release Date";
        const { asFragment } = renderComponent(currentSelection);

        expect(screen.getByTestId("sort-control")).toBeInTheDocument();
        expect(screen.getByTestId("sort-control")).toHaveClass("sort-control");
        expect(screen.getByTestId("dropdown-label")).toHaveTextContent("Sort by");
        expect(screen.getByTestId("dropdown-button")).toHaveTextContent(currentSelection);
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should pass correct options to DropdownControl", () => {
        renderComponent("Title");

        expect(screen.getByTestId("dropdown-button")).toHaveTextContent("Title");
    });

    test("Should call onSelectionChange when DropdownControl triggers change", async () => {
        renderComponent("Release Date");
        const button = screen.getByTestId("dropdown-button");

        await user.click(button);

        expect(onSelectionChangeMock).toHaveBeenCalledTimes(1);
        expect(onSelectionChangeMock).toHaveBeenCalledWith("Title");
    });

    test("Should update displayed selection when currentSelection prop changes", () => {
        const { rerender } = renderComponent("Release Date");

        expect(screen.getByTestId("dropdown-button")).toHaveTextContent("Release Date");

        rerender(<SortControl currentSelection="Title" onSelectionChange={onSelectionChangeMock} />);

        expect(screen.getByTestId("dropdown-button")).toHaveTextContent("Title");
    });

    test("Should render with correct testId and className", () => {
        renderComponent("Release Date");

        const sortControl = screen.getByTestId("sort-control");
        expect(sortControl).toBeInTheDocument();
        expect(sortControl).toHaveClass("sort-control");
    });
});
