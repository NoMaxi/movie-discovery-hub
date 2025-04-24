import { createBrowserRouter } from "react-router-dom";
import { movieDetailsLoader } from "@/router/loaders";
import { MovieListPage } from "@/pages/MovieListPage/MovieListPage";
import { SearchFormPage } from "@/pages/SearchFormPage/SearchFormPage";
import { MovieDetailsPage } from "@/pages/MovieDetailsPage/MovieDetailsPage";
import { MovieDetailsError } from "@/components/MovieDetailsError/MovieDetailsError";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MovieListPage,
        children: [
            { index: true, Component: SearchFormPage },
            {
                path: "/:movieId",
                Component: MovieDetailsPage,
                loader: movieDetailsLoader,
                errorElement: <MovieDetailsError />,
            },
        ],
    },
]);
