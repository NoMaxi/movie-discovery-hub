import { FormEvent, useRef, useState } from "react";
import { Genre, InitialMovieInfo } from "@/types/common";
import { CalendarIcon } from "@/components/common/CalendarIcon/CalendarIcon";
import { GenreMultiSelect, GenreSelectRef } from "@/components/GenreMultiSelect/GenreMultiSelect";

interface MovieFormProps {
    initialMovieInfo?: Partial<InitialMovieInfo>;
    onSubmit: (formData: MovieFormData) => void;
}

interface MovieFormData {
    id?: string;
    title: string;
    release_date: string;
    poster_path: string;
    vote_average: number;
    genres: Genre[];
    runtime: number;
    overview: string;
}

export const MovieForm = ({ initialMovieInfo = {}, onSubmit }: MovieFormProps) => {
    const [genreError, setGenreError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const genreSelectRef = useRef<GenreSelectRef>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setGenreError(null);

        const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
        const selectedGenres = formData.genres
            ? ((formData.genres as string).split(",").filter(Boolean) as Genre[])
            : [];

        if (selectedGenres.length === 0) {
            setGenreError("Select at least one genre to proceed");
            return;
        }

        const processedData: MovieFormData = {
            ...(initialMovieInfo.id && { id: initialMovieInfo.id }),
            title: formData.title as string,
            release_date: formData.release_date as string,
            poster_path: formData.poster_path as string,
            vote_average: parseFloat(formData.vote_average as string) || 0,
            genres: selectedGenres,
            runtime: parseInt(formData.runtime as string, 10) || 0,
            overview: formData.overview as string,
        };
        onSubmit(processedData);
    };

    const handleReset = () => {
        genreSelectRef.current?.reset();
        setGenreError(null);
    };

    const handleCalendarIconClick = () => {
        dateInputRef.current?.showPicker();
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} onReset={handleReset} noValidate>
            <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                <div className="col-span-2">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter title"
                        className="input-field"
                        defaultValue={initialMovieInfo.title ?? ""}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="release_date" className="form-label">
                        Release Date
                    </label>
                    <div className="relative">
                        <input
                            ref={dateInputRef}
                            type="date"
                            id="release_date"
                            name="release_date"
                            className="input-field"
                            min="1900-01-01"
                            defaultValue={initialMovieInfo.releaseDate ?? ""}
                            required
                        />
                        <CalendarIcon
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={handleCalendarIconClick}
                        />
                    </div>
                </div>

                <div className="col-span-2">
                    <label htmlFor="poster_path" className="form-label">
                        Movie URL
                    </label>
                    <input
                        type="url"
                        id="poster_path"
                        name="poster_path"
                        placeholder="[https://example.com/image.jpg](https://example.com/image.jpg)"
                        className="input-field"
                        defaultValue={initialMovieInfo.imageUrl ?? ""}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="vote_average" className="form-label">
                        Rating
                    </label>
                    <input
                        type="number"
                        id="vote_average"
                        name="vote_average"
                        placeholder="7.8"
                        className="input-field"
                        step="0.1"
                        min="0"
                        max="10"
                        defaultValue={initialMovieInfo.rating ?? ""}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <label htmlFor="genres" className="form-label">
                        Genre
                    </label>
                    <GenreMultiSelect
                        ref={genreSelectRef}
                        id="genres"
                        name="genres"
                        initialGenres={initialMovieInfo.genres ?? []}
                        aria-describedby="genre-error"
                    />
                    {genreError && (
                        <p id="genre-error" className="text-[var(--color-primary)] text-sm mt-1 opacity-80">
                            {genreError}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="runtime" className="form-label">
                        Runtime
                    </label>
                    <input
                        type="number"
                        id="runtime"
                        name="runtime"
                        placeholder="minutes"
                        className="input-field"
                        min="0"
                        defaultValue={initialMovieInfo.duration ?? ""} // Map from duration
                        required
                    />
                </div>

                <div className="col-span-3">
                    <label htmlFor="overview" className="form-label">
                        Overview
                    </label>
                    <textarea
                        id="overview"
                        name="overview"
                        placeholder="Movie description"
                        className="input-field min-h-[200px] h-auto py-3"
                        defaultValue={initialMovieInfo.description ?? ""}
                        required
                    ></textarea>
                </div>

                <div className="col-span-3 flex justify-end gap-x-4 mt-8">
                    <button type="reset" className="btn btn-outline" onClick={handleReset}>
                        Reset
                    </button>
                    <button type="submit" className="btn">
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
};
