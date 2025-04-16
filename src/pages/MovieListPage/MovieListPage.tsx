import { useEffect, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import bgHeaderImage from "@/assets/bg_header.png";
import { GENRES } from "@/constants";
import { Genre, Movie, MovieDetailsData, SortOption } from "@/types/common";
import { movieService } from "@/services/movieService";
import { SearchForm } from "@/components/SearchForm/SearchForm";
import { GenreSelect } from "@/components/GenreSelect/GenreSelect";
import { SortControl } from "@/components/SortControl/SortControl";
import { MovieTile } from "@/components/MovieTile/MovieTile";
import { MovieDetails } from "@/components/MovieDetails/MovieDetails";
import { NetflixRouletteText } from "@/components/common/NetflixRouletteText/NetflixRouletteText";

export const MovieListPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortCriterion, setSortCriterion] = useState<SortOption>("Release Date");
    const [activeGenre, setActiveGenre] = useState<Genre>("All");
    const [selectedMovie, setSelectedMovie] = useState<MovieDetailsData | null>(null);

    const queryClient = useQueryClient();

    const { ref: loadMoreRef, inView: isLoadMoreVisible } = useInView({
        threshold: 0.1,
    });

    const {
        data,
        error: queryError,
        fetchNextPage,
        hasNextPage,
        isError,
        isFetching,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery<{
        movies: Movie[];
        totalAmount: number;
        nextOffset?: number;
    }>({
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

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSelectedMovie(null);
    };

    const handleGenreSelect = (genre: Genre) => {
        setActiveGenre(genre);
        setSelectedMovie(null);
    };

    const handleSortChange = (selection: SortOption) => {
        setSortCriterion(selection);
        setSelectedMovie(null);
    };

    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const handleMovieClick = async (movie: Movie) => {
        setIsDetailLoading(true);
        setDetailError(null);
        setSelectedMovie(null);

        const movieId = movie.id;
        try {
            const movieDetails = await movieService.getMovieById(movieId);
            setSelectedMovie(movieDetails);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error(`Failed to fetch movie details by id ${movieId}:`, error);
            setDetailError("Failed to load movie details.");
            setSelectedMovie(null);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleMovieDetailsClose = () => {
        setSelectedMovie(null);
        setDetailError(null);
    };

    const handleAddMovieClick = () => {
        console.log("Add movie - Placeholder");
        // TODO: Implement `Add Movie` logic
    };

    const handleMovieEdit = (movie: Movie) => {
        console.log("Edit movie:", movie.id, "- Placeholder");
        // TODO: Implement `Edit Movie` logic
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

    const allMovies = data?.pages.flatMap(({ movies }) => movies) ?? [];
    const totalAmount = data?.pages[0]?.totalAmount ?? 0;
    const queryErrorMessage =
        queryError instanceof Error ? queryError.message : "An unknown error occurred while fetching movies.";

    return (
        <div className="movie-list-page flex flex-col items-center relative w-full min-h-screen">
            <div
                className="
                    flex justify-between items-center
                    fixed top-0 left-0 right-0 h-[60px] px-16 z-50
                    bg-opacity-80 backdrop-blur-sm shadow-md
                "
            >
                <NetflixRouletteText />
                <button className="btn-add-movie" onClick={handleAddMovieClick}>
                    + Add Movie
                </button>
            </div>

            <header
                className="
                    relative w-[var(--content-width)] px-[60px] pt-[80px] pb-[20px] mb-[10px]
                    bg-[var(--color-content-background)] bg-cover bg-center bg-no-repeat
                "
                style={{ backgroundImage: `url(${bgHeaderImage})` }}
            >
                <div className="flex flex-col relative min-h-[290px] z-10">
                    {selectedMovie ? (
                        <>
                            <button
                                onClick={handleMovieDetailsClose}
                                className="
                                    absolute top-0 right-0 text-5xl p-2 z-20
                                    text-[var(--color-primary)] hover:text-red-400
                                    cursor-pointer transition-colors
                                "
                                title="Back to Search"
                            >
                                &times;
                            </button>
                            {isDetailLoading && <div className="text-center p-10 text-xl">Loading details...</div>}
                            {detailError && <div className="text-center p-10 text-xl text-red-500">{detailError}</div>}
                            {selectedMovie && !isDetailLoading && <MovieDetails details={selectedMovie} />}
                        </>
                    ) : (
                        <div className="flex flex-col items-start px-[60px]">
                            <h2 className="text-[40px] font-light uppercase mb-8 mt-[25px] tracking-[1px]">
                                Find Your Movie
                            </h2>
                            <div className="w-full">
                                <SearchForm initialQuery={searchQuery} onSearch={handleSearch} />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow w-[var(--content-width)] px-16 pb-6 mb-[60px] bg-[var(--color-content-background)]">
                <div className="flex justify-between items-center h-[60px] mb-6 border-b-2 border-[var(--color-gray-light)]">
                    <GenreSelect genres={GENRES} selectedGenre={activeGenre} onSelect={handleGenreSelect} />
                    <SortControl currentSelection={sortCriterion} onSelectionChange={handleSortChange} />
                </div>

                <div className="mb-6">
                    <span className="font-semibold">{totalAmount}</span> movies found
                    {isDeleting && <span className="ml-4 text-yellow-500"> Deleting...</span>}
                    {deleteError && <span className="ml-4 text-red-500"> {deleteError}</span>}
                </div>

                {isLoading ? (
                    <div className="text-center py-10">Loading movies...</div>
                ) : isError ? (
                    <div className="text-center py-10 text-red-500">{queryErrorMessage}</div>
                ) : allMovies.length > 0 ? (
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
                ) : (
                    !isFetching && <div className="text-center py-10">No movies found.</div>
                )}

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
