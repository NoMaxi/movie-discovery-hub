import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SortOption } from "@/types/common";
import { SortControl } from "./SortControl";

jest.mock("@/components/common/SelectArrow/SelectArrow", () => () => <svg data-testid="select-arrow"></svg>);

describe("SortControl", () => {
    const SORT_OPTIONS: SortOption[] = ["Release Date", "Title"];
    const initialSelection = SORT_OPTIONS[0];
    let onSelectionChangeMock: jest.Mock;
    let user: UserEvent;

    beforeEach(() => {
        onSelectionChangeMock = jest.fn();
        user = userEvent.setup();
    });

    const renderComponent = (currentSelection: SortOption) => {
        return render(<SortControl currentSelection={currentSelection} onSelectionChange={onSelectionChangeMock} />);
    };

    test("Should render correctly with initial selection", () => {
        const { asFragment } = renderComponent(initialSelection);

        expect(screen.getByText("Sort by")).toBeInTheDocument();
        expect(screen.getByText("Sort by")).toHaveClass("opacity-60");

        const selectionButton = screen.getByRole("button", { name: /release date/i });

        expect(selectionButton).toBeInTheDocument();
        expect(selectionButton).toHaveTextContent(initialSelection);
        expect(screen.queryByRole("button", { name: SORT_OPTIONS[1] })).not.toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should open context menu when selection button is clicked", async () => {
        renderComponent(initialSelection);
        const selectionButton = screen.getByRole("button", { name: /release date/i });

        await user.click(selectionButton);

        const releaseDateButtons = screen.getAllByRole("button", { name: SORT_OPTIONS[0] });
        expect(releaseDateButtons).toHaveLength(2);

        const titleOptionButton = screen.getByRole("button", { name: SORT_OPTIONS[1] });
        expect(titleOptionButton).toBeInTheDocument();
    });

    test("Should call 'onSelectionChange' prop with correct value when menu option is clicked", async () => {
        renderComponent(initialSelection);
        const selectionButton = screen.getByRole("button", { name: /release date/i });

        await user.click(selectionButton);

        const expectedSelection = SORT_OPTIONS[1];
        const titleOptionButton = screen.getByRole("button", { name: expectedSelection });

        await user.click(titleOptionButton);

        expect(onSelectionChangeMock).toHaveBeenCalledTimes(1);
        expect(onSelectionChangeMock).toHaveBeenCalledWith(expectedSelection);
    });

    test("Should close context menu after option is selected", async () => {
        renderComponent(initialSelection);
        const selectionButton = screen.getByRole("button", { name: /release date/i });

        await user.click(selectionButton);

        expect(screen.getByRole("button", { name: SORT_OPTIONS[1] })).toBeInTheDocument();

        const titleOptionButton = screen.getByRole("button", { name: SORT_OPTIONS[1] });

        await user.click(titleOptionButton);

        expect(screen.queryByRole("button", { name: SORT_OPTIONS[1] })).not.toBeInTheDocument();
    });

    test("Should close context menu when clicking outside the component", async () => {
        renderComponent(initialSelection);
        const selectionButton = screen.getByRole("button", { name: /release date/i });

        await user.click(selectionButton);

        expect(screen.getByRole("button", { name: SORT_OPTIONS[1] })).toBeInTheDocument();

        await user.click(document.body);

        expect(screen.queryByRole("button", { name: SORT_OPTIONS[1] })).not.toBeInTheDocument();
    });

    test("Should display the updated selection when 'currentSelection' prop changes", () => {
        const { rerender } = renderComponent(initialSelection);
        const selectionButtonInitial = screen.getByRole("button", { name: /release date/i });

        expect(selectionButtonInitial).toHaveTextContent(initialSelection);

        const updatedSelection = SORT_OPTIONS[1];

        rerender(<SortControl currentSelection={updatedSelection} onSelectionChange={onSelectionChangeMock} />);
        const selectionButtonUpdated = screen.getByRole("button", { name: /title/i });

        expect(selectionButtonUpdated).toBeInTheDocument();
        expect(selectionButtonUpdated).toHaveTextContent(updatedSelection);
    });
});
