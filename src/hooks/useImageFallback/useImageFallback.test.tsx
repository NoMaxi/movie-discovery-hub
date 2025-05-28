import { act, renderHook } from "@testing-library/react";
import { useImageFallback } from "./useImageFallback";

describe("useImageFallback", () => {
    const mockImageUrl = "https://example.com/test-image.jpg";
    const mockFallbackImage = "https://example.com/fallback-image.png";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should return correct initial values", () => {
        const { result } = renderHook(() => useImageFallback(mockImageUrl, mockFallbackImage));

        expect(result.current.src).toBe(mockImageUrl);
        expect(typeof result.current.onError).toBe("function");
    });

    it("Should return fallback image source when image error occurs", () => {
        const { result } = renderHook(() => useImageFallback(mockImageUrl, mockFallbackImage));

        act(() => {
            result.current.onError();
        });

        expect(result.current.src).toBe(mockFallbackImage);
    });
    it("Should reset error state when imageUrl changes", () => {
        const { result, rerender } = renderHook(
            ({ imageUrl, fallbackImage }) => useImageFallback(imageUrl, fallbackImage),
            {
                initialProps: {
                    imageUrl: mockImageUrl,
                    fallbackImage: mockFallbackImage,
                },
            },
        );

        act(() => {
            result.current.onError();
        });

        expect(result.current.src).toBe(mockFallbackImage);

        rerender({
            imageUrl: "https://example.com/new-image.jpg",
            fallbackImage: mockFallbackImage,
        });

        expect(result.current.src).toBe("https://example.com/new-image.jpg");
    });
    it("Should not reset error state when fallbackImage changes", () => {
        const { result, rerender } = renderHook(
            ({ imageUrl, fallbackImage }) => useImageFallback(imageUrl, fallbackImage),
            {
                initialProps: {
                    imageUrl: mockImageUrl,
                    fallbackImage: mockFallbackImage,
                },
            },
        );

        act(() => {
            result.current.onError();
        });

        expect(result.current.src).toBe(mockFallbackImage);

        const newFallbackImage = "https://example.com/new-fallback.png";
        rerender({
            imageUrl: mockImageUrl,
            fallbackImage: newFallbackImage,
        });

        expect(result.current.src).toBe(newFallbackImage);
    });
    it("Should maintain stable onError function reference", () => {
        const { result, rerender } = renderHook(() => useImageFallback(mockImageUrl, mockFallbackImage));

        const firstOnError = result.current.onError;

        rerender();

        const secondOnError = result.current.onError;

        expect(firstOnError).toBe(secondOnError);
    });

    it("Should handle multiple error calls correctly", () => {
        const { result } = renderHook(() => useImageFallback(mockImageUrl, mockFallbackImage));

        act(() => {
            result.current.onError();
        });

        expect(result.current.src).toBe(mockFallbackImage);

        act(() => {
            result.current.onError();
        });

        expect(result.current.src).toBe(mockFallbackImage);
    });
    it("Should work with empty string imageUrl", () => {
        const { result } = renderHook(() => useImageFallback("", mockFallbackImage));

        expect(result.current.src).toBe("");

        act(() => {
            result.current.onError();
        });

        expect(result.current.src).toBe(mockFallbackImage);
    });

    it("Should work with empty string fallbackImage", () => {
        const { result } = renderHook(() => useImageFallback(mockImageUrl, ""));

        expect(result.current.src).toBe(mockImageUrl);

        act(() => {
            result.current.onError();
        });

        expect(result.current.src).toBe("");
    });
    it("Should reset error state when imageUrl changes from fallback state", () => {
        const { result, rerender } = renderHook(({ imageUrl }) => useImageFallback(imageUrl, mockFallbackImage), {
            initialProps: { imageUrl: mockImageUrl },
        });

        act(() => {
            result.current.onError();
        });

        expect(result.current.src).toBe(mockFallbackImage);

        rerender({ imageUrl: "https://example.com/image2.jpg" });

        expect(result.current.src).toBe("https://example.com/image2.jpg");

        rerender({ imageUrl: "https://example.com/image3.jpg" });

        expect(result.current.src).toBe("https://example.com/image3.jpg");
    });

    it("Should handle rapid imageUrl changes correctly", () => {
        const { result, rerender } = renderHook(({ imageUrl }) => useImageFallback(imageUrl, mockFallbackImage), {
            initialProps: { imageUrl: mockImageUrl },
        });

        rerender({ imageUrl: "https://example.com/image1.jpg" });
        rerender({ imageUrl: "https://example.com/image2.jpg" });
        rerender({ imageUrl: "https://example.com/image3.jpg" });

        expect(result.current.src).toBe("https://example.com/image3.jpg");

        act(() => {
            result.current.onError();
        });

        expect(result.current.src).toBe(mockFallbackImage);
    });
});
