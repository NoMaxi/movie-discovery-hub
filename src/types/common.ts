export type SelectableGenre = "Comedy" | "Crime" | "Documentary" | "Horror";

export type Genre = "All" | SelectableGenre;

export interface Movie {
    id: number;
    imageUrl: string;
    title: string;
    releaseYear: number;
    genres: string[];
    rating: number;
    duration: number;
    description: string;
}

export interface InitialMovieInfo extends Omit<Movie, "releaseYear"> {
    releaseDate: string;
}

export interface MovieFormData {
    id?: number;
    title: string;
    release_date: string;
    poster_path: string;
    vote_average: number;
    genres: string[];
    runtime: number;
    overview: string;
}

export type SortOption = "Release Date" | "Title";
