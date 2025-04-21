import bgHeaderImage from "@/assets/bg_header.png";
import { SearchForm } from "@/components/SearchForm/SearchForm";
import { MovieDetails } from "@/components/MovieDetails/MovieDetails";
import { Movie } from "@/types/common";

interface HeaderProps {
    searchQuery: string;
    onSearch: (query: string) => void;
    showDetailsSection: boolean;
    selectedMovie: Movie | null;
    onDetailsClose: () => void;
}

export const Header = ({ searchQuery, onSearch, showDetailsSection, selectedMovie, onDetailsClose }: HeaderProps) => (
    <header
        className="
            relative w-[var(--content-width)] px-[60px] pt-[80px] pb-[20px] mb-[10px]
            bg-[var(--color-content-background)] bg-cover bg-center bg-no-repeat
        "
        style={{ backgroundImage: `url(${bgHeaderImage})` }}
    >
        <div className={`flex flex-col relative z-10 ${showDetailsSection ? "h-[540px]" : "min-h-[290px]"}`}>
            {showDetailsSection && selectedMovie ? (
                <>
                    <button
                        onClick={onDetailsClose}
                        className="
                            absolute top-0 right-0 p-2 z-20 text-5xl text-[var(--color-primary)]
                             hover:text-red-400 cursor-pointer transition-colors
                         "
                        title="Back to Search"
                        aria-label="Close movie details"
                    >
                        &times;
                    </button>
                    <MovieDetails details={selectedMovie} />
                </>
            ) : (
                <div className="flex flex-col items-start px-[60px]">
                    <h2 className="text-[40px] font-light uppercase mb-8 mt-[25px] tracking-[1px]">Find Your Movie</h2>
                    <div className="w-full">
                        <SearchForm initialQuery={searchQuery} onSearch={onSearch} />
                    </div>
                </div>
            )}
        </div>
    </header>
);
