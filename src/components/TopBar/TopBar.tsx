import { NetflixRouletteText } from "@/components/common/NetflixRouletteText/NetflixRouletteText";

interface TopBarProps {
    onAddMovieClick: () => void;
}

export const TopBar = ({ onAddMovieClick }: TopBarProps) => (
    <div
        className="
            flex justify-between items-center fixed
            top-0 left-0 right-0 h-3xl px-16 z-50
            bg-opacity-80 backdrop-blur-sm shadow-md
        "
    >
        <NetflixRouletteText />
        <button className="btn-add-movie" onClick={onAddMovieClick}>
            + Add Movie
        </button>
    </div>
);
