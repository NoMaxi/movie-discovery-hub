import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { Header } from "./Header";

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        Outlet: () => <div data-testid="outlet" />,
        useParams: jest.fn(),
    };
});

const { useParams } = jest.requireMock("react-router-dom");

describe("Header", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithRouter = (movieId?: string) => {
        (useParams as jest.Mock).mockReturnValue(movieId ? { movieId } : {});
        return render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );
    };

    test("Should render a header with the correct background and base classes", () => {
        const { asFragment } = renderWithRouter();
        const header = screen.getByTestId("header");

        expect(header).toBeInTheDocument();
        expect(header).toHaveStyle({ backgroundImage: expect.stringContaining("bg_header.png") });
        expect(header).toHaveClass("relative");
        expect(header).toHaveClass("w-[var(--content-width)]");
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should apply 'min-h-[290px]' class when 'movieId' is not present in URL params", () => {
        renderWithRouter();
        expect(screen.getByTestId("header-inner")).toHaveClass("min-h-[290px]");
    });

    test("Should apply 'h-[540px]' class when 'movieId' is present in URL params", () => {
        renderWithRouter("123");
        expect(screen.getByTestId("header-inner")).toHaveClass("h-[540px]");
    });

    test("Should render Outlet", () => {
        renderWithRouter();
        expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });
});
