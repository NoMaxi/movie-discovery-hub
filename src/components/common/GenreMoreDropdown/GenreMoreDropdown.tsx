import { useRef, useState } from "react";
import { Genre } from "@/types/common";
import { useClickOutside } from "@/hooks/useClickOutside/useClickOutside";
import SelectArrow from "@/components/common/SelectArrow/SelectArrow";
import { ContextMenu } from "@/components/common/ContextMenu/ContextMenu";

export interface GenreMoreDropdownProps {
    options: readonly Genre[];
    selectedGenre?: Genre;
    onSelectionChange: (genre: Genre) => void;
    className?: string;
    buttonClassName?: string;
}

export const GenreMoreDropdown = ({
    options,
    selectedGenre,
    onSelectionChange,
    className = "",
    buttonClassName = "",
}: GenreMoreDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const controlRef = useRef<HTMLDivElement>(null);

    useClickOutside(controlRef, () => setIsOpen(false), isOpen);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleOptionSelect = (option: Genre) => {
        onSelectionChange(option);
        closeMenu();
    };

    const contextMenuActions = options.map((option) => ({
        label: option,
        onClick: () => handleOptionSelect(option),
    }));

    const displayText = selectedGenre || "More Genres";

    return (
        <div
            className={`genre-more-dropdown relative inline-block text-left ${className}`}
            ref={controlRef}
            data-testid="genre-more-dropdown"
        >
            <button
                type="button"
                className={`
                    genre-more-button inline-flex items-center justify-center gap-x-2 min-w-4xl
                    px-2 py-1 text-lg font-medium uppercase
                    cursor-pointer transition-colors duration-200
                    focus:outline-none
                    ${buttonClassName}
                `}
                onClick={toggleDropdown}
            >
                {displayText}
                <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                    <SelectArrow />
                </span>
            </button>

            <ContextMenu
                isOpen={isOpen}
                onClose={closeMenu}
                actions={contextMenuActions}
                className="
                    genre-more-dropdown-menu
                    absolute right-0 top-full
                    mt-1 w-44 rounded
                    max-h-[400px] overflow-y-auto overflow-x-hidden
                "
            />
        </div>
    );
};
