# Netflix Roulette | Movie Discovery Hub

This project is a movie management application. It allows users to browse, search, view details, add, and edit movies.

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Bundler:** Vite
- **Routing:** React Router DOM
- **State Management:** React Context, TanStack Query (React Query) for server state
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **API Definition:** Swagger (OpenAPI)
- **Testing:**
  - Jest & React Testing Library (Unit/Integration Tests)
  - Cypress (End-to-End Tests)
- **Linting:** ESLint
- **Formatting:** Prettier (implied, common practice)
- **Component Development:** Storybook

## Features

- List and browse movies.
- Search for movies by title or genre.
- Sort movies by release date or title.
- View detailed information for each movie.
- Add new movies through a form.
- Edit existing movie details.
- Delete movies.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone \<repository-url\>
    cd react-mentoring-program
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

- **Development Server:**
    To start the Vite development server with Hot Module Replacement (HMR):

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    This will typically open the application in your default browser at `http://localhost:5173` (or another port if 5173 is in use).

- **Storybook:**
    To run Storybook for component development and testing:

    ```bash
    npm run storybook
    # or
    yarn storybook
    ```

### Running Tests

- **Unit & Integration Tests (Jest):**

    ```bash
    npm test
    # or to run in watch mode:
    npm run test:watch
    # or to update snapshots:
    npm run test:update
    ```

- **End-to-End Tests (Cypress):**

    ```bash
    npm run cy:open
    # or
    yarn cy:open
    ```

    This will open the Cypress Test Runner.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

This will generate optimized static assets in the `dist` folder.

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

The project follows a standard React application structure:

```text
react-mentoring-program/
├── cypress/                # End-to-end tests
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components
│   ├── constants/          # Application constants
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── mocks/              # Mock data and service workers
│   ├── pages/              # Page-level components (routed)
│   ├── router/             # Routing configuration
│   ├── services/           # API service integrations (e.g., movieService)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── main.tsx            # Main application entry point
│   ├── index.css           # Global styles
│   └── swagger.yaml        # API specification
├── .eslintrc.js            # ESLint configuration
├── jest.config.ts          # Jest configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration (if customized)
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Linting and Formatting

- **Linting:** ESLint is configured to enforce code quality and consistency. Run `npm run lint` to check for linting errors.
- **Formatting:** While not explicitly configured in `package.json` scripts for a global format command, Prettier is a dev dependency, suggesting it's used for code formatting, likely via editor integration or pre-commit hooks.

## API

The application interacts with a backend API. The API specification can be found in `src/swagger.yaml`. For development, a mock API server might be used (details would typically be here if a specific mock server setup is part of the project, e.g., using `msw` or a simple Express server - this project uses `swagger.yaml` which implies a backend is expected or mocked elsewhere).

## Contributing

(Details on how to contribute to the project, if applicable. For this mentoring program, this might not be relevant unless collaboration is part of the exercise.)
