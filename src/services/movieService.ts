import axios, { AxiosResponse } from "axios";
import { Genre, Movie, MovieDetailsData, MovieListResult, SortOption } from "@/types/common";
import { DEFAULT_MOVIES_PER_PAGE } from "@/constants/constants";
import {
    mapAPIMovieDetailsToMovie,
    mapAPIMovieDetailsToMovieData,
    mapSortOptionToSortBy,
    mapSortOptionToSortOrder,
} from "@/utils/movieMapping";

export interface CreateMoviePayload {
    genres: string[];
    overview: string;
    poster_path: string;
    runtime: number;
    title: string;
    budget?: number;
    release_date?: string;
    revenue?: number;
    tagline?: string;
    vote_average?: number;
    vote_count?: number;
}

export interface APIMovieDetails extends CreateMoviePayload {
    id: number;
}

export interface MoviesResponse {
    data: APIMovieDetails[];
    totalAmount: number;
    offset: number;
    limit: number;
}

export interface BadRequestError {
    messages: string[];
}

export type SearchBy = "title" | "genres";
export type SortBy = "title" | "release_date";
export type SortOrder = "asc" | "desc";

export interface MoviesRequestParams {
    searchBy?: SearchBy;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
    search?: string;
    limit?: number;
    offset?: number;
    filter?: Genre;
}

export const API_URL = "http://localhost:4000/movies";

export interface InfiniteMovieListResult extends MovieListResult {
    nextOffset?: number;
}

export const movieService = {
    async getMovies(
        searchQuery: string,
        sortCriterion: SortOption,
        activeGenre: Genre,
        signal: AbortSignal | undefined,
        offset: number = 0,
    ): Promise<InfiniteMovieListResult> {
        const params: MoviesRequestParams = {
            sortBy: mapSortOptionToSortBy(sortCriterion),
            sortOrder: mapSortOptionToSortOrder(sortCriterion),
            searchBy: "title",
            limit: DEFAULT_MOVIES_PER_PAGE,
            offset,
        };

        if (searchQuery) {
            params.search = searchQuery;
        }

        if (activeGenre !== "All") {
            params.filter = activeGenre;
        }

        const { data: moviesResponse } = await axios.get<MoviesResponse>(API_URL, { params, signal });

        const { offset: responseOffset, totalAmount, limit, data } = moviesResponse;
        const movies: Movie[] = data.map(mapAPIMovieDetailsToMovie);
        const currentTotalFetched = offset + movies.length;
        const nextOffset = currentTotalFetched < totalAmount ? currentTotalFetched : undefined;

        return {
            movies,
            totalAmount,
            limit,
            offset: responseOffset,
            nextOffset,
        };
    },

    async getMovieById(id: number): Promise<MovieDetailsData> {
        const response = await axios.get<APIMovieDetails>(`${API_URL}/${id}`);
        return mapAPIMovieDetailsToMovieData(response.data);
    },

    async createMovie(movieData: CreateMoviePayload): Promise<MovieDetailsData> {
        const { data } = await axios.post<APIMovieDetails, AxiosResponse<APIMovieDetails>, CreateMoviePayload>(
            API_URL,
            movieData,
        );
        return mapAPIMovieDetailsToMovieData(data);
    },

    async updateMovie(movieData: APIMovieDetails): Promise<MovieDetailsData> {
        const { data } = await axios.put<APIMovieDetails, AxiosResponse<APIMovieDetails>, APIMovieDetails>(
            API_URL,
            movieData,
        );
        return mapAPIMovieDetailsToMovieData(data);
    },

    async deleteMovie(id: number): Promise<void> {
        await axios.delete(`${API_URL}/${id}`);
    },
};
