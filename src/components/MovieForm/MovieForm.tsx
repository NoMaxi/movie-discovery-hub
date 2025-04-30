import { FormEvent, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { isBefore, isValid, parseISO } from "date-fns";
import { InitialMovieInfo, MovieFormData } from "@/types/common";
import { urlValidationRegExp } from "@/constants/constants";
import { CalendarIcon } from "@/components/common/CalendarIcon/CalendarIcon";
import { GenreMultiSelect } from "@/components/GenreMultiSelect/GenreMultiSelect";

interface MovieFormProps {
    initialMovieInfo?: Partial<InitialMovieInfo>;
    onSubmit: (formData: MovieFormData) => void;
}

const mapInitialInfoToDefaultValues = (initialInfo: Partial<InitialMovieInfo> = {}): Partial<MovieFormData> => ({
    id: initialInfo.id,
    title: initialInfo.title ?? "",
    release_date: initialInfo.releaseDate ?? "",
    poster_path: initialInfo.imageUrl ?? "",
    vote_average: initialInfo.rating,
    genres: initialInfo.genres ?? [],
    runtime: initialInfo.duration,
    overview: initialInfo.description ?? "",
});

export const MovieForm = ({ initialMovieInfo = {}, onSubmit }: MovieFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<MovieFormData>({
        defaultValues: mapInitialInfoToDefaultValues(initialMovieInfo),
        shouldFocusError: false,
        mode: "onChange",
        reValidateMode: "onChange",
    });
    const dateInputRef = useRef<HTMLInputElement>(null);

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
        reset(mapInitialInfoToDefaultValues(initialMovieInfo));
    };

    const handleCalendarIconClick = () => {
        dateInputRef.current?.showPicker();
    };

    const { ref: rhfDateRef, ...dateRegisterProps } = register("release_date", {
        required: "Release date is required",
        validate: (value) => {
            if (!value) {
                return true;
            }

            const inputDate = parseISO(value);
            const minDate = parseISO("1900-01-01");

            if (!isValid(inputDate)) {
                return "Please enter a valid date";
            }

            if (isBefore(inputDate, minDate)) {
                return "Date must be 1900-01-01 or later";
            }

            return true;
        },
    });

    return (
        <form onSubmit={(e) => onSubmitWithFocusPrevention(e)} onReset={handleFormReset} noValidate>
            <div className="grid grid-cols-3 gap-x-6 gap-y-6">
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
                        {...register("title", {
                            required: "Title is required",
                        })}
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
                        {...register("poster_path", {
                            required: "Movie URL is required",
                            pattern: {
                                value: urlValidationRegExp,
                                message: "Please enter a valid URL",
                            },
                        })}
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
                        {...register("vote_average", {
                            required: "Rating is required",
                            valueAsNumber: true,
                            min: { value: 0, message: "Rating must be 0 or higher" },
                            max: { value: 10, message: "Rating must be 10 or lower" },
                        })}
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
                        rules={{
                            validate: (value: string[]) => value.length > 0 || "Select at least one genre to proceed",
                        }}
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
                        {...register("runtime", {
                            required: "Runtime is required",
                            valueAsNumber: true,
                            min: { value: 0, message: "Runtime must be 0 or higher" },
                            max: { value: 60 * 10, message: "Runtime is too long" },
                        })}
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
                        {...register("overview", { required: "Overview is required" })}
                    ></textarea>
                    {errors.overview && (
                        <p id="overview-error" className="error-message" role="alert">
                            {errors.overview.message}
                        </p>
                    )}
                </div>

                <div className="col-span-3 flex justify-end gap-x-4 mt-8">
                    <button type="reset" className="btn btn-outline">
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
