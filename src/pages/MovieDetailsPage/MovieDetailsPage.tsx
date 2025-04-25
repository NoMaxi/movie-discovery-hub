import { useLoaderData } from "react-router-dom";
import { Movie } from "@/types/common";
import { CloseDetailsButton } from "@/components/common/CloseDetailsButton/CloseDetailsButton";
import { MovieDetails } from "@/components/MovieDetails/MovieDetails";

export const MovieDetailsPage = () => {
    const { movieDetails } = useLoaderData<{ movieDetails: Movie }>();

    return (
        <div data-testid="movie-details-container" className="relative">
            <CloseDetailsButton />
            <MovieDetails details={movieDetails} />
        </div>
    );
};
