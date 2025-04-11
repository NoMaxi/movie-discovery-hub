import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { SelectableGenre } from "@/types/common";
import { SELECTABLE_GENRES } from "@/constants";
import { useClickOutside } from "@/hooks/useClickOutside/useClickOutside";
import SelectArrow from "@/components/common/SelectArrow/SelectArrow";

export interface GenreMultiSelectProps {
    id: string;
    name: string;
    preselectedGenres?: SelectableGenre[];
    ariaDescribedby?: string;
}

export interface GenreMultiSelectRef {
    reset: () => void;
}

export const GenreMultiSelect = forwardRef<GenreMultiSelectRef, GenreMultiSelectProps>(
    ({ preselectedGenres = [], id, name, ariaDescribedby }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selectedGenres, setSelectedGenres] = useState<Set<SelectableGenre>>(new Set(preselectedGenres));
        const [hiddenValue, setHiddenValue] = useState(preselectedGenres.join(", "));
        const controlRef = useRef<HTMLDivElement>(null);
        const hiddenInputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            setHiddenValue(Array.from(selectedGenres).join(", "));
        }, [selectedGenres]);

        useClickOutside(controlRef, () => setIsOpen(false), isOpen);

        const toggleDropdown = () => setIsOpen(!isOpen);

        const handleCheckboxChange = useCallback((genre: SelectableGenre, isChecked: boolean) => {
            setSelectedGenres((prevSelected) => {
                const newSelected = new Set(prevSelected);
                if (isChecked) {
                    newSelected.add(genre);
                } else {
                    newSelected.delete(genre);
                }

                const genresArray = Array.from(newSelected);
                if (hiddenInputRef.current) {
                    hiddenInputRef.current.value = genresArray.join(", ");
                }

                return newSelected;
            });
        }, []);

        const reset = useCallback(() => {
            setSelectedGenres(new Set(preselectedGenres));
        }, [preselectedGenres]);

        useImperativeHandle(ref, () => ({ reset }), [reset]);

        const areGenresSelected = selectedGenres.size > 0;
        const displayValue = selectedGenres.size > 0 ? Array.from(selectedGenres).join(", ") : "Select Genre";

        return (
            <div className="genre-select relative" ref={controlRef}>
                <button
                    id={id}
                    type="button"
                    onClick={toggleDropdown}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-describedby={ariaDescribedby}
                    className="
                        input-field relative flex items-center justify-between w-full
                        text-left text-[var(--color-primary)] font-normal opacity-80
                        cursor-pointer
                    "
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

                <input
                    ref={hiddenInputRef}
                    type="hidden"
                    name={name}
                    value={hiddenValue}
                    data-testid={`hidden-input-${name}`}
                />
            </div>
        );
    },
);
