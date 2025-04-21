import { PacmanLoader } from "react-spinners";
import { PRIMARY_COLOR } from "@/constants/constants";

export const Loader = () => (
    <PacmanLoader color={PRIMARY_COLOR} loading={true} size={40} aria-label="Loading Spinner" />
);
