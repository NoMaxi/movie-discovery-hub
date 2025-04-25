import { render, screen } from "@testing-library/react";
import { useLoaderData } from "react-router-dom";
import "@testing-library/jest-dom";
import { Movie } from "@/types/common";
import { mockAPIMovie } from "@/mocks/movieData";
import { MovieDetailsPage } from "./MovieDetailsPage";

jest.mock("react-router-dom", () => ({
    useLoaderData: jest.fn(),
}));

jest.mock("@/components/MovieDetails/MovieDetails", () => ({
    MovieDetails: ({ details }: { details: Movie }) => (
        <div data-testid="movie-details" data-details={JSON.stringify(details)} />
    ),
}));

jest.mock("@/components/common/CloseDetailsButton/CloseDetailsButton", () => ({
    CloseDetailsButton: () => <div data-testid="close-details-button" />,
}));

describe("MovieDetailsPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useLoaderData as jest.Mock).mockReturnValue({ movieDetails: mockAPIMovie });
    });

    test("Should render component correctly", () => {
        const { asFragment } = render(<MovieDetailsPage />);
        const mainContainer = screen.getByTestId("movie-details-container");

        expect(mainContainer).toHaveClass("relative");
        expect(screen.getByTestId("close-details-button")).toBeInTheDocument();
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should pass correct movie details to MovieDetails component", () => {
        render(<MovieDetailsPage />);
        const movieDetailsComponent = screen.getByTestId("movie-details");
        const passedDetails = JSON.parse(movieDetailsComponent.getAttribute("data-details") || "{}");

        expect(passedDetails).toEqual(mockAPIMovie);
    });

    test("Should handle different movie data correctly", () => {
        const differentMovieDetails = {
            ...mockAPIMovie,
            id: 456,
            title: "Another Movie",
            overview: "Another overview",
            poster_path: "https://example.com/another-poster.jpg",
            release_date: "2024-02-02",
            vote_average: 7.2,
        };
        (useLoaderData as jest.Mock).mockReturnValue({ movieDetails: differentMovieDetails });

        render(<MovieDetailsPage />);
        const movieDetailsComponent = screen.getByTestId("movie-details");
        const passedDetails = JSON.parse(movieDetailsComponent.getAttribute("data-details") || "{}");

        expect(passedDetails).toEqual(differentMovieDetails);
    });
});
