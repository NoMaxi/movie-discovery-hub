import { MouseEvent, useState } from "react";
import { Movie } from "@/types/common";

interface MovieTileProps {
    movie: Movie;
    onClick: (movie: Movie) => void;
    onEdit: (movie: Movie) => void;
    onDelete: (movie: Movie) => void;
}

const MovieTile = ({ movie, onClick, onEdit, onDelete }: MovieTileProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = (e: MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEditClick = (e: MouseEvent) => {
        e.stopPropagation();
        onEdit(movie);
        setIsMenuOpen(false);
    };

    const handleDeleteClick = (e: MouseEvent) => {
        e.stopPropagation();
        onDelete(movie);
        setIsMenuOpen(false);
    };

    const handleTileClick = () => {
        if (!isMenuOpen) {
            onClick(movie);
        } else {
            setIsMenuOpen(false);
        }
    };

    return (
        <div
            className="movie-tile relative group cursor-pointer text-[var(--color-text)]"
            onClick={handleTileClick}
            style={{ width: "320px" }}
        >
            <button
                onClick={handleMenuToggle}
                className={`
                    movie-tile-menu-toggle
                    flex items-center justify-center
                    absolute top-4 right-4 z-10 w-9 h-9 
                    bg-[var(--color-gray)] bg-opacity-80 rounded-full
                    text-[var(--color-text)] text-2xl font-bold leading-none
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    cursor-pointer
                    ${isMenuOpen ? "opacity-100" : ""}
                `}
            >
                ⋮
            </button>

            {isMenuOpen && (
                <div
                    className="
                        movie-tile-context-menu
                        absolute top-4 right-14 z-20 w-[190px] h-[auto]
                        bg-[var(--color-background)]
                        rounded shadow-lg
                        overflow-hidden
                        flex flex-col justify-center
                    "
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleMenuToggle}
                        className="
                            movie-tile-menu-close
                            absolute top-1 right-2
                            text-[var(--color-gray-lighter)] hover:text-[var(--color-text)]
                            text-xl leading-none
                            cursor-pointer
                        "
                    >
                        ×
                    </button>
                    <ul>
                        <li>
                            <button
                                onClick={handleEditClick}
                                className="
                                    movie-tile-edit-button
                                    block w-full text-left px-4 py-2
                                    text-base text-[var(--color-text)]
                                    hover:bg-[var(--color-primary)]
                                    transition-colors duration-150
                                    cursor-pointer
                                "
                            >
                                Edit
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleDeleteClick}
                                className="
                                    movie-tile-delete-button
                                    block w-full text-left px-4 py-2
                                    text-base text-[var(--color-text)]
                                    hover:bg-[var(--color-primary)]
                                    transition-colors duration-150
                                    cursor-pointer
                                "
                            >
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            <img src={movie.imageUrl} alt={`${movie.title} poster`} className="w-[320px] h-[455px] object-cover mb-4" />

            <div className="flex justify-between items-start mb-1">
                <h3 className="text-[18px] font-medium text-[var(--color-gray-lighter)] pr-2">{movie.title}</h3>
                <span
                    className="
                        border border-[var(--color-gray-light)] rounded
                        px-3 py-1 text-[14px] font-medium text-[var(--color-gray-lighter)]
                        flex-shrink-0
                    "
                >
                    {movie.releaseYear}
                </span>
            </div>
            <p className="text-[14px] text-[var(--color-gray-light)]">{movie.genres.join(", ")}</p>
        </div>
    );
};

export default MovieTile;
