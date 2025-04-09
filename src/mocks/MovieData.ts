import { InitialMovieInfo, MovieDetailsData } from "@/types/common";

export const mockMovieDetails: MovieDetailsData = {
    id: "1",
    title: "Pulp Fiction",
    releaseYear: 1994,
    genres: ["Comedy", "Crime"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
    rating: 8.9,
    duration: 154,
    description:
        "Jules Winnfield (Samuel L. Jackson) and Vincent Vega (John Travolta) are two hit men who are out to retrieve a suitcase stolen from their employer, mob boss Marsellus Wallace (Ving Rhames). Wallace has also asked Vincent to take his wife Mia (Uma Thurman) out a few days later when Wallace himself will be out of town. Butch Coolidge (Bruce Willis) is an aging boxer who is paid by Wallace to lose his fight. The lives of these seemingly unrelated people are woven together comprising of a series of funny, bizarre and uncalled-for incidents.—Soumitra",
};

export const alternativeMovieDetails: MovieDetailsData = {
    id: "2",
    imageUrl: "https://example.com/poster-alt.jpg",
    title: "Another Great Film",
    releaseYear: 2022,
    genres: ["Comedy", "Crime"],
    rating: 7.9,
    duration: 59.5,
    description: "The greatest movie in history of cinema.",
};

export const mockMovieInfo: InitialMovieInfo = {
    ...mockMovieDetails,
    releaseDate: "1994-10-14",
};
