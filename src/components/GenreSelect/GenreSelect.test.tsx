import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { GenreSelect } from "./GenreSelect";

describe("GenreSelect", () => {
    let onSelectMock: jest.Mock;
    let user: UserEvent;

    beforeEach(() => {
        onSelectMock = jest.fn();
        user = userEvent.setup();
    });

    test("Should render main genre tabs and More dropdown", () => {
        const { asFragment } = render(<GenreSelect selectedGenre="Comedy" onSelect={onSelectMock} />);

        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.getByText("Drama")).toBeInTheDocument();
        expect(screen.getByText("Comedy")).toBeInTheDocument();
        expect(screen.getByText("Action")).toBeInTheDocument();
        expect(screen.getByText("Horror")).toBeInTheDocument();
        expect(screen.getByText("More")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should highlight selected main genre", () => {
        const { asFragment } = render(<GenreSelect selectedGenre="Comedy" onSelect={onSelectMock} />);
        const selectedGenre = screen.getByText("Comedy");

        expect(selectedGenre).toHaveClass("text-[var(--color-text)]");
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should change styles correctly when different main genre is selected", () => {
        const { rerender } = render(<GenreSelect selectedGenre="Comedy" onSelect={onSelectMock} />);
        const initialSelectedGenre = screen.getByText("Comedy");

        expect(initialSelectedGenre).toHaveClass("text-[var(--color-text)]");

        rerender(<GenreSelect selectedGenre="Action" onSelect={onSelectMock} />);

        const newSelectedGenre = screen.getByText("Action");

        expect(initialSelectedGenre).not.toHaveClass("text-[var(--color-text)]");
        expect(initialSelectedGenre).toHaveClass("text-[var(--color-gray-lighter)]");
        expect(newSelectedGenre).toHaveClass("text-[var(--color-text)]");
    });

    test("Should call 'onSelect' prop with clicked main genre", async () => {
        render(<GenreSelect selectedGenre="Comedy" onSelect={onSelectMock} />);
        const clickedGenre = screen.getByText("Action");

        await user.click(clickedGenre);

        expect(onSelectMock).toHaveBeenCalledWith("Action");
    });

    test("Should highlight More dropdown when secondary genre is selected", () => {
        const { asFragment } = render(<GenreSelect selectedGenre="Romance" onSelect={onSelectMock} />);
        const moreButton = screen.getByText("Romance");

        expect(moreButton).toHaveClass("text-[var(--color-text)]");
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should call 'onSelect' prop when secondary genre is selected from dropdown", async () => {
        render(<GenreSelect selectedGenre="All" onSelect={onSelectMock} />);
        
        // Click on the "More" dropdown button to open it
        const moreButton = screen.getByText("More");
        await user.click(moreButton);
        
        // Find and click on a secondary genre option (e.g., "Adventure")
        const adventureOption = screen.getByText("Adventure");
        await user.click(adventureOption);
        
        // Verify that onSelect was called with the selected secondary genre
        expect(onSelectMock).toHaveBeenCalledWith("Adventure");
    });
});
