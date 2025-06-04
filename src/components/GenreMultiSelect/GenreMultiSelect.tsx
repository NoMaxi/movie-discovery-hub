import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Genre } from "@/types/common";
import { SELECTABLE_GENRES } from "@/constants/constants";
import { useClickOutside } from "@/hooks/useClickOutside/useClickOutside";
import SelectArrow from "@/components/common/SelectArrow/SelectArrow";

export interface GenreMultiSelectProps {
    id: string;
    name: string;
    preselectedGenres?: string[];
    onChange?: (value: string[]) => void;
    ariaDescribedby?: string;
    error?: boolean;
}

const defaultEmptyGenres: string[] = [];

export const GenreMultiSelect = forwardRef<HTMLDivElement, GenreMultiSelectProps>(
    ({ preselectedGenres = defaultEmptyGenres, onChange, id, ariaDescribedby, error }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selectedGenres, setSelectedGenres] = useState<Set<Genre | string>>(
            () => new Set(preselectedGenres),
        );
        const controlRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            setSelectedGenres(new Set(preselectedGenres));
        }, [preselectedGenres]);

        useClickOutside(controlRef, () => setIsOpen(false), isOpen);

        const toggleDropdown = () => setIsOpen(!isOpen);

        const handleCheckboxChange = useCallback(
            (genre: Genre, isChecked: boolean) => {
                const newSelected = new Set(selectedGenres);
                if (isChecked) {
                    newSelected.add(genre);
                } else {
                    newSelected.delete(genre);
                }

                const genresArray = Array.from(newSelected);
                setSelectedGenres(newSelected);
                onChange?.(genresArray);
            },
            [selectedGenres, onChange],
        );

        const areGenresSelected = selectedGenres.size > 0;
        const displayValue = areGenresSelected ? Array.from(selectedGenres).join(", ") : "Select Genre";

        const combinedRef = (node: HTMLDivElement | null) => {
            controlRef.current = node;
            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        return (
            <div className="genre-select relative" ref={combinedRef}>
                <button
                    id={id}
                    type="button"
                    onClick={toggleDropdown}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-describedby={ariaDescribedby}
                    aria-invalid={error ? "true" : "false"}
                    className={`
                        input-field relative flex items-center justify-between w-full
                        text-left text-[var(--color-primary)] font-normal opacity-80
                        cursor-pointer ${error ? "input-error" : ""}
                    `}
                >
                    <span
                        className={`truncate ${
                            areGenresSelected ? "text-[var(--color-text)]" : "text-[var(--color-text)] opacity-30"
                        }`}
                    >
                        {displayValue}
                    </span>
                    <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                        <SelectArrow className="w-4 h-4" />
                    </span>
                </button>

                {isOpen && (
                    <div
                        role="listbox"
                        className="
                        absolute z-30 mt-1 w-full bg-[var(--color-background)]
                        border border-[var(--color-gray-light)] rounded-md shadow-lg
                        max-h-60 overflow-y-auto
                    "
                    >
                        {SELECTABLE_GENRES.map((genre) => (
                            <label
                                key={genre}
                                className="
                                    flex items-center px-4 py-3 space-x-3
                                    hover:bg-[var(--color-gray)]
                                    cursor-pointer transition-colors
                                "
                            >
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={selectedGenres.has(genre)}
                                    onChange={(e) => handleCheckboxChange(genre, e.target.checked)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <span className="text-[var(--color-text)] text-[16px]">{genre}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        );
    },
);
