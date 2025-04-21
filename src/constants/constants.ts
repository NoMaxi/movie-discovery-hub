import { Genre, SelectableGenre, SortOption } from "@/types/common";

export const GENRES: Genre[] = ["All", "Documentary", "Comedy", "Horror", "Crime"];
export const SELECTABLE_GENRES: SelectableGenre[] = ["Documentary", "Comedy", "Horror", "Crime"];

export const PRIMARY_COLOR = "#F65261";

export const DEFAULT_SORT_CRITERION: SortOption = "Release Date";
export const DEFAULT_ACTIVE_GENRE: Genre = "All";
export const DEFAULT_TITLE = "No Title";
export const DEFAULT_DESCRIPTION = "No description available.";
export const DEFAULT_MOVIES_PER_PAGE = 18;
export const MOVIE_LIST_STALE_TIME = 5 * 60 * 1000; // 5 minutes
