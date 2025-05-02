interface ErrorMessageProps {
    message: string;
    onDismiss: () => void;
    className?: string;
}

export const ErrorMessage = ({ message, onDismiss, className = "" }: ErrorMessageProps) => {
    if (!message) {
        return null;
    }

    return (
        <div data-testid="error-container" className={`flex items-center text-center ${className}`}>
            <span data-testid="error-message" className="text-red-500 mr-3">
                {message}
            </span>
            <button
                data-testid="error-dismiss-button"
                onClick={onDismiss}
                className="
                    text-3xl text-red-300 hover:text-[var(--color-primary)]
                    transition-colors duration-300 cursor-pointer
                "
                aria-label="Dismiss error"
            >
                &times;
            </button>
        </div>
    );
};
