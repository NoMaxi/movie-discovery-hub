import { renderHook } from "@testing-library/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useNavigateWithSearchParams } from "./useNavigateWithSearchParams";

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    useSearchParams: jest.fn(),
}));

describe("useNavigateWithSearchParams", () => {
    let navigateMock: jest.Mock;
    let mockSearchParams: URLSearchParams;

    beforeEach(() => {
        jest.clearAllMocks();

        navigateMock = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigateMock);

        mockSearchParams = new URLSearchParams();
        (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);
    });

    it("Should navigate to the provided path without search params when none exist", () => {
        const { result } = renderHook(() => useNavigateWithSearchParams());

        result.current("/some-path");

        expect(navigateMock).toHaveBeenCalledWith("/some-path");
    });

    it("Should navigate to the provided path with search params when they exist", () => {
        mockSearchParams.append("query", "test");
        mockSearchParams.append("page", "2");

        const { result } = renderHook(() => useNavigateWithSearchParams());

        result.current("/some-path");

        expect(navigateMock).toHaveBeenCalledWith("/some-path?query=test&page=2");
    });

    it("Should use the same searchParams reference for multiple navigations", () => {
        mockSearchParams.append("query", "test");

        const { result } = renderHook(() => useNavigateWithSearchParams());

        result.current("/first-path");
        result.current("/second-path");

        expect(navigateMock).toHaveBeenCalledTimes(2);
        expect(navigateMock).toHaveBeenNthCalledWith(1, "/first-path?query=test");
        expect(navigateMock).toHaveBeenNthCalledWith(2, "/second-path?query=test");
    });

    it("Should handle paths with trailing slash correctly", () => {
        mockSearchParams.append("query", "test");

        const { result } = renderHook(() => useNavigateWithSearchParams());

        result.current("/some-path/");

        expect(navigateMock).toHaveBeenCalledWith("/some-path/?query=test");
    });
});
