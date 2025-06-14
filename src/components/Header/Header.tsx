import bgHeaderImage from "@/assets/bg-header.png";
import { Outlet, useParams } from "react-router-dom";

export const Header = () => {
    const { movieId } = useParams();
    const heightClass = movieId ? "h-header-height-expanded" : "min-h-header-height-collapsed";

    return (
        <header
            data-testid="header"
            className="
                relative w-content-width px-3xl pt-4xl pb-xl mb-md
                bg-content-background bg-cover bg-center bg-no-repeat
            "
            style={{ backgroundImage: `url(${bgHeaderImage})` }}
        >
            <div data-testid="header-inner" className={`flex flex-col relative z-10 ${heightClass}`}>
                <Outlet data-testid="outlet-inner" />
            </div>
        </header>
    );
};
