import React, { ReactNode } from "react";
import { Portal } from "react-portal";
import { FocusTrap } from "focus-trap-react";

interface DialogProps {
    title: string | React.JSX.Element;
    children: ReactNode;
    onClose: () => void;
    className?: string;
}

export const Dialog = ({ title, children, onClose, className = "" }: DialogProps) => (
    <Portal>
        <FocusTrap
            focusTrapOptions={{
                clickOutsideDeactivates: false,
                initialFocus: false,
                escapeDeactivates: false,
            }}
        >
            <div
                data-testid="dialog-overlay"
                className="
                    dialog-overlay
                    fixed flex justify-center items-center z-1000 p-4
                    bg-black bg-opacity-70 inset-0
                "
            >
                <div
                    data-testid="dialog-content"
                    className={`
                        dialog-content
                        relative flex flex-col w-full max-h-[90vh] p-[60px]
                        bg-[var(--color-background)] rounded-md shadow-2xl
                        overflow-y-auto
                        ${className}
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {title && (
                        <div className="dialog-header flex justify-between items-start pb-[38px]">
                            {typeof title === "string" ? (
                                <h2 className="font-light text-[40px] text-[var(--color-text)] uppercase tracking-wide">
                                    {title}
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
                            flex items-center justify-center w-[20px] h-[20px]
                            absolute top-[30px] right-[30px]
                            text-[var(--color-gray-lighter)] hover:text-[var(--color-primary)]
                            before:content-[''] before:block before:absolute before:w-[2px] before:h-[24px]
                            before:bg-current before:rotate-45
                            after:content-[''] after:block after:absolute after:w-[2px] after:h-[24px]
                            after:bg-current after:-rotate-45
                            cursor-pointer transition-colors duration-150
                        "
                    >
                        <span className="sr-only">Close</span>
                    </button>
                    <div className={`dialog-body flex-grow ${!title ? "pt-0" : ""}`}>{children}</div>
                </div>
            </div>
        </FocusTrap>
    </Portal>
);
