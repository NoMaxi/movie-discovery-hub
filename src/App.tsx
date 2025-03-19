import "./App.css";
import Counter from "@/components/Counter.tsx";
import SearchForm from "@/components/SearchForm.tsx";

const App = () => {
    const handleSearch = (query: string) => {
        console.log("Search query: ", query);
    };

    return (
        <div className="space-y-10 p-4">
            <Counter initialValue={ 10 } />
            <SearchForm onSearch={ handleSearch } />
        </div>
    );
};

export default App;
