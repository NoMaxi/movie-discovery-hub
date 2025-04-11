/// <reference types="@testing-library/cypress" />
import { SearchForm } from "./SearchForm";

describe("<SearchForm /> Component Tests", () => {
    const searchText = "movie title";
    const placeholderText = "What do you want to watch?";
    const searchButtonSelector = "[data-testid='search-button']";
    const searchInputSelector = "[data-testid='search-input']";

    it("Should render input with an initial value if initialQuery is provided in props", () => {
        const initialQuery = "test movie";
        const onSearchSpy = cy.spy();
        cy.mount(<SearchForm onSearch={onSearchSpy} initialQuery={initialQuery} />);

        cy.get(searchInputSelector).should("have.value", initialQuery);
    });

    it("Should render empty input if no initialQuery is provided in props", () => {
        const onSearchSpy = cy.spy();
        cy.mount(<SearchForm onSearch={onSearchSpy} />);

        cy.findByPlaceholderText(placeholderText).should("be.visible").and("have.value", "");
        cy.get(searchButtonSelector).should("be.visible").and("contain.text", "Search");
    });

    it("Should update input value when user types text in the input", () => {
        const onSearchSpy = cy.spy();
        cy.mount(<SearchForm onSearch={onSearchSpy} />);

        cy.get(searchInputSelector).type(searchText);

        cy.get(searchInputSelector).should("have.value", searchText);
    });

    it("Should call 'onSearch' prop with input value when search button is clicked", () => {
        const onSearchSpy = cy.spy().as("onSearchSpy");
        cy.mount(<SearchForm onSearch={onSearchSpy} />);

        cy.get(searchInputSelector).type(searchText);
        cy.get(searchButtonSelector).click();

        cy.get("@onSearchSpy").should("have.been.calledOnceWith", searchText);
    });

    it("Should call 'onSearch' prop with input value when Enter key is pressed in the input", () => {
        const onSearchSpy = cy.spy().as("onSearchSpy");
        cy.mount(<SearchForm onSearch={onSearchSpy} />);

        cy.get(searchInputSelector).type(`${searchText}{enter}`);

        cy.get("@onSearchSpy").should("have.been.calledOnceWith", searchText);
    });

    it("Should not call 'onSearch' prop when Enter key is pressed in the input if the input value is empty", () => {
        const onSearchSpy = cy.spy().as("onSearchSpy");
        cy.mount(<SearchForm onSearch={onSearchSpy} />);

        cy.get(searchInputSelector).type(`{enter}`);

        cy.get("@onSearchSpy").should("not.have.been.called");
    });

    it("Should not call 'onSearch' prop when a non-Enter key is pressed in the input", () => {
        const onSearchSpy = cy.spy().as("onSearchSpy");
        cy.mount(<SearchForm onSearch={onSearchSpy} />);

        cy.get(searchInputSelector).type(`${searchText}{downArrow}`);

        cy.get("@onSearchSpy").should("not.have.been.called");
    });
});
