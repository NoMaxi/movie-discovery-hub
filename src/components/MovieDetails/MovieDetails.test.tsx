import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { formatDuration } from "@/utils/formatting";
import { MovieDetailsData } from "@/types/common";
import MovieDetails from "./MovieDetails";

describe("MovieDetails", () => {
    const mockMovieDetails: MovieDetailsData = {
        id: "1",
        title: "Pulp Fiction",
        releaseYear: 1994,
        genres: ["Comedy", "Crime"],
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
        rating: 8.9,
        duration: 154,
        description:
            "Jules Winnfield (Samuel L. Jackson) and Vincent Vega (John Travolta) are two hit men who are out to retrieve a suitcase stolen from their employer, mob boss Marsellus Wallace (Ving Rhames). Wallace has also asked Vincent to take his wife Mia (Uma Thurman) out a few days later when Wallace himself will be out of town. Butch Coolidge (Bruce Willis) is an aging boxer who is paid by Wallace to lose his fight. The lives of these seemingly unrelated people are woven together comprising of a series of funny, bizarre and uncalled-for incidents.—Soumitra",
    };

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
        const alternativeMovieDetails: MovieDetailsData = {
            id: "2",
            imageUrl: "https://example.com/poster-alt.jpg",
            title: "Another Great Film",
            releaseYear: 2022,
            genres: ["Comedy", "Crime"],
            rating: 7.9,
            duration: 59.5,
            description: "The greatest movie in history of cinema.",
        };
        const { asFragment } = renderComponent(alternativeMovieDetails);

        expect(screen.getByAltText(`${alternativeMovieDetails.title} poster`)).toBeInTheDocument();
        expect(screen.getByText(alternativeMovieDetails.title)).toBeInTheDocument();
        expect(screen.getByText(alternativeMovieDetails.description)).toBeInTheDocument();
        expect(screen.getByText(formatDuration(alternativeMovieDetails.duration))).toBeInTheDocument();

        expect(asFragment()).toMatchSnapshot();
    });
});
