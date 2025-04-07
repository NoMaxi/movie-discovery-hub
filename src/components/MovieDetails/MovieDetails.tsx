import { MovieDetailsData } from "@/types/common";
import { formatDuration } from "@/utils/formatting";

interface MovieDetailsProps {
    details: MovieDetailsData;
}

const MovieDetails = ({
    details: { description, duration, genres, imageUrl, rating, releaseYear, title },
}: MovieDetailsProps) => {
    return (
        <div className="movie-details flex gap-x-14 p-8 text-[var(--color-text)] w-full">
            <img
                src={imageUrl}
                alt={`${title} poster`}
                className="movie-details-poster w-[320px] h-[485px] object-cover flex-shrink-0"
            />

            <div className="movie-details-info flex flex-col flex-grow">
                <div className="flex items-center gap-x-5 mb-2">
                    <h1 className="movie-details-title text-[40px] font-light tracking-[1px] text-white uppercase">
                        {title}
                    </h1>
                    <div className="movie-details-rating w-[60px] h-[60px] border-2 rounded-full flex items-center justify-center flex-shrink-0">
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

export default MovieDetails;
