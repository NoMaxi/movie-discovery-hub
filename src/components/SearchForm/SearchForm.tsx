import React, { useState, FormEvent, ChangeEvent } from "react";

interface SearchFormProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
}

export const SearchForm = ({ initialQuery = "", onSearch }: SearchFormProps) => {
    const [query, setQuery] = useState(initialQuery);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const trimmedQuery = query.trim();
        onSearch(trimmedQuery);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center w-full">
            <input
                data-testid="search-input"
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to watch?"
                className="input-field input-transparent-shadow-glow"            />
            <button data-testid="search-button" type="submit" className="btn ml-[14px]">
                Search
            </button>
        </form>
    );
};
