import { RegisterOptions } from "react-hook-form";
import { isAfter, isBefore, isValid, parseISO } from "date-fns";
import { MovieFormData } from "@/types/common";
import { urlValidationRegExp } from "@/constants/constants";

export const titleValidation: RegisterOptions<MovieFormData, "title"> = {
    required: "Title is required",
};

export const releaseDateValidation: RegisterOptions<MovieFormData, "release_date"> = {
    required: "Release date is required",
    validate: (value) => {
        if (!value) {
            return true;
        }

        const inputDate = parseISO(value);
        const minDate = parseISO("1900-01-01");
        const maxDate = parseISO("2050-01-01");

        if (!isValid(inputDate)) {
            return "Please enter a valid date";
        }

        if (isBefore(inputDate, minDate)) {
            return "Date must be 1900-01-01 or later";
        }

        if (isAfter(inputDate, maxDate)) {
            return "Date must be 2050-01-01 or earlier";
        }

        return true;
    },
};

export const posterPathValidation: RegisterOptions<MovieFormData, "poster_path"> = {
    required: "Movie URL is required",
    pattern: {
        value: urlValidationRegExp,
        message: "Please enter a valid URL",
    },
};

export const ratingValidation: RegisterOptions<MovieFormData, "vote_average"> = {
    required: "Rating is required",
    valueAsNumber: true,
    min: { value: 0, message: "Rating must be 0 or higher" },
    max: { value: 10, message: "Rating must be 10 or lower" },
    validate: (value) => {
        if (value === undefined || value === null) {
            return true;
        }

        return /^\d+(\.\d)?$/.test(value.toString()) || "Rating must be a whole number or have a single decimal place";
    },
};

export const genreValidation: RegisterOptions<MovieFormData, "genres"> = {
    validate: (value: string[]) => value.length > 0 || "Select at least one genre to proceed",
};

export const runtimeValidation: RegisterOptions<MovieFormData, "runtime"> = {
    required: "Runtime is required",
    valueAsNumber: true,
    min: { value: 0, message: "Runtime must be 0 or higher" },
    max: { value: 60 * 10, message: "Runtime is too long" },
};

export const overviewValidation: RegisterOptions<MovieFormData, "overview"> = {
    required: "Overview is required",
};
