import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook for handling image fallback functionality
 * @param imageUrl - The primary image URL to display
 * @param fallbackImage - The fallback image to display when primary image fails to load
 * @returns Object containing the appropriate image source and error handler
 */
export const useImageFallback = (imageUrl: string, fallbackImage: string) => {
    const [isImageError, setIsImageError] = useState(false);

    useEffect(() => {
        setIsImageError(false);
    }, [imageUrl]);

    const handleImageError = useCallback(() => {
        setIsImageError(true);
    }, []);

    return {
        src: isImageError ? fallbackImage : imageUrl,
        onError: handleImageError,
    };
};
