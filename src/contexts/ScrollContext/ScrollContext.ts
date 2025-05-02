import { createContext } from "react";

export interface ScrollContextType {
    targetMovieId: number | null;
    setTargetMovieId: (id: number | null) => void;
    triggerScroll: boolean;
    setTriggerScroll: (trigger: boolean) => void;
}

export const ScrollContext = createContext<ScrollContextType | undefined>(undefined);
