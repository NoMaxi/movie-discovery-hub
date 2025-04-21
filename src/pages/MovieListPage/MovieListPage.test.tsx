import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Genre, Movie, SortOption } from "@/types/common";
import { MovieListPage } from "./MovieListPage";
import { movieService } from "@/services/movieService";

beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
    window.scrollTo = jest.fn();

    class MockIntersectionObserver implements IntersectionObserver {
        readonly root: Element | null = null;
        readonly rootMargin: string = "";
        readonly thresholds: ReadonlyArray<number> = [];

        constructor() {}

        disconnect(): void {}
        observe(): void {}
        unobserve(): void {}
        takeRecords(): IntersectionObserverEntry[] {
            return [];
        }
    }

    global.IntersectionObserver = MockIntersectionObserver;
});

jest.mock("@/components/TopBar/TopBar", () => ({
    TopBar: ({ onAddMovieClick }: { onAddMovieClick: () => void }) => (
        <div data-testid="top-bar" onClick={onAddMovieClick}>
            Top Bar
        </div>
    ),
}));

jest.mock("@/components/Header/Header", () => ({
    Header: ({
        searchQuery,
        onSearch,
        showDetailsSection,
        selectedMovie,
        onDetailsClose,
    }: {
        searchQuery: string;
        onSearch: (query: string) => void;
        showDetailsSection: boolean;
        selectedMovie: Movie | null;
        onDetailsClose: () => void;
    }) => (
        <div data-testid="header">
            {showDetailsSection && selectedMovie && <div data-testid="movie-details">{selectedMovie.title}</div>}
            {showDetailsSection && (
                <button data-testid="close-details" onClick={onDetailsClose}>
                    Close
                </button>
            )}
            <input
                data-testid="search-input"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search movies"
            />
        </div>
    ),
}));

jest.mock("@/components/GenreSelect/GenreSelect", () => ({
    GenreSelect: ({ selectedGenre, onSelect }: { selectedGenre: string; onSelect: (genre: string) => void }) => (
        <div data-testid="genre-select" onClick={() => onSelect("Drama")}>
            Genre Select: {selectedGenre}
        </div>
    ),
}));

jest.mock("@/components/SortControl/SortControl", () => ({
    SortControl: ({
        currentSelection,
        onSelectionChange,
    }: {
        currentSelection: string;
        onSelectionChange: (selection: string) => void;
    }) => (
        <div data-testid="sort-control" onClick={() => onSelectionChange("Title")}>
            Sort Control: {currentSelection}
        </div>
    ),
}));

jest.mock("@/components/MovieTile/MovieTile", () => ({
    MovieTile: ({
        movie,
        onClick,
        onEdit,
        onDelete,
    }: {
        movie: Movie;
        onClick: (movie: Movie, e: React.MouseEvent) => void;
        onEdit: (movie: Movie) => void;
        onDelete: (movie: Movie) => void;
    }) => (
        <div data-testid="movie-tile" data-movie-id={movie.id} onClick={(e) => onClick(movie, e)}>
            {movie.title}
            <button
                data-testid="edit-movie-button"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(movie);
                }}
            >
                Edit
            </button>
            <button
                data-testid="delete-movie-button"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(movie);
                }}
            >
                Delete
            </button>
        </div>
    ),
}));

jest.mock("@/components/common/Loader/Loader", () => ({
    Loader: () => <div data-testid="loader">Loading...</div>,
}));

jest.mock("@/components/common/NetflixRouletteText/NetflixRouletteText", () => ({
    NetflixRouletteText: () => <div data-testid="footer-text">Netflix Roulette</div>,
}));

jest.mock("@tanstack/react-query", () => ({
    useInfiniteQuery: jest.fn(),
    useQueryClient: jest.fn(),
}));

jest.mock("react-intersection-observer", () => ({
    useInView: jest.fn(),
}));

jest.mock("@/services/movieService", () => ({
    movieService: {
        getMovies: jest.fn(),
        deleteMovie: jest.fn(),
    },
}));

describe("MovieListPage", () => {
    const useInfiniteQueryMock = useInfiniteQuery as jest.Mock;
    const useQueryClientMock = useQueryClient as jest.Mock;
    const useInViewMock = useInView as jest.Mock;
    const movieServiceDeleteMock = movieService.deleteMovie as jest.Mock;
    let fetchNextPageSpy: jest.Mock;
    let invalidateQueriesSpy: jest.Mock;
    let user: UserEvent;

    beforeEach(() => {
        jest.clearAllMocks();
        fetchNextPageSpy = jest.fn();
        invalidateQueriesSpy = jest.fn();
        useQueryClientMock.mockReturnValue({ invalidateQueries: invalidateQueriesSpy });
        useInViewMock.mockReturnValue({ ref: jest.fn(), inView: false });
        movieServiceDeleteMock.mockResolvedValue(undefined);
        jest.spyOn(console, "log").mockImplementation();
        jest.spyOn(console, "error").mockImplementation();
        user = userEvent.setup();
    });

    const mockMovie: Movie = {
        id: 1,
        title: "Movie A",
        imageUrl: "image.jpg",
        releaseYear: 2021,
        genres: ["Action"],
        rating: 8.5,
        duration: 120,
        description: "Test movie",
    };

    const setupInfiniteQuery = (overrides = {}) => {
        useInfiniteQueryMock.mockReturnValue({
            data: {
                pages: [
                    {
                        movies: [mockMovie],
                        totalAmount: 1,
                        offset: 0,
                        limit: 10,
                        nextOffset: 1,
                    },
                ],
            },
            isLoading: false,
            isError: false,
            isFetching: false,
            fetchNextPage: fetchNextPageSpy,
            hasNextPage: false,
            isFetchingNextPage: false,
            error: null,
            ...overrides,
        });
    };

    test("Should show total count banner and footer always", () => {
        setupInfiniteQuery();

        render(<MovieListPage />);
        const countElement = screen.getByTestId("movie-count");

        expect(countElement).toBeInTheDocument();
        expect(countElement).toHaveTextContent(/^\d+ movies found$/i);
        expect(screen.getByTestId("footer-text")).toBeInTheDocument();
    });

    test("Should load more when sentinel becomes visible & hasNextPage", () => {
        setupInfiniteQuery({ hasNextPage: true });
        useInViewMock.mockReturnValue({ ref: jest.fn(), inView: true });

        render(<MovieListPage />);

        expect(fetchNextPageSpy).toHaveBeenCalledTimes(1);
    });

    test("Should not load more if already fetchingNextPage", () => {
        setupInfiniteQuery({ hasNextPage: true, isFetchingNextPage: true });
        useInViewMock.mockReturnValue({ ref: jest.fn(), inView: true });

        render(<MovieListPage />);

        expect(fetchNextPageSpy).not.toHaveBeenCalled();
    });

    test("Should render 'Loading more...' when isFetchingNextPage", () => {
        setupInfiniteQuery({ isFetchingNextPage: true, hasNextPage: true });

        render(<MovieListPage />);

        expect(screen.getByText("Loading more...")).toBeInTheDocument();
    });

    test("Should render loader when loading movies", () => {
        useInfiniteQueryMock.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            isFetching: true,
            fetchNextPage: jest.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            error: null,
        });

        render(<MovieListPage />);

        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    test("Should show error UI on query failure", () => {
        useInfiniteQueryMock.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            isFetching: false,
            fetchNextPage: jest.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            error: new Error("Test error"),
        });

        render(<MovieListPage />);

        expect(screen.getByText(/Test error/)).toBeInTheDocument();
    });

    test("Should show empty state when no movies", () => {
        useInfiniteQueryMock.mockReturnValue({
            data: { pages: [{ movies: [], totalAmount: 0, offset: 0, limit: 10 }] },
            isLoading: false,
            isError: false,
            isFetching: false,
            fetchNextPage: jest.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            error: null,
        });

        render(<MovieListPage />);

        expect(screen.getByText("No movies found.")).toBeInTheDocument();
    });

    test("Should render movies when data is available", async () => {
        setupInfiniteQuery();

        render(<MovieListPage />);

        expect(screen.getByTestId("movie-tile")).toBeInTheDocument();
        expect(screen.getByTestId("movie-tile")).toHaveTextContent("Movie A");
    });

    test("Should open movie details when a tile is clicked", async () => {
        setupInfiniteQuery();

        render(<MovieListPage />);
        const tile = screen.getByTestId("movie-tile");

        await user.click(tile);

        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
        expect(screen.getByTestId("movie-details")).toHaveTextContent("Movie A");
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    test("Should close movie details when details close callback is called", async () => {
        setupInfiniteQuery();

        render(<MovieListPage />);
        const tile = screen.getByTestId("movie-tile");

        await user.click(tile);
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();

        const closeButton = screen.getByTestId("close-details");
        await user.click(closeButton);

        expect(screen.queryByTestId("movie-details")).not.toBeInTheDocument();
        expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "nearest",
        });
    });

    test("Should handle genre selection", async () => {
        setupInfiniteQuery();
        const originalGenreSelectMock = jest.requireMock("@/components/GenreSelect/GenreSelect").GenreSelect;
        jest.requireMock("@/components/GenreSelect/GenreSelect").GenreSelect = ({
            onSelect,
        }: {
            onSelect: (genre: Genre) => void;
        }) => {
            return (
                <div
                    data-testid="genre-select"
                    onClick={() => {
                        onSelect("Comedy");
                        invalidateQueriesSpy();
                    }}
                >
                    Genre Select
                </div>
            );
        };

        render(<MovieListPage />);
        const genreSelect = screen.getByTestId("genre-select");

        await user.click(genreSelect);

        expect(invalidateQueriesSpy).toHaveBeenCalled();

        jest.requireMock("@/components/GenreSelect/GenreSelect").GenreSelect = originalGenreSelectMock;
    });

    test("Should handle sort criterion change", async () => {
        setupInfiniteQuery();
        const originalSortControlMock = jest.requireMock("@/components/SortControl/SortControl").SortControl;
        jest.requireMock("@/components/SortControl/SortControl").SortControl = ({
            onSelectionChange,
        }: {
            onSelectionChange: (newSelection: SortOption) => void;
        }) => {
            return (
                <div
                    data-testid="sort-control"
                    onClick={() => {
                        onSelectionChange("Title");
                        invalidateQueriesSpy();
                    }}
                >
                    Sort Control
                </div>
            );
        };

        render(<MovieListPage />);
        const sortControl = screen.getByTestId("sort-control");

        await user.click(sortControl);

        expect(invalidateQueriesSpy).toHaveBeenCalled();

        jest.requireMock("@/components/SortControl/SortControl").SortControl = originalSortControlMock;
    });

    test("Should handle add movie click", async () => {
        setupInfiniteQuery();

        render(<MovieListPage />);
        const addButton = screen.getByTestId("top-bar");

        await user.click(addButton);

        expect(console.log).toHaveBeenCalledWith("Add movie - Placeholder");
    });

    test("Should handle movie edit", async () => {
        setupInfiniteQuery();

        render(<MovieListPage />);
        const editButton = screen.getByTestId("edit-movie-button");

        await user.click(editButton);

        expect(console.log).toHaveBeenCalledWith("Edit movie:", mockMovie.id, "- Placeholder");
    });

    test("Should handle successful movie deletion", async () => {
        setupInfiniteQuery();

        render(<MovieListPage />);
        const deleteButton = screen.getByTestId("delete-movie-button");

        await user.click(deleteButton);

        expect(movieService.deleteMovie).toHaveBeenCalledWith(mockMovie.id);
        expect(invalidateQueriesSpy).toHaveBeenCalled();
        expect(screen.queryByText(/Failed to delete movie/)).not.toBeInTheDocument();
    });

    test("Should handle movie deletion error", async () => {
        setupInfiniteQuery();
        movieServiceDeleteMock.mockRejectedValue(new Error("Delete failed"));

        render(<MovieListPage />);
        const deleteButton = screen.getByTestId("delete-movie-button");

        await user.click(deleteButton);

        expect(movieService.deleteMovie).toHaveBeenCalledWith(mockMovie.id);
        expect(console.error).toHaveBeenCalledWith("Failed to delete movie:", expect.any(Error));

        await waitFor(() => {
            expect(screen.getByText(/Failed to delete movie/)).toBeInTheDocument();
        });
    });

    test("Should show deleting state during movie deletion", async () => {
        setupInfiniteQuery();
        movieServiceDeleteMock.mockReturnValue(
            new Promise((resolve) => {
                setTimeout(() => resolve(undefined), 100);
            }),
        );

        render(<MovieListPage />);
        const deleteButton = screen.getByTestId("delete-movie-button");

        await user.click(deleteButton);

        expect(screen.getByText(/Deleting\.\.\./)).toBeInTheDocument();
    });

    test("Should reset selected movie when deleting the currently selected movie", async () => {
        setupInfiniteQuery();

        render(<MovieListPage />);
        const tile = screen.getByTestId("movie-tile");

        await user.click(tile);

        expect(screen.getByTestId("movie-details")).toBeInTheDocument();

        const deleteButton = screen.getByTestId("delete-movie-button");

        await user.click(deleteButton);

        expect(screen.queryByTestId("movie-details")).not.toBeInTheDocument();
    });
});
