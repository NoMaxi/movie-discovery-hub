import axios, { AxiosResponse } from "axios";
import { movieService, API_URL, APIMovieDetails, CreateMoviePayload } from "@/services/movieService";
import { mockAPIMovie } from "@/mocks/movieData";
import { mapAPIMovieDetailsToMovieData } from "@/utils/movieMapping";
import { DEFAULT_MOVIES_PER_PAGE } from "@/constants/constants";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("movieService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getMovies", () => {
        it("Should fetch movies with default parameters", async () => {
            const moviesResponse = {
                data: [mockAPIMovie],
                totalAmount: 100,
                offset: 0,
                limit: DEFAULT_MOVIES_PER_PAGE,
            };
            mockedAxios.get.mockResolvedValue({ data: moviesResponse } as AxiosResponse<typeof moviesResponse>);

            const result = await movieService.getMovies("", "Release Date", "All", undefined);

            expect(mockedAxios.get).toHaveBeenCalledWith(API_URL, {
                params: {
                    sortBy: "release_date",
                    sortOrder: "desc",
                    searchBy: "title",
                    limit: DEFAULT_MOVIES_PER_PAGE,
                    offset: 0,
                },
                signal: undefined,
            });

            expect(result).toEqual({
                movies: [mapAPIMovieDetailsToMovieData(mockAPIMovie)],
                totalAmount: 100,
                offset: 0,
                limit: DEFAULT_MOVIES_PER_PAGE,
                nextOffset: 1,
            });
        });

        it("Should include search and filter parameters when provided", async () => {
            const moviesResponse = {
                data: [mockAPIMovie, mockAPIMovie],
                totalAmount: 2,
                offset: 5,
                limit: DEFAULT_MOVIES_PER_PAGE,
            };
            mockedAxios.get.mockResolvedValue({ data: moviesResponse } as AxiosResponse<typeof moviesResponse>);

            const result = await movieService.getMovies("test", "Title", "Crime", undefined, 5);

            expect(mockedAxios.get).toHaveBeenCalledWith(API_URL, {
                params: {
                    sortBy: "title",
                    sortOrder: "asc",
                    searchBy: "title",
                    limit: DEFAULT_MOVIES_PER_PAGE,
                    offset: 5,
                    search: "test",
                    filter: "Crime",
                },
                signal: undefined,
            });

            expect(result).toEqual({
                movies: [mapAPIMovieDetailsToMovieData(mockAPIMovie), mapAPIMovieDetailsToMovieData(mockAPIMovie)],
                totalAmount: 2,
                offset: 5,
                limit: DEFAULT_MOVIES_PER_PAGE,
                nextOffset: undefined,
            });
        });
    });

    describe("getMovieById", () => {
        it("Should fetch a movie by ID and map it", async () => {
            mockedAxios.get.mockResolvedValue({ data: mockAPIMovie } as AxiosResponse<APIMovieDetails>);

            const result = await movieService.getMovieById(123);

            expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/123`);
            expect(result).toEqual(mapAPIMovieDetailsToMovieData(mockAPIMovie));
        });
    });

    describe("createMovie", () => {
        it("Should post new movie and map response", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...payload } = mockAPIMovie;
            const createPayload = payload as CreateMoviePayload;
            const apiResponse: APIMovieDetails = mockAPIMovie;
            mockedAxios.post.mockResolvedValue({ data: apiResponse } as AxiosResponse<APIMovieDetails>);

            const result = await movieService.createMovie(createPayload);

            expect(mockedAxios.post).toHaveBeenCalledWith(API_URL, createPayload);
            expect(result).toEqual(mapAPIMovieDetailsToMovieData(apiResponse));
        });
    });

    describe("updateMovie", () => {
        it("Should put updated movie and map response", async () => {
            const updatePayload = mockAPIMovie as APIMovieDetails;
            const apiResponse: APIMovieDetails = mockAPIMovie;
            mockedAxios.put.mockResolvedValue({ data: apiResponse } as AxiosResponse<APIMovieDetails>);

            const result = await movieService.updateMovie(updatePayload);

            expect(mockedAxios.put).toHaveBeenCalledWith(API_URL, updatePayload);
            expect(result).toEqual(mapAPIMovieDetailsToMovieData(apiResponse));
        });
    });

    describe("deleteMovie", () => {
        it("Should delete movie by ID", async () => {
            mockedAxios.delete.mockResolvedValue({} as AxiosResponse);

            await movieService.deleteMovie(123);

            expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_URL}/123`);
        });
    });
});
