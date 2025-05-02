import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ErrorMessage } from "./ErrorMessage";

describe("ErrorMessage", () => {
    const mockOnDismiss = jest.fn();
    const testMessage = "Test error message";
    let user: UserEvent;

    beforeEach(() => {
        mockOnDismiss.mockClear();
        user = userEvent.setup();
    });

    const renderComponent = (props: Partial<React.ComponentProps<typeof ErrorMessage>> = {}) => {
        const defaultProps: React.ComponentProps<typeof ErrorMessage> = {
            message: testMessage,
            onDismiss: mockOnDismiss,
        };
        const mergedProps = { ...defaultProps, ...props };
        return render(<ErrorMessage {...mergedProps} />);
    };

    it("Should render the error message correctly", () => {
        const { asFragment } = renderComponent();

        expect(screen.getByTestId("error-message")).toHaveTextContent(testMessage);
        expect(screen.getByLabelText("Dismiss error")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    it("Should call onDismiss when dismiss button is clicked", async () => {
        renderComponent();
        const dismissButton = screen.getByTestId("error-dismiss-button");

        await user.click(dismissButton);

        expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it("Should apply className prop correctly", () => {
        const testClass = "test-class";
        renderComponent({ className: testClass });
        const container = screen.getByTestId("error-container");

        expect(container).toHaveClass(testClass);
        expect(container).toHaveClass("flex");
        expect(container).toHaveClass("items-center");
        expect(container).toHaveClass("text-center");
    });

    it("Should return null when no message is provided", () => {
        const { container } = renderComponent({ message: "" });

        expect(container).toBeEmptyDOMElement();
    });

    it("Should render the message in red text", () => {
        renderComponent();
        const messageElement = screen.getByTestId("error-message");

        expect(messageElement).toHaveClass("text-red-500");
    });

    it("Should have the correct button styling", () => {
        renderComponent();
        const button = screen.getByTestId("error-dismiss-button");

        expect(button).toHaveClass("text-3xl");
        expect(button).toHaveClass("text-red-300");
        expect(button).toHaveClass("transition-colors");
        expect(button).toHaveClass("duration-300");
        expect(button).toHaveClass("cursor-pointer");
    });
});
