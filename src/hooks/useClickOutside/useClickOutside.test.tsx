import { renderHook } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { useClickOutside } from "./useClickOutside";

describe("useClickOutside", () => {
    let container: HTMLDivElement;
    let user: UserEvent;
    const handler = jest.fn();

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        handler.mockClear();
        user = userEvent.setup();
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it("Should call handler when clicking outside", async () => {
        const ref = { current: container };
        renderHook(() => useClickOutside(ref, handler, true));

        await user.click(document.body);

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("Should not call handler when clicking inside", async () => {
        const ref = { current: container };
        renderHook(() => useClickOutside(ref, handler, true));

        await user.click(container);

        expect(handler).not.toHaveBeenCalled();
    });

    it("Should not listen for clicks when 'isActive' is false", async () => {
        const ref = { current: container };
        renderHook(() => useClickOutside(ref, handler, false));

        await user.click(document.body);

        expect(handler).not.toHaveBeenCalled();
    });

    it("Should remove event listener on unmount", async () => {
        const ref = { current: container };
        const { unmount } = renderHook(() => useClickOutside(ref, handler, true));

        unmount();

        await user.click(document.body);

        expect(handler).not.toHaveBeenCalled();
    });
});
