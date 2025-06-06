import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useParams, useSearchParams } from "react-router-dom";
import { DEFAULT_ACTIVE_GENRE, DEFAULT_SORT_OPTION } from "@/constants/constants";
import { GenreFilter, Movie, SortOption } from "@/types/common";
import { InfiniteMovieListResult, movieService } from "@/services/movieService";
import { useScrollContext } from "@/contexts/ScrollContext/useScrollContext";
import { useNavigateWithSearchParams } from "@/hooks/useNavigateWithSearchParams/useNavigateWithSearchParams";
import { Loader } from "@/components/common/Loader/Loader";
import { NetflixRouletteText } from "@/components/common/NetflixRouletteText/NetflixRouletteText";
import { GenreSelect } from "@/components/GenreSelect/GenreSelect";
import { SortControl } from "@/components/SortControl/SortControl";
import { MovieTile } from "@/components/MovieTile/MovieTile";
import { TopBar } from "@/components/TopBar/TopBar";
import { Header } from "@/components/Header/Header";

export const MovieListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { movieId } = useParams<{ movieId: string }>();
    const navigateWithSearchParams = useNavigateWithSearchParams();
    const lastClickedTileRef = useRef<HTMLDivElement | null>(null);
    const { targetMovieId, setTargetMovieId, triggerScroll, setTriggerScroll } = useScrollContext();

    const queryClient = useQueryClient();
    const { ref: loadMoreRef, inView: isLoadMoreVisible } = useInView({ threshold: 0.1 });

    const searchQuery = searchParams.get("query") ?? "";
    const sortCriterion = (searchParams.get("sortBy") as SortOption) ?? DEFAULT_SORT_OPTION;
    const activeGenre = (searchParams.get("genre") as GenreFilter) ?? DEFAULT_ACTIVE_GENRE;

    const {
        data,
        error: queryError,
        fetchNextPage,
        hasNextPage,
        isError,
        isFetching,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery<InfiniteMovieListResult>({
        queryKey: ["movies", activeGenre, sortCriterion, searchQuery],
        queryFn: ({ pageParam = 0, signal }) => {
            return movieService.getMovies(searchQuery, sortCriterion, activeGenre, signal, pageParam as number);
        },
        getNextPageParam: (lastPage) => lastPage.nextOffset,
        initialPageParam: undefined,
    });

    const allMovies = useMemo(() => data?.pages.flatMap(({ movies }) => movies) ?? [], [data]);

    useEffect(() => {
        if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        if (triggerScroll && targetMovieId && !movieId) {
            const movieTileElement = document.querySelector(`[data-movie-id="${targetMovieId}"]`);
            if (movieTileElement) {
                movieTileElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
            setTargetMovieId(null);
            setTriggerScroll(false);
        }
    }, [triggerScroll, targetMovieId, movieId, allMovies, setTargetMovieId, setTriggerScroll]);

    useEffect(() => {
        if (!triggerScroll && !movieId && lastClickedTileRef.current) {
            lastClickedTileRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            lastClickedTileRef.current = null;
        }
    }, [movieId, triggerScroll]);

    const updateSearchParam = (key: "genre" | "sortBy", value: GenreFilter | SortOption) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(key, value);
        setSearchParams(newParams, { replace: true });
    };

    const handleGenreSelect = (genre: GenreFilter) => {
        updateSearchParam("genre", genre);
    };

    const handleSortChange = (sortOption: SortOption) => {
        updateSearchParam("sortBy", sortOption);
    };

    const handleMovieClick = (movie: Movie, event: React.MouseEvent<HTMLDivElement>) => {
        lastClickedTileRef.current = event.currentTarget;
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigateWithSearchParams(String(movie.id));
    };

    const handleAddMovieClick = () => {
        navigateWithSearchParams("/new");
    };

    const handleMovieEdit = (movie: Movie) => {
        navigateWithSearchParams(`/${movie.id}/edit`);
    };

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleMovieDelete = async (movie: Movie) => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            await movieService.deleteMovie(movie.id);
            await queryClient.invalidateQueries({ queryKey: ["movies", activeGenre, sortCriterion, searchQuery] });
        } catch (err) {
            console.error("Failed to delete movie:", err);
            setDeleteError("Failed to delete movie.");
        } finally {
            setIsDeleting(false);
        }
    };

    const totalAmount = data?.pages[0]?.totalAmount ?? 0;
    const queryErrorMessage =
        queryError instanceof Error ? queryError.message : "An unknown error occurred while fetching movies.";

    const showError = !isLoading && isError;
    const showMovieGrid = !isLoading && !isError && allMovies.length > 0;
    const showEmptyState = !isLoading && !isError && allMovies.length === 0 && !isFetching;

    return (
        <div className="movie-list-page flex flex-col items-center relative w-full min-h-screen">
            <TopBar onAddMovieClick={handleAddMovieClick} />

            <Header />

            <main
                className="
                    flex-grow w-[var(--content-width)] px-16 pb-6 mb-[60px]
                    bg-[var(--color-content-background)]
                "
            >
                <div
                    className="
                        flex justify-between items-center h-[60px] mb-6
                        border-b-2 border-[var(--color-gray-light)]
                    "
                >
                    <GenreSelect selectedGenre={activeGenre} onSelect={handleGenreSelect} />
                    <SortControl currentSelection={sortCriterion} onSelectionChange={handleSortChange} />
                </div>

                <div className="mb-6" data-testid="movie-count">
                    <span className="font-semibold">{totalAmount}</span> movies found
                    {isDeleting && <span className="ml-4 text-yellow-500"> Deleting...</span>}
                    {deleteError && <span className="ml-4 text-red-500"> {deleteError}</span>}
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center pt-10 -ml-24 h-full">
                        <Loader />
                    </div>
                )}

                {showError && <div className="text-center py-10 text-red-500">{queryErrorMessage}</div>}

                {showMovieGrid && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[64px] gap-y-8">
                        {allMovies.map((movie) => (
                            <MovieTile
                                key={movie.id}
                                movie={movie}
                                onClick={handleMovieClick}
                                onEdit={handleMovieEdit}
                                onDelete={handleMovieDelete}
                            />
                        ))}
                    </div>
                )}

                {showEmptyState && <div className="text-center py-10">No movies found.</div>}

                <div ref={loadMoreRef} className="h-10 w-full mt-4">
                    {isFetchingNextPage && <div className="text-center py-5 text-lg">Loading more...</div>}
                </div>
            </main>
            <footer
                className="
                    flex justify-center items-center
                    fixed bottom-0 left-0 right-0 h-[60px]
                    bg-[var(--color-gray)] z-50
                "
            >
                <NetflixRouletteText />
            </footer>
        </div>
    );
};
