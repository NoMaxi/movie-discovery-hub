import type { LoaderFunction } from "react-router-dom";
import { movieService } from "@/services/movieService";

export const movieDetailsLoader: LoaderFunction = async ({ params }) => {
    const movieId = Number(params.movieId);
    return { movieDetails: await movieService.getMovieById(movieId) };
};
