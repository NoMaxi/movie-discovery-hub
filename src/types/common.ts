export type Genre = "All" | "Comedy" | "Crime" | "Documentary" | "Horror";

export interface Movie {
    id: string;
    imageUrl: string;
    title: string;
    releaseYear: number;
    genres: Genre[];
}
