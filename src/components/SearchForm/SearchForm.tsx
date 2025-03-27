import React, { useState, FormEvent, ChangeEvent } from "react";

interface SearchFormProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
}

const SearchForm = ({ initialQuery = "", onSearch }: SearchFormProps) => {
    const [query, setQuery] = useState(initialQuery);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            onSearch(trimmedQuery);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center justify-center w-1/2">
            <input
                data-testid="search-input"
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to watch?"
                className="
                    input-field
                    placeholder-[var(--color-gray-lighter)]
                    border-none
                    rounded-md
                    py-3
                    px-6
                    text-lg
                    flex-grow
                "
            />
            <button data-testid="search-button" type="submit" className="btn ml-3" disabled={!query.trim()}>
                Search
            </button>
        </form>
    );
};

export default SearchForm;
