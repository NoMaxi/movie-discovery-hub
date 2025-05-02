import { useState } from "react";
import { movieService } from "@/services/movieService";
import { MovieFormData } from "@/types/common";
import { useNavigateWithSearchParams } from "@/hooks/useNavigateWithSearchParams/useNavigateWithSearchParams";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";
import { Dialog } from "@/components/common/Dialog/Dialog";
import { MovieForm } from "@/components/MovieForm/MovieForm";

export const AddMovieFormPage = () => {
    const navigateWithSearchParams = useNavigateWithSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (formData: MovieFormData) => {
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            const movie = await movieService.createMovie(formData);
            window.scrollTo({ top: 0, behavior: "smooth" });
            navigateWithSearchParams(`/${movie.id}`);
        } catch (error) {
            console.error("Error creating a movie:", error);
            setErrorMessage("Failed to create a movie. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        navigateWithSearchParams("/");
    };

    const showErrorMessage = !isSubmitting && !!errorMessage;

    return (
        <Dialog title="Add Movie" onClose={handleClose} className="max-w-[976px]">
            {showErrorMessage && (
                <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} className="pb-6" />
            )}

            <MovieForm onSubmit={handleSubmit} isLoading={isSubmitting} resetMode="clear" />
        </Dialog>
    );
};
