import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { App } from "./App";
import { MovieListPage } from "@/pages/MovieListPage/MovieListPage";

jest.mock("@/pages/MovieListPage/MovieListPage", () => ({
    MovieListPage: jest.fn(() => <div data-testid="mocked-movie-list-page">Mocked Movie List Page</div>),
}));

describe("App", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Should render App component correctly", () => {
        const { asFragment } = render(<App />);
        const appContainer = screen.getByTestId("app-container");

        expect(appContainer).toHaveClass("flex", "flex-col", "items-center", "justify-center");
        expect(screen.getByTestId("mocked-movie-list-page")).toBeInTheDocument();
        expect(MovieListPage).toHaveBeenCalled();
        expect(asFragment()).toMatchSnapshot();
    });
});
