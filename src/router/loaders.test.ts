import { movieService } from "@/services/movieService";
import { mockAPIMovie } from "@/mocks/movieData";
import { movieDetailsLoader } from "@/router/loaders";

jest.mock("@/services/movieService", () => ({
    movieService: {
        getMovieById: jest.fn(),
    },
}));

describe("loaders", () => {
    describe("movieDetailsLoader", () => {
        const mockedGetMovieById = movieService.getMovieById as jest.Mock;
        const errorMessage = "Invalid movie id";

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("Should convert the route parameter to a number and fetch the movie", async () => {
            mockedGetMovieById.mockResolvedValueOnce(mockAPIMovie);
            const mockMovieId = mockAPIMovie.id;

            const result = await movieDetailsLoader({
                params: { movieId: mockMovieId.toString() },
            } as never);

            expect(mockedGetMovieById).toHaveBeenCalledTimes(1);
            expect(mockedGetMovieById).toHaveBeenCalledWith(mockMovieId);
            expect(result).toStrictEqual({ movieDetails: mockAPIMovie });
        });

        it("Should throw an Error when movieId is missing", async () => {
            await expect(
                movieDetailsLoader({
                    params: {},
                } as never),
            ).rejects.toEqual(
                expect.objectContaining({
                    message: errorMessage,
                }),
            );

            expect(mockedGetMovieById).not.toHaveBeenCalled();
        });

        it("Should throw an Error when movieId is not a valid number", async () => {
            await expect(
                movieDetailsLoader({
                    params: { movieId: "not-a-number" },
                } as never),
            ).rejects.toEqual(
                expect.objectContaining({
                    message: errorMessage,
                }),
            );

            expect(mockedGetMovieById).not.toHaveBeenCalled();
        });
    });
});
