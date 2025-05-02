import React, { MouseEvent, useMemo, useState } from "react";
import { Movie } from "@/types/common";
import { useScrollContext } from "@/contexts/ScrollContext/useScrollContext";
import { ContextMenu } from "@/components/common/ContextMenu/ContextMenu";

interface MovieTileProps {
    movie: Movie;
    onClick: (movie: Movie, event: React.MouseEvent<HTMLDivElement>) => void;
    onEdit: (movie: Movie) => void;
    onDelete: (movie: Movie) => void;
}

export const MovieTile = ({ movie, onClick, onEdit, onDelete }: MovieTileProps) => {
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const { setTargetMovieId } = useScrollContext();

    const handleMenuToggle = (e: MouseEvent) => {
        e.stopPropagation();
        setIsContextMenuOpen(!isContextMenuOpen);
    };

    const handleTileClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isContextMenuOpen) {
            setIsContextMenuOpen(false);
        } else {
            onClick(movie, event);
        }
    };

    const handleMovieEdit = () => {
        setTargetMovieId(movie.id);
        onEdit(movie);
    };

    const contextMenuActions = useMemo(
        () => [
            { label: "Edit", onClick: handleMovieEdit },
            { label: "Delete", onClick: () => onDelete(movie) },
        ],
        [onEdit, onDelete, movie, setTargetMovieId],
    );

    return (
        <div
            className="movie-tile relative group w-[320px] text-[var(--color-text)] cursor-pointer "
            onClick={handleTileClick}
            data-testid="movie-tile"
            data-movie-id={movie.id}
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
