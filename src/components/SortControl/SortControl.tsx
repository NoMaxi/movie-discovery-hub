import { SortOption } from "@/types/common";
import { SORT_OPTIONS } from "@/constants/constants";
import { DropdownControl } from "@/components/common/DropdownControl/DropdownControl";

interface SortControlProps {
    currentSelection: SortOption;
    onSelectionChange: (newSelection: SortOption) => void;
}

export const SortControl = ({ currentSelection, onSelectionChange }: SortControlProps) => {
    return (
        <DropdownControl
            label="Sort by"
            options={SORT_OPTIONS}
            currentSelection={currentSelection}
            onSelectionChange={onSelectionChange}
            testId="sort-control"
            className="sort-control"
        />
    );
};
