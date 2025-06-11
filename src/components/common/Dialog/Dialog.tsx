import React, { ReactNode, useState, useEffect, useRef } from "react";
import { Portal } from "react-portal";
import { FocusTrap } from "focus-trap-react";

interface DialogProps {
    title: string | React.JSX.Element;
    children: ReactNode;
    onClose: () => void;
    className?: string;
}

export const Dialog = ({ title, children, onClose, className = "" }: DialogProps) => {
    const [isActive, setIsActive] = useState(false);
    const dialogContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const focusTimeout = setTimeout(() => {
            setIsActive(true);
        }, 0);

        return () => clearTimeout(focusTimeout);
    }, []);

    return (
        <Portal>
            <FocusTrap
                active={isActive}
                focusTrapOptions={{
                    clickOutsideDeactivates: false,
                    escapeDeactivates: false,
                    fallbackFocus: () => dialogContentRef.current ?? '[data-testid="dialog-content"]',
                }}
            >
                <div
                    data-testid="dialog-overlay"
                    className="
                        dialog-overlay
                        fixed flex justify-center items-center z-1000 p-4
                        bg-black/30 backdrop-blur-md inset-0
                    "
                >
                    <div
                        ref={dialogContentRef}
                        tabIndex={-1}
                        data-testid="dialog-content"
                        className={`
                            dialog-content
                            relative flex flex-col w-full
                            bg-background rounded-md shadow-2xl
                            max-h-[95vh] overflow-hidden
                            ${className}
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="
                                dialog-header-container
                                sticky top-0 px-3xl pt-3xl pb-[38px]
                                bg-background z-10
                            "
                        >
                            {title && (
                                <div className="dialog-header flex justify-between items-start">
                                    {typeof title === "string" ? (
                                        <h2 className="font-light text-2xl text-text uppercase tracking-wide">
                                            {title.toUpperCase()}
                                        </h2>
                                    ) : (
                                        <div>{title}</div>
                                    )}
                                </div>
                            )}
                            <button
                                type="button"
                                data-testid="dialog-close-button"
                                onClick={onClose}
                                className="
                                    dialog-close-button
                                    flex items-center justify-center w-xl h-xl
                                    absolute top-[30px] right-[30px]
                                    hover:text-primary
                                    before:content-[''] before:block before:absolute before:w-[2px] before:h-[24px]
                                    before:bg-current before:rotate-45
                                    after:content-[''] after:block after:absolute after:w-[2px] after:h-[24px]
                                    after:bg-current after:-rotate-45
                                    cursor-pointer transition-colors duration-300
                                "
                            >
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                        <div
                            data-testid="dialog-body"
                            className={`dialog-body flex-grow px-3xl pb-3xl overflow-y-auto ${!title ? "pt-3xl" : ""}`}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </FocusTrap>
        </Portal>
    );
};
