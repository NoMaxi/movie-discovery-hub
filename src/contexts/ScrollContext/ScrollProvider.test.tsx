import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ScrollProvider } from "./ScrollProvider";
import { useScrollContext } from "./useScrollContext";

const TestConsumer = () => {
    const { targetMovieId, setTargetMovieId, triggerScroll, setTriggerScroll } = useScrollContext();

    return (
        <div>
            <div data-testid="targetMovieId">{String(targetMovieId)}</div>
            <div data-testid="triggerScroll">{String(triggerScroll)}</div>
            <button onClick={() => act(() => setTargetMovieId(123))}>Set Target ID</button>
            <button onClick={() => act(() => setTriggerScroll(true))}>Trigger Scroll</button>
            <button onClick={() => act(() => setTargetMovieId(null))}>Reset Target ID</button>
            <button onClick={() => act(() => setTriggerScroll(false))}>Reset Trigger Scroll</button>
        </div>
    );
};

const renderWithProvider = () => {
    return render(
        <ScrollProvider>
            <TestConsumer />
        </ScrollProvider>,
    );
};

describe("ScrollProvider", () => {
    test("Should provide initial context values", () => {
        const { asFragment } = renderWithProvider();

        expect(screen.getByTestId("targetMovieId").textContent).toBe("null");
        expect(screen.getByTestId("triggerScroll").textContent).toBe("false");
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should update targetMovieId when setTargetMovieId is called", () => {
        renderWithProvider();

        const setButton = screen.getByText("Set Target ID");
        act(() => {
            setButton.click();
        });

        expect(screen.getByTestId("targetMovieId").textContent).toBe("123");

        const resetButton = screen.getByText("Reset Target ID");
        act(() => {
            resetButton.click();
        });

        expect(screen.getByTestId("targetMovieId").textContent).toBe("null");
    });

    test("Should update triggerScroll when setTriggerScroll is called", () => {
        renderWithProvider();

        const triggerButton = screen.getByText("Trigger Scroll");
        act(() => {
            triggerButton.click();
        });

        expect(screen.getByTestId("triggerScroll").textContent).toBe("true");

        const resetButton = screen.getByText("Reset Trigger Scroll");
        act(() => {
            resetButton.click();
        });

        expect(screen.getByTestId("triggerScroll").textContent).toBe("false");
    });

    test("Should render children", () => {
        render(
            <ScrollProvider>
                <div>Child Component</div>
            </ScrollProvider>,
        );

        expect(screen.getByText("Child Component")).toBeInTheDocument();
    });
});
