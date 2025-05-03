import React, { forwardRef } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { InitialMovieInfo, MovieFormData, SelectableGenre } from "@/types/common";
import { mockMovieInfo } from "@/mocks/movieData";
import { GenreMultiSelectProps } from "@/components/GenreMultiSelect/GenreMultiSelect";
import { MovieForm } from "./MovieForm";

jest.mock("@/components/common/CalendarIcon/CalendarIcon", () => ({
    CalendarIcon: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="calendar-icon" {...props} />,
}));

jest.mock("@/components/GenreMultiSelect/GenreMultiSelect", () => {
    const MockGenreMultiSelectComponent = forwardRef<
        HTMLDivElement,
        GenreMultiSelectProps & { onChange?: (value: string[]) => void }
    >((props, ref) => {
        const { id, name, preselectedGenres = [], onChange, ariaDescribedby, error } = props;
        const availableGenres: SelectableGenre[] = ["Comedy", "Crime", "Documentary", "Horror"];

        const handleCheckboxChange = (genre: SelectableGenre, checked: boolean) => {
            const currentGenres = new Set(preselectedGenres);
            if (checked) {
                currentGenres.add(genre);
            } else {
                currentGenres.delete(genre);
            }
            onChange?.(Array.from(currentGenres));
        };

        const displayValue = preselectedGenres.length > 0 ? preselectedGenres.join(", ") : "Select Genre";
        const areGenresSelected = preselectedGenres.length > 0;

        return (
            <div data-testid="genre-multi-select" ref={ref}>
                <button
                    type="button"
                    aria-describedby={ariaDescribedby}
                    id={id}
                    aria-invalid={error ? "true" : "false"}
                    className={`mock-button ${areGenresSelected ? "selected" : ""}`}
                >
                    {displayValue}
                </button>
                <div>
                    {availableGenres.map((genre) => (
                        <label key={genre}>
                            {genre}
                            <input
                                type="checkbox"
                                value={genre}
                                checked={preselectedGenres.includes(genre)}
                                onChange={(e) => handleCheckboxChange(genre, e.target.checked)}
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
        Object.defineProperty(window.HTMLInputElement.prototype, "showPicker", {
            value: showPickerMock,
            configurable: true,
            writable: true,
        });
    });

    afterEach(() => {
        delete (window.HTMLInputElement.prototype as { showPicker?: () => void }).showPicker;
        jest.clearAllMocks();
    });

    const renderComponent = (
        initialMovieInfo?: Partial<InitialMovieInfo>,
        resetMode?: "clear" | "restore",
        isLoading = false,
    ) => {
        return render(
            <MovieForm
                initialMovieInfo={initialMovieInfo}
                onSubmit={onSubmitMock}
                resetMode={resetMode}
                isLoading={isLoading}
            />,
        );
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
        expect(screen.getByLabelText(/rating/i)).toHaveValue(0);

        expect(screen.getByTestId("genre-multi-select")).toBeInTheDocument();
        expect(within(screen.getByTestId("genre-multi-select")).getByRole("button")).toHaveTextContent("Select Genre");

        expect(screen.getByLabelText(/runtime/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/runtime/i)).toHaveValue(0);

        expect(screen.getByLabelText(/overview/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/overview/i)).toHaveValue("");

        expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();

        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render prefilled form correctly for Edit Movie mode", async () => {
        const { asFragment } = renderComponent(mockMovieInfo);

        await waitFor(() => {
            expect(screen.getByLabelText(/title/i)).toHaveValue(mockMovieInfo.title);
        });

        expect(screen.getByLabelText(/release date/i)).toHaveValue(mockMovieInfo.releaseDate);
        expect(screen.getByLabelText(/movie url/i)).toHaveValue(mockMovieInfo.imageUrl);
        expect(screen.getByLabelText(/rating/i)).toHaveValue(mockMovieInfo.rating);
        expect(screen.getByLabelText(/runtime/i)).toHaveValue(mockMovieInfo.duration);
        expect(screen.getByLabelText(/overview/i)).toHaveValue(mockMovieInfo.description);

        const genreSelect = screen.getByTestId("genre-multi-select");
        await waitFor(() => {
            expect(within(genreSelect).getByRole("button")).toHaveTextContent(mockMovieInfo.genres.join(", "));
        });
        expect(within(genreSelect).getByLabelText("Comedy", { selector: "input[type='checkbox']" })).toBeChecked();
        expect(within(genreSelect).getByLabelText("Crime", { selector: "input[type='checkbox']" })).toBeChecked();
        expect(
            within(genreSelect).getByLabelText("Documentary", { selector: "input[type='checkbox']" }),
        ).not.toBeChecked();
        expect(within(genreSelect).getByLabelText("Horror", { selector: "input[type='checkbox']" })).not.toBeChecked();
        
        expect(asFragment()).toMatchSnapshot();
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
        const genreSelect = screen.getByTestId("genre-multi-select");

        await user.type(titleInput, mockMovieInfo.title);
        await user.clear(dateInput);
        await user.type(dateInput, mockMovieInfo.releaseDate);
        await user.type(urlInput, mockMovieInfo.imageUrl);
        await user.clear(ratingInput);
        await user.type(ratingInput, mockMovieInfo.rating.toString());
        await user.clear(runtimeInput);
        await user.type(runtimeInput, mockMovieInfo.duration.toString());
        await user.type(overviewInput, mockMovieInfo.description);

        const selectedGenre = "Comedy";
        const comedyCheckbox = within(genreSelect).getByLabelText(selectedGenre, {
            selector: "input[type='checkbox']",
        });
        await user.click(comedyCheckbox);

        await waitFor(() => {
            expect(within(genreSelect).getByRole("button")).toHaveTextContent(selectedGenre);
        });

        await user.click(submitButton);

        await waitFor(() => {
            expect(onSubmitMock).toHaveBeenCalledTimes(1);
        });

        const expectedData: MovieFormData = {
            title: mockMovieInfo.title,
            release_date: mockMovieInfo.releaseDate,
            poster_path: mockMovieInfo.imageUrl,
            vote_average: mockMovieInfo.rating,
            genres: [selectedGenre],
            runtime: mockMovieInfo.duration,
            overview: mockMovieInfo.description,
        };
        expect(onSubmitMock).toHaveBeenCalledWith(expectedData);

        expect(screen.queryByText(/select at least one genre/i)).not.toBeInTheDocument();
        expect(screen.queryByTestId("genre-error-message")).not.toBeInTheDocument();
    });

    test("Should call 'onSubmit' prop with processed data including id in Edit Movie mode", async () => {
        const mockUpdatedMovieTitle = "Updated Movie";
        renderComponent(mockMovieInfo);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        const genreSelect = screen.getByTestId("genre-multi-select");

        await waitFor(() => {
            expect(within(genreSelect).getByRole("button")).toHaveTextContent(mockMovieInfo.genres.join(", "));
        });

        await user.clear(titleInput);
        await user.type(titleInput, mockUpdatedMovieTitle);

        await user.click(submitButton);

        await waitFor(() => {
            expect(onSubmitMock).toHaveBeenCalledTimes(1);
        });

        const expectedData: MovieFormData = {
            id: mockMovieInfo.id,
            title: mockUpdatedMovieTitle,
            release_date: mockMovieInfo.releaseDate,
            poster_path: mockMovieInfo.imageUrl,
            vote_average: mockMovieInfo.rating,
            genres: mockMovieInfo.genres,
            runtime: mockMovieInfo.duration,
            overview: mockMovieInfo.description,
        };
        expect(onSubmitMock).toHaveBeenCalledWith(expectedData);
    });

    test("Should call 'onSubmit' with 0 for rating and runtime if non-numeric/empty values were provided", async () => {
        renderComponent();

        await user.type(screen.getByLabelText(/title/i), "Numeric Test");
        await user.clear(screen.getByLabelText(/release date/i));
        await user.type(screen.getByLabelText(/release date/i), "2024-01-17");
        await user.type(screen.getByLabelText(/movie url/i), "https://numeric.test");
        await user.type(screen.getByLabelText(/overview/i), "Mock Description");

        const genreSelect = screen.getByTestId("genre-multi-select");
        const horrorCheckbox = within(genreSelect).getByLabelText("Horror", { selector: "input[type='checkbox']" });
        await user.click(horrorCheckbox);

        await waitFor(() => {
            expect(within(genreSelect).getByRole("button")).toHaveTextContent("Horror");
        });

        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(onSubmitMock).toHaveBeenCalledTimes(1);
        });

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

        await user.clear(screen.getByLabelText(/release date/i));
        await user.type(screen.getByLabelText(/release date/i), "2024-01-16");
        await user.type(screen.getByLabelText(/movie url/i), "https://movie.com");
        await user.clear(screen.getByLabelText(/rating/i));
        await user.type(screen.getByLabelText(/rating/i), "5");
        await user.clear(screen.getByLabelText(/runtime/i));
        await user.type(screen.getByLabelText(/runtime/i), "100");
        await user.type(screen.getByLabelText(/overview/i), "Overview here.");

        const genreSelect = screen.getByTestId("genre-multi-select");
        expect(within(genreSelect).getByRole("button")).toHaveTextContent("Select Genre");

        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText("Title is required")).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(/select at least one genre/i)).toBeInTheDocument();
        });

        expect(screen.getByLabelText(/title/i)).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByLabelText(/title/i)).toHaveClass("input-error");
        expect(within(genreSelect).getByRole("button")).toHaveAttribute("aria-invalid", "true");

        expect(onSubmitMock).not.toHaveBeenCalled();
    });

    test("Should reset fields to initial values when Reset button is clicked in 'restore' mode", async () => {
        renderComponent(mockMovieInfo, "restore");

        const titleInput = screen.getByLabelText(/title/i);
        const dateInput = screen.getByLabelText(/release date/i);
        const urlInput = screen.getByLabelText(/movie url/i);
        const ratingInput = screen.getByLabelText(/rating/i);
        const runtimeInput = screen.getByLabelText(/runtime/i);
        const overviewInput = screen.getByLabelText(/overview/i);
        const resetButton = screen.getByRole("button", { name: /reset/i });
        const genreSelect = screen.getByTestId("genre-multi-select");

        await waitFor(() => {
            expect(titleInput).toHaveValue(mockMovieInfo.title);
        });
        expect(within(genreSelect).getByRole("button")).toHaveTextContent(mockMovieInfo.genres.join(", "));

        await user.clear(titleInput);
        await user.type(titleInput, "Temporary Title");
        await user.clear(runtimeInput);
        await user.type(runtimeInput, "10");
        await user.clear(dateInput);
        await user.type(dateInput, "2000-01-01");
        const comedyCheckbox = within(genreSelect).getByLabelText("Comedy", { selector: "input[type='checkbox']" });
        await user.click(comedyCheckbox);
        await waitFor(() => {
            expect(within(genreSelect).getByRole("button")).toHaveTextContent("Crime");
        });

        await user.click(resetButton);

        await waitFor(() => {
            expect(within(genreSelect).getByRole("button")).toHaveTextContent(mockMovieInfo.genres.join(", "));
        });

        expect(titleInput).toHaveValue(mockMovieInfo.title);
        expect(dateInput).toHaveValue(mockMovieInfo.releaseDate);
        expect(urlInput).toHaveValue(mockMovieInfo.imageUrl);
        expect(ratingInput).toHaveValue(mockMovieInfo.rating);
        expect(runtimeInput).toHaveValue(mockMovieInfo.duration);
        expect(overviewInput).toHaveValue(mockMovieInfo.description);

        expect(within(genreSelect).getByLabelText("Comedy", { selector: "input[type='checkbox']" })).toBeChecked();
        expect(within(genreSelect).getByLabelText("Crime", { selector: "input[type='checkbox']" })).toBeChecked();

        expect(screen.queryByText(/select at least one genre/i)).not.toBeInTheDocument();
    });

    test("Should clear fields on Reset button click in default 'clear' mode", async () => {
        renderComponent(mockMovieInfo);

        const titleInput = screen.getByLabelText(/title/i);
        const dateInput = screen.getByLabelText(/release date/i);
        const urlInput = screen.getByLabelText(/movie url/i);
        const ratingInput = screen.getByLabelText(/rating/i);
        const runtimeInput = screen.getByLabelText(/runtime/i);
        const overviewInput = screen.getByLabelText(/overview/i);
        const resetButton = screen.getByRole("button", { name: /reset/i });
        const genreSelect = screen.getByTestId("genre-multi-select");

        await waitFor(() => {
            expect(titleInput).toHaveValue(mockMovieInfo.title);
        });
        expect(within(genreSelect).getByRole("button")).toHaveTextContent(mockMovieInfo.genres.join(", "));

        await user.click(resetButton);

        await waitFor(() => {
            expect(within(genreSelect).getByRole("button")).toHaveTextContent("Select Genre");
        });

        expect(titleInput).toHaveValue("");
        expect(dateInput).toHaveValue("");
        expect(urlInput).toHaveValue("");
        expect(ratingInput).toHaveValue(0);
        expect(runtimeInput).toHaveValue(0);
        expect(overviewInput).toHaveValue("");

        expect(within(genreSelect).getByLabelText("Comedy", { selector: "input[type='checkbox']" })).not.toBeChecked();
        expect(within(genreSelect).getByLabelText("Crime", { selector: "input[type='checkbox']" })).not.toBeChecked();

        expect(screen.queryByText(/select at least one genre/i)).not.toBeInTheDocument();
    });

    test("Should call showPicker on date input when calendar icon is clicked", async () => {
        renderComponent();
        const icon = screen.getByTestId("calendar-icon");

        await user.click(icon);

        expect(showPickerMock).toHaveBeenCalledTimes(1);
    });

    test("Should show validation error for invalid date format", async () => {
        renderComponent();
        const dateInput = screen.getByLabelText(/release date/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.clear(dateInput);
        await user.click(submitButton);
        const requiredErrorElement = await screen.findByText("Release date is required");
        expect(requiredErrorElement).toHaveAttribute("role", "alert");
        expect(onSubmitMock).not.toHaveBeenCalled();

        await user.clear(dateInput);
        await user.type(dateInput, "1899-12-31");
        await user.click(screen.getByLabelText(/title/i));
        const minDateErrorElement = await screen.findByText("Date must be 1900-01-01 or later");
        expect(minDateErrorElement).toHaveAttribute("role", "alert");

        await user.click(submitButton);
        await screen.findByText("Date must be 1900-01-01 or later");
        expect(onSubmitMock).not.toHaveBeenCalled();

        await user.clear(dateInput);
        await user.type(dateInput, "2050-01-02");
        await user.click(screen.getByLabelText(/title/i));
        const maxDateErrorElement = await screen.findByText("Date must be 2050-01-01 or earlier");
        expect(maxDateErrorElement).toHaveAttribute("role", "alert");

        await user.click(submitButton);
        await screen.findByText("Date must be 2050-01-01 or earlier");
        expect(onSubmitMock).not.toHaveBeenCalled();
    });

    test("Should show validation error for rating with too many decimal places", async () => {
        renderComponent();
        const ratingInput = screen.getByLabelText(/rating/i);

        await user.type(screen.getByLabelText(/title/i), "Rating Test");
        await user.clear(screen.getByLabelText(/release date/i));
        await user.type(screen.getByLabelText(/release date/i), "2023-01-01");
        await user.type(screen.getByLabelText(/movie url/i), "https://rating.test");
        await user.clear(screen.getByLabelText(/runtime/i));
        await user.type(screen.getByLabelText(/runtime/i), "120");
        await user.type(screen.getByLabelText(/overview/i), "Rating validation test");
        const genreSelect = screen.getByTestId("genre-multi-select");
        await user.click(within(genreSelect).getByLabelText("Comedy", { selector: "input[type='checkbox']" }));
        await waitFor(() => {
            expect(within(genreSelect).getByRole("button")).toHaveTextContent("Comedy");
        });

        await user.clear(ratingInput);
        await user.type(ratingInput, "7.89");
        await user.click(screen.getByLabelText(/title/i));

        await waitFor(() => {
            expect(
                screen.getByText(/rating must be a whole number or have a single decimal place/i),
            ).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: /submit/i }));
        await waitFor(() => {
            expect(
                screen.getByText(/rating must be a whole number or have a single decimal place/i),
            ).toBeInTheDocument();
        });
        expect(onSubmitMock).not.toHaveBeenCalled();
    });

    test("Should apply loading styles and disable form when isLoading is true", () => {
        renderComponent(undefined, undefined, true);

        const formGrid = screen.getByTestId("movie-form-grid");
        expect(formGrid).toHaveClass("opacity-40");
        expect(formGrid).toHaveClass("pointer-events-none");

        expect(screen.getByLabelText(/title/i)).toBeDisabled();

        expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();
        expect(screen.getByRole("button", { name: /Submitting.../i })).toBeDisabled();

        expect(screen.getByRole("button", { name: /Submitting.../i })).toBeInTheDocument();
    });

    test("Should show validation error for overview when it is empty", async () => {
        renderComponent();

        await user.type(screen.getByLabelText(/title/i), "Overview Test");
        await user.clear(screen.getByLabelText(/release date/i));
        await user.type(screen.getByLabelText(/release date/i), "2023-01-01");
        await user.type(screen.getByLabelText(/movie url/i), "https://overview.test");
        await user.clear(screen.getByLabelText(/rating/i));
        await user.type(screen.getByLabelText(/rating/i), "8");
        await user.clear(screen.getByLabelText(/runtime/i));
        await user.type(screen.getByLabelText(/runtime/i), "110");
        const genreSelect = screen.getByTestId("genre-multi-select");
        await user.click(within(genreSelect).getByLabelText("Crime", { selector: "input[type='checkbox']" }));
        await waitFor(() => {
            expect(within(genreSelect).getByRole("button")).toHaveTextContent("Crime");
        });

        await user.click(screen.getByRole("button", { name: /submit/i }));

        const overviewErrorElement = await screen.findByText("Overview is required");
        expect(overviewErrorElement).toHaveAttribute("role", "alert");

        expect(screen.getByLabelText(/overview/i)).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByLabelText(/overview/i)).toHaveClass("input-error");

        expect(onSubmitMock).not.toHaveBeenCalled();
    });
});
