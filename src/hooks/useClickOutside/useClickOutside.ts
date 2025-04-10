import { RefObject, useEffect } from "react";

export const useClickOutside = (ref: RefObject<HTMLElement | null>, handler: () => void, isActive: boolean) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        if (isActive) {
            document.addEventListener("click", handleClickOutside, true);
        } else {
            document.removeEventListener("click", handleClickOutside, true);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [ref, handler, isActive]);
};
