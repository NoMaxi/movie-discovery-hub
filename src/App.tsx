import "@/App.css";
import { MovieListPage } from "@/pages/MovieListPage/MovieListPage";

export const App = () => (
    <div data-testid="app-container" className="flex flex-col items-center justify-center">
        <MovieListPage />
    </div>
);
