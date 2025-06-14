import React, { MouseEvent, useCallback, useMemo, useState, useRef } from "react";
import { Movie } from "@/types/common";
import noPosterImage from "@/assets/no-poster-image.png";
import { useScrollContext } from "@/contexts/ScrollContext/useScrollContext";
import { useImageFallback } from "@/hooks/useImageFallback/useImageFallback";
import { useClickOutside } from "@/hooks/useClickOutside/useClickOutside";
import { ContextMenu } from "@/components/common/ContextMenu/ContextMenu";

interface MovieTileProps {
    movie: Movie;
    onClick: (movie: Movie, event: React.MouseEvent<HTMLDivElement>) => void;
    onEdit: (movie: Movie) => void;
    onDelete: (movie: Movie) => void;
}

export const MovieTile = ({ movie, onClick, onEdit, onDelete }: MovieTileProps) => {
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const movieTileRef = useRef<HTMLDivElement>(null);
    const { setTargetMovieId } = useScrollContext();
    const imageProps = useImageFallback(movie.imageUrl, noPosterImage);

    useClickOutside(movieTileRef, () => setIsContextMenuOpen(false), isContextMenuOpen);

    const handleMenuToggle = (e: MouseEvent) => {
        e.stopPropagation();
        setIsContextMenuOpen(!isContextMenuOpen);
    };

    const handleContextMenuClose = useCallback(() => {
        setIsContextMenuOpen(false);
    }, []);

    const handleTileClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isContextMenuOpen) {
            setIsContextMenuOpen(false);
        } else {
            onClick(movie, event);
        }
    };

    const handleMovieEdit = useCallback(() => {
        setTargetMovieId(movie.id);
        onEdit(movie);
    }, [movie, onEdit, setTargetMovieId]);

    const handleMovieDelete = useCallback(() => {
        onDelete(movie);
    }, [movie, onDelete]);

    const contextMenuActions = useMemo(
        () => [
            { label: "Edit", onClick: handleMovieEdit },
            { label: "Delete", onClick: handleMovieDelete },
        ],
        [handleMovieEdit, handleMovieDelete],
    );

    return (
        <div
            ref={movieTileRef}
            className="movie-tile relative group w-[320px] text-text cursor-pointer "
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
                    bg-gray bg-opacity-80 rounded-full
                    text-text text-2xl font-bold leading-none
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
                onClose={handleContextMenuClose}
                actions={contextMenuActions}
                className="w-[120px] top-4 right-14"
                withCloseButton
            />

            <img
                src={imageProps.src}
                alt={`${movie.title} poster`}
                className="w-full h-[455px] object-cover mb-4"
                onError={imageProps.onError}
            />

            <div className="flex justify-between items-start mb-1">
                <h3 className="text-[18px] font-medium text-gray-lighter pr-2">{movie.title}</h3>
                <span
                    className="
                        flex-shrink-0
                        border border-gray-light px-3 py-1 rounded
                        text-md font-medium text-gray-lighter
                    "
                >
                    {movie.releaseYear}
                </span>
            </div>
            <p className="text-md text-gray-light">{movie.genres.join(", ")}</p>
        </div>
    );
};
