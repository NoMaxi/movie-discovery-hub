import { createBrowserRouter } from "react-router-dom";
import { movieDetailsLoader } from "@/router/loaders";
import { MovieListPage } from "@/pages/MovieListPage/MovieListPage";
import { SearchFormPage } from "@/pages/SearchFormPage/SearchFormPage";
import { MovieDetailsPage } from "@/pages/MovieDetailsPage/MovieDetailsPage";
import { MovieDetailsError } from "@/components/MovieDetailsError/MovieDetailsError";
import { AddMovieFormPage } from "@/pages/AddMovieFormPage/AddMovieFormPage";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MovieListPage,
        children: [
            {
                path: "/",
                Component: SearchFormPage,
                children: [
                    {
                        path: "/new",
                        Component: AddMovieFormPage,
                    },
                ],
            },
            {
                path: "/:movieId",
                Component: MovieDetailsPage,
                loader: movieDetailsLoader,
                errorElement: <MovieDetailsError />,
            },
        ],
    },
]);
