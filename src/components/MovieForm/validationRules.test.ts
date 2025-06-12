import { releaseDateValidation, ratingValidation, genreValidation } from "./validationRules";

describe("MovieForm Validation Rules", () => {
    describe("releaseDateValidation", () => {
        const validate = releaseDateValidation.validate as (value: string | undefined) => boolean | string;

        test("Should return true for a valid date within range", () => {
            expect(validate("2023-05-15")).toBe(true);
        });

        test("Should return error message for an invalid date format", () => {
            expect(validate("invalid-date")).toBe("Please enter a valid date");
        });

        test("Should return error message for a date before 1900-01-01", () => {
            expect(validate("1899-12-31")).toBe("Date must be 1900-01-01 or later");
        });

        test("Should return error message for a date after 2050-01-01", () => {
            expect(validate("2050-01-02")).toBe("Date must be 2050-01-01 or earlier");
        });

        test("Should return true for an empty value (required rule handles empty)", () => {
            expect(validate(undefined)).toBe(true);
            expect(validate("")).toBe(true);
        });
    });

    describe("ratingValidation", () => {
        const validate = ratingValidation.validate as (value: number | undefined | null) => boolean | string;

        test("Should return true for a valid integer rating", () => {
            expect(validate(8)).toBe(true);
        });

        test("Should return true for a valid rating with one decimal place", () => {
            expect(validate(7.5)).toBe(true);
        });

        test("Should return error message for a rating with more than one decimal place", () => {
            expect(validate(7.55)).toBe("Rating must be a whole number or have a single decimal place");
        });

        test("Should return true for a rating of 0", () => {
            expect(validate(0)).toBe(true);
        });

        test("Should return true for a rating of 10", () => {
            expect(validate(10)).toBe(true);
        });

        test("Should return true for undefined or null (required rule handles empty)", () => {
            expect(validate(undefined)).toBe(true);
            expect(validate(null)).toBe(true);
        });
    });

    describe("genreValidation", () => {
        const validate = genreValidation.validate as (value: string[]) => boolean | string;

        test("Should return true when at least one genre is selected", () => {
            expect(validate(["Action"])).toBe(true);
            expect(validate(["Action", "Comedy"])).toBe(true);
        });

        test("Should return error message when no genres are selected", () => {
            expect(validate([])).toBe("Select at least one genre to proceed");
        });
    });
});
