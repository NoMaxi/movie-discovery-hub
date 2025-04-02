import { useState, useRef, useEffect } from "react";
import { SortOption } from "@/types/common";
import SelectArrow from "@/components/common/SelectArrow/SelectArrow";

interface SortControlProps {
    currentSelection: SortOption;
    onSelectionChange: (newSelection: SortOption) => void;
}

const SortControl = ({ currentSelection, onSelectionChange }: SortControlProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const controlRef = useRef<HTMLDivElement>(null);
    const options: SortOption[] = ["Release Date", "Title"];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleOptionClick = (option: SortOption) => {
        onSelectionChange(option);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="sort-control relative inline-block text-left" ref={controlRef}>
            <div className="flex items-center gap-x-4 text-base">
                <span className="sort-control-label text-[16px] uppercase opacity-60">Sort by</span>
                <button
                    type="button"
                    className="
                        sort-control-button inline-flex items-center justify-center gap-x-2
                        text-[16px] font-medium uppercase
                        focus:outline-none cursor-pointer
                    "
                    onClick={toggleDropdown}
                >
                    {currentSelection}
                    <SelectArrow />
                </button>
            </div>

            {isOpen && (
                <div
                    className="
                        sort-control-dropdown
                        absolute right-0
                        mt-2 w-48 origin-top-right rounded z-20
                        bg-[var(--color-background)] ring-1 ring-black shadow-lg
                        focus:outline-none overflow-hidden
                    "
                >
                    <ul>
                        {options.map((option) => (
                            <li key={option}>
                                <button
                                    onClick={() => handleOptionClick(option)}
                                    className={`
                                        sort-control-option
                                        block w-full px-4 py-2
                                        text-left text-[14px] uppercase font-medium
                                        ${currentSelection === option && "text-[var(--color-primary)]"}
                                        hover:bg-[var(--color-primary)] hover:text-[var(--color-text)]
                                        transition-colors duration-150 cursor-pointer
                                    `}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SortControl;
