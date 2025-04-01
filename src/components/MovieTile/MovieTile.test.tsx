import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Movie } from "@/types/common";
import MovieTile from "./MovieTile";

describe("MovieTile", () => {
    const mockMovie: Movie = {
        id: "1",
        title: "Test Movie Title",
        releaseYear: 1994,
        genres: ["Comedy", "Horror"],
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
    };
    let onClickMock: jest.Mock;
    let onEditMock: jest.Mock;
    let onDeleteMock: jest.Mock;

    beforeEach(() => {
        onClickMock = jest.fn();
        onEditMock = jest.fn();
        onDeleteMock = jest.fn();
    });

    const renderComponent = () => {
        return render(
            <MovieTile movie={mockMovie} onClick={onClickMock} onEdit={onEditMock} onDelete={onDeleteMock} />,
        );
    };

    test("Should render movie tile with correct data", () => {
        const { asFragment } = renderComponent();
        const img = screen.getByAltText(`${mockMovie.title} poster`);

        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", mockMovie.imageUrl);

        expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
        expect(screen.getByText(mockMovie.releaseYear.toString())).toBeInTheDocument();
        expect(screen.getByText(mockMovie.genres.join(", "))).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should call 'onClick' prop with movie data when tile is clicked", () => {
        renderComponent();
        const titleElement = screen.getByText(mockMovie.title);

        fireEvent.click(titleElement);

        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(onClickMock).toHaveBeenCalledWith(mockMovie);
    });

    test("Should call 'onEdit' prop with movie data when Edit button is clicked", () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");

        fireEvent.click(menuToggleButton);

        const editButton = screen.getByText("Edit");

        fireEvent.click(editButton);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(onEditMock).toHaveBeenCalledTimes(1);
        expect(onEditMock).toHaveBeenCalledWith(mockMovie);
    });

    test("Should call 'onDelete' prop with movie data when Delete button is clicked", () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");

        fireEvent.click(menuToggleButton);

        const deleteButton = screen.getByText("Delete");

        fireEvent.click(deleteButton);

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(onDeleteMock).toHaveBeenCalledTimes(1);
        expect(onDeleteMock).toHaveBeenCalledWith(mockMovie);
    });

    test("Should show context menu when menu toggle button is clicked", () => {
        renderComponent();

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();

        const menuToggleButton = screen.getByText("⋮");

        fireEvent.click(menuToggleButton);

        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    test("Should close context menu when close button is clicked", () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");

        fireEvent.click(menuToggleButton);

        expect(screen.getByText("Edit")).toBeInTheDocument();

        const closeButton = screen.getByText("×");

        fireEvent.click(closeButton);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    });

    test("Should close context menu when menu toggle button is clicked while menu is open", () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");

        fireEvent.click(menuToggleButton);

        expect(screen.getByText("Edit")).toBeInTheDocument();

        fireEvent.click(menuToggleButton);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    test("Should close context menu and not call 'onClick' prop when tile is clicked while menu is open", () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");
        const titleElement = screen.getByText(mockMovie.title);

        fireEvent.click(menuToggleButton);

        expect(screen.getByText("Edit")).toBeInTheDocument();

        fireEvent.click(titleElement);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(onClickMock).not.toHaveBeenCalled();
    });
});
