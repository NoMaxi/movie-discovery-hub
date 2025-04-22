import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_ACTIVE_GENRE, DEFAULT_SORT_CRITERION, GENRES } from "@/constants/constants";
import { Genre, Movie, SortOption } from "@/types/common";
import { InfiniteMovieListResult, movieService } from "@/services/movieService";
import { GenreSelect } from "@/components/GenreSelect/GenreSelect";
import { SortControl } from "@/components/SortControl/SortControl";
import { MovieTile } from "@/components/MovieTile/MovieTile";
import { NetflixRouletteText } from "@/components/common/NetflixRouletteText/NetflixRouletteText";
import { Loader } from "@/components/common/Loader/Loader";
import { TopBar } from "@/components/TopBar/TopBar";
import { Header } from "@/components/Header/Header";

export const MovieListPage = () => {
    const queryClient = useQueryClient();
    const { ref: loadMoreRef, inView: isLoadMoreVisible } = useInView({ threshold: 0.1 });
    const lastClickedTileRef = useRef<HTMLDivElement | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const searchQuery = searchParams.get("query") ?? "";
    const sortCriterion = (searchParams.get("sortBy") as SortOption) ?? DEFAULT_SORT_CRITERION;
    const activeGenre = (searchParams.get("genre") as Genre) ?? DEFAULT_ACTIVE_GENRE;

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

    useEffect(() => {
        if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const resetSelectedMovie = () => {
        setSelectedMovie(null);
    };

    const resetClickedTile = () => {
        lastClickedTileRef.current = null;
    };

    const resetViewState = () => {
        resetSelectedMovie();
        resetClickedTile();
    };

    const handleSearch = (query: string) => {
        setSearchParams(
            (prev) => {
                prev.set("query", query);
                return prev;
            },
            { replace: true },
        );
        resetViewState();
    };

    const handleGenreSelect = (genre: Genre) => {
        setSearchParams(
            (prev) => {
                prev.set("genre", genre);
                return prev;
            },
            { replace: true },
        );
        resetViewState();
    };

    const handleSortChange = (selection: SortOption) => {
        setSearchParams(
            (prev) => {
                prev.set("sortBy", selection);
                return prev;
            },
            { replace: true },
        );
        resetViewState();
    };

    const handleMovieClick = (movie: Movie, event: React.MouseEvent<HTMLDivElement>) => {
        lastClickedTileRef.current = event.currentTarget;
        setSelectedMovie(movie);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDetailsClose = () => {
        resetSelectedMovie();

        if (lastClickedTileRef.current) {
            lastClickedTileRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
            resetClickedTile();
        }
    };

    const handleAddMovieClick = () => {
        console.log("Add movie - Placeholder");
    };
    const handleMovieEdit = (movie: Movie) => {
        console.log("Edit movie:", movie.id, "- Placeholder");
    };

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleMovieDelete = async (movie: Movie) => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            await movieService.deleteMovie(movie.id);
            await queryClient.invalidateQueries({ queryKey: ["movies", activeGenre, sortCriterion, searchQuery] });

            if (selectedMovie?.id === movie.id) {
                resetViewState();
            }
        } catch (err) {
            console.error("Failed to delete movie:", err);
            setDeleteError("Failed to delete movie.");
        } finally {
            setIsDeleting(false);
        }
    };

    const allMovies = data?.pages.flatMap(({ movies }) => movies) ?? [];
    const totalAmount = data?.pages[0]?.totalAmount ?? 0;
    const queryErrorMessage =
        queryError instanceof Error ? queryError.message : "An unknown error occurred while fetching movies.";

    const showDetailsSection = !!selectedMovie;
    const showError = !isLoading && isError;
    const showMovieGrid = !isLoading && !isError && allMovies.length > 0;
    const showEmptyState = !isLoading && !isError && allMovies.length === 0 && !isFetching;

    return (
        <div className="movie-list-page flex flex-col items-center relative w-full min-h-screen">
            <TopBar onAddMovieClick={handleAddMovieClick} />

            <Header
                searchQuery={searchQuery}
                onSearch={handleSearch}
                showDetailsSection={showDetailsSection}
                selectedMovie={selectedMovie}
                onDetailsClose={handleDetailsClose}
            />

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
                    <GenreSelect genres={GENRES} selectedGenre={activeGenre} onSelect={handleGenreSelect} />
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
