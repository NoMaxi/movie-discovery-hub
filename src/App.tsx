import "@/App.css";
import { MovieListPage } from "@/pages/MovieListPage/MovieListPage";

export const App = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <MovieListPage />
        </div>
    );
};
