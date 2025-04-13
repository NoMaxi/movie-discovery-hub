export type Genre = "All" | "Comedy" | "Crime" | "Documentary" | "Horror";

export type SelectableGenre = Exclude<Genre, "All">;

export interface Movie {
    id: string;
    imageUrl: string;
    title: string;
    releaseYear: number;
    genres: Genre[];
}

export interface MovieDetailsData {
    id: string;
    imageUrl: string;
    title: string;
    releaseYear: number;
    genres: SelectableGenre[];
    rating: number;
    duration: number;
    description: string;
}

export interface InitialMovieInfo extends Omit<MovieDetailsData, "releaseYear"> {
    releaseDate: string;
}

export type SortOption = "Release Date" | "Title";
