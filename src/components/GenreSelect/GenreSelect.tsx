import { Genre } from "@/types/common";

interface GenreSelectProps {
    genres: Genre[];
    selectedGenre: Genre;
    onSelect: (genre: Genre) => void;
}

export const GenreSelect = ({ genres, selectedGenre, onSelect }: GenreSelectProps) => (
    <div className="flex flex-wrap gap-x-8" data-testid="genre-select">
        {genres.map((genre) => (
            <div
                key={genre}
                className={`
                    group
                    relative
                    px-2
                    py-1
                    text-lg
                    font-medium
                    cursor-pointer
                    transition-colors
                    duration-200
                    uppercase
                    ${
                        genre === selectedGenre
                            ? "text-[var(--color-text)]"
                            : "text-[var(--color-gray-lighter)] hover:text-[var(--color-text)]"
                    }
                `}
                onClick={() => onSelect(genre)}
            >
                {genre}
                <span
                    className={`
                        absolute
                        left-0
                        -bottom-[16px]
                        h-[3px]
                        w-0
                        bg-[var(--color-primary)]
                        transition-all
                        duration-300
                        ${genre === selectedGenre ? "w-full" : "group-hover:w-full"}
                    `}
                ></span>
            </div>
        ))}
    </div>
);
