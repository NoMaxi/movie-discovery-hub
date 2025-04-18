import { Movie, MovieDetailsData, SortOption } from "@/types/common";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/constants/constants";
import { DEFAULT_IMAGE_URL } from "@/constants/assetConstants";
import { getYearFromDate } from "@/utils/formatting";
import { APIMovieDetails, SortBy, SortOrder } from "@/services/movieService";

export const mapAPIMovieDetailsToMovie = ({
    genres,
    id,
    poster_path,
    release_date,
    title,
}: APIMovieDetails): Movie => ({
    id,
    genres,
    imageUrl: poster_path || DEFAULT_IMAGE_URL,
    releaseYear: getYearFromDate(release_date),
    title: title || DEFAULT_TITLE,
});

export const mapAPIMovieDetailsToMovieData = ({
    id,
    overview,
    runtime,
    genres,
    poster_path,
    vote_average,
    release_date,
    title,
}: APIMovieDetails): MovieDetailsData => ({
    id,
    description: overview || DEFAULT_DESCRIPTION,
    duration: runtime,
    genres,
    imageUrl: poster_path || DEFAULT_IMAGE_URL,
    rating: vote_average ?? 0,
    releaseYear: getYearFromDate(release_date),
    title: title || DEFAULT_TITLE,
});

const SORT_OPTION_TO_SORT_BY: Record<SortOption, SortBy> = {
    "Release Date": "release_date",
    Title: "title",
};

const SORT_OPTION_TO_SORT_ORDER: Record<SortOption, SortOrder> = {
    "Release Date": "desc",
    Title: "asc",
};

export const mapSortOptionToSortBy = (sortOption: SortOption): SortBy => {
    return SORT_OPTION_TO_SORT_BY[sortOption] || "release_date";
};

export const mapSortOptionToSortOrder = (sortOption: SortOption): SortOrder => {
    return SORT_OPTION_TO_SORT_ORDER[sortOption] || "desc";
};
