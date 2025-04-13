import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Dialog } from "./Dialog";

jest.mock("focus-trap-react", () => ({
    FocusTrap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

interface DialogProps {
    title: string | React.JSX.Element;
    children: React.ReactNode;
    onClose: () => void;
    className?: string;
}

describe("Dialog", () => {
    const defaultProps: Omit<DialogProps, "onClose"> = {
        title: "Default Test Title",
        children: <p>Default test children content</p>,
    };
    const mockTitleText = "Dialog Title Text";
    let onCloseMock: jest.Mock;
    let user: UserEvent;

    beforeEach(() => {
        onCloseMock = jest.fn();
        user = userEvent.setup();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props: Partial<React.ComponentProps<typeof Dialog>> = {}) => {
        const mergedProps = { ...defaultProps, ...props };
        return render(<Dialog {...mergedProps} onClose={onCloseMock} />);
    };

    test("Should render correctly with string title and children", () => {
        const childrenTextContent = "Children Text Content";
        const mockChildren = <p>{childrenTextContent}</p>;
        const { asFragment } = renderComponent({ title: mockTitleText, children: mockChildren });

        expect(screen.getByTestId("dialog-overlay")).toBeInTheDocument();

        const dialogContent = screen.getByTestId("dialog-content");

        expect(dialogContent).toBeInTheDocument();

        const header = within(dialogContent).getByRole("heading", { name: mockTitleText, level: 2 });

        expect(header).toBeInTheDocument();

        const dialogBody = screen.getByTestId("dialog-body");

        expect(within(dialogBody).getByText(childrenTextContent)).toBeInTheDocument();
        expect(dialogBody).toHaveClass("dialog-body");
        expect(screen.getByTestId("dialog-close-button")).toBeInTheDocument();
        expect(onCloseMock).not.toHaveBeenCalled();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Should render correctly with empty string title", () => {
        renderComponent({ title: "" });
        const dialogContent = screen.getByTestId("dialog-content");

        expect(within(dialogContent).queryByRole("heading")).not.toBeInTheDocument();
        expect(screen.getByTestId("dialog-close-button")).toBeInTheDocument();

        const dialogBody = screen.getByTestId("dialog-body");

        expect(dialogBody).toBeInTheDocument();
        expect(dialogBody).toHaveClass("dialog-body pt-0");
    });

    test("Should render correctly with JSX element as title", () => {
        const jsxTitle = <span data-testid="jsx-title">{mockTitleText}</span>;
        renderComponent({ title: jsxTitle });

        const dialogContent = screen.getByTestId("dialog-content");

        expect(within(dialogContent).getByTestId("jsx-title")).toBeInTheDocument();
        expect(within(dialogContent).getByText(mockTitleText)).toBeInTheDocument();
        expect(within(dialogContent).queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
        expect(screen.getByTestId("dialog-body")).toBeInTheDocument();
        expect(screen.getByTestId("dialog-close-button")).toBeInTheDocument();
    });

    test("Should call 'onClose' prop when close button is clicked", async () => {
        renderComponent();
        const closeButton = screen.getByTestId("dialog-close-button");

        await user.click(closeButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test("Should apply custom classes to the dialog content element", () => {
        const customClass = "my-custom-dialog";
        renderComponent({ className: customClass });

        const dialogContent = screen.getByTestId("dialog-content");

        expect(dialogContent).toHaveClass("dialog-content");
        expect(dialogContent).toHaveClass(customClass);
    });

    test("Should render complex children correctly", () => {
        const complexChildren = (
            <form data-testid="my-form">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" />
                <button type="submit">Submit</button>
            </form>
        );
        renderComponent({ children: complexChildren });

        const dialogContent = screen.getByTestId("dialog-content");
        const form = within(dialogContent).getByTestId("my-form");

        expect(form).toBeInTheDocument();
        expect(within(form).getByLabelText("Name")).toBeInTheDocument();
        expect(within(form).getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });
});
