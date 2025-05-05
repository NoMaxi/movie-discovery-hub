import { APIMovieDetails } from "@/services/movieService";

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

type MovieFormOmittedAPIFields =
    | "id"
    | "release_date"
    | "runtime"
    | "vote_average"
    | "budget"
    | "revenue"
    | "tagline"
    | "vote_count";

type MovieFormBase = Omit<APIMovieDetails, MovieFormOmittedAPIFields>;

export type MovieFormData = MovieFormBase & {
    id?: number;
    release_date: string;
    runtime: number;
    vote_average: number;
};

export type SortOption = "Release Date" | "Title";
