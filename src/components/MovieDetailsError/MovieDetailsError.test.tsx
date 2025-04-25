import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { MovieDetailsError } from "./MovieDetailsError";

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useRouteError: jest.fn(),
    };
});

jest.mock("@/components/common/CloseDetailsButton/CloseDetailsButton", () => ({
    CloseDetailsButton: () => <div data-testid="close-details-button" />,
}));

const { useRouteError } = jest.requireMock("react-router-dom");

describe("MovieDetailsError", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn();
    });

    const renderMovieDetailsError = (error = {}) => {
        useRouteError.mockReturnValue(error);
        return render(
            <MemoryRouter>
                <MovieDetailsError />
            </MemoryRouter>,
        );
    };

    test("Should render component with correct content", () => {
        const { asFragment } = renderMovieDetailsError();

        expect(screen.getByText("Sorry, we couldn't load the movie details.")).toBeInTheDocument();
        expect(screen.getByText("Please try again later or return to search.")).toBeInTheDocument();
        expect(screen.getByText("Back to Search")).toBeInTheDocument();
        expect(screen.getByTestId("close-details-button")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render a link back to the search page", () => {
        renderMovieDetailsError();

        const backLink = screen.getByTestId("back-to-search-link");
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute("href", "/");
        expect(backLink).toHaveClass("btn mt-5");
        expect(backLink).toHaveTextContent("Back to Search");
    });

    test("Should log the error to console", () => {
        const testError = { message: "Test error message" };
        renderMovieDetailsError(testError);

        expect(console.error).toHaveBeenCalledWith(testError);
    });

    test("Should have correct container styling", () => {
        renderMovieDetailsError();

        const container = screen.getByTestId("error-container");
        expect(container).toHaveClass("error-container");
        expect(container).toHaveClass("flex");
        expect(container).toHaveClass("flex-col");
        expect(container).toHaveClass("items-center");
        expect(container).toHaveClass("justify-center");
        expect(container).toHaveClass("relative");
        expect(container).toHaveClass("h-full");
    });
});
