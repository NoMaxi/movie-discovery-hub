import { renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { useClickOutside } from "./useClickOutside";

describe("useClickOutside", () => {
    let container: HTMLDivElement;
    const handler = jest.fn();

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        handler.mockClear();
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it("Should call handler when clicking outside", () => {
        const ref = { current: container };
        renderHook(() => useClickOutside(ref, handler, true));

        fireEvent.click(document.body);

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("Should not call handler when clicking inside", () => {
        const ref = { current: container };
        renderHook(() => useClickOutside(ref, handler, true));

        fireEvent.click(container);

        expect(handler).not.toHaveBeenCalled();
    });

    it("Should not listen for clicks when 'isActive' is false", () => {
        const ref = { current: container };
        renderHook(() => useClickOutside(ref, handler, false));

        fireEvent.click(document.body);

        expect(handler).not.toHaveBeenCalled();
    });

    it("Should remove event listener on unmount", () => {
        const ref = { current: container };
        const { unmount } = renderHook(() => useClickOutside(ref, handler, true));

        unmount();

        fireEvent.click(document.body);

        expect(handler).not.toHaveBeenCalled();
    });
});
