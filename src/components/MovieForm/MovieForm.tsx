import { FormEvent, useRef, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { InitialMovieInfo, MovieFormData } from "@/types/common";
import {
    titleValidation,
    releaseDateValidation,
    posterPathValidation,
    ratingValidation,
    genreValidation,
    runtimeValidation,
    overviewValidation,
} from "./validationRules";
import { Loader } from "@/components/common/Loader/Loader";
import { CalendarIcon } from "@/components/common/CalendarIcon/CalendarIcon";
import { GenreMultiSelect } from "@/components/GenreMultiSelect/GenreMultiSelect";

interface MovieFormProps {
    initialMovieInfo?: Partial<InitialMovieInfo>;
    onSubmit: (formData: MovieFormData) => void;
    isLoading?: boolean;
    resetMode?: "clear" | "restore";
}

const mapInitialInfoToDefaultValues = (initialInfo: Partial<InitialMovieInfo> = {}): Partial<MovieFormData> => ({
    id: initialInfo.id,
    title: initialInfo.title ?? "",
    release_date: initialInfo.releaseDate ?? "",
    poster_path: initialInfo.imageUrl ?? "",
    vote_average: initialInfo.rating ?? 0,
    genres: initialInfo.genres ?? [],
    runtime: initialInfo.duration ?? 0,
    overview: initialInfo.description ?? "",
});

const emptyMovieFormData: MovieFormData = {
    title: "",
    release_date: "",
    poster_path: "",
    vote_average: 0,
    genres: [],
    runtime: 0,
    overview: "",
};

export const MovieForm = ({
    initialMovieInfo = {},
    onSubmit,
    resetMode = "clear",
    isLoading = false,
}: MovieFormProps) => {
    const dateInputRef = useRef<HTMLInputElement>(null);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<MovieFormData>({
        defaultValues: mapInitialInfoToDefaultValues(initialMovieInfo),
        disabled: isLoading,
        mode: "onChange",
        reValidateMode: "onChange",
    });

    useEffect(() => {
        if (initialMovieInfo && initialMovieInfo.id) {
            reset(mapInitialInfoToDefaultValues(initialMovieInfo));
        }
    }, [initialMovieInfo, reset]);

    const onSubmitHandler: SubmitHandler<MovieFormData> = (data) => {
        const submitData = initialMovieInfo.id ? { ...data, id: initialMovieInfo.id } : data;
        const finalData: MovieFormData = {
            ...submitData,
            vote_average: Number(submitData.vote_average) || 0,
            runtime: Number(submitData.runtime) || 0,
        };
        onSubmit(finalData);
    };

    const onSubmitWithFocusPrevention = (event: FormEvent) => {
        event.preventDefault();
        handleSubmit(onSubmitHandler)(event);
    };

    const handleFormReset = () => {
        if (resetMode === "restore") {
            reset(mapInitialInfoToDefaultValues(initialMovieInfo));
        } else {
            reset(emptyMovieFormData);
        }
    };

    const handleCalendarIconClick = () => {
        dateInputRef.current?.showPicker();
    };

    const { ref: rhfDateRef, ...dateRegisterProps } = register("release_date", releaseDateValidation);

    return (
        <form onSubmit={(e) => onSubmitWithFocusPrevention(e)} noValidate className="relative">
            {isLoading && (
                <div
                    className="
                    absolute flex justify-center items-center z-10
                    inset-0 bg-opacity-0 rounded
                 "
                >
                    <Loader />
                </div>
            )}

            <div
                data-testid="movie-form-grid"
                className={`
                    grid grid-cols-3 gap-x-6 gap-y-6
                    transition-all duration-300 ${isLoading ? "opacity-40 pointer-events-none" : ""}
                `}
            >
                <div className="col-span-2">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Enter title"
                        className={`input-field ${errors.title ? "input-error" : ""}`}
                        aria-invalid={errors.title ? "true" : "false"}
                        aria-describedby="title-error"
                        autoFocus
                        {...register("title", titleValidation)}
                    />
                    {errors.title && (
                        <p id="title-error" className="error-message" role="alert">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="release_date" className="form-label">
                        Release Date
                    </label>
                    <div className="relative">
                        <input
                            ref={(e) => {
                                rhfDateRef(e);
                                dateInputRef.current = e;
                            }}
                            type="date"
                            id="release_date"
                            className={`input-field ${errors.release_date ? "input-error" : ""}`}
                            min="1900-01-01"
                            aria-invalid={errors.release_date ? "true" : "false"}
                            aria-describedby="release_date-error"
                            {...dateRegisterProps}
                        />
                        <CalendarIcon
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={handleCalendarIconClick}
                        />
                    </div>
                    {errors.release_date && (
                        <p id="release_date-error" className="error-message" role="alert">
                            {errors.release_date.message}
                        </p>
                    )}
                </div>

                <div className="col-span-2">
                    <label htmlFor="poster_path" className="form-label">
                        Movie URL
                    </label>
                    <input
                        type="url"
                        id="poster_path"
                        placeholder="https://example.com/image.jpg"
                        className={`input-field ${errors.poster_path ? "input-error" : ""}`}
                        aria-invalid={errors.poster_path ? "true" : "false"}
                        aria-describedby="poster_path-error"
                        {...register("poster_path", posterPathValidation)}
                    />
                    {errors.poster_path && (
                        <p id="poster_path-error" className="error-message" role="alert">
                            {errors.poster_path.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="vote_average" className="form-label">
                        Rating
                    </label>
                    <input
                        type="number"
                        id="vote_average"
                        placeholder="7.8"
                        className={`input-field ${errors.vote_average ? "input-error" : ""}`}
                        step="0.1"
                        aria-invalid={errors.vote_average ? "true" : "false"}
                        aria-describedby="vote_average-error"
                        {...register("vote_average", ratingValidation)}
                    />
                    {errors.vote_average && (
                        <p id="vote_average-error" className="error-message" role="alert">
                            {errors.vote_average.message}
                        </p>
                    )}
                </div>

                <div className="col-span-2">
                    <label htmlFor="genres" className="form-label">
                        Genre
                    </label>
                    <Controller
                        name="genres"
                        control={control}
                        rules={genreValidation}
                        render={({ field, fieldState: { error } }) => (
                            <>
                                <GenreMultiSelect
                                    id="genres"
                                    preselectedGenres={field.value}
                                    onChange={field.onChange}
                                    name={field.name}
                                    ariaDescribedby="genre-error"
                                    error={!!error}
                                />
                                {error && (
                                    <p id="genre-error" className="error-message" role="alert">
                                        {error.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>

                <div>
                    <label htmlFor="runtime" className="form-label">
                        Runtime
                    </label>
                    <input
                        type="number"
                        id="runtime"
                        placeholder="minutes"
                        className={`input-field ${errors.runtime ? "input-error" : ""}`}
                        aria-invalid={errors.runtime ? "true" : "false"}
                        aria-describedby="runtime-error"
                        {...register("runtime", runtimeValidation)}
                    />
                    {errors.runtime && (
                        <p id="runtime-error" className="error-message" role="alert">
                            {errors.runtime.message}
                        </p>
                    )}
                </div>

                <div className="col-span-3">
                    <label htmlFor="overview" className="form-label">
                        Overview
                    </label>
                    <textarea
                        id="overview"
                        placeholder="Movie description"
                        className={`input-field min-h-[200px] h-auto py-3 ${errors.overview ? "input-error" : ""}`}
                        aria-invalid={errors.overview ? "true" : "false"}
                        aria-describedby="overview-error"
                        {...register("overview", overviewValidation)}
                    ></textarea>
                    {errors.overview && (
                        <p id="overview-error" className="error-message" role="alert">
                            {errors.overview.message}
                        </p>
                    )}
                </div>

                <div className="col-span-3 flex justify-end gap-x-4 mt-8">
                    <button type="button" onClick={handleFormReset} className="btn btn-outline" disabled={isLoading}>
                        Reset
                    </button>
                    <button type="submit" className="btn" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
};
