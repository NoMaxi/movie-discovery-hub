import { useContext } from "react";
import { ScrollContext } from "./ScrollContext";

export const useScrollContext = () => {
    const context = useContext(ScrollContext);

    if (context === undefined) {
        throw new Error("useScrollContext must be used within a ScrollProvider");
    }

    return context;
};
