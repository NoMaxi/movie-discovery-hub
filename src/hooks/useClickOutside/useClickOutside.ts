import { RefObject, useEffect } from "react";

export const useClickOutside = (ref: RefObject<HTMLElement | null>, handler: () => void, isActive: boolean) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        if (isActive) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [ref, handler, isActive]);
};
