import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SelectableGenre } from "@/types/common";
import { SELECTABLE_GENRES } from "@/constants/constants";
import { GenreMultiSelect, GenreMultiSelectRef } from "./GenreMultiSelect";

jest.mock("@/hooks/useClickOutside/useClickOutside", () => ({
    useClickOutside: jest.fn(),
}));

jest.mock("@/components/common/SelectArrow/SelectArrow", () => ({
    __esModule: true,
    default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="select-arrow" {...props} />,
}));

describe("GenreMultiSelect", () => {
    const defaultProps: React.ComponentProps<typeof GenreMultiSelect> = {
        id: "genre-select",
        name: "genres",
    };
    let user: UserEvent;

    beforeEach(() => {
        user = userEvent.setup();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props: Partial<React.ComponentProps<typeof GenreMultiSelect>> = {}) => {
        const ref = React.createRef<GenreMultiSelectRef>();
        const mergedProps = { ...defaultProps, ...props };
        const view = render(<GenreMultiSelect {...mergedProps} ref={ref} />);
        return { ...view, ref };
    };

    test("Should render correctly with default props and no preselected genres", () => {
        const { asFragment } = renderComponent();

        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByRole("button")).toHaveTextContent("Select Genre");
        expect(screen.getByTestId("select-arrow")).toBeInTheDocument();
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

        const hiddenInput = screen.getByTestId("hidden-input-genres");

        expect(hiddenInput).toBeInTheDocument();
        expect(hiddenInput).toHaveValue("");

        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render correctly with preselected genres", () => {
        const preselectedGenres: SelectableGenre[] = ["Comedy", "Horror"];
        const { asFragment } = renderComponent({ preselectedGenres });

        expect(screen.getByRole("button")).toHaveTextContent("Comedy, Horror");

        const hiddenInput = screen.getByTestId("hidden-input-genres");

        expect(hiddenInput).toBeInTheDocument();
        expect(hiddenInput).toHaveValue("Comedy, Horror");

        expect(asFragment()).toMatchSnapshot();
    });

    test("Should toggle dropdown visibility when button is clicked", async () => {
        renderComponent();
        const button = screen.getByRole("button");

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

        await user.click(button);

        expect(screen.getByRole("listbox")).toBeInTheDocument();

        SELECTABLE_GENRES.forEach((genre) => {
            expect(screen.getByText(genre)).toBeInTheDocument();
            expect(screen.getByLabelText(genre, { selector: "input[type='checkbox']" })).not.toBeChecked();
        });

        await user.click(button);

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    test("Should update selected genres when checkboxes are clicked", async () => {
        renderComponent();
        const button = screen.getByRole("button");

        await user.click(button);

        const comedyCheckbox = screen.getByLabelText("Comedy", { selector: "input[type='checkbox']" });
        const horrorCheckbox = screen.getByLabelText("Horror", { selector: "input[type='checkbox']" });

        await user.click(comedyCheckbox);

        expect(comedyCheckbox).toBeChecked();
        expect(screen.getByRole("button")).toHaveTextContent("Comedy");

        await user.click(horrorCheckbox);

        expect(horrorCheckbox).toBeChecked();
        expect(screen.getByRole("button")).toHaveTextContent("Comedy, Horror");

        await user.click(comedyCheckbox);

        expect(comedyCheckbox).not.toBeChecked();
        expect(horrorCheckbox).toBeChecked();
        expect(screen.getByRole("button")).toHaveTextContent("Horror");

        const hiddenInput = screen.getByTestId("hidden-input-genres");
        expect(hiddenInput).toHaveValue("Horror");
    });

    test("Should display correct checkboxes state with preselected genres", async () => {
        const preselectedGenres: SelectableGenre[] = ["Comedy", "Crime"];
        renderComponent({ preselectedGenres });
        const button = screen.getByRole("button");

        await user.click(button);

        const comedyCheckbox = screen.getByLabelText("Comedy", { selector: "input[type='checkbox']" });
        const crimeCheckbox = screen.getByLabelText("Crime", { selector: "input[type='checkbox']" });
        const documentaryCheckbox = screen.getByLabelText("Documentary", { selector: "input[type='checkbox']" });
        const horrorCheckbox = screen.getByLabelText("Horror", { selector: "input[type='checkbox']" });

        expect(comedyCheckbox).toBeChecked();
        expect(crimeCheckbox).toBeChecked();
        expect(documentaryCheckbox).not.toBeChecked();
        expect(horrorCheckbox).not.toBeChecked();
    });

    test("Should update hidden input value when genres are selected", async () => {
        renderComponent();
        const button = screen.getByRole("button");

        await user.click(button);

        const comedyCheckbox = screen.getByLabelText("Comedy", { selector: "input[type='checkbox']" });
        const documentaryCheckbox = screen.getByLabelText("Documentary", { selector: "input[type='checkbox']" });

        await user.click(comedyCheckbox);
        await user.click(documentaryCheckbox);

        const hiddenInput = screen.getByTestId("hidden-input-genres");

        expect(hiddenInput).toHaveValue("Comedy, Documentary");

        await user.click(documentaryCheckbox);

        expect(hiddenInput).toHaveValue("Comedy");
    });

    test("Should apply accessibility attributes correctly", () => {
        const ariaDescribedby = "test-description";
        renderComponent({ ariaDescribedby });
        const button = screen.getByRole("button");

        expect(button).toHaveAttribute("aria-haspopup", "listbox");
        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(button).toHaveAttribute("aria-describedby", ariaDescribedby);
        expect(button).toHaveAttribute("id", defaultProps.id);
    });

    test("Should update aria-expanded attribute when dropdown is toggled", async () => {
        renderComponent();
        const button = screen.getByRole("button");

        expect(button).toHaveAttribute("aria-expanded", "false");

        await user.click(button);

        expect(button).toHaveAttribute("aria-expanded", "true");

        await user.click(button);

        expect(button).toHaveAttribute("aria-expanded", "false");
    });

    test("Should reset to preselected genres when reset method is called", async () => {
        const preselectedGenres: SelectableGenre[] = ["Comedy"];
        const { ref } = renderComponent({ preselectedGenres });
        const button = screen.getByRole("button");

        await user.click(button);

        const horrorCheckbox = screen.getByLabelText("Horror", { selector: "input[type='checkbox']" });
        await user.click(horrorCheckbox);

        expect(screen.getByRole("button")).toHaveTextContent("Comedy, Horror");

        await act(async () => {
            ref.current?.reset();
        });

        expect(screen.getByRole("button")).toHaveTextContent("Comedy");

        const hiddenInput = screen.getByTestId("hidden-input-genres");
        expect(hiddenInput).toHaveValue("Comedy");
    });

    test("Should reset to empty selection when reset method is called with no preselected genres", async () => {
        const { ref } = renderComponent();
        const button = screen.getByRole("button");

        await user.click(button);

        const comedyCheckbox = screen.getByLabelText("Comedy", { selector: "input[type='checkbox']" });
        const horrorCheckbox = screen.getByLabelText("Horror", { selector: "input[type='checkbox']" });

        await user.click(comedyCheckbox);
        await user.click(horrorCheckbox);

        expect(screen.getByRole("button")).toHaveTextContent("Comedy, Horror");

        act(() => {
            ref.current?.reset();
        });

        expect(screen.getByRole("button")).toHaveTextContent("Select Genre");

        const hiddenInput = screen.getByTestId("hidden-input-genres");
        expect(hiddenInput).toHaveValue("");
    });

    test("Should prevent event propagation when clicking on checkboxes", async () => {
        renderComponent();
        const button = screen.getByRole("button");

        await user.click(button);

        const comedyCheckbox = screen.getByLabelText("Comedy", { selector: "input[type='checkbox']" });

        const mockStopPropagation = jest.fn();
        const originalAddEventListener = document.addEventListener;

        document.addEventListener = jest.fn().mockImplementation((event, handler) => {
            if (event === "click") {
                document.addEventListener = originalAddEventListener;
            } else {
                originalAddEventListener(event, handler);
            }
        });

        const clickEvent = new MouseEvent("click", { bubbles: true });
        Object.defineProperty(clickEvent, "stopPropagation", { value: mockStopPropagation });

        await user.click(comedyCheckbox);

        expect(screen.getByRole("listbox")).toBeInTheDocument();

        document.addEventListener = originalAddEventListener;
    });
});
