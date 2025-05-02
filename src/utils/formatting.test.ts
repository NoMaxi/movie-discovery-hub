import { formatDuration, getYearFromDate } from "./formatting";

describe("formatting", () => {
    describe("formatDuration", () => {
        it("Should return empty string for invalid input", () => {
            expect(formatDuration(NaN)).toBe("");
            expect(formatDuration(-Infinity)).toBe("");
            expect(formatDuration(Infinity)).toBe("");
            expect(formatDuration(-1)).toBe("");
            expect(formatDuration(-100)).toBe("");
        });

        it("Should format zero duration correctly", () => {
            expect(formatDuration(0)).toBe("0min");
        });

        it("Should format minutes only correctly", () => {
            expect(formatDuration(32)).toBe("32min");
            expect(formatDuration(45)).toBe("45min");
        });

        it("Should format hours only correctly", () => {
            expect(formatDuration(60)).toBe("1h");
            expect(formatDuration(120)).toBe("2h");
            expect(formatDuration(180)).toBe("3h");
        });

        it("Should format hours and minutes correctly", () => {
            expect(formatDuration(91)).toBe("1h 31min");
            expect(formatDuration(154)).toBe("2h 34min");
            expect(formatDuration(208)).toBe("3h 28min");
        });

        it("Should handle decimal values correctly", () => {
            expect(formatDuration(60.5)).toBe("1h 1min");
            expect(formatDuration(120.75)).toBe("2h 1min");
            expect(formatDuration(180.25)).toBe("3h");
        });
    });

    describe("getYearFromDate", () => {
        it("Should return 0 for falsy inputs", () => {
            expect(getYearFromDate(undefined)).toBe(0);
            expect(getYearFromDate("")).toBe(0);
        });

        it("Should return 0 for invalid date formats", () => {
            expect(getYearFromDate("not-a-date")).toBe(0);
            expect(getYearFromDate("32/13/2022")).toBe(0);
            expect(getYearFromDate("2022/13/32")).toBe(0);
        });

        it("Should correctly extract year from valid ISO date strings", () => {
            expect(getYearFromDate("2022-01-01")).toBe(2022);
            expect(getYearFromDate("2023-06-15")).toBe(2023);
            expect(getYearFromDate("2020-02-29")).toBe(2020);
            expect(getYearFromDate("1999-12-31")).toBe(1999);
        });

        it("Should handle ISO date strings with time component", () => {
            expect(getYearFromDate("1971-01-01T23:38:41Z")).toBe(1971);
            expect(getYearFromDate("2022-01-01T12:00:00Z")).toBe(2022);
            expect(getYearFromDate("2023-06-15T15:30:45+02:00")).toBe(2023);
        });
    });
});
