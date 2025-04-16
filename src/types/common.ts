export type SelectableGenre = "Comedy" | "Crime" | "Documentary" | "Horror";

export type Genre = "All" | SelectableGenre;

export interface Movie {
    id: number;
    imageUrl: string;
    title: string;
    releaseYear: number;
    genres: string[];
}

export interface MovieDetailsData {
    id: number;
    imageUrl: string;
    title: string;
    releaseYear: number;
    genres: string[];
    rating: number;
    duration: number;
    description: string;
}

export interface InitialMovieInfo extends Omit<MovieDetailsData, "releaseYear"> {
    releaseDate: string;
}

export type SortOption = "Release Date" | "Title";

export interface MovieListResult {
    movies: Movie[];
    totalAmount: number;
    offset: number;
    limit: number;
}
