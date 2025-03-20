import { useState } from "react";
import "@/App.css";
import { Genre } from "@/types/common";
import Counter from "@/components/Counter/Counter";
import SearchForm from "@/components/SearchForm/SearchForm";
import GenreSelect from "@/components/GenreSelect/GenreSelect";

const App = () => {
    const genres: Genre[] = ["All", "Documentary", "Comedy", "Horror", "Crime"];
    const [selectedGenre, setSelectedGenre] = useState<Genre>("All");

    const handleGenreSelect = (genre: Genre) => {
        setSelectedGenre(genre);
        console.log("Selected genre: ", genre);
    };

    const handleSearch = (query: string) => {
        console.log("Search query: ", query);
    };

    return (
        <div className="space-y-16 p-4 flex flex-col items-center justify-center">
            <Counter initialValue={ 10 } />
            <SearchForm onSearch={ handleSearch } />
            <GenreSelect
                genres={ genres }
                selectedGenre={ selectedGenre }
                onSelect={ handleGenreSelect }
            />
        </div>
    );
};

export default App;
