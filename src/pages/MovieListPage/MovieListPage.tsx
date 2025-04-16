import { useState, useEffect, useCallback, useRef } from "react";
import axios, { CancelTokenSource } from "axios";
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
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<MovieDetailsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalMovies, setTotalMovies] = useState<number>(0);

    const cancelTokenRef = useRef<CancelTokenSource | null>(null);

    const fetchMovies = useCallback(async () => {
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("Operation canceled due to new request.");
        }

        cancelTokenRef.current = axios.CancelToken.source();

        setIsLoading(true);
        setError(null);

        try {
            const { movies, totalAmount } = await movieService.getMovies(
                searchQuery,
                sortCriterion,
                activeGenre,
                cancelTokenRef.current.token,
            );
            setMovies(movies);
            setTotalMovies(totalAmount);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled:", error.message);
            } else {
                console.error("Failed to fetch movies:", error);
                setError("Failed to load movies. Please try again later.");
                setMovies([]);
                setTotalMovies(0);
            }
        } finally {
            setIsLoading(false);
            cancelTokenRef.current = null;
        }
    }, [searchQuery, sortCriterion, activeGenre]);

    useEffect(() => {
        fetchMovies();

        return () => {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel("Operation canceled due to MovieListPage component unmount");
                cancelTokenRef.current = null;
            }
        };
    }, [fetchMovies]);

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

    const handleMovieClick = async (movie: Movie) => {
        setIsLoading(true);
        setError(null);

        const movieId = movie.id;
        try {
            const movieDetails = await movieService.getMovieById(movieId);
            setSelectedMovie(movieDetails);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(`Failed to fetch movie details by id ${movieId}:`, error);
            setError("Failed to load movie details.");
            setSelectedMovie(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMovieDetailsClose = () => {
        setSelectedMovie(null);
    };

    const handleAddMovieClick = () => {
        console.log("Add movie");
        // TODO: Implement Add Movie
    };

    const handleMovieEdit = (movie: Movie) => {
        console.log("Edit movie:", movie.id);
        // TODO: Implement Edit Movie
    };

    const handleMovieDelete = async (movie: Movie) => {
        try {
            setIsLoading(true);
            await movieService.deleteMovie(movie.id);
            await fetchMovies();
        } catch (err) {
            console.error("Failed to delete movie:", err);
            setError("Failed to delete movie.");
        } finally {
            setIsLoading(false);
        }
    };

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
                            <MovieDetails details={selectedMovie} />
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
                    <span className="font-semibold">{totalMovies}</span> movies found
                </div>

                {isLoading && !selectedMovie ? (
                    <div className="text-center py-10">Loading movies...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : movies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[64px] gap-y-8">
                        {movies.map((movie) => (
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
                    !isLoading && <div className="text-center py-10">No movies found.</div>
                )}
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
