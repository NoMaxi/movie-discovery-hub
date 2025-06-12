import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SelectArrow from "./SelectArrow";

describe("SelectArrow", () => {
    test("Should render correctly", () => {
        const { asFragment } = render(<SelectArrow />);
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render an SVG element", () => {
        render(<SelectArrow />);
        const svgElement = screen.getByTestId("select-arrow-svg");

        expect(svgElement).toBeInTheDocument();
        expect(svgElement.tagName.toLowerCase()).toBe("svg");
    });

    test("Should have correct CSS classes applied to the SVG element", () => {
        render(<SelectArrow />);
        const svgElement = screen.getByTestId("select-arrow-svg");

        expect(svgElement).toHaveClass("w-3");
        expect(svgElement).toHaveClass("h-3");
        expect(svgElement).toHaveClass("fill-primary");
    });

    test("Should have correct custom CSS classes applied to the SVG element", () => {
        const customClass = "custom-class";
        render(<SelectArrow className={customClass} />);
        const svgElement = screen.getByTestId("select-arrow-svg");

        expect(svgElement).toHaveClass(customClass);
    });

    test("Should have correct SVG attributes", () => {
        render(<SelectArrow />);
        const svgElement = screen.getByTestId("select-arrow-svg");

        expect(svgElement).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
        expect(svgElement).toHaveAttribute("viewBox", "0 0 10 10");
        expect(svgElement).toHaveAttribute("aria-hidden", "true");
    });

    test("Should contain a path element with correct shape data", () => {
        render(<SelectArrow />);
        const pathElement = screen.getByTestId("select-arrow-path");

        expect(pathElement).toBeInTheDocument();
        expect(pathElement.tagName.toLowerCase()).toBe("path");
        expect(pathElement).toHaveAttribute("d", "M0 0 L10 0 L5 7 z");
    });
});
