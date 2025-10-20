<!-- Copilot / AI agent guidance for crm-beta (crm-mern-app) -->

# Repo snapshot

-   Full-stack MERN-style demo split into two folders: `backend/` (Express + Mongoose) and `client/` (React + Vite + Tailwind).
-   Backend entry: `backend/server.js` (single-file Express app; defines Mongoose schemas for Client and Campaign and REST endpoints under `/api/*`).
-   Client entry: `client/src/app.jsx` (monolithic React single-file demo UI using Tailwind; vite dev server configured in `client/package.json`).

# Quick goals for AI coding agents

-   Make small, focused edits (fix a bug, add an endpoint, update UI) and keep changes minimal and well-scoped.
-   Preserve existing patterns: backend uses simple Express routes, Mongoose models declared inline in `server.js`; client is a single React component file with many helper components inside `app.jsx`.

# How to run (dev & build)

-   Backend (from `backend/`):

    -   Install: npm install
    -   Dev: npm run dev (uses nodemon)
    -   Prod: npm start (node server.js)
    -   Expects environment variables: `PORT`, and `DB_CONNECTION_STRING` (used in `server.js`).

-   Client (from `client/`):
    -   Install: npm install
    -   Dev: npm run dev (starts Vite; proxy configured for `/api` -> `http://localhost:5000` in `vite.config.js`)
    -   Build: npm run build
    -   Preview: npm run preview

# Project-specific conventions & patterns

-   Backend:

    -   All REST endpoints live in `backend/server.js` and respond under `/api/*` (e.g. `/api/clients`, `/api/campaigns`, `/api/send/ad`).
    -   Mongoose models are created in the same file; follow that style for additions (declare schema then model then endpoints).
    -   Errors are returned with JSON messages and `error: err.message` — follow the same error-response shape for compatibility.

-   Client:
    -   `client/src/app.jsx` is intentionally monolithic; new UI components should be added in the same file unless a refactor is requested.
    -   Tailwind classes are used per-component. `tailwind.config.js` content paths include `./src/app.jsx` and `./src/main.jsx` — if you add new JSX files put them in `client/src/` and update `tailwind.config.js` if needed.
    -   The app uses in-memory mock data arrays (`allContacts`, `allLeads`) inside `app.jsx` for demo flows — backend integration is simulated by Vite proxy when running both servers.

# Integration points and external deps

-   Database: MongoDB via `mongoose` configured with `DB_CONNECTION_STRING` env var used in `backend/server.js`.
-   Third-party services referenced in `backend/package.json`: `node-telegram-bot-api`, `nodemailer`, `twilio` (not wired in server.js but available as dependencies). If you implement integrations, add credentials via env vars and keep secrets out of the repo.
-   Deployment: `backend/vercel.json` exists and routes all requests to `server.js` for Vercel deployment. Keep server entrypoint and Vercel config in sync.

# Practical examples for common tasks

-   Add a new API route: follow pattern in `server.js` — add schema/model above routes, then create Express route using async/await and return JSON with consistent error shape.
-   Wire client to backend: use fetch('/api/your-route') from `client/src/app.jsx` or create a small helper function; during dev the vite proxy sends `/api` to `http://localhost:5000`.
-   Add a new Tailwind component: add JSX to `client/src/app.jsx`, use Tailwind classes, and ensure the file path is included in `tailwind.config.js` content array.

# Safety and style

-   Keep changes isolated: prefer adding small components or endpoints; large refactors must be proposed first.
-   Tests are not present; if you add functionality include a brief manual test plan (commands, sample requests) in the PR description.

# Files to reference when coding

-   `backend/server.js` — models and endpoints (most backend logic lives here).
-   `backend/package.json` — start/dev scripts and backend dependencies.
-   `backend/vercel.json` — deployment routing for Vercel.
-   `client/src/app.jsx` — primary React UI and mock data.
-   `client/package.json`, `vite.config.js`, `tailwind.config.js` — client build/dev configuration and proxy rules.

If anything above is unclear or you want conventions tightened (for example splitting `app.jsx` into components), tell me which parts to expand and I will update this file.
