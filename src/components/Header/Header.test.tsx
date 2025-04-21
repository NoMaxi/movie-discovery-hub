import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { mockMovieDetails } from "@/mocks/movieData";
import { Header } from "./Header";

describe("Header", () => {
    const defaultProps = {
        searchQuery: "",
        onSearch: jest.fn(),
        showDetailsSection: false,
        selectedMovie: null,
        onDetailsClose: jest.fn(),
    };
    let onSearchMock: jest.Mock;
    let onDetailsCloseMock: jest.Mock;
    let user: UserEvent;

    beforeEach(() => {
        onSearchMock = jest.fn();
        onDetailsCloseMock = jest.fn();
        user = userEvent.setup();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props = {}) => {
        return render(
            <Header {...defaultProps} onSearch={onSearchMock} onDetailsClose={onDetailsCloseMock} {...props} />,
        );
    };

    test("Should render search view with initial query", () => {
        renderComponent({ searchQuery: " test " });
        const heading = screen.getByRole("heading", { name: "Find Your Movie", level: 2 });

        expect(heading).toBeInTheDocument();

        const input = screen.getByTestId("search-input");

        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(" test ");

        const button = screen.getByTestId("search-button");

        expect(button).toBeInTheDocument();
    });

    test("Should call onSearch with trimmed query when pressing Enter in search input", async () => {
        renderComponent();
        const input = screen.getByTestId("search-input");

        await user.clear(input);
        await user.type(input, "  Apollo Movie  ");
        await user.keyboard("{Enter}");

        expect(onSearchMock).toHaveBeenCalledWith("Apollo Movie");
    });

    test("Should call onSearch with trimmed query when clicking search button", async () => {
        renderComponent();
        const input = screen.getByTestId("search-input");
        const button = screen.getByTestId("search-button");

        await user.clear(input);
        await user.type(input, "  Matrix  ");
        await user.click(button);

        expect(onSearchMock).toHaveBeenCalledWith("Matrix");
    });

    test("Should render details section and handle close action", async () => {
        renderComponent({ showDetailsSection: true, selectedMovie: mockMovieDetails });
        const closeButton = screen.getByRole("button", { name: "Close movie details" });

        expect(closeButton).toBeInTheDocument();
        expect(screen.getByText(mockMovieDetails.title)).toBeInTheDocument();

        await user.click(closeButton);

        expect(onDetailsCloseMock).toHaveBeenCalledTimes(1);
    });
});
