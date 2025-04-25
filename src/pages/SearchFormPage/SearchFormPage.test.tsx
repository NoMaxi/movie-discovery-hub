import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SearchFormPage } from "./SearchFormPage";

jest.mock("@/components/SearchForm/SearchForm", () => ({
    SearchForm: ({ initialQuery, onSearch }: { initialQuery: string; onSearch: (query: string) => void }) => (
        <div data-testid="search-form">
            <p data-testid="initial-query">{initialQuery}</p>
            <button type="button" onClick={() => onSearch("new-query")}>
                Search
            </button>
        </div>
    ),
}));

const mockSetSearchParams = jest.fn();

let mockedQueryString = "";
jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useSearchParams: jest.fn(() => [new URLSearchParams(mockedQueryString), mockSetSearchParams]),
    };
});

describe("SearchFormPage", () => {
    beforeEach(() => {
        mockSetSearchParams.mockClear();
        mockedQueryString = "";
    });

    it("Should render correctly", () => {
        const { asFragment } = render(<SearchFormPage />);

        expect(screen.getByRole("heading", { level: 2, name: /find your movie/i })).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    it("Should pass query from URL as 'initialQuery'", () => {
        mockedQueryString = "?query=Matrix";
        render(<SearchFormPage />);

        expect(screen.getByTestId("initial-query")).toHaveTextContent("Matrix");
    });

    it("Should update search params when a new search is submitted", async () => {
        render(<SearchFormPage />);
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /search/i }));

        expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

        const [callback, options] = mockSetSearchParams.mock.calls[0];

        expect(typeof callback).toBe("function");
        expect(options).toEqual({ replace: true });

        const params = new URLSearchParams();
        const updatedParams = callback(params);

        expect(updatedParams.get("query")).toBe("new-query");
    });
});
