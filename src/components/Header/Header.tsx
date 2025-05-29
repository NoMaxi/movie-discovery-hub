import bgHeaderImage from "@/assets/bg-header.png";
import { Outlet, useParams } from "react-router-dom";

export const Header = () => {
    const { movieId } = useParams();
    const heightClass = movieId ? "h-[540px]" : "min-h-[290px]";

    return (
        <header
            data-testid="header"
            className="
                relative w-[var(--content-width)] px-[60px] pt-[80px] pb-[20px] mb-[10px]
                bg-[var(--color-content-background)] bg-cover bg-center bg-no-repeat
            "
            style={{ backgroundImage: `url(${bgHeaderImage})` }}
        >
            <div data-testid="header-inner" className={`flex flex-col relative z-10 ${heightClass}`}>
                <Outlet data-testid="outlet-inner" />
            </div>
        </header>
    );
};
