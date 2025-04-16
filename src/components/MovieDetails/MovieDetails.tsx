import { MovieDetailsData } from "@/types/common";
import { formatDuration } from "@/utils/formatting";

interface MovieDetailsProps {
    details: MovieDetailsData;
}

export const MovieDetails = ({
    details: { description, duration, genres, imageUrl, rating, releaseYear, title },
}: MovieDetailsProps) => {
    return (
        <div
            className="
                movie-details flex w-full gap-x-14 p-8 text-[var(--color-text)]
                bg-[var(--color-content-background)]
            "
        >
            <img
                src={imageUrl}
                alt={`${title} poster`}
                className="movie-details-poster flex-shrink-0 w-[320px] h-[485px] object-cover"
            />

            <div className="movie-details-info flex flex-col flex-grow">
                <div className="flex items-center gap-x-5 mb-2">
                    <h1 className="movie-details-title text-[40px] font-light tracking-[1px] uppercase">{title}</h1>
                    <div
                        className="
                            movie-details-rating flex flex-shrink-0 items-center justify-center
                            w-[60px] h-[60px] border-2 rounded-full
                        "
                    >
                        <span className="font-light">{rating}</span>
                    </div>
                </div>

                <p className="movie-details-genres text-[14px] opacity-50 mb-6">{genres.join(", ")}</p>

                <div className="flex items-center gap-x-6 text-[24px] font-light text-[var(--color-primary)] mb-6">
                    <span className="movie-details-date">{releaseYear}</span>
                    <span className="movie-details-duration">{formatDuration(duration)}</span>
                </div>

                <p className="movie-details-description font-light opacity-50 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};
