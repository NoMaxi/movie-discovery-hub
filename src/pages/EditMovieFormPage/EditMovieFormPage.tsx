import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InitialMovieInfo, MovieFormData } from "@/types/common";
import { mapAPIMovieDetailsToInitialMovieInfo } from "@/utils/movieMapping";
import { movieService } from "@/services/movieService";
import { useScrollContext } from "@/contexts/ScrollContext/useScrollContext";
import { useNavigateWithSearchParams } from "@/hooks/useNavigateWithSearchParams/useNavigateWithSearchParams";
import { Dialog } from "@/components/common/Dialog/Dialog";
import { Loader } from "@/components/common/Loader/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";
import { MovieForm } from "@/components/MovieForm/MovieForm";

export const EditMovieFormPage = () => {
    const navigateWithSearchParams = useNavigateWithSearchParams();
    const { movieId } = useParams<{ movieId: string }>();
    const { setTriggerScroll } = useScrollContext();

    const [isFetchingDetails, setIsFetchingDetails] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [movieInfo, setMovieInfo] = useState<InitialMovieInfo | null>(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!movieId) {
                setIsFetchingDetails(false);
                setErrorMessage("Movie ID not found.");
                return;
            }

            setIsFetchingDetails(true);
            setErrorMessage(null);

            try {
                const movie = await movieService.getAPIMovieDetailsById(Number(movieId));
                setMovieInfo(mapAPIMovieDetailsToInitialMovieInfo(movie));
            } catch (err) {
                console.error("Error fetching movie details during movie edit:", err);
                setErrorMessage("Failed to load movie details. Please try again.");
                setMovieInfo(null);
            } finally {
                setIsFetchingDetails(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    const handleSubmit = async (formData: MovieFormData) => {
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await movieService.updateMovie({ ...formData, id: Number(movieId) });
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTriggerScroll(true);
            navigateWithSearchParams(`/${movieId}`);
        } catch (error) {
            console.error("Error updating a movie:", error);
            setErrorMessage("Failed to update a movie. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (movieInfo && movieId) {
            navigateWithSearchParams(`/${movieId}`);
        } else {
            navigateWithSearchParams(`/`);
        }
    };

    const showForm = !isFetchingDetails && !!movieInfo;
    const showErrorMessage = !isFetchingDetails && !!errorMessage;

    return (
        <Dialog title="Edit Movie" onClose={handleClose} className="max-w-[976px]">
            {isFetchingDetails && (
                <div className="flex justify-center items-center min-h-[700px] h-full">
                    <Loader />
                </div>
            )}

            {showErrorMessage && (
                <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} className="pb-6" />
            )}

            {showForm && (
                <MovieForm
                    initialMovieInfo={movieInfo}
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                    resetMode="restore"
                />
            )}
        </Dialog>
    );
};
