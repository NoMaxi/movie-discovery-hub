import { Movie } from "@/types/common";
import { formatDuration } from "@/utils/formatting";
import noPosterImage from "@/assets/no-poster-image.png";
import { useImageFallback } from "@/hooks/useImageFallback/useImageFallback";

interface MovieDetailsProps {
    details: Movie;
}

export const MovieDetails = ({
    details: { description, duration, genres, imageUrl, rating, releaseYear, title },
}: MovieDetailsProps) => {
    const imageProps = useImageFallback(imageUrl, noPosterImage);
    return (
        <div
            data-testid="movie-details"
            className="
                movie-details flex w-full max-h-header-height-expanded gap-x-14 p-8 text-text
                bg-content-background
            "
        >
            <img
                src={imageProps.src}
                alt={`${title} poster`}
                className="movie-details-poster flex-shrink-0 w-[320px] h-[485px] object-cover"
                onError={imageProps.onError}
            />

            <div className="movie-details-info flex flex-col flex-grow">
                <div className="flex items-center gap-x-5 mb-2">
                    <h1 className="movie-details-title text-2xl font-light tracking-[1px] uppercase">{title}</h1>{" "}
                    <div
                        className="
                            movie-details-rating flex flex-shrink-0 items-center justify-center
                            w-3xl h-3xl border-2 rounded-full
                        "
                    >
                        <span className="font-light">{rating}</span>
                    </div>
                </div>

                <p className="movie-details-genres text-md opacity-50 mb-6">{genres.join(", ")}</p>

                <div className="flex items-center gap-x-6 text-[24px] font-light text-primary mb-6">
                    <span className="movie-details-date">{releaseYear}</span>
                    <span className="movie-details-duration">{formatDuration(duration)}</span>
                </div>

                <p
                    className="
                    movie-details-description font-light opacity-50 leading-relaxed overflow-y-scroll"
                >
                    {description}
                </p>
            </div>
        </div>
    );
};
