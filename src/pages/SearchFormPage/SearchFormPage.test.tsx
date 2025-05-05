import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SearchFormPage } from "./SearchFormPage";

jest.mock("@/components/SearchForm/SearchForm", () => ({
    SearchForm: ({ initialQuery, onSearch }: { initialQuery: string; onSearch: (query: string) => void }) => (
        <div data-testid="search-form">
            <p data-testid="initial-query">{initialQuery}</p>
            <button type="button" onClick={() => onSearch("new-query")}>
                Search
            </button>
            <button type="button" onClick={() => onSearch("")}>
                Empty Search
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
    let user: UserEvent;

    beforeEach(() => {
        mockSetSearchParams.mockClear();
        mockedQueryString = "";
        user = userEvent.setup();
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

        await user.click(screen.getByRole("button", { name: "Search" }));

        expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

        const [newParams, options] = mockSetSearchParams.mock.calls[0];

        expect(typeof newParams).toBe("object");
        expect(options).toEqual({ replace: true });
        expect(newParams.get("query")).toBe("new-query");
    });

    it("Should remove query parameter when empty search is submitted", async () => {
        mockedQueryString = "?query=Matrix";
        render(<SearchFormPage />);

        await user.click(screen.getByRole("button", { name: "Empty Search" }));

        expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

        const [newParams, options] = mockSetSearchParams.mock.calls[0];

        expect(typeof newParams).toBe("object");
        expect(options).toEqual({ replace: true });
        expect(newParams.has("query")).toBe(false);
    });
});
