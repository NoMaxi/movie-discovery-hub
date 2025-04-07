import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchForm } from "./SearchForm";

describe("SearchForm", () => {
    const placeholderText = "What do you want to watch?";
    const searchText = "movie title";
    let onSearchMock: jest.Mock;

    beforeEach(() => {
        onSearchMock = jest.fn();
    });

    test("Should render input with an initial value if initialQuery is provided in props", () => {
        const { asFragment } = render(<SearchForm initialQuery={searchText} onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText(placeholderText);

        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(searchText);
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render empty input if no initialQuery is provided in props", () => {
        const { asFragment } = render(<SearchForm onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText(placeholderText);

        expect(input).toBeInTheDocument();
        expect(input).toHaveValue("");
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should update input value when user types text in the input", () => {
        render(<SearchForm onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText(placeholderText);

        fireEvent.change(input, { target: { value: searchText } });

        expect(input).toHaveValue(searchText);
    });

    test("Should call 'onSearch' prop with input value when search button is clicked", () => {
        render(<SearchForm onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText(placeholderText);
        const button = screen.getByText("Search");

        fireEvent.change(input, { target: { value: searchText } });
        fireEvent.click(button);

        expect(onSearchMock).toHaveBeenCalledWith(searchText);
    });

    test("Should call 'onSearch' prop with input value when Enter key is pressed in the input", () => {
        render(<SearchForm onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText(placeholderText);

        fireEvent.change(input, { target: { value: searchText } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(onSearchMock).toHaveBeenCalledWith(searchText);
    });

    test("Should not call 'onSearch' prop when Enter key is pressed in the input if the input value is empty", () => {
        render(<SearchForm onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText(placeholderText);

        fireEvent.keyDown(input, { key: "Enter" });

        expect(onSearchMock).not.toHaveBeenCalled();
    });

    test("Should not call 'onSearch' prop when a non-Enter key is pressed in the input", () => {
        render(<SearchForm onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText(placeholderText);

        fireEvent.change(input, { target: { value: searchText } });
        fireEvent.keyDown(input, { key: "Space" });

        expect(onSearchMock).not.toHaveBeenCalled();
    });
});
