import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NetflixRouletteText } from "./NetflixRouletteText";

describe("NetflixRouletteText", () => {
    test("Should render the component with correct text parts", () => {
        const { asFragment } = render(<NetflixRouletteText />);
        const netflixPart = screen.getByText("netflix");
        const roulettePart = screen.getByText("roulette");

        expect(netflixPart).toBeInTheDocument();
        expect(roulettePart).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should apply correct CSS classes to elements", () => {
        render(<NetflixRouletteText />);
        const parentSpan = screen.getByTestId("netflix-roulette-text");
        const netflixSpan = screen.getByText("netflix");
        const rouletteSpan = screen.getByText("roulette");

        expect(parentSpan).toContainElement(netflixSpan);
        expect(parentSpan).toContainElement(rouletteSpan);
        expect(parentSpan).toHaveClass("text-primary group");
        expect(netflixSpan).toHaveClass("font-black group-hover:text-blue-500 transition-colors duration-300");
        expect(rouletteSpan).toHaveClass("font-medium group-hover:text-red-500 transition-colors duration-300");
    });
});
