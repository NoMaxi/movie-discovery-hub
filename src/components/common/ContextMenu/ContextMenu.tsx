import { MouseEvent } from "react";

interface ContextMenuAction {
    label: string;
    onClick: () => void;
}

interface ContextMenuProps {
    isOpen: boolean;
    onClose: () => void;
    actions: ContextMenuAction[];
    className?: string;
    withCloseButton?: boolean;
}

export const ContextMenu = ({
    isOpen,
    onClose,
    actions,
    className = "",
    withCloseButton = false,
}: ContextMenuProps) => {
    if (!isOpen) {
        return null;
    }

    const handleActionClick = (actionOnClick: () => void) => {
        actionOnClick();
        onClose();
    };

    const handleMenuClick = (e: MouseEvent) => {
        e.stopPropagation();
    };

    const handleMenuClose = (e: MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    return (
        <div
            data-testid="context-menu"
            className={`
                context-menu
                absolute z-20 min-w-[100px]
                flex flex-col
                bg-[var(--color-content-background)]
                ring-1 ring-black shadow-lg rounded
                ${className}
            `}
            onClick={handleMenuClick}
        >
            {withCloseButton && (
                <button
                    data-testid="context-menu-close-button"
                    className="
                    context-menu-close-button
                    absolute top-1 right-2
                    text-xl leading-none text-[var(--color-gray-lighter)]
                    hover:text-[var(--color-text)]
                    cursor-pointer
                "
                    onClick={handleMenuClose}
                >
                    &times;
                </button>
            )}

            <ul className="m-0 p-0 list-none">
                {actions.map((action) => (
                    <li key={action.label}>
                        <button
                            data-testid={`context-menu-${action.label.toLowerCase()}-button`}
                            className={`
                                context-menu-${action.label.toLowerCase()}-button
                                block w-full text-left px-4 py-2
                                text-base text-[var(--color-text)]
                                hover:bg-[var(--color-primary)]
                                transition-colors duration-150
                                cursor-pointer
                            `}
                            onClick={() => handleActionClick(action.onClick)}
                        >
                            {action.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
