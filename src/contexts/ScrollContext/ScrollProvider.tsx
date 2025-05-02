import { useState, ReactNode } from "react";
import { ScrollContext } from "./ScrollContext";

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
    const [targetMovieId, setTargetMovieId] = useState<number | null>(null);
    const [triggerScroll, setTriggerScroll] = useState<boolean>(false);

    return (
        <ScrollContext.Provider value={{ targetMovieId, setTargetMovieId, triggerScroll, setTriggerScroll }}>
            {children}
        </ScrollContext.Provider>
    );
};
