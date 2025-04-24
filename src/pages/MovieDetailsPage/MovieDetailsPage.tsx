import { useLoaderData } from "react-router-dom";
import { MovieDetails } from "@/components/MovieDetails/MovieDetails";
import { Movie } from "@/types/common";
import { CloseDetailsButton } from "@/components/common/CloseDetailsButton/CloseDetailsButton";

export const MovieDetailsPage = () => {
    const { movieDetails } = useLoaderData<{ movieDetails: Movie }>();

    return (
        <div className="relative">
            <CloseDetailsButton />
            <MovieDetails details={movieDetails} />
        </div>
    );
};
