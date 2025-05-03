import React, { ReactNode } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Movie, SortOption } from "@/types/common";
import { movieService } from "@/services/movieService";
import { ScrollProvider } from "@/contexts/ScrollContext/ScrollProvider";
import { useScrollContext } from "@/contexts/ScrollContext/useScrollContext";
import { useNavigateWithSearchParams } from "@/hooks/useNavigateWithSearchParams/useNavigateWithSearchParams";
import { MovieListPage } from "./MovieListPage";

jest.mock("@/contexts/ScrollContext/useScrollContext");
jest.mock("@/hooks/useNavigateWithSearchParams/useNavigateWithSearchParams");

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
    Header: () => (
        <div data-testid="header">
            <div>Header Component</div>
        </div>
    ),
}));

jest.mock("@/components/GenreSelect/GenreSelect", () => ({
    GenreSelect: ({ selectedGenre, onSelect }: { selectedGenre: string; onSelect: (genre: string) => void }) => (
        <div data-testid="genre-select" onClick={() => onSelect("Documentary")}>
            Genre Select: {selectedGenre}
        </div>
    ),
}));

jest.mock("@/components/SortControl/SortControl", () => ({
    SortControl: ({
        currentSelection,
        onSelectionChange,
    }: {
        currentSelection: SortOption;
        onSelectionChange: (newSelection: SortOption) => void;
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
    ...jest.requireActual("@tanstack/react-query"),
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

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useSearchParams: jest.fn(),
}));

const renderWithProviders = (ui: React.ReactElement, { queryClient }: { queryClient?: QueryClient } = {}) => {
    const client = queryClient || new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const Wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>
            <ScrollProvider>{children}</ScrollProvider>
        </QueryClientProvider>
    );
    return render(ui, { wrapper: Wrapper });
};

describe("MovieListPage", () => {
    const useInfiniteQueryMock = useInfiniteQuery as jest.Mock;
    const useQueryClientMock = useQueryClient as jest.Mock;
    const useInViewMock = useInView as jest.Mock;
    const movieServiceDeleteMock = movieService.deleteMovie as jest.Mock;
    const useScrollContextMock = useScrollContext as jest.Mock;
    const useNavigateWithSearchParamsMock = useNavigateWithSearchParams as jest.Mock;
    let fetchNextPageSpy: jest.Mock;
    let invalidateQueriesSpy: jest.Mock;
    let mockNavigateWithSearchParams: jest.Mock;
    let mockSetTargetMovieId: jest.Mock;
    let mockSetTriggerScroll: jest.Mock;
    let user: UserEvent;
    let mockSetSearchParams: jest.Mock;
    let currentSearchParamsState: URLSearchParams;

    beforeEach(() => {
        jest.clearAllMocks();
        fetchNextPageSpy = jest.fn();
        invalidateQueriesSpy = jest.fn();
        mockNavigateWithSearchParams = jest.fn();
        mockSetTargetMovieId = jest.fn();
        mockSetTriggerScroll = jest.fn();

        useQueryClientMock.mockReturnValue({ invalidateQueries: invalidateQueriesSpy });
        useInViewMock.mockReturnValue({ ref: jest.fn(), inView: false });
        movieServiceDeleteMock.mockResolvedValue(undefined);
        useScrollContextMock.mockReturnValue({
            targetMovieId: null,
            setTargetMovieId: mockSetTargetMovieId,
            triggerScroll: false,
            setTriggerScroll: mockSetTriggerScroll,
        });
        useNavigateWithSearchParamsMock.mockReturnValue(mockNavigateWithSearchParams);

        jest.spyOn(console, "error").mockImplementation(() => {});
        user = userEvent.setup();

        currentSearchParamsState = new URLSearchParams({ sortBy: "Release Date", genre: "All" });

        mockSetSearchParams = jest.fn((newParams) => {
            currentSearchParamsState = newParams;
            (useSearchParams as jest.Mock).mockReturnValue([currentSearchParamsState, mockSetSearchParams]);
        });

        (useParams as jest.Mock).mockReturnValue({ movieId: undefined });
        (useSearchParams as jest.Mock).mockReturnValue([currentSearchParamsState, mockSetSearchParams]);
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

    test("Should match snapshot for default state", () => {
        setupInfiniteQuery();

        const { asFragment } = renderWithProviders(<MovieListPage />);

        expect(asFragment()).toMatchSnapshot();
    });

    test("Should show total count banner and footer always", () => {
        setupInfiniteQuery();

        renderWithProviders(<MovieListPage />);
        const countElement = screen.getByTestId("movie-count");

        expect(countElement).toBeInTheDocument();
        expect(countElement).toHaveTextContent(/^\d+ movies found$/i);
        expect(screen.getByTestId("footer-text")).toBeInTheDocument();
    });

    test("Should handle the useEffect dependency for load more correctly", () => {
        setupInfiniteQuery({ hasNextPage: true });
        useInViewMock.mockReturnValue({ ref: jest.fn(), inView: false });

        const { rerender } = renderWithProviders(<MovieListPage />);
        expect(fetchNextPageSpy).not.toHaveBeenCalled();

        useInViewMock.mockReturnValue({ ref: jest.fn(), inView: true });
        rerender(
            <QueryClientProvider client={new QueryClient()}>
                <ScrollProvider>
                    <MovieListPage />
                </ScrollProvider>
            </QueryClientProvider>,
        );

        expect(fetchNextPageSpy).toHaveBeenCalledTimes(1);

        setupInfiniteQuery({ hasNextPage: false });
        rerender(
            <QueryClientProvider client={new QueryClient()}>
                <ScrollProvider>
                    <MovieListPage />
                </ScrollProvider>
            </QueryClientProvider>,
        );

        expect(fetchNextPageSpy).toHaveBeenCalledTimes(1);
    });

    test("Should not load more if already fetchingNextPage", () => {
        setupInfiniteQuery({ hasNextPage: true, isFetchingNextPage: true });
        useInViewMock.mockReturnValue({ ref: jest.fn(), inView: true });

        renderWithProviders(<MovieListPage />);

        expect(fetchNextPageSpy).not.toHaveBeenCalled();
    });

    test("Should render 'Loading more...' when isFetchingNextPage", () => {
        setupInfiniteQuery({ isFetchingNextPage: true, hasNextPage: true });

        renderWithProviders(<MovieListPage />);

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

        renderWithProviders(<MovieListPage />);

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

        renderWithProviders(<MovieListPage />);

        expect(screen.getByText(/Test error/)).toBeInTheDocument();
    });

    test("Should show generic error message when error is not an Error object", () => {
        useInfiniteQueryMock.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            isFetching: false,
            fetchNextPage: jest.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            error: "String error",
        });

        renderWithProviders(<MovieListPage />);

        expect(screen.getByText(/An unknown error occurred while fetching movies/)).toBeInTheDocument();
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

        renderWithProviders(<MovieListPage />);

        expect(screen.getByText("No movies found.")).toBeInTheDocument();
    });

    test("Should handle case when no pages data is available", () => {
        useInfiniteQueryMock.mockReturnValue({
            data: { pages: [] },
            isLoading: false,
            isError: false,
            isFetching: false,
            fetchNextPage: jest.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            error: null,
        });

        renderWithProviders(<MovieListPage />);
        const countElement = screen.getByTestId("movie-count");

        expect(countElement).toHaveTextContent("0 movies found");

        expect(screen.getByText("No movies found.")).toBeInTheDocument();
    });

    test("Should render movies when data is available", async () => {
        setupInfiniteQuery();

        renderWithProviders(<MovieListPage />);

        expect(screen.getByTestId("movie-tile")).toBeInTheDocument();
        expect(screen.getByTestId("movie-tile")).toHaveTextContent("Movie A");
    });

    test("Should navigate to movie details when a tile is clicked", async () => {
        setupInfiniteQuery();
        (useSearchParams as jest.Mock).mockReturnValue([
            new URLSearchParams({ sortBy: "Release Date", genre: "All" }),
            jest.fn(),
        ]);

        renderWithProviders(<MovieListPage />);
        const tile = screen.getByTestId("movie-tile");

        await user.click(tile);

        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith(String(mockMovie.id));
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    test("Should scroll to the last clicked tile when returning from movie details", async () => {
        setupInfiniteQuery();
        const scrollIntoViewMock = jest.fn();
        const mockRef = { current: null as HTMLDivElement | null };
        jest.spyOn(React, "useRef").mockReturnValue(mockRef);
        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
            configurable: true,
            value: scrollIntoViewMock,
        });

        (useParams as jest.Mock).mockReturnValue({ movieId: undefined });
        const { rerender } = renderWithProviders(<MovieListPage />);
        const tile = screen.getByTestId("movie-tile");

        await user.click(tile);
        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith(String(mockMovie.id));
        mockRef.current = tile as HTMLDivElement;

        (useParams as jest.Mock).mockReturnValue({ movieId: "1" });
        rerender(
            <QueryClientProvider client={new QueryClient()}>
                <ScrollProvider>
                    <MovieListPage />
                </ScrollProvider>
            </QueryClientProvider>,
        );
        expect(scrollIntoViewMock).not.toHaveBeenCalled();

        (useParams as jest.Mock).mockReturnValue({ movieId: undefined });
        rerender(
            <QueryClientProvider client={new QueryClient()}>
                <ScrollProvider>
                    <MovieListPage />
                </ScrollProvider>
            </QueryClientProvider>,
        );

        await waitFor(() => {
            expect(scrollIntoViewMock).toHaveBeenCalledWith({
                behavior: "smooth",
                block: "nearest",
            });
        });
        expect(mockRef.current).toBeNull();

        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
            configurable: true,
            value: Element.prototype.scrollIntoView,
        });
        jest.restoreAllMocks();
    });

    test("Should handle genre selection by updating search params", async () => {
        setupInfiniteQuery();

        renderWithProviders(<MovieListPage />);
        const genreSelect = screen.getByTestId("genre-select");

        await user.click(genreSelect);

        expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

        expect(currentSearchParamsState.get("genre")).toBe("Documentary");
        expect(currentSearchParamsState.get("sortBy")).toBe("Release Date");
    });

    test("Should handle sort criterion change by updating search params", async () => {
        setupInfiniteQuery();

        renderWithProviders(<MovieListPage />);
        const sortControl = screen.getByTestId("sort-control");

        await user.click(sortControl);

        expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

        expect(currentSearchParamsState.get("sortBy")).toBe("Title");
        expect(currentSearchParamsState.get("genre")).toBe("All");
    });

    test("Should handle add movie click", async () => {
        setupInfiniteQuery();

        renderWithProviders(<MovieListPage />);
        const addButton = screen.getByTestId("top-bar");

        await user.click(addButton);

        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith("/new");
    });

    test("Should handle movie edit", async () => {
        setupInfiniteQuery();

        renderWithProviders(<MovieListPage />);
        const editButton = screen.getByTestId("edit-movie-button");

        await user.click(editButton);

        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith(`/${mockMovie.id}/edit`);
    });

    test("Should handle successful movie deletion", async () => {
        setupInfiniteQuery();

        renderWithProviders(<MovieListPage />);
        const deleteButton = screen.getByTestId("delete-movie-button");

        await user.click(deleteButton);

        expect(movieService.deleteMovie).toHaveBeenCalledWith(mockMovie.id);

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalled();
        });

        expect(screen.queryByText(/Failed to delete movie/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Deleting/)).not.toBeInTheDocument();
    });

    test("Should invalidate queries with correct parameters after movie deletion", async () => {
        setupInfiniteQuery();
        (useSearchParams as jest.Mock).mockReturnValue([
            new URLSearchParams({ query: "search term", sortBy: "Title", genre: "Documentary" }),
            jest.fn(),
        ]);

        renderWithProviders(<MovieListPage />);
        const deleteButton = screen.getByTestId("delete-movie-button");

        await user.click(deleteButton);

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalledWith({
                queryKey: ["movies", "Documentary", "Title", "search term"],
            });
        });
    });

    test("Should handle movie deletion error", async () => {
        setupInfiniteQuery();
        movieServiceDeleteMock.mockRejectedValue(new Error("Delete failed"));

        renderWithProviders(<MovieListPage />);
        const deleteButton = screen.getByTestId("delete-movie-button");

        await user.click(deleteButton);

        expect(movieService.deleteMovie).toHaveBeenCalledWith(mockMovie.id);
        expect(console.error).toHaveBeenCalledWith("Failed to delete movie:", expect.any(Error));

        await waitFor(() => {
            expect(screen.getByText(/Failed to delete movie/)).toBeInTheDocument();
        });
    });

    test("Should extract search query, sort criterion, and genre from URL parameters", () => {
        setupInfiniteQuery();
        (useSearchParams as jest.Mock).mockReturnValue([
            new URLSearchParams({ query: "test search", sortBy: "Title", genre: "Documentary" }),
            jest.fn(),
        ]);

        renderWithProviders(<MovieListPage />);

        expect(useInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["movies", "Documentary", "Title", "test search"],
            }),
        );
    });

    test("Should use default values when URL parameters are not provided", () => {
        setupInfiniteQuery();
        (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams({}), jest.fn()]);

        renderWithProviders(<MovieListPage />);

        expect(useInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["movies", "All", "Release Date", ""],
            }),
        );
    });

    test("Should navigate without query params when no search params exist", async () => {
        setupInfiniteQuery();
        (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams({}), jest.fn()]);

        renderWithProviders(<MovieListPage />);
        const tile = screen.getByTestId("movie-tile");

        await user.click(tile);

        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith(String(mockMovie.id));
    });

    test("Should not scroll when movieId is present in URL", () => {
        setupInfiniteQuery();
        (useParams as jest.Mock).mockReturnValue({ movieId: "1" });
        const scrollIntoViewMock = jest.fn();
        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
            configurable: true,
            value: scrollIntoViewMock,
        });

        useScrollContextMock.mockReturnValue({
            targetMovieId: 1,
            setTargetMovieId: mockSetTargetMovieId,
            triggerScroll: true,
            setTriggerScroll: mockSetTriggerScroll,
        });

        renderWithProviders(<MovieListPage />);

        expect(scrollIntoViewMock).not.toHaveBeenCalled();
        expect(mockSetTargetMovieId).not.toHaveBeenCalled();
        expect(mockSetTriggerScroll).not.toHaveBeenCalled();

        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
            configurable: true,
            value: Element.prototype.scrollIntoView,
        });
    });

    test("Should scroll to target movie when triggerScroll is true and movieId is not present", async () => {
        setupInfiniteQuery();
        (useParams as jest.Mock).mockReturnValue({ movieId: undefined });
        const scrollIntoViewMock = jest.fn();
        const mockMovieElement = document.createElement("div");
        mockMovieElement.setAttribute("data-movie-id", String(mockMovie.id));
        jest.spyOn(document, "querySelector").mockReturnValue(mockMovieElement);
        Object.defineProperty(mockMovieElement, "scrollIntoView", {
            configurable: true,
            value: scrollIntoViewMock,
        });

        useScrollContextMock.mockReturnValue({
            targetMovieId: mockMovie.id,
            setTargetMovieId: mockSetTargetMovieId,
            triggerScroll: true,
            setTriggerScroll: mockSetTriggerScroll,
        });

        renderWithProviders(<MovieListPage />);

        await waitFor(() => {
            expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth", block: "nearest" });
        });
        await waitFor(() => {
            expect(mockSetTargetMovieId).toHaveBeenCalledWith(null);
        });
        await waitFor(() => {
            expect(mockSetTriggerScroll).toHaveBeenCalledWith(false);
        });

        jest.restoreAllMocks();
    });

    test("Should not scroll if targetMovieId is null even if triggerScroll is true", async () => {
        setupInfiniteQuery();
        (useParams as jest.Mock).mockReturnValue({ movieId: undefined });
        const scrollIntoViewMock = jest.fn();
        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
            configurable: true,
            value: scrollIntoViewMock,
        });

        useScrollContextMock.mockReturnValue({
            targetMovieId: null,
            setTargetMovieId: mockSetTargetMovieId,
            triggerScroll: true,
            setTriggerScroll: mockSetTriggerScroll,
        });

        renderWithProviders(<MovieListPage />);

        expect(scrollIntoViewMock).not.toHaveBeenCalled();
        expect(mockSetTargetMovieId).not.toHaveBeenCalled();
        expect(mockSetTriggerScroll).not.toHaveBeenCalled();

        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
            configurable: true,
            value: Element.prototype.scrollIntoView,
        });
    });

    test("Should update multiple search params sequentially", async () => {
        setupInfiniteQuery();
        const { rerender } = renderWithProviders(<MovieListPage />);

        expect(currentSearchParamsState.get("genre")).toBe("All");
        expect(currentSearchParamsState.get("sortBy")).toBe("Release Date");

        const genreSelect = screen.getByTestId("genre-select");
        await user.click(genreSelect);

        expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
        expect(currentSearchParamsState.get("genre")).toBe("Documentary");
        expect(currentSearchParamsState.get("sortBy")).toBe("Release Date");

        rerender(
            <QueryClientProvider client={new QueryClient()}>
                <ScrollProvider>
                    <MovieListPage />
                </ScrollProvider>
            </QueryClientProvider>,
        );

        const sortControl = screen.getByTestId("sort-control");
        await user.click(sortControl);

        expect(mockSetSearchParams).toHaveBeenCalledTimes(2);
        expect(currentSearchParamsState.get("genre")).toBe("Documentary");
        expect(currentSearchParamsState.get("sortBy")).toBe("Title");
    });

    test("Should call movieService.getMovies with correct parameters", async () => {
        const getMoviesMock = movieService.getMovies as jest.Mock;
        getMoviesMock.mockResolvedValue({
            movies: [mockMovie],
            totalAmount: 1,
            offset: 0,
            limit: 10,
            nextOffset: undefined,
        });
        const searchQuery = "test query";
        const sortCriterion = "Title" as SortOption;
        const activeGenre = "Documentary";
        (useSearchParams as jest.Mock).mockReturnValue([
            new URLSearchParams({ query: searchQuery, sortBy: sortCriterion, genre: activeGenre }),
            jest.fn(),
        ]);

        renderWithProviders(<MovieListPage />);

        const queryFnArg = useInfiniteQueryMock.mock.calls[0][0];
        const queryFn = queryFnArg.queryFn;
        const pageParam = 2;
        const mockSignal = {} as AbortSignal;

        await queryFn({ pageParam, signal: mockSignal });

        expect(getMoviesMock).toHaveBeenCalledWith(searchQuery, sortCriterion, activeGenre, mockSignal, pageParam);
    });
});
