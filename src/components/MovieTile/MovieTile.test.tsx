import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
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
    let user: UserEvent;

    beforeEach(() => {
        onClickMock = jest.fn();
        onEditMock = jest.fn();
        onDeleteMock = jest.fn();
        user = userEvent.setup();
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

    test("Should call 'onClick' prop with movie data when tile is clicked", async () => {
        renderComponent();
        const titleElement = screen.getByText(mockMovie.title);

        await user.click(titleElement);

        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(onClickMock).toHaveBeenCalledWith(mockMovie);
    });

    test("Should call 'onEdit' prop with movie data when Edit button is clicked", async () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");

        await user.click(menuToggleButton);

        const editButton = screen.getByText("Edit");

        await user.click(editButton);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(onEditMock).toHaveBeenCalledTimes(1);
        expect(onEditMock).toHaveBeenCalledWith(mockMovie);
    });

    test("Should call 'onDelete' prop with movie data when Delete button is clicked", async () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");

        await user.click(menuToggleButton);

        const deleteButton = screen.getByText("Delete");

        await user.click(deleteButton);

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(onDeleteMock).toHaveBeenCalledTimes(1);
        expect(onDeleteMock).toHaveBeenCalledWith(mockMovie);
    });

    test("Should show context menu when menu toggle button is clicked", async () => {
        renderComponent();

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();

        const menuToggleButton = screen.getByText("⋮");

        await user.click(menuToggleButton);

        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    test("Should close context menu when close button is clicked", async () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");

        await user.click(menuToggleButton);

        expect(screen.getByText("Edit")).toBeInTheDocument();

        const closeButton = screen.getByText("×");

        await user.click(closeButton);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    });

    test("Should close context menu when menu toggle button is clicked while menu is open", async () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");

        await user.click(menuToggleButton);

        expect(screen.getByText("Edit")).toBeInTheDocument();

        await user.click(menuToggleButton);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    test("Should close context menu and not call 'onClick' prop when tile is clicked while menu is open", async () => {
        renderComponent();
        const menuToggleButton = screen.getByText("⋮");
        const titleElement = screen.getByText(mockMovie.title);

        await user.click(menuToggleButton);

        expect(screen.getByText("Edit")).toBeInTheDocument();

        await user.click(titleElement);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(onClickMock).not.toHaveBeenCalled();
    });
});
