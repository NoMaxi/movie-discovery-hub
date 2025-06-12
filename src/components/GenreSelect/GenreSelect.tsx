import { GenreFilter, Genre } from "@/types/common";
import { MAIN_GENRES, SECONDARY_GENRES } from "@/constants/constants";
import { GenreMoreDropdown } from "@/components/common/GenreMoreDropdown/GenreMoreDropdown";

interface GenreSelectProps {
    selectedGenre: GenreFilter;
    onSelect: (genre: GenreFilter) => void;
}

export const GenreSelect = ({ selectedGenre, onSelect }: GenreSelectProps) => {
    const isSecondaryGenre = selectedGenre !== "All" && SECONDARY_GENRES.includes(selectedGenre);

    return (
        <div className="flex flex-wrap items-center gap-x-8" data-testid="genre-select">
            {MAIN_GENRES.map((genre) => (
                <div
                    key={genre}
                    className={`
                        group relative px-2 py-1
                        text-lg font-medium uppercase cursor-pointer
                        transition-colors duration-200
                        ${genre === selectedGenre ? "text-text" : "text-gray-lighter hover:text-text"}
                    `}
                    onClick={() => onSelect(genre)}
                >
                    {genre}
                    <span
                        className={`
                            absolute left-0 h-[3px] w-0 -bottom-lg bg-primary
                            transition-all duration-300
                            ${genre === selectedGenre ? "w-full" : "group-hover:w-full"}
                        `}
                    ></span>
                </div>
            ))}

            <div className="relative group">
                <GenreMoreDropdown
                    options={SECONDARY_GENRES}
                    selectedGenre={isSecondaryGenre ? selectedGenre : undefined}
                    onSelectionChange={(genre: Genre) => onSelect(genre)}
                    className="genre-more-control"
                    buttonClassName={`${isSecondaryGenre ? "text-text" : "text-gray-lighter hover:text-text"}`}
                />
                <span
                    className={`
                        absolute left-0 h-[3px] w-0 -bottom-lg bg-primary
                        transition-all duration-300
                        ${isSecondaryGenre ? "w-full" : "group-hover:w-full"}
                    `}
                ></span>
            </div>
        </div>
    );
};
