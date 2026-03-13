# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Cafe Employee Manager Frontend

  Frontend for the Cafe Employee Manager technical assessment.

  ## Stack

  - React + TypeScript
  - Vite
  - Ant Design
  - AG Grid
  - TanStack Query
  - Axios
  - React Router

  ## Features Implemented

  - Cafes page with:
    - location filter
    - AG Grid listing
    - create cafe modal
    - edit selected cafe
    - delete selected cafe
    - refresh, loading, empty, and error states
  - Employees page with:
    - cafe filter
    - AG Grid listing
    - create employee modal
    - edit selected employee
    - delete selected employee
    - refresh, loading, empty, and error states
  - Mutation feedback with success and error toasts

  ## Getting Started

  Install dependencies:

  ```bash
  npm install
  ```

  Start the development server:

  ```bash
  npm run dev
  ```

  Build for production:

  ```bash
  npm run build
  ```

  ## Backend API

  The frontend expects the backend API to be running at:

  ```text
  http://localhost:5068/api
  ```

  You can override this with an environment variable:

  ```bash
  VITE_API_BASE_URL=http://localhost:5068/api
  ```

  ## Project Structure

  ```text
  src/
    api/          API client and endpoint modules
    components/   Shared modal forms
    hooks/        React Query hooks
    pages/        Route-level pages
    types/        Shared TypeScript models
    utils/        Error helpers
  ```

  ## Day 5 Polish

  - Added toast feedback for create, update, and delete actions
  - Added empty and loading states to both data grids
  - Added refresh actions and summary cards
  - Improved README to reflect the actual application
