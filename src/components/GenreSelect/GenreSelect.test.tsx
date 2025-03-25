import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Genre } from "@/types/common";
import GenreSelect from "./GenreSelect";

describe("GenreSelect", () => {
    const genres: Genre[] = ["Documentary", "Comedy", "Crime"];
    let onSelectMock: jest.Mock;

    beforeEach(() => {
        onSelectMock = jest.fn();
    });

    test("Should render all genres provided in props", () => {
        const { asFragment } = render(<GenreSelect genres={genres} selectedGenre="Comedy" onSelect={onSelectMock} />);

        genres.forEach((genre) => {
            expect(screen.getByText(genre)).toBeInTheDocument();
        });
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render nothing if empty array genres is provided", () => {
        const { asFragment } = render(<GenreSelect genres={[]} selectedGenre="Comedy" onSelect={onSelectMock} />);

        expect(screen.queryByRole("div")).toBeNull();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should highlight selected genre provided in props", () => {
        const { asFragment } = render(<GenreSelect genres={genres} selectedGenre="Comedy" onSelect={onSelectMock} />);
        const selectedGenre = screen.getByText("Comedy");

        expect(selectedGenre).toHaveClass("text-[var(--color-text)]");
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should change styles correctly when different genre is selected", () => {
        const { rerender } = render(<GenreSelect genres={genres} selectedGenre="Comedy" onSelect={onSelectMock} />);
        const initialSelectedGenre = screen.getByText("Comedy");

        expect(initialSelectedGenre).toHaveClass("text-[var(--color-text)]");

        rerender(<GenreSelect genres={genres} selectedGenre="Crime" onSelect={onSelectMock} />);

        const newSelectedGenre = screen.getByText("Crime");

        expect(initialSelectedGenre).not.toHaveClass("text-[var(--color-text)]");
        expect(initialSelectedGenre).toHaveClass("text-[var(--color-gray-lighter)]");
        expect(newSelectedGenre).toHaveClass("text-[var(--color-text)]");
    });

    test("Should call 'onSelect' prop with clicked genre", () => {
        render(<GenreSelect genres={genres} selectedGenre="Comedy" onSelect={onSelectMock} />);
        const clickedGenre = screen.getByText("Crime");

        fireEvent.click(clickedGenre);

        expect(onSelectMock).toHaveBeenCalledWith("Crime");
    });
});
