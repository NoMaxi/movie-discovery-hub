import { useState, useRef } from "react";
import { SortOption } from "@/types/common";
import { useClickOutside } from "@/hooks/useClickOutside/useClickOutside";
import SelectArrow from "@/components/common/SelectArrow/SelectArrow";
import { ContextMenu } from "@/components/common/ContextMenu/ContextMenu";

interface SortControlProps {
    currentSelection: SortOption;
    onSelectionChange: (newSelection: SortOption) => void;
}

export const SortControl = ({ currentSelection, onSelectionChange }: SortControlProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const controlRef = useRef<HTMLDivElement>(null);
    const options: SortOption[] = ["Release Date", "Title"];

    useClickOutside(controlRef, () => setIsOpen(false), isOpen);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const contextMenuActions = options.map((option) => ({
        label: option,
        onClick: () => onSelectionChange(option),
    }));

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
                    <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                        <SelectArrow />
                    </span>
                </button>
            </div>

            <ContextMenu
                isOpen={isOpen}
                onClose={closeMenu}
                actions={contextMenuActions}
                className="
                    sort-control-dropdown
                    absolute right-0
                    mt-2 w-48 origin-top-right rounded
                "
            />
        </div>
    );
};
