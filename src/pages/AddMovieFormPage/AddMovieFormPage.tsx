import { Dialog } from "@/components/common/Dialog/Dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Movie, MovieFormData } from "@/types/common";
import { movieService } from "@/services/movieService";
import { MovieForm } from "@/components/MovieForm/MovieForm";

export const AddMovieFormPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const navigateWithSearchParams = (path: string) => {
        const searchParamsString = searchParams.toString();
        navigate(`${path}${searchParamsString ? `?${searchParamsString}` : ""}`);
    };

    const handleSubmit = async (formData: MovieFormData) => {
        try {
            const movie: Movie = await movieService.createMovie(formData);
            navigateWithSearchParams(`/${movie.id}`);
        } catch (error) {
            console.error("Error creating movie:", error);
        }
    };

    const handleClose = () => {
        navigateWithSearchParams("/");
    };

    return (
        <Dialog
            title="Add Movie"
            children={<MovieForm onSubmit={handleSubmit} />}
            onClose={handleClose}
            className="max-w-[976px]"
        />
    );
};
