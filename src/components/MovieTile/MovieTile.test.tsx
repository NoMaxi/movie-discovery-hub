import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { mockMovieDetails } from "@/mocks/movieData";
import { MovieTile } from "./MovieTile";

jest.mock("@/assets/no-poster-image.png", () => "mocked-no-poster-image.png");
jest.mock("@/contexts/ScrollContext/useScrollContext", () => ({
    useScrollContext: () => ({
        setTargetMovieId: jest.fn(),
        targetMovieId: null,
        triggerScroll: false,
        setTriggerScroll: jest.fn(),
    }),
}));

describe("MovieTile", () => {
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

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () =>
        render(
            <MovieTile movie={mockMovieDetails} onClick={onClickMock} onEdit={onEditMock} onDelete={onDeleteMock} />,
        );

    test("Should render movie tile with correct data and no context menu initially", () => {
        const { asFragment } = renderComponent();
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", mockMovieDetails.imageUrl);

        expect(screen.getByText(mockMovieDetails.title)).toBeInTheDocument();
        expect(screen.getByText(mockMovieDetails.releaseYear.toString())).toBeInTheDocument();
        expect(screen.getByText(mockMovieDetails.genres.join(", "))).toBeInTheDocument();

        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should show context menu when menu toggle button is clicked", async () => {
        renderComponent();
        const menuToggleButton = screen.getByTestId("movie-tile-menu-toggle");

        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();

        await user.click(menuToggleButton);

        const contextMenu = screen.getByTestId("context-menu");

        expect(contextMenu).toBeInTheDocument();
        expect(within(contextMenu).getByTestId("context-menu-edit-button")).toBeInTheDocument();
        expect(within(contextMenu).getByTestId("context-menu-delete-button")).toBeInTheDocument();
        expect(within(contextMenu).getByTestId("context-menu-close-button")).toBeInTheDocument();
    });

    test("Should close context menu when its close button is clicked", async () => {
        renderComponent();
        const menuToggleButton = screen.getByTestId("movie-tile-menu-toggle");

        await user.click(menuToggleButton);

        expect(screen.getByTestId("context-menu")).toBeInTheDocument();

        const closeButton = screen.getByTestId("context-menu-close-button");
        await user.click(closeButton);

        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        expect(onEditMock).not.toHaveBeenCalled();
        expect(onDeleteMock).not.toHaveBeenCalled();
    });

    test("Should close context menu when menu toggle button is clicked while menu is open", async () => {
        renderComponent();
        const menuToggleButton = screen.getByTestId("movie-tile-menu-toggle");

        await user.click(menuToggleButton);

        expect(screen.getByTestId("context-menu")).toBeInTheDocument();

        await user.click(menuToggleButton);

        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
    });

    test("Should call 'onClick' prop with movie data when tile is clicked", async () => {
        renderComponent();
        const imageElement = screen.getByAltText(`${mockMovieDetails.title} poster`);

        expect(imageElement).toBeInTheDocument();
        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();

        await user.click(imageElement);

        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(onClickMock).toHaveBeenCalledWith(mockMovieDetails, expect.any(Object));
        expect(onClickMock.mock.calls[0][1]).toHaveProperty("type", "click");
        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
    });

    test("Should call 'onEdit' prop with movie data when Edit button is clicked in context menu", async () => {
        renderComponent();
        const menuToggleButton = screen.getByTestId("movie-tile-menu-toggle");

        await user.click(menuToggleButton);

        expect(screen.getByTestId("context-menu")).toBeInTheDocument();

        const editButton = screen.getByTestId("context-menu-edit-button");
        await user.click(editButton);

        expect(onEditMock).toHaveBeenCalledTimes(1);
        expect(onEditMock).toHaveBeenCalledWith(mockMovieDetails);
        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
    });

    test("Should call 'onDelete' prop with movie data when Delete button is clicked in context menu", async () => {
        renderComponent();
        const menuToggleButton = screen.getByTestId("movie-tile-menu-toggle");

        await user.click(menuToggleButton);
        expect(screen.getByTestId("context-menu")).toBeInTheDocument();

        const deleteButton = screen.getByTestId("context-menu-delete-button");
        await user.click(deleteButton);

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        expect(onDeleteMock).toHaveBeenCalledTimes(1);
        expect(onDeleteMock).toHaveBeenCalledWith(mockMovieDetails);
    });

    test("Should close context menu and not call 'onClick' prop when tile is clicked while menu is open", async () => {
        renderComponent();
        const menuToggleButton = screen.getByTestId("movie-tile-menu-toggle");
        const imageElement = screen.getByAltText(`${mockMovieDetails.title} poster`);

        await user.click(menuToggleButton);

        expect(screen.getByTestId("context-menu")).toBeInTheDocument();

        await user.click(imageElement);

        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        expect(onClickMock).not.toHaveBeenCalled();
    });

    test("Should display fallback image when movie poster fails to load", async () => {
        renderComponent();
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        expect(img).toHaveAttribute("src", mockMovieDetails.imageUrl);

        act(() => {
            img.dispatchEvent(new Event("error"));
        });

        await waitFor(() => {
            expect(img).toHaveAttribute("src", "mocked-no-poster-image.png");
        });
    });

    test("Should reset image error state when movie changes", async () => {
        const { rerender } = renderComponent();
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        act(() => {
            img.dispatchEvent(new Event("error"));
        });

        await waitFor(() => {
            expect(img).toHaveAttribute("src", "mocked-no-poster-image.png");
        });

        const newMovie = { ...mockMovieDetails, id: 2, imageUrl: "new-image-url.jpg" };
        rerender(<MovieTile movie={newMovie} onClick={onClickMock} onEdit={onEditMock} onDelete={onDeleteMock} />);
        const newImg = screen.getByAltText(`${newMovie.title} poster`);

        expect(newImg).toHaveAttribute("src", newMovie.imageUrl);
    });

    test("Should have onError handler attached to image element", () => {
        renderComponent();
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        expect(img).toHaveAttribute("src", mockMovieDetails.imageUrl);
        expect(img.onerror).toBeDefined();
    });

    test("Should not show fallback image when image loads successfully", () => {
        renderComponent();
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        expect(img).toHaveAttribute("src", mockMovieDetails.imageUrl);
        expect(img).not.toHaveAttribute("src", "mocked-no-poster-image.png");
    });

    test("Should handle fallback image error gracefully", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        renderComponent();
        const img = screen.getByAltText(`${mockMovieDetails.title} poster`);

        act(() => {
            img.dispatchEvent(new Event("error"));
        });

        await waitFor(() => {
            expect(img).toHaveAttribute("src", "mocked-no-poster-image.png");
        });

        act(() => {
            img.dispatchEvent(new Event("error"));
        });

        await waitFor(() => {
            expect(img).toHaveAttribute("src", "mocked-no-poster-image.png");
        });

        consoleSpy.mockRestore();
    });
});
