export type Genre = "All" | "Documentary" | "Comedy" | "Horror" | "Crime";

export interface Movie {
    id: string;
    imageUrl: string;
    title: string;
    releaseYear: number;
    genres: string[];
}
