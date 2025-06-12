import { APIMovieDetails } from "@/services/movieService";

export type Genre =
    | "Drama"
    | "Romance"
    | "Animation"
    | "Adventure"
    | "Family"
    | "Comedy"
    | "Fantasy"
    | "Science Fiction"
    | "Action"
    | "Thriller"
    | "History"
    | "Crime"
    | "Mystery"
    | "Music"
    | "War"
    | "Horror"
    | "Western"
    | "TV Movie"
    | "Documentary";

export type GenreFilter = "All" | Genre;

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
