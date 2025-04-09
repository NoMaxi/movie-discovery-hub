import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CalendarIcon } from "./CalendarIcon";

describe("CalendarIcon", () => {
    test("Should render correctly", () => {
        const { asFragment } = render(<CalendarIcon />);
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render an SVG element", () => {
        render(<CalendarIcon />);
        const svgElement = screen.getByRole("img", { hidden: true });

        expect(svgElement).toBeInTheDocument();
        expect(svgElement.tagName.toLowerCase()).toBe("svg");
    });

    test("Should have correct SVG attributes", () => {
        render(<CalendarIcon />);
        const svgElement = screen.getByRole("img", { hidden: true });

        expect(svgElement).toHaveAttribute("width", "24");
        expect(svgElement).toHaveAttribute("height", "22");
        expect(svgElement).toHaveAttribute("viewBox", "0 0 24 22");
        expect(svgElement).toHaveAttribute("fill", "none");
        expect(svgElement).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
        expect(svgElement).toHaveAttribute("aria-hidden", "true");
    });

    test("Should apply additional props correctly", () => {
        const testId = "test-calendar";
        const className = "custom-class";
        render(<CalendarIcon data-testid={testId} className={className} />);
        const svgElement = screen.getByTestId(testId);

        expect(svgElement).toHaveClass(className);
    });
});

