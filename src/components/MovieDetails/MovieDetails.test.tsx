import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { formatDuration } from "@/utils/formatting";
import { MovieDetailsData } from "@/types/common";
import { mockMovieDetails, alternativeMovieDetails } from "@/mocks/MovieData";
import { MovieDetails } from "./MovieDetails";

describe("MovieDetails", () => {
    const renderComponent = (details: MovieDetailsData) => {
        return render(<MovieDetails details={details} />);
    };

    test("Should render movie details correctly with provided data", () => {
        const { asFragment } = renderComponent(mockMovieDetails);
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", mockMovieDetails.imageUrl);

        expect(screen.getByText(mockMovieDetails.title)).toBeInTheDocument();
        expect(screen.getByText(mockMovieDetails.rating.toString())).toBeInTheDocument();
        expect(screen.getByText(mockMovieDetails.genres.join(", "))).toBeInTheDocument();
        expect(screen.getByText(mockMovieDetails.releaseYear.toString())).toBeInTheDocument();
        expect(screen.getByText(mockMovieDetails.description)).toBeInTheDocument();

        const expectedDuration = formatDuration(mockMovieDetails.duration);

        expect(screen.getByText(expectedDuration)).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render different movie details correctly", () => {
        const { asFragment } = renderComponent(alternativeMovieDetails);

        expect(screen.getByAltText(`${alternativeMovieDetails.title} poster`)).toBeInTheDocument();
        expect(screen.getByText(alternativeMovieDetails.title)).toBeInTheDocument();
        expect(screen.getByText(alternativeMovieDetails.description)).toBeInTheDocument();
        expect(screen.getByText(formatDuration(alternativeMovieDetails.duration))).toBeInTheDocument();

        expect(asFragment()).toMatchSnapshot();
    });
});
