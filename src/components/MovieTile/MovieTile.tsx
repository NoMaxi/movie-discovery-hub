import { MouseEvent, useMemo, useState } from "react";
import { Movie } from "@/types/common";
import ContextMenu from "@/components/common/ContextMenu/ContextMenu";

interface MovieTileProps {
    movie: Movie;
    onClick: (movie: Movie) => void;
    onEdit: (movie: Movie) => void;
    onDelete: (movie: Movie) => void;
}

const MovieTile = ({ movie, onClick, onEdit, onDelete }: MovieTileProps) => {
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

    const handleMenuToggle = (e: MouseEvent) => {
        e.stopPropagation();
        setIsContextMenuOpen(!isContextMenuOpen);
    };

    const handleTileClick = () => {
        if (isContextMenuOpen) {
            setIsContextMenuOpen(false);
        } else {
            onClick(movie);
        }
    };

    const contextMenuActions = useMemo(
        () => [
            { label: "Edit", onClick: () => onEdit(movie) },
            { label: "Delete", onClick: () => onDelete(movie) },
        ],
        [onEdit, onDelete, movie],
    );

    return (
        <div
            className="movie-tile relative group w-[320px] text-[var(--color-text)] cursor-pointer "
            onClick={handleTileClick}
        >
            <button
                data-testid="movie-tile-menu-toggle"
                className={`
                    movie-tile-menu-toggle
                    flex items-center justify-center
                    absolute top-4 right-4 z-10 w-9 h-9
                    bg-[var(--color-gray)] bg-opacity-80 rounded-full
                    text-[var(--color-text)] text-2xl font-bold leading-none
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    cursor-pointer
                    ${isContextMenuOpen && "opacity-100"}
                `}
                onClick={handleMenuToggle}
            >
                &#8942;
            </button>

            <ContextMenu
                isOpen={isContextMenuOpen}
                onClose={() => setIsContextMenuOpen(false)}
                actions={contextMenuActions}
                className="w-[120px] top-4 right-14"
                withCloseButton
            />

            <img src={movie.imageUrl} alt={`${movie.title} poster`} className="w-full h-[455px] object-cover mb-4" />

            <div className="flex justify-between items-start mb-1">
                <h3 className="text-[18px] font-medium text-[var(--color-gray-lighter)] pr-2">{movie.title}</h3>
                <span
                    className="
                        flex-shrink-0
                        border border-[var(--color-gray-light)] px-3 py-1 rounded
                        text-[14px] font-medium text-[var(--color-gray-lighter)]
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
