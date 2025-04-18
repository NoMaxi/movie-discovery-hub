import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PacmanLoader } from "react-spinners";
import { PRIMARY_COLOR } from "@/constants/constants";
import { Loader } from "./Loader";

jest.mock("react-spinners", () => ({
    PacmanLoader: jest.fn(() => <div data-testid="mocked-pacman-loader">Mocked PacmanLoader</div>),
}));

describe("Loader", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Should render loader component with correct props", () => {
        const { asFragment } = render(<Loader />);

        expect(screen.getByTestId("mocked-pacman-loader")).toBeInTheDocument();
        expect(PacmanLoader).toHaveBeenCalledWith(
            {
                color: PRIMARY_COLOR,
                loading: true,
                size: 40,
                "aria-label": "Loading Spinner",
            },
            undefined,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
