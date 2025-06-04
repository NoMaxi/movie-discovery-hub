import { GenreFilter, Genre, SortOption } from "@/types/common";

export const MAIN_GENRES: GenreFilter[] = ["All", "Drama", "Comedy", "Action", "Horror"];

export const SECONDARY_GENRES: Genre[] = [
    "Adventure",
    "Animation",
    "Crime",
    "Documentary",
    "Family",
    "Fantasy",
    "History",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "TV Movie",
    "War",
    "Western",
];

export const SELECTABLE_GENRES: Genre[] = ["Drama", "Comedy", "Action", "Horror", ...SECONDARY_GENRES];
export const SORT_OPTIONS: SortOption[] = ["Release Date", "Title"];

export const DEFAULT_SORT_OPTION: SortOption = "Release Date";
export const DEFAULT_ACTIVE_GENRE: GenreFilter = "All";
export const DEFAULT_TITLE = "No Title";
export const DEFAULT_DESCRIPTION = "No description available.";
export const DEFAULT_MOVIES_PER_PAGE = 18;
export const MOVIE_LIST_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const urlValidationRegExp =
    /^(?:https?|ftp):\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[/?]\S+)$/i;
