import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TopBar } from "./TopBar";

jest.mock("@/components/common/NetflixRouletteText/NetflixRouletteText", () => ({
    NetflixRouletteText: jest.fn(() => <div data-testid="mocked-netflix-roulette-text">NetflixRouletteText</div>),
}));

describe("TopBar", () => {
    let onAddMovieClickMock: jest.Mock;
    let user: UserEvent;

    beforeEach(() => {
        onAddMovieClickMock = jest.fn();
        user = userEvent.setup();
    });

    test("Should render correctly with NetflixRouletteText and Add movie button", () => {
        const { asFragment } = render(<TopBar onAddMovieClick={onAddMovieClickMock} />);
        const netflixRouletteText = screen.getByTestId("mocked-netflix-roulette-text");

        expect(netflixRouletteText).toBeInTheDocument();

        const addButton = screen.getByRole("button", { name: /\+ add movie/i });

        expect(addButton).toHaveClass("btn-add-movie");
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should call 'onAddMovieClick' prop when the Add movie button is clicked", async () => {
        render(<TopBar onAddMovieClick={onAddMovieClickMock} />);
        const addButton = screen.getByRole("button", { name: /\+ add movie/i });

        await user.click(addButton);

        expect(onAddMovieClickMock).toHaveBeenCalledTimes(1);
    });
});
