import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { CloseDetailsButton } from "./CloseDetailsButton";

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useSearchParams: jest.fn(),
    };
});

const { useSearchParams } = jest.requireMock("react-router-dom");

describe("CloseDetailsButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockSearchParams = (params: string = "") => {
        const mockSearchParamsInstance = new URLSearchParams(params);
        (useSearchParams as jest.Mock).mockReturnValue([
            mockSearchParamsInstance,
            jest.fn(),
        ]);
    };

    const renderButton = (searchParamsString: string = "") => {
        mockSearchParams(searchParamsString);
        return render(
            <MemoryRouter>
                <CloseDetailsButton />
            </MemoryRouter>,
        );
    };

    test("should render the close button with correct styling", () => {
        const { asFragment } = renderButton();
        const closeButton = screen.getByRole("link", { name: /close movie details/i });

        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveClass("absolute");
        expect(closeButton).toHaveClass("top-0");
        expect(closeButton).toHaveClass("right-0");
        expect(closeButton).toHaveClass("text-5xl");
        expect(closeButton).toHaveTextContent("×");
        expect(asFragment()).toMatchSnapshot();
    });

    test("should navigate to root path when no search params are present", () => {
        renderButton();
        const closeButton = screen.getByRole("link", { name: /close movie details/i });

        expect(closeButton).toHaveAttribute("href", "/");
    });

    test("should preserve search params in the navigation link", () => {
        renderButton("genre=action&sort=rating");
        const closeButton = screen.getByRole("link", { name: /close movie details/i });

        expect(closeButton).toHaveAttribute("href", "/?genre=action&sort=rating");
    });

    test("should have proper accessibility attributes", () => {
        renderButton();
        const closeButton = screen.getByRole("link", { name: /close movie details/i });

        expect(closeButton).toHaveAttribute("title", "Close movie details");
        expect(closeButton).toHaveAttribute("aria-label", "Close movie details");
    });
});
