interface SelectArrowProps {
    className?: string;
}

const SelectArrow = ({ className }: SelectArrowProps) => (
    <svg
        data-testid="select-arrow-svg"
        className={`w-3 h-3 fill-primary ${className ?? ""}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 10"
        aria-hidden="true"
    >
        <path data-testid="select-arrow-path" d="M0 0 L10 0 L5 7 z" />
    </svg>
);

export default SelectArrow;
