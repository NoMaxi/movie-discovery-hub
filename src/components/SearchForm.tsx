import React, { useState, FormEvent, ChangeEvent } from "react";

interface SearchFormProps {
    onSearch: (query: string) => void;
    initialSearchQuery?: string;
}

const SearchForm = ({ initialSearchQuery = "", onSearch }: SearchFormProps) => {
    const [query, setQuery] = useState(initialSearchQuery);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSearch(query);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

    return (
        <form onSubmit={ handleSubmit } className="flex items-center justify-center">
            <input
                type="text"
                value={ query }
                onChange={ handleInputChange }
                onKeyDown={ handleKeyDown }
                placeholder="What do you want to watch?"
                className="
                    input-field
                    placeholder-[var(--color-gray-lighter)]
                    border-none
                    rounded-md
                    py-3
                    px-6
                    max-w-1/2
                    text-lg
                    flex-grow
                "
            />
            <button type="submit" className="btn ml-3">Search</button>
        </form>
    );
};

export default SearchForm;
