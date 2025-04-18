import { PacmanLoader } from "react-spinners";
import { PRIMARY_COLOR } from "@/constants/constants";

export const Loader = () => (
    <PacmanLoader
        className="-ml-24"
        color={PRIMARY_COLOR}
        loading={true}
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
);
