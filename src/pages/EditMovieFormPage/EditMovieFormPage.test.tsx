import { ReactNode } from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InitialMovieInfo, MovieFormData } from "@/types/common";
import { movieService } from "@/services/movieService";
import { mapAPIMovieDetailsToInitialMovieInfo } from "@/utils/movieMapping";
import { useNavigateWithSearchParams } from "@/hooks/useNavigateWithSearchParams/useNavigateWithSearchParams";
import { useScrollContext } from "@/contexts/ScrollContext/useScrollContext";
import { mockAPIMovie } from "@/mocks/movieData";
import { EditMovieFormPage } from "./EditMovieFormPage";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
}));
jest.mock("@/services/movieService");
jest.mock("@/hooks/useNavigateWithSearchParams/useNavigateWithSearchParams");
jest.mock("@/contexts/ScrollContext/useScrollContext");
jest.mock("@/utils/movieMapping");
jest.mock("@/components/common/Loader/Loader", () => ({
    Loader: () => <div data-testid="mock-loader">Loading...</div>,
}));

let mockDialogOnClose: () => void;
jest.mock("@/components/common/Dialog/Dialog", () => ({
    Dialog: ({
        title,
        children,
        onClose,
        className,
    }: {
        title: string;
        children: ReactNode;
        onClose: () => void;
        className?: string;
    }) => {
        mockDialogOnClose = onClose;
        return (
            <div data-testid="mock-dialog" className={className}>
                <h2 data-testid="mock-dialog-title">{title}</h2>
                <button data-testid="mock-dialog-close-button" onClick={onClose}>
                    Close
                </button>
                {children}
            </div>
        );
    },
}));

let mockMovieFormSubmit: (formData: MovieFormData) => void;
let lastMovieFormProps: { initialMovieInfo?: InitialMovieInfo | null; isLoading?: boolean; resetMode?: string } | null = null;

jest.mock("@/components/MovieForm/MovieForm", () => ({
    MovieForm: ({
        initialMovieInfo,
        onSubmit,
        isLoading,
        resetMode,
    }: {
        initialMovieInfo: InitialMovieInfo | null;
        onSubmit: (formData: MovieFormData) => void;
        isLoading?: boolean;
        resetMode?: string;
    }) => {
        mockMovieFormSubmit = onSubmit;
        lastMovieFormProps = { initialMovieInfo, isLoading, resetMode };
        return <form data-testid="mock-movie-form">Mock Movie Form</form>;
    },
}));

let mockErrorMessageDismiss: (() => void) | undefined;
jest.mock("@/components/common/ErrorMessage/ErrorMessage", () => ({
    ErrorMessage: ({
        message,
        onDismiss,
        className,
    }: {
        message: string | null;
        onDismiss: () => void;
        className?: string;
    }) => {
        mockErrorMessageDismiss = onDismiss;
        return message ? (
            <div data-testid="mock-error-message" className={className}>
                {message}
                <button data-testid="mock-error-dismiss-button" onClick={onDismiss}>
                    Dismiss
                </button>
            </div>
        ) : null;
    },
}));

const mockNavigateWithSearchParams = jest.fn();
const mockSetTriggerScroll = jest.fn();
const mockGetAPIMovieDetailsById = movieService.getAPIMovieDetailsById as jest.Mock;
const mockUpdateMovie = movieService.updateMovie as jest.Mock;
const mockMapAPIMovieDetailsToInitialMovieInfo = mapAPIMovieDetailsToInitialMovieInfo as jest.Mock;
const useParams = jest.requireMock("react-router-dom").useParams as jest.Mock;

const mockMovieId = "123";

const mockInitialMovieInfo: InitialMovieInfo = {
    title: "Test Movie",
    releaseDate: "2023-01-01",
    imageUrl: "path/to/poster.jpg",
    rating: 8.5,
    genres: ["Action", "Adventure"],
    duration: 120,
    description: "Test overview",
    id: 123,
};

const renderComponent = () => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <EditMovieFormPage />
        </QueryClientProvider>,
    );
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("EditMovieFormPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ movieId: mockMovieId });
        (useNavigateWithSearchParams as jest.Mock).mockReturnValue(mockNavigateWithSearchParams);
        (useScrollContext as jest.Mock).mockReturnValue({ setTriggerScroll: mockSetTriggerScroll });
        mockGetAPIMovieDetailsById.mockImplementation(async () => {
            await delay(10);
            return mockAPIMovie;
        });
        mockMapAPIMovieDetailsToInitialMovieInfo.mockReturnValue(mockInitialMovieInfo);
        window.scrollTo = jest.fn();
        mockErrorMessageDismiss = undefined;
        lastMovieFormProps = null;
    });

    test("Should show loader while fetching details", () => {
        renderComponent();
        expect(screen.getByTestId("mock-loader")).toBeInTheDocument();
        expect(screen.queryByTestId("mock-movie-form")).not.toBeInTheDocument();
        expect(screen.queryByTestId("mock-error-message")).not.toBeInTheDocument();
    });

    test("Should show error message if fetching details fails", async () => {
        const mockError = new Error("Fetch Error");
        mockGetAPIMovieDetailsById.mockRejectedValue(mockError);
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        renderComponent();

        await waitFor(() => {
            expect(screen.queryByTestId("mock-loader")).not.toBeInTheDocument();
        });
        expect(screen.getByTestId("mock-error-message")).toBeInTheDocument();
        expect(screen.getByTestId("mock-error-message")).toHaveTextContent(
            "Failed to load movie details. Please try again.",
        );
        expect(screen.queryByTestId("mock-movie-form")).not.toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching movie details during movie edit:", mockError);

        consoleErrorSpy.mockRestore();
    });

     test("Should show error message if movieId is missing", async () => {
        useParams.mockReturnValue({ movieId: undefined });
        renderComponent();

        await waitFor(() => {
            expect(screen.queryByTestId("mock-loader")).not.toBeInTheDocument();
        });
        expect(screen.getByTestId("mock-error-message")).toBeInTheDocument();
        expect(screen.getByTestId("mock-error-message")).toHaveTextContent("Movie ID not found.");
        expect(screen.queryByTestId("mock-movie-form")).not.toBeInTheDocument();
    });

    test("Should render correctly with Dialog and MovieForm after successful fetch", async () => {
        const { asFragment } = renderComponent();

        await waitFor(() => {
            expect(screen.queryByTestId("mock-loader")).not.toBeInTheDocument();
        });

        expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
        expect(screen.getByTestId("mock-dialog-title")).toHaveTextContent("Edit Movie");
        expect(screen.getByTestId("mock-movie-form")).toBeInTheDocument();
        expect(lastMovieFormProps?.initialMovieInfo).toEqual(mockInitialMovieInfo);
        expect(lastMovieFormProps?.resetMode).toBe("restore");
        expect(lastMovieFormProps?.isLoading).toBe(false);
        expect(screen.queryByTestId("mock-error-message")).not.toBeInTheDocument();
        expect(mockGetAPIMovieDetailsById).toHaveBeenCalledWith(Number(mockMovieId));
        expect(mockMapAPIMovieDetailsToInitialMovieInfo).toHaveBeenCalledWith(mockAPIMovie);
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should handle successful form submission", async () => {
        const mockFormData: MovieFormData = {
            title: "Updated Movie",
            poster_path: "path/to/updated_image.jpg",
            genres: ["Drama"],
            overview: "An updated great movie",
            runtime: 130,
            release_date: "2024-01-01",
            vote_average: 9.0,
        };
        const expectedPayload = { ...mockFormData, id: Number(mockMovieId) };

        mockUpdateMovie.mockImplementation(async () => {
            await delay(10);
            return expectedPayload;
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("mock-movie-form")).toBeInTheDocument();
        });

        await act(async () => {
            mockMovieFormSubmit(mockFormData);
        });

        await waitFor(() => expect(lastMovieFormProps?.isLoading).toBe(true));

        expect(mockUpdateMovie).toHaveBeenCalledTimes(1);
        expect(mockUpdateMovie).toHaveBeenCalledWith(expectedPayload);

        await waitFor(() => {
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
        });
        await waitFor(() => {
            expect(mockSetTriggerScroll).toHaveBeenCalledWith(true);
        });
        await waitFor(() => {
            expect(mockNavigateWithSearchParams).toHaveBeenCalledTimes(1);
        });
        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith(`/${mockMovieId}`);

        expect(screen.queryByTestId("mock-error-message")).not.toBeInTheDocument();
    });

    test("Should handle failed form submission", async () => {
        const mockFormData: MovieFormData = {
            title: "Updated Movie",
            poster_path: "path/to/updated_image.jpg",
            genres: ["Drama"],
            overview: "An updated great movie",
            runtime: 130,
            release_date: "2024-01-01",
            vote_average: 9.0,
        };
        const mockError = new Error("Update API Error");

        mockUpdateMovie.mockImplementation(async () => {
            await delay(10);
            throw mockError;
        });
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("mock-movie-form")).toBeInTheDocument();
        });

        await act(async () => {
            mockMovieFormSubmit(mockFormData);
        });

        await waitFor(() => expect(lastMovieFormProps?.isLoading).toBe(true));

        expect(mockUpdateMovie).toHaveBeenCalledTimes(1);
        expect(mockUpdateMovie).toHaveBeenCalledWith({ ...mockFormData, id: Number(mockMovieId) });

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating a movie:", mockError);
        });
        await waitFor(() => {
            expect(screen.getByTestId("mock-error-message")).toBeInTheDocument();
        });
        expect(screen.getByTestId("mock-error-message")).toHaveTextContent(
            "Failed to update a movie. Please try again.",
        );

        expect(mockNavigateWithSearchParams).not.toHaveBeenCalled();
        expect(window.scrollTo).not.toHaveBeenCalled();
        expect(mockSetTriggerScroll).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    test("Should handle dialog close when movie info is loaded", async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("mock-movie-form")).toBeInTheDocument();
        });

        await act(async () => {
            mockDialogOnClose();
        });

        await waitFor(() => {
            expect(mockNavigateWithSearchParams).toHaveBeenCalledTimes(1);
        });
        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith(`/${mockMovieId}`);
    });

     test("Should handle dialog close when movie info failed to load", async () => {
        mockGetAPIMovieDetailsById.mockRejectedValue(new Error("Fetch Error"));
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("mock-error-message")).toBeInTheDocument();
        });

        await act(async () => {
            mockDialogOnClose();
        });

        await waitFor(() => {
            expect(mockNavigateWithSearchParams).toHaveBeenCalledTimes(1);
        });
        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith("/");
    });

     test("Should handle dialog close when movieId is missing", async () => {
        useParams.mockReturnValue({ movieId: undefined });
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("mock-error-message")).toBeInTheDocument();
        });

        await act(async () => {
            mockDialogOnClose();
        });

        await waitFor(() => {
            expect(mockNavigateWithSearchParams).toHaveBeenCalledTimes(1);
        });
        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith("/");
    });

    test("Should handle fetch error message dismissal", async () => {
        mockGetAPIMovieDetailsById.mockRejectedValue(new Error("Fetch Error"));
        jest.spyOn(console, "error").mockImplementation(() => {});
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("mock-error-message")).toBeInTheDocument();
        });

        expect(mockErrorMessageDismiss).toBeDefined();

        await act(async () => {
            if (mockErrorMessageDismiss) {
                mockErrorMessageDismiss();
            }
        });

        await waitFor(() => {
            expect(screen.queryByTestId("mock-error-message")).not.toBeInTheDocument();
        });
        jest.restoreAllMocks();
    });

    test("Should handle submit error message dismissal", async () => {
        const mockError = new Error("Update API Error");
        mockUpdateMovie.mockRejectedValue(mockError);
        jest.spyOn(console, "error").mockImplementation(() => {});

        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("mock-movie-form")).toBeInTheDocument();
        });

        await act(async () => {
            mockMovieFormSubmit({} as MovieFormData);
        });

        await waitFor(() => {
            expect(screen.getByTestId("mock-error-message")).toBeInTheDocument();
        });

        expect(mockErrorMessageDismiss).toBeDefined();

        await act(async () => {
            if (mockErrorMessageDismiss) {
                mockErrorMessageDismiss();
            }
        });

        await waitFor(() => {
            expect(screen.queryByTestId("mock-error-message")).not.toBeInTheDocument();
        });
        jest.restoreAllMocks();
    });
});
