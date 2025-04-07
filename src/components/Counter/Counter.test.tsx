import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Counter } from "./Counter";

describe("Counter", () => {
    test("Should render the default initial value if not provided in props", () => {
        const { asFragment } = render(<Counter />);

        expect(screen.getByText("0")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render the initial value provided in props", () => {
        const { asFragment } = render(<Counter initialValue={5} />);

        expect(screen.getByText("5")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should decrement the displayed value on decrement button click", () => {
        render(<Counter initialValue={5} />);
        const decrementButton = screen.getByText("-");

        fireEvent.click(decrementButton);

        expect(screen.getByText("4")).toBeInTheDocument();

        fireEvent.click(decrementButton);

        expect(screen.getByText("3")).toBeInTheDocument();
    });

    test("Should increment the displayed value on increment button click", () => {
        render(<Counter initialValue={5} />);
        const incrementButton = screen.getByText("+");

        fireEvent.click(incrementButton);

        expect(screen.getByText("6")).toBeInTheDocument();

        fireEvent.click(incrementButton);

        expect(screen.getByText("7")).toBeInTheDocument();
    });

    test("Should disable the decrement button if the count is 0", () => {
        render(<Counter initialValue={0} />);
        const decrementButton = screen.getByText("-");

        expect(decrementButton).toBeDisabled();

        expect(screen.getByText("0")).toBeInTheDocument();
    });

    test("Should disable the decrement button if the count is less than 0", () => {
        render(<Counter initialValue={-5} />);
        const decrementButton = screen.getByText("-");

        expect(decrementButton).toBeDisabled();

        expect(screen.getByText("-5")).toBeInTheDocument();
    });

    test("Should disable the decrement button when count reaches 0 after decrementing", () => {
        render(<Counter initialValue={1} />);
        const decrementButton = screen.getByText("-");

        expect(decrementButton).toBeEnabled();

        fireEvent.click(decrementButton);

        expect(screen.getByText("0")).toBeInTheDocument();
        expect(decrementButton).toBeDisabled();
    });

    test("Should re-enable the decrement button and decrement correctly after being disabled", () => {
        render(<Counter initialValue={0} />);
        const decrementButton = screen.getByText("-");
        const incrementButton = screen.getByText("+");

        expect(decrementButton).toBeDisabled();

        fireEvent.click(incrementButton);

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(decrementButton).toBeEnabled();

        fireEvent.click(decrementButton);

        expect(screen.getByText("0")).toBeInTheDocument();
    });
});
