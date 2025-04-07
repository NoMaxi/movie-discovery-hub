import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ContextMenu } from "./ContextMenu";

interface ContextMenuAction {
    label: string;
    onClick: () => void;
}

describe("ContextMenu", () => {
    let onCloseMock: jest.Mock;
    let user: UserEvent;
    let mockActions: ContextMenuAction[];

    beforeEach(() => {
        onCloseMock = jest.fn();
        mockActions = [
            { label: "Edit", onClick: jest.fn() },
            { label: "Delete", onClick: jest.fn() },
        ];
        user = userEvent.setup();
    });

    const renderComponent = (isOpen: boolean, props: Partial<React.ComponentProps<typeof ContextMenu>> = {}) => {
        const defaultProps: React.ComponentProps<typeof ContextMenu> = {
            isOpen,
            onClose: onCloseMock,
            actions: mockActions,
        };
        const mergedProps = { ...defaultProps, ...props };
        return render(<ContextMenu {...mergedProps} />);
    };

    test("Should not render when 'isOpen' prop is false", () => {
        renderComponent(false);
        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
    });

    test("Should render correctly without close button by default when 'isOpen' is true", () => {
        const { asFragment } = renderComponent(true, { className: "custom-class" });
        const menuElement = screen.getByTestId("context-menu");

        expect(menuElement).toBeInTheDocument();
        expect(menuElement).toHaveClass("custom-class");
        expect(screen.queryByTestId("context-menu-close-button")).not.toBeInTheDocument();
        expect(screen.getByTestId("context-menu-edit-button")).toBeInTheDocument();
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByTestId("context-menu-delete-button")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot("without-close-button");
    });

    test("Should render correctly with close button when 'withCloseButton' is true", () => {
        const { asFragment } = renderComponent(true, { withCloseButton: true });
        const menuElement = screen.getByTestId("context-menu");

        expect(menuElement).toBeInTheDocument();
        expect(screen.getByTestId("context-menu-close-button")).toBeInTheDocument();
        expect(screen.getByTestId("context-menu-edit-button")).toBeInTheDocument();
        expect(screen.getByTestId("context-menu-delete-button")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot("with-close-button");
    });

    test("Should call 'onClose' prop when close button is clicked", async () => {
        renderComponent(true, { withCloseButton: true });
        const closeButton = screen.getByTestId("context-menu-close-button");

        await user.click(closeButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
        expect(mockActions[0].onClick).not.toHaveBeenCalled();
        expect(mockActions[1].onClick).not.toHaveBeenCalled();
    });

    test("Should call correct action's 'onClick' and 'onClose' props when action button is clicked", async () => {
        renderComponent(true);
        const editButton = screen.getByTestId("context-menu-edit-button");

        await user.click(editButton);

        expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
        expect(mockActions[1].onClick).not.toHaveBeenCalled();
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test("Should stop propagation when clicking inside the menu container", async () => {
        const handleOuterClick = jest.fn();
        render(
            <div data-testid="outer-container" onClick={handleOuterClick}>
                <ContextMenu isOpen={true} onClose={onCloseMock} actions={mockActions} />
            </div>,
        );

        const menuElement = screen.getByTestId("context-menu");
        await user.click(menuElement);

        expect(handleOuterClick).not.toHaveBeenCalled();
        expect(onCloseMock).not.toHaveBeenCalled();
    });

    test("Should stop propagation when clicking the close button", async () => {
        const handleOuterClick = jest.fn();
        render(
            <div data-testid="outer-container" onClick={handleOuterClick}>
                <ContextMenu isOpen={true} onClose={onCloseMock} actions={mockActions} withCloseButton={true} />
            </div>,
        );

        const closeButton = screen.getByTestId("context-menu-close-button");
        await user.click(closeButton);

        expect(handleOuterClick).not.toHaveBeenCalled();
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test("Should stop propagation when clicking an action button", async () => {
        const handleOuterClick = jest.fn();
        render(
            <div data-testid="outer-container" onClick={handleOuterClick}>
                <ContextMenu isOpen={true} onClose={onCloseMock} actions={mockActions} />
            </div>,
        );

        const editButton = screen.getByTestId("context-menu-edit-button");
        await user.click(editButton);

        expect(handleOuterClick).not.toHaveBeenCalled();
        expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
});
