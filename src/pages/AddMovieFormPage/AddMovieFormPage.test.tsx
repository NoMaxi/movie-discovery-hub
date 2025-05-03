import { ReactNode } from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { movieService } from "@/services/movieService";
import { useNavigateWithSearchParams } from "@/hooks/useNavigateWithSearchParams/useNavigateWithSearchParams";
import { AddMovieFormPage } from "./AddMovieFormPage";
import { MovieFormData } from "@/types/common";

jest.mock("@/services/movieService");
jest.mock("@/hooks/useNavigateWithSearchParams/useNavigateWithSearchParams");

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
let lastMovieFormProps: { isLoading?: boolean; resetMode?: string } | null = null;

jest.mock("@/components/MovieForm/MovieForm", () => ({
    MovieForm: ({
        onSubmit,
        isLoading,
        resetMode,
    }: {
        onSubmit: (formData: MovieFormData) => void;
        isLoading?: boolean;
        resetMode?: string;
    }) => {
        mockMovieFormSubmit = onSubmit;
        lastMovieFormProps = { isLoading, resetMode };
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
const mockCreateMovie = movieService.createMovie as jest.Mock;

const renderComponent = () => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <AddMovieFormPage />
        </QueryClientProvider>,
    );
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("AddMovieFormPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigateWithSearchParams as jest.Mock).mockReturnValue(mockNavigateWithSearchParams);
        window.scrollTo = jest.fn();
        mockErrorMessageDismiss = undefined;
        lastMovieFormProps = null;
    });

    test("Should render correctly with Dialog and MovieForm", () => {
        const { asFragment } = renderComponent();

        expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
        expect(screen.getByTestId("mock-dialog-title")).toHaveTextContent("Add Movie");
        expect(screen.getByTestId("mock-movie-form")).toBeInTheDocument();
        expect(lastMovieFormProps?.resetMode).toBe("clear");
        expect(lastMovieFormProps?.isLoading).toBe(false);
        expect(screen.queryByTestId("mock-error-message")).not.toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should handle successful form submission", async () => {
        const mockFormData: MovieFormData = {
            title: "New Movie",
            poster_path: "path/to/image.jpg",
            genres: ["Action"],
            overview: "A great movie",
            runtime: 120,
            release_date: "2023-01-01",
            vote_average: 8.0,
        };
        const mockCreatedMovie = { ...mockFormData, id: 123 };

        mockCreateMovie.mockImplementation(async () => {
            await delay(10);
            return mockCreatedMovie;
        });

        renderComponent();

        await act(async () => {
            mockMovieFormSubmit(mockFormData);
        });

        await waitFor(() => expect(lastMovieFormProps?.isLoading).toBe(true));

        expect(mockCreateMovie).toHaveBeenCalledTimes(1);
        expect(mockCreateMovie).toHaveBeenCalledWith(mockFormData);

        await waitFor(() => {
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
        });
        await waitFor(() => {
            expect(mockNavigateWithSearchParams).toHaveBeenCalledTimes(1);
        });
        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith(`/${mockCreatedMovie.id}`);

        expect(screen.queryByTestId("mock-error-message")).not.toBeInTheDocument();
    });

    test("Should handle failed form submission", async () => {
        const mockFormData: MovieFormData = {
            title: "New Movie",
            poster_path: "path/to/image.jpg",
            genres: ["Action"],
            overview: "A great movie",
            runtime: 120,
            release_date: "2023-01-01",
            vote_average: 8.0,
        };
        const mockError = new Error("API Error");

        mockCreateMovie.mockImplementation(async () => {
            await delay(10);
            throw mockError;
        });
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        renderComponent();

        await act(async () => {
            mockMovieFormSubmit(mockFormData);
        });

        await waitFor(() => expect(lastMovieFormProps?.isLoading).toBe(true));

        expect(mockCreateMovie).toHaveBeenCalledTimes(1);
        expect(mockCreateMovie).toHaveBeenCalledWith(mockFormData);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error creating a movie:", mockError);
        });
        await waitFor(() => {
            expect(screen.getByTestId("mock-error-message")).toBeInTheDocument();
        });
        expect(screen.getByTestId("mock-error-message")).toHaveTextContent(
            "Failed to create a movie. Please try again.",
        );

        expect(mockNavigateWithSearchParams).not.toHaveBeenCalled();
        expect(window.scrollTo).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    test("Should handle dialog close", async () => {
        renderComponent();

        await act(async () => {
            mockDialogOnClose();
        });

        await waitFor(() => {
            expect(mockNavigateWithSearchParams).toHaveBeenCalledTimes(1);
        });
        expect(mockNavigateWithSearchParams).toHaveBeenCalledWith("/");
    });

    test("Should handle error message dismissal", async () => {
        const mockError = new Error("API Error");
        mockCreateMovie.mockRejectedValue(mockError);
        jest.spyOn(console, "error").mockImplementation(() => {});

        renderComponent();

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
