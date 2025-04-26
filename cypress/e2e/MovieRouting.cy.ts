import { Genre, SortOption } from "../../src/types/common";
import { DEFAULT_ACTIVE_GENRE, DEFAULT_SORT_OPTION } from "../../src/constants/constants";

describe("Movie List Page - URL Search Parameters", () => {
    const searchInputSelector = '[data-testid="search-input"]';
    const searchButtonSelector = '[data-testid="search-button"]';
    const genreSelectSelector = '[data-testid="genre-select"]';
    const sortControlSelector = '[data-testid="sort-control"]';
    const movieCountSelector = '[data-testid="movie-count"]';
    const movieTileSelector = '[data-testid="movie-tile"]';
    const movieDetailsSelector = '[data-testid="movie-details"]';
    const closeDetailsButtonSelector = '[data-testid="close-details-button"]';

    const testQuery = "car";
    const testGenre: Genre = "Comedy";
    const testSortOption: SortOption = "Title";
    let firstMovieId: string;

    beforeEach(() => {
        cy.intercept("GET", "**/movies*").as("getMovies");
        cy.intercept("GET", /\/movies\/\d+$/).as("getMovieDetails");
        cy.visit("/");
        cy.wait("@getMovies");

        cy.get(movieTileSelector)
            .first()
            .invoke("attr", "data-movie-id")
            .then((id) => {
                if (id) {
                    firstMovieId = id;
                } else {
                    throw new Error("Could not find movie ID for the first tile.");
                }
            });
    });

    const checkUrlParam = (param: string, expectedValue: string) => {
        cy.url().should((url) => {
            const urlObj = new URL(url);
            const paramValue = urlObj.searchParams.get(param);
            expect(paramValue).to.equal(expectedValue);
        });
    };

    it("Should load with default parameters and no search params in URL", () => {
        cy.url().should("not.include", "?");
        cy.get(searchInputSelector).should("have.value", "");
        cy.get(genreSelectSelector).should("contain.text", DEFAULT_ACTIVE_GENRE);
        cy.get(sortControlSelector).find("button").should("contain.text", DEFAULT_SORT_OPTION);
    });

    it("Should update URL with 'query' param on search and persist after reload", () => {
        cy.get(searchInputSelector).type(testQuery);
        cy.get(searchButtonSelector).click();
        cy.wait("@getMovies");

        checkUrlParam("query", testQuery);
        cy.url().should("not.include", "genre=");
        cy.url().should("not.include", "sortBy=");

        cy.get(searchInputSelector).should("have.value", testQuery);

        cy.reload();
        cy.wait("@getMovies");

        checkUrlParam("query", testQuery);
        cy.get(searchInputSelector).should("have.value", testQuery);
        cy.get(genreSelectSelector).should("contain.text", DEFAULT_ACTIVE_GENRE);
        cy.get(sortControlSelector).find("button").should("contain.text", DEFAULT_SORT_OPTION);
    });

    it("Should update URL with 'genre' param on selection and persist after reload", () => {
        cy.get(genreSelectSelector).contains("div", testGenre).click();
        cy.wait("@getMovies");

        checkUrlParam("genre", testGenre);
        cy.url().should("not.include", "query=");
        cy.url().should("not.include", "sortBy=");

        cy.get(genreSelectSelector).should("contain.text", testGenre);

        cy.reload();
        cy.wait("@getMovies");

        checkUrlParam("genre", testGenre);
        cy.get(genreSelectSelector).should("contain.text", testGenre);
        cy.get(searchInputSelector).should("have.value", "");
        cy.get(sortControlSelector).find("button").should("contain.text", DEFAULT_SORT_OPTION);
    });

    it("Should update URL with 'sortBy' param on selection and persist after reload", () => {
        cy.get(sortControlSelector).find("button").click();
        cy.contains(testSortOption).click();
        cy.wait("@getMovies");

        checkUrlParam("sortBy", testSortOption);
        cy.url().should("not.include", "query=");
        cy.url().should("not.include", "genre=");

        cy.get(sortControlSelector).find("button").should("contain.text", testSortOption);

        cy.reload();
        cy.wait("@getMovies");

        checkUrlParam("sortBy", testSortOption);
        cy.get(sortControlSelector).find("button").should("contain.text", testSortOption);
        cy.get(searchInputSelector).should("have.value", "");
        cy.get(genreSelectSelector).should("contain.text", DEFAULT_ACTIVE_GENRE);
    });

    it("Should update URL with all params combined and persist after reload", () => {
        cy.get(searchInputSelector).type(testQuery);
        cy.get(searchButtonSelector).click();
        cy.get(genreSelectSelector).contains("div", testGenre).click();
        cy.get(sortControlSelector).find("button").click();
        cy.contains(testSortOption).click();
        cy.wait("@getMovies");

        checkUrlParam("query", testQuery);
        checkUrlParam("genre", testGenre);
        checkUrlParam("sortBy", testSortOption);

        cy.get(searchInputSelector).should("have.value", testQuery);
        cy.get(genreSelectSelector).should("contain.text", testGenre);
        cy.get(sortControlSelector).find("button").should("contain.text", testSortOption);

        cy.reload();
        cy.wait("@getMovies");

        checkUrlParam("query", testQuery);
        checkUrlParam("genre", testGenre);
        checkUrlParam("sortBy", testSortOption);
        cy.get(searchInputSelector).should("have.value", testQuery);
        cy.get(genreSelectSelector).should("contain.text", testGenre);
        cy.get(sortControlSelector).find("button").should("contain.text", testSortOption);
    });

    it("Should load correct state when visiting URL with parameters directly", () => {
        const urlWithParams = `/?query=${encodeURIComponent(testQuery)}&genre=${testGenre}&sortBy=${testSortOption}`;
        cy.visit(urlWithParams);
        cy.wait("@getMovies");

        cy.get(searchInputSelector).should("have.value", testQuery);
        cy.get(genreSelectSelector).should("contain.text", testGenre);
        cy.get(sortControlSelector).find("button").should("contain.text", testSortOption);
        cy.get(movieCountSelector).should("exist");
    });

    it("Should navigate to movie details, preserve search params, and persist details on reload", () => {
        cy.get(searchInputSelector).type(testQuery);
        cy.get(searchButtonSelector).click();
        cy.wait("@getMovies");
        cy.get(genreSelectSelector).contains("div", testGenre).click();
        cy.wait("@getMovies");
        cy.get(sortControlSelector).find("button").click();
        cy.contains(testSortOption).click();
        cy.wait("@getMovies");

        let clickedMovieId: string;

        cy.get(movieTileSelector)
            .first()
            .invoke("attr", "data-movie-id")
            .then((id) => {
                if (!id) throw new Error("Could not get movie ID before clicking");
                clickedMovieId = id;
            })
            .then(() => {
                cy.get(movieTileSelector).first().click();
                cy.wait("@getMovieDetails");

                cy.url().should("match", new RegExp(`/${clickedMovieId}(\\?.*)?$`));
                checkUrlParam("query", testQuery);
                checkUrlParam("genre", testGenre);
                checkUrlParam("sortBy", testSortOption);

                cy.get(movieDetailsSelector).should("be.visible");
                cy.get(movieCountSelector).should("exist");

                cy.reload();
                cy.wait("@getMovieDetails");
                cy.wait("@getMovies");

                cy.url().should("match", new RegExp(`/${clickedMovieId}(\\?.*)?$`));
                checkUrlParam("query", testQuery);
                checkUrlParam("genre", testGenre);
                checkUrlParam("sortBy", testSortOption);
                cy.get(movieDetailsSelector).should("be.visible");
                cy.get(movieCountSelector).should("exist");
            });
    });

    it("Should show SearchForm on root path and MovieDetails on /:movieId path", () => {
        cy.url().should("eq", Cypress.config().baseUrl + "/");
        cy.get(searchInputSelector).should("be.visible");
        cy.get(searchButtonSelector).should("be.visible");
        cy.get(movieDetailsSelector).should("not.exist");

        cy.get(movieTileSelector).first().click();
        cy.wait("@getMovieDetails");

        cy.url().should("match", new RegExp(`/${firstMovieId}(\\?.*)?$`));
        cy.get(movieDetailsSelector).should("be.visible");
        cy.get(searchInputSelector).should("not.exist");
        cy.get(searchButtonSelector).should("not.exist");

        cy.get(closeDetailsButtonSelector).click({ force: true });

        cy.url().should("match", /^http:\/\/localhost:\d+\/(\?.*)?$/);
        cy.get(searchInputSelector).should("be.visible");
        cy.get(searchButtonSelector).should("be.visible");
        cy.get(movieDetailsSelector).should("not.exist");
    });
});
