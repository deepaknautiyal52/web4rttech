# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Web4rtTech company website: a React 18 (Create React App) frontend at the repo root plus a Laravel 9 API in `backend/`. They are two separate apps run side by side, not a monorepo with shared tooling. The frontend is plain CSS (no UI framework); the backend uses MySQL and Sanctum token auth.

## Commands

Frontend (repo root):
```bash
npm install
npm start          # http://localhost:3000
npm run build      # production build to build/
npm test           # react-scripts test runner (no frontend tests exist yet)
```

Backend (`cd backend`):
```bash
composer install
copy .env.example .env    # then set DB_* credentials
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
php artisan test                                  # all PHPUnit tests
php artisan test --filter=SomeTestName            # single test
./vendor/bin/pint                                 # code style (Laravel Pint)
```

On this machine PHP is `C:\xampp2\php\php.exe` and is not on PATH; Composer is not installed globally.

The frontend reads `REACT_APP_API_URL` (default `http://localhost:8000/api`). It is defined separately in `src/utils/adminAuth.js` and `src/pages/Contact.jsx`, so change both if you change the default. `backend/tests/` only contains the stock Laravel `ExampleTest` files; `phpunit.xml` leaves the SQLite in-memory DB lines commented out, so tests hit whatever `DB_*` points to.

## Architecture

**Frontend routing and layout.** `src/App.jsx` defines all routes in one `SiteLayout`. `Header`/`Footer` are hidden for any `/admin*` path. `/admin` is wrapped in `ProtectedRoute` and renders `AdminLayout` with nested routes (`AdminOverview`, `AdminSubmissions`, `AdminFinances`, `AdminSettings`); `/admin/login` sits outside the guard.

**Static content lives in code, not the API.** All service pages come from `src/data/services.js` (`categories` plus a `services` array with pricing, tech stack, FAQ, related services), which is the single source of truth for `Services` and `ServiceDetail`. News articles are a hardcoded `articles` array in `src/pages/News.jsx`. Only contact submissions and finance entries go through the backend. `public/sitemap.xml` and the `SiteMap` page are maintained by hand alongside these.

**SEO.** Every page renders the shared `components/SEO.jsx` (react-helmet-async `Helmet`; `HelmetProvider` is set up in `src/index.jsx`) for meta tags, Open Graph/Twitter cards, and JSON-LD.

**Admin auth flow.** `POST /api/login` returns a Sanctum plain-text token. The frontend keeps it and the user in `localStorage` (`web4rt_admin_token`, `web4rt_admin_user`) via `src/utils/adminAuth.js`, and admin pages call `fetch` with `Authorization: Bearer <token>`. There is no admin registration route or seeder (`DatabaseSeeder` has the user factory commented out), so admin `User` rows must be created manually (e.g. `php artisan tinker`).

**Analytics are computed in the browser.** `GET /api/analytics` returns the full, unpaginated contact list with only the needed fields. `src/pages/admin/analyticsUtils.js` buckets it into week/month/quarter/half-year/year periods client-side (Monday-start weeks) for the `recharts` charts in `AdminOverview`. Adding a metric usually means extending both `ContactController::analytics` and `analyticsUtils.js`. `statusMeta.js` and `financeMeta.js` hold the status and finance-category label/colour metadata shared by the admin pages.

**Backend API (`backend/routes/api.php`).**
- Public: `POST /contacts` (contact/quote form), `POST /login`, `GET /hello` (integration smoke test).
- `auth:sanctum` only: `/logout`, `PUT /settings/password`, contact management (`GET/PUT/PATCH/DELETE /contacts[/{contact}]`, paginated 20 per page, searchable), `/analytics`, and `/finance-entries` (`apiResource` plus `/finance-entries/analytics`). Company finances have no public routes at all.
- Models: `Contact` (inquiry plus deal status/value/`won_at`, added across several migrations), `FinanceEntry` (income/expense with `amount` cast to `decimal:2` and a period range), `User`.

## Notes

- `.env` files (root and `backend/`) are gitignored; only `backend/.env.example` is tracked.
- Production is planned as Docker (React + Laravel + MySQL) behind web4rttech.com, but no Dockerfile or compose file exists in this repo yet.
