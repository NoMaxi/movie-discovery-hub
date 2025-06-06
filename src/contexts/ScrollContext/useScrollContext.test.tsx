import { ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";
import { ScrollProvider } from "./ScrollProvider";
import { useScrollContext } from "./useScrollContext";

describe("useScrollContext", () => {
    test("Should return context values when used within ScrollProvider", () => {
        const wrapper = ({ children }: { children: ReactNode }) => <ScrollProvider>{children}</ScrollProvider>;
        const { result } = renderHook(() => useScrollContext(), { wrapper });

        expect(result.current.targetMovieId).toBeNull();
        expect(result.current.triggerScroll).toBe(false);
        expect(typeof result.current.setTargetMovieId).toBe("function");
        expect(typeof result.current.setTriggerScroll).toBe("function");
    });

    test("Should update context values", () => {
        const wrapper = ({ children }: { children: ReactNode }) => <ScrollProvider>{children}</ScrollProvider>;
        const { result } = renderHook(() => useScrollContext(), { wrapper });

        act(() => {
            result.current.setTargetMovieId(456);
            result.current.setTriggerScroll(true);
        });

        expect(result.current.targetMovieId).toBe(456);
        expect(result.current.triggerScroll).toBe(true);
    });

    test("Should throw an error when used outside of ScrollProvider", () => {
        expect(() => {
            renderHook(() => useScrollContext());
        }).toThrow("useScrollContext must be used within a ScrollProvider");
    });
});
