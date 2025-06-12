import { Link, useSearchParams } from "react-router-dom";

export const CloseDetailsButton = () => {
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.toString();

    return (
        <Link
            data-testid="close-details-button"
            to={searchParamsString ? `/?${searchParamsString}` : "/"}
            className="
                absolute top-0 right-0 p-2 z-20 text-5xl text-primary
                hover:text-red-400 cursor-pointer transition-colors
            "
            title="Close movie details"
            aria-label="Close movie details"
        >
            &times;
        </Link>
    );
};
