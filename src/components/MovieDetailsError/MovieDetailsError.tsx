import { Link, useRouteError } from "react-router-dom";
import { CloseDetailsButton } from "@/components/common/CloseDetailsButton/CloseDetailsButton";

export const MovieDetailsError = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div
            data-testid="error-container"
            className="error-container flex flex-col items-center justify-center relative h-full"
        >
            <CloseDetailsButton />

            <p>Sorry, we couldn't load the movie details.</p>
            <p>Please try again later or return to search.</p>

            <Link data-testid="back-to-search-link" to="/" className="btn mt-5">
                Back to Search
            </Link>
        </div>
    );
};
