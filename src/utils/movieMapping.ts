import noPosterImage from "@/assets/no_image_poster.png";
import { Movie, MovieDetailsData, SortOption } from "@/types/common";
import { getYearFromDate } from "@/utils/formatting";
import { APIMovieDetails, SortBy, SortOrder } from "@/services/movieService";

const DEFAULT_TITLE = "No Title";
const DEFAULT_IMAGE_URL = noPosterImage;
const DEFAULT_DESCRIPTION = "No description available.";

export const mapAPIMovieDetailsToMovie = ({
    genres,
    id,
    poster_path,
    release_date,
    title,
}: APIMovieDetails): Movie => ({
    id,
    genres: genres || [],
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
    duration: runtime ?? 0,
    genres,
    imageUrl: poster_path || DEFAULT_IMAGE_URL,
    rating: vote_average ?? 0,
    releaseYear: getYearFromDate(release_date),
    title: title || DEFAULT_TITLE,
});

export const mapSortOptionToSortBy = (sortOption: SortOption): SortBy => {
    return sortOption === "Title" ? "title" : "release_date";
};

export const mapSortOptionToSortOrder = (sortOption: SortOption): SortOrder => {
    return sortOption === "Title" ? "asc" : "desc";
};
