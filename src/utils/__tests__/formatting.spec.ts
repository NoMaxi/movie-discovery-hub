import { formatDuration } from "../formatting";

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
