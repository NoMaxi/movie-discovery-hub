import React, { forwardRef, useImperativeHandle } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { InitialMovieInfo, SelectableGenre } from "@/types/common";
import { mockMovieInfo } from "@/mocks/movieData";
import { GenreMultiSelectProps, GenreMultiSelectRef } from "@/components/GenreMultiSelect/GenreMultiSelect";
import { MovieForm } from "./MovieForm";

jest.mock("@/components/common/CalendarIcon/CalendarIcon", () => ({
    CalendarIcon: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="calendar-icon" {...props} />,
}));

const mockGenreSelectReset = jest.fn();

jest.mock("@/components/GenreMultiSelect/GenreMultiSelect", () => {
    const MockGenreMultiSelectComponent = forwardRef<GenreMultiSelectRef, GenreMultiSelectProps>((props, ref) => {
        const { id, name, preselectedGenres = [], ariaDescribedby } = props;

        useImperativeHandle(ref, () => ({
            reset: mockGenreSelectReset,
        }));

        return (
            <div data-testid="genre-multi-select">
                <input
                    type="hidden"
                    name={name}
                    defaultValue={preselectedGenres.join(", ")}
                    data-testid={`hidden-${name}`}
                />
                <button type="button" aria-describedby={ariaDescribedby} id={id}>
                    {preselectedGenres.length > 0 ? preselectedGenres.join(", ") : "Select Genre"}
                </button>
                <div>
                    {(["Comedy", "Crime", "Documentary", "Horror"] as SelectableGenre[]).map((genre) => (
                        <label key={genre}>
                            {genre}
                            <input
                                type="checkbox"
                                value={genre}
                                defaultChecked={preselectedGenres.includes(genre)}
                                name={`mock-${name}-${genre}`}
                            />
                        </label>
                    ))}
                </div>
            </div>
        );
    });
    MockGenreMultiSelectComponent.displayName = "MockGenreMultiSelect";

    return {
        __esModule: true,
        GenreMultiSelect: MockGenreMultiSelectComponent,
    };
});

describe("MovieForm", () => {
    let user: UserEvent;
    let onSubmitMock: jest.Mock;
    let showPickerMock: jest.Mock;

    beforeEach(() => {
        user = userEvent.setup();
        onSubmitMock = jest.fn();
        showPickerMock = jest.fn();
        HTMLInputElement.prototype.showPicker = showPickerMock;
    });

    afterEach(() => {
        delete (HTMLInputElement.prototype as { showPicker?: () => void }).showPicker;
        mockGenreSelectReset.mockClear();
        jest.clearAllMocks();
    });

    const renderComponent = (initialMovieInfo?: InitialMovieInfo) => {
        return render(<MovieForm initialMovieInfo={initialMovieInfo} onSubmit={onSubmitMock} />);
    };

    test("Should render empty form correctly for Add Movie mode", () => {
        const { asFragment } = renderComponent();

        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toHaveValue("");

        expect(screen.getByLabelText(/release date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/release date/i)).toHaveValue("");

        expect(screen.getByLabelText(/movie url/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/movie url/i)).toHaveValue("");

        expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/rating/i)).toHaveValue(null);

        expect(screen.getByTestId("genre-multi-select")).toBeInTheDocument();
        expect(within(screen.getByTestId("genre-multi-select")).getByRole("button")).toHaveTextContent("Select Genre");

        expect(screen.getByLabelText(/runtime/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/runtime/i)).toHaveValue(null);

        expect(screen.getByLabelText(/overview/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/overview/i)).toHaveValue("");

        expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();

        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render prefilled form correctly for Edit Movie mode", () => {
        renderComponent(mockMovieInfo);

        expect(screen.getByLabelText(/title/i)).toHaveValue(mockMovieInfo.title);
        expect(screen.getByLabelText(/release date/i)).toHaveValue(mockMovieInfo.releaseDate);
        expect(screen.getByLabelText(/movie url/i)).toHaveValue(mockMovieInfo.imageUrl);
        expect(screen.getByLabelText(/rating/i)).toHaveValue(mockMovieInfo.rating);
        expect(screen.getByLabelText(/runtime/i)).toHaveValue(mockMovieInfo.duration);
        expect(screen.getByLabelText(/overview/i)).toHaveValue(mockMovieInfo.description);

        expect(within(screen.getByTestId("genre-multi-select")).getByRole("button")).toHaveTextContent(
            mockMovieInfo.genres.join(", "),
        );
        expect(screen.getByLabelText("Comedy", { selector: "input[type='checkbox']" })).toBeChecked();
        expect(screen.getByLabelText("Crime", { selector: "input[type='checkbox']" })).toBeChecked();
        expect(screen.getByLabelText("Documentary", { selector: "input[type='checkbox']" })).not.toBeChecked();
        expect(screen.getByLabelText("Horror", { selector: "input[type='checkbox']" })).not.toBeChecked();
    });

    test("Should call 'onSubmit' prop with processed data when valid form was submitted in Add Movie mode", async () => {
        renderComponent();

        const titleInput = screen.getByLabelText(/title/i);
        const dateInput = screen.getByLabelText(/release date/i);
        const urlInput = screen.getByLabelText(/movie url/i);
        const ratingInput = screen.getByLabelText(/rating/i);
        const runtimeInput = screen.getByLabelText(/runtime/i);
        const overviewInput = screen.getByLabelText(/overview/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(titleInput, mockMovieInfo.title);
        fireEvent.change(dateInput, { target: { value: mockMovieInfo.releaseDate } });
        await user.type(urlInput, mockMovieInfo.imageUrl);
        await user.type(ratingInput, mockMovieInfo.rating.toString());
        await user.type(runtimeInput, mockMovieInfo.duration.toString());
        await user.type(overviewInput, mockMovieInfo.description);

        const selectedGenre = "Comedy";
        const comedyCheckbox = screen.getByLabelText(selectedGenre, { selector: "input[type='checkbox']" });
        await user.click(comedyCheckbox);

        const hiddenGenreInput = screen.getByTestId("hidden-genres");
        fireEvent.change(hiddenGenreInput, { target: { value: selectedGenre } });

        await user.click(submitButton);

        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({
            title: mockMovieInfo.title,
            release_date: mockMovieInfo.releaseDate,
            poster_path: mockMovieInfo.imageUrl,
            vote_average: mockMovieInfo.rating,
            genres: [selectedGenre],
            runtime: mockMovieInfo.duration,
            overview: mockMovieInfo.description,
        });
        expect(screen.queryByText(/select at least one genre/i)).not.toBeInTheDocument();
    });

    test("Should call 'onSubmit' prop with processed data including id in Edit Movie mode", async () => {
        const mockUpdatedMovieTitle = "Updated Movie";
        renderComponent(mockMovieInfo);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.clear(titleInput);
        await user.type(titleInput, mockUpdatedMovieTitle);

        const hiddenGenreInput = screen.getByTestId("hidden-genres");
        fireEvent.change(hiddenGenreInput, { target: { value: "Comedy,Crime" } });

        await user.click(submitButton);

        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({
            id: mockMovieInfo.id,
            title: mockUpdatedMovieTitle,
            release_date: mockMovieInfo.releaseDate,
            poster_path: mockMovieInfo.imageUrl,
            vote_average: mockMovieInfo.rating,
            genres: mockMovieInfo.genres,
            runtime: mockMovieInfo.duration,
            overview: mockMovieInfo.description,
        });
    });

    test("Should call 'onSubmit' with 0 for rating and runtime if non-numeric values were provided", async () => {
        renderComponent();

        await user.type(screen.getByLabelText(/title/i), "Numeric Test");
        fireEvent.change(screen.getByLabelText(/release date/i), { target: { value: "2024-01-17" } });
        await user.type(screen.getByLabelText(/movie url/i), "https://numeric.test");
        await user.type(screen.getByLabelText(/overview/i), "Mock Description");
        const hiddenGenreInput = screen.getByTestId("hidden-genres");
        fireEvent.change(hiddenGenreInput, { target: { value: "Horror" } });

        await user.click(screen.getByRole("button", { name: /submit/i }));

        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith(
            expect.objectContaining({
                vote_average: 0,
                runtime: 0,
                genres: ["Horror"],
                title: "Numeric Test",
            }),
        );
    });

    test("Should show genre validation error and not call onSubmit if no genre was selected", async () => {
        renderComponent();

        await user.type(screen.getByLabelText(/title/i), "Movie Without Genre");
        fireEvent.change(screen.getByLabelText(/release date/i), { target: { value: "2024-01-16" } });
        await user.type(screen.getByLabelText(/movie url/i), "https://movie.com");
        await user.type(screen.getByLabelText(/rating/i), "5");
        await user.type(screen.getByLabelText(/runtime/i), "100");
        await user.type(screen.getByLabelText(/overview/i), "Overview here.");

        const hiddenGenreInput = screen.getByTestId("hidden-genres");
        fireEvent.change(hiddenGenreInput, { target: { value: "" } });

        await user.click(screen.getByRole("button", { name: /submit/i }));

        expect(onSubmitMock).not.toHaveBeenCalled();
        expect(screen.getByText(/select at least one genre/i)).toBeInTheDocument();
    });

    test("Should reset fields to initial values and call GenreMultiSelect reset when Reset button is clicked", async () => {
        renderComponent(mockMovieInfo);

        const titleInput = screen.getByLabelText(/title/i);
        const dateInput = screen.getByLabelText(/release date/i);
        const urlInput = screen.getByLabelText(/movie url/i);
        const ratingInput = screen.getByLabelText(/rating/i);
        const runtimeInput = screen.getByLabelText(/runtime/i);
        const overviewInput = screen.getByLabelText(/overview/i);
        const resetButton = screen.getByRole("button", { name: /reset/i });

        await user.clear(titleInput);
        await user.type(titleInput, "Temporary Title");
        await user.clear(runtimeInput);
        await user.type(runtimeInput, "10");
        fireEvent.change(dateInput, { target: { value: "2000-01-01" } });

        await user.click(resetButton);

        expect(titleInput).toHaveValue(mockMovieInfo.title);
        expect(dateInput).toHaveValue(mockMovieInfo.releaseDate);
        expect(urlInput).toHaveValue(mockMovieInfo.imageUrl);
        expect(ratingInput).toHaveValue(mockMovieInfo.rating);
        expect(runtimeInput).toHaveValue(mockMovieInfo.duration);
        expect(overviewInput).toHaveValue(mockMovieInfo.description);

        expect(mockGenreSelectReset).toHaveBeenCalledTimes(1);
        expect(screen.queryByText(/select at least one genre/i)).not.toBeInTheDocument();
    });

    test("Should clear fields and call GenreMultiSelect 'reset' on Reset button click in Add mode", async () => {
        renderComponent();

        const titleInput = screen.getByLabelText(/title/i);
        const dateInput = screen.getByLabelText(/release date/i);
        const urlInput = screen.getByLabelText(/movie url/i);
        const ratingInput = screen.getByLabelText(/rating/i);
        const runtimeInput = screen.getByLabelText(/runtime/i);
        const overviewInput = screen.getByLabelText(/overview/i);
        const resetButton = screen.getByRole("button", { name: /reset/i });
        const hiddenGenreInput = screen.getByTestId("hidden-genres");

        await user.type(titleInput, "Temporary Title");
        fireEvent.change(dateInput, { target: { value: "2022-02-02" } });
        await user.type(urlInput, "https://temp.com");
        await user.type(ratingInput, "5.5");
        await user.type(runtimeInput, "99");
        await user.type(overviewInput, "Temp description");
        fireEvent.change(hiddenGenreInput, { target: { value: "Crime" } });

        await user.click(resetButton);

        expect(titleInput).toHaveValue("");
        expect(dateInput).toHaveValue("");
        expect(urlInput).toHaveValue("");
        expect(ratingInput).toHaveValue(null);
        expect(runtimeInput).toHaveValue(null);
        expect(overviewInput).toHaveValue("");

        expect(mockGenreSelectReset).toHaveBeenCalledTimes(1);

        expect(screen.queryByText(/select at least one genre/i)).not.toBeInTheDocument();
    });

    test("Should call showPicker on date input when calendar icon is clicked", async () => {
        renderComponent();
        const icon = screen.getByTestId("calendar-icon");

        await user.click(icon);

        expect(showPickerMock).toHaveBeenCalledTimes(1);
    });
});
