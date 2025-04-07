export type Genre = "All" | "Comedy" | "Crime" | "Documentary" | "Horror";

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
    genres: Genre[];
    rating: number;
    duration: number;
    description: string;
}

export type SortOption = "Release Date" | "Title";
