import { SearchForm } from "@/components/SearchForm/SearchForm";
import { Outlet, useSearchParams } from "react-router-dom";

export const SearchFormPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchQuery = searchParams.get("query") ?? "";

    const handleSearch = (query: string) => {
        const newParams = new URLSearchParams(searchParams);

        if (query) {
            newParams.set("query", query);
        } else {
            newParams.delete("query");
        }

        setSearchParams(newParams, { replace: true });
    };

    return (
        <div className="flex flex-col items-start px-[60px]">
            <h2 className="text-[40px] font-light uppercase mb-8 mt-[25px] tracking-[1px]">Find Your Movie</h2>
            <div className="w-full">
                <SearchForm initialQuery={searchQuery} onSearch={handleSearch} />
                <Outlet />
            </div>
        </div>
    );
};
