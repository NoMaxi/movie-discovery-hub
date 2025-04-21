import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/constants/constants";
import { DEFAULT_IMAGE_URL } from "@/constants/assetConstants";
import { getYearFromDate } from "@/utils/formatting";
import { mapAPIMovieDetailsToMovieData, mapSortOptionToSortBy, mapSortOptionToSortOrder } from "./movieMapping";
import { mockAPIMovie } from "@/mocks/MovieData";
import { APIMovieDetails } from "@/services/movieService";
import { SortOption } from "@/types/common";

describe("movieMapping", () => {
    describe("mapAPIMovieDetailsToMovieData", () => {
        it("Should correctly map APIMovieDetails to MovieDetailsData", () => {
            const result = mapAPIMovieDetailsToMovieData(mockAPIMovie);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockAPIMovie.id);
            expect(result.description).toBe(mockAPIMovie.overview);
            expect(result.duration).toBe(mockAPIMovie.runtime);
            expect(result.genres).toEqual(mockAPIMovie.genres);
            expect(result.imageUrl).toBe(mockAPIMovie.poster_path);
            expect(result.rating).toBe(mockAPIMovie.vote_average);
            expect(result.releaseYear).toBe(getYearFromDate(mockAPIMovie.release_date));
            expect(result.title).toBe(mockAPIMovie.title);
        });

        it("Should correctly return default values", () => {
            const emptyStringsMovie: APIMovieDetails = { ...mockAPIMovie, overview: "", poster_path: "", title: "" };
            delete emptyStringsMovie.vote_average;

            const result = mapAPIMovieDetailsToMovieData(emptyStringsMovie);

            expect(result).toBeDefined();
            expect(result.description).toBe(DEFAULT_DESCRIPTION);
            expect(result.imageUrl).toBe(DEFAULT_IMAGE_URL);
            expect(result.title).toBe(DEFAULT_TITLE);
        });
    });

    describe("mapSortOptionToSortBy", () => {
        it('Should map "Release Date" to "release_date"', () => {
            const result = mapSortOptionToSortBy("Release Date");
            expect(result).toBe("release_date");
        });

        it("Should map 'Title' to 'title'", () => {
            const result = mapSortOptionToSortBy("Title");
            expect(result).toBe("title");
        });

        it("Should handle default case", () => {
            const result = mapSortOptionToSortBy("Invalid Option" as SortOption);
            expect(result).toBe("release_date");
        });
    });

    describe("mapSortOptionToSortOrder", () => {
        it("Should map 'Release Date' to 'desc'", () => {
            const result = mapSortOptionToSortOrder("Release Date");
            expect(result).toBe("desc");
        });

        it("Should map 'Title' to 'asc'", () => {
            const result = mapSortOptionToSortOrder("Title");
            expect(result).toBe("asc");
        });

        it("Should handle default case", () => {
            const result = mapSortOptionToSortOrder("Invalid Option" as SortOption);
            expect(result).toBe("desc");
        });
    });
});
