import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside/useClickOutside";
import SelectArrow from "@/components/common/SelectArrow/SelectArrow";
import { ContextMenu } from "@/components/common/ContextMenu/ContextMenu";

export interface DropdownControlProps<T extends string> {
    label: string;
    options: readonly T[];
    currentSelection: T;
    onSelectionChange: (newSelection: T) => void;
    testId?: string;
    className?: string;
    buttonClassName?: string;
    dropdownClassName?: string;
}

export const DropdownControl = <T extends string>({
    label,
    options,
    currentSelection,
    onSelectionChange,
    testId,
    className = "",
    buttonClassName = "",
    dropdownClassName = "",
}: DropdownControlProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const controlRef = useRef<HTMLDivElement>(null);

    useClickOutside(controlRef, () => setIsOpen(false), isOpen);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleOptionSelect = (option: T) => {
        onSelectionChange(option);
        closeMenu();
    };

    const contextMenuActions = options.map((option) => ({
        label: option,
        onClick: () => handleOptionSelect(option),
    }));

    return (
        <div
            className={`dropdown-control relative inline-block text-left ${className}`}
            ref={controlRef}
            data-testid={testId}
        >
            <div className="flex items-center gap-x-4 text-base">
                <span className="dropdown-control-label text-[16px] uppercase opacity-60">{label}</span>
                <button
                    type="button"
                    className={`
                        dropdown-control-button inline-flex items-center justify-center gap-x-2 min-w-[140px]
                        text-[16px] font-medium uppercase
                        focus:outline-none cursor-pointer
                        ${buttonClassName}
                    `}
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
                className={`
                    dropdown-control-dropdown
                    absolute right-0
                    mt-2 w-44 origin-top-right rounded
                    ${dropdownClassName}
                `}
            />
        </div>
    );
};
