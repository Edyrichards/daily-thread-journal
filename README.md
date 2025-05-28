# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/da720972-6cc0-4ffa-b129-9adddbbfba16

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/da720972-6cc0-4ffa-b129-9adddbbfba16) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Project Overview

This application is a spiritual growth and journaling platform. It is built using a modern web stack:

*   **Vite:** For fast development and optimized builds.
*   **React:** For building the user interface.
*   **TypeScript:** For static typing and improved code quality.
*   **Tailwind CSS:** For utility-first styling.
*   **shadcn-ui:** For pre-built, accessible UI components.

Key libraries used include:
*   **React Router DOM (`react-router-dom`):** For client-side navigation.
*   **TanStack Query (`@tanstack/react-query`):** For managing server state, caching, and data fetching.

### Project Structure

*   `public/`: Static assets like `favicon.ico` and `robots.txt`. The main `index.html` is at the root.
*   `src/`: Application source code.
    *   `components/`: Reusable UI components.
        *   `ui/`: Components from shadcn-ui.
        *   `dashboard/`: Components specific to the dashboard.
    *   `hooks/`: Custom React hooks.
    *   `lib/`: Core logic, API interactions (`api.ts`), utilities (`utils.ts`, `storage.ts`), etc.
    *   `pages/`: Top-level route components representing different views of the application.
    *   `App.tsx`: Main application component, sets up routing and global layout.
    *   `main.tsx`: Entry point of the application, renders the root component.
*   `.env.example`: Example environment variables.
*   `index.html`: The main HTML page for the application.
*   `README.md`: This file.
*   `package.json`: Lists project dependencies and scripts.
*   `vite.config.ts`: Vite configuration.
*   `vitest.config.ts`: Vitest (testing framework) configuration.

## Build and Deployment

### Building for Production

To create a production-ready build of the application, run:

```sh
npm run build
```

This command bundles the application and outputs static assets to the `dist/` directory.

### Deployment

The contents of the `dist/` directory can be deployed to any static web hosting service, such as Vercel, Netlify, GitHub Pages, AWS S3 with CloudFront, etc.

This project can also be deployed using the [Lovable platform](https://lovable.dev/projects/da720972-6cc0-4ffa-b129-9adddbbfba16) by clicking on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Running Tests

This project uses [Vitest](https://vitest.dev/) as the test runner and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing React components.

### Test Scripts

*   **`npm test`**: Runs all tests in watch mode.
*   **`npm run coverage`**: Runs all tests once and generates a coverage report (viewable in `coverage/index.html`).

### Writing Tests

Create test files with a `.test.ts` or `.test.tsx` extension (e.g., `MyComponent.test.tsx`) typically alongside the file they are testing or in a `__tests__` directory. Refer to the Vitest and React Testing Library documentation for guidance on writing effective tests.
A sample test can be found at `src/components/Header.test.tsx`.

## Configuration Management

This project uses Vite, which supports environment variables loaded from `.env` files. These files allow you to customize application settings for different environments (development, production, etc.) without hardcoding them.

### Environment Variables Files

*   `.env`: Loaded in all cases.
*   `.env.local`: Loaded in all cases, ignored by Git. Use for local overrides.
*   `.env.[mode]`: Loaded only in the specified mode (e.g., `.env.development`, `.env.production`).
*   `.env.[mode].local`: Loaded only in the specified mode, ignored by Git. Use for local overrides of mode-specific settings.

Variables in `.env.[mode].local` will override those in `.env.[mode]`, which override those in `.env` and `.env.local`.

Refer to the `.env.example` file in the project root for a template of environment variables you might want to configure. Copy this file to `.env.local` (for general local settings) or `.env.[mode].local` (for mode-specific local settings) and provide the appropriate values. **Do not commit `.local` files to version control.**

### Using Environment Variables in Code

Only variables prefixed with `VITE_` are exposed to your client-side source code (e.g., `import.meta.env.VITE_API_URL`). Other variables are only available in the Vite config, plugins, and server-side rendering (if applicable).

For more details, see the [Vite documentation on Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html).

## Security Considerations

### Dependency Vulnerabilities

This project uses npm for package management. It's important to regularly check for known vulnerabilities in project dependencies. Use the following commands:

*   `npm audit`: To see a report of known vulnerabilities.
*   `npm audit fix`: To attempt to automatically fix vulnerabilities. For more complex vulnerabilities, manual intervention might be required.

Consider integrating this into your development workflow, for example, as a pre-commit hook or part of your CI/CD pipeline.

### HTTP Security Headers

Basic security headers (`X-Content-Type-Options`, `X-Frame-Options`, and a foundational `Content-Security-Policy`) have been added to `index.html` via meta tags. These headers help protect against common web vulnerabilities like MIME-sniffing, clickjacking, and cross-site scripting (XSS).

**Important:** The provided `Content-Security-Policy (CSP)` is a starting point. It has been configured to allow connections to `https://bible-api.com`, scripts from `https://cdn.gpteng.co`, and images from `https://lovable.dev`. You **must** review and test this CSP thoroughly. Depending on your application's specific requirements (e.g., use of other CDNs, analytics services, inline scripts/styles from libraries), you will likely need to adjust the policy. A misconfigured CSP can block legitimate resources and break application functionality.
