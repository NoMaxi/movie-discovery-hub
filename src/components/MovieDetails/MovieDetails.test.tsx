import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { formatDuration } from "@/utils/formatting";
import { Movie } from "@/types/common";
import { mockMovieDetails, alternativeMovieDetails } from "@/mocks/movieData";
import { MovieDetails } from "./MovieDetails";

jest.mock("@/assets/no-poster-image.png", () => "mocked-no-poster-image.png");

describe("MovieDetails", () => {
    const renderComponent = (details: Movie) => {
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

    test("Should have onError handler attached to image element", () => {
        renderComponent(mockMovieDetails);
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        expect(img).toHaveAttribute("src", mockMovieDetails.imageUrl);
        expect(img.onerror).toBeDefined();
    });

    test("Should not show fallback image when image loads successfully", () => {
        renderComponent(mockMovieDetails);
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        expect(img).toHaveAttribute("src", mockMovieDetails.imageUrl);
        expect(img).not.toHaveAttribute("src", "mocked-no-poster-image.png");
    });

    test("Should display fallback image when movie poster fails to load", async () => {
        renderComponent(mockMovieDetails);
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        expect(img).toHaveAttribute("src", mockMovieDetails.imageUrl);

        act(() => {
            img.dispatchEvent(new Event("error"));
        });

        await waitFor(() => {
            expect(img).toHaveAttribute("src", "mocked-no-poster-image.png");
        });
    });

    test("Should reset image error state when movie changes", async () => {
        const { rerender } = renderComponent(mockMovieDetails);
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        act(() => {
            img.dispatchEvent(new Event("error"));
        });

        await waitFor(() => {
            expect(img).toHaveAttribute("src", "mocked-no-poster-image.png");
        });

        rerender(<MovieDetails details={alternativeMovieDetails} />);

        const newImg = screen.getByAltText(`${alternativeMovieDetails.title} poster`);
        expect(newImg).toHaveAttribute("src", alternativeMovieDetails.imageUrl);
    });

    test("Should handle fallback image error gracefully", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        renderComponent(mockMovieDetails);
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        act(() => {
            img.dispatchEvent(new Event("error"));
        });

        await waitFor(() => {
            expect(img).toHaveAttribute("src", "mocked-no-poster-image.png");
        });

        act(() => {
            img.dispatchEvent(new Event("error"));
        });

        await waitFor(() => {
            expect(img).toHaveAttribute("src", "mocked-no-poster-image.png");
        });

        consoleSpy.mockRestore();
    });
});
