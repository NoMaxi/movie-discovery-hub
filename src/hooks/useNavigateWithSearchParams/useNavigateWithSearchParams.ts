import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useNavigateWithSearchParams = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    return useCallback(
        (path: string) => {
            const searchParamsString = searchParams.toString();
            navigate(`${path}${searchParamsString ? `?${searchParamsString}` : ""}`);
        },
        [navigate, searchParams],
    );
};
