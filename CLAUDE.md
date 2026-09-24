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

**Frontend routing and layout.** `src/App.jsx` defines all routes in one `SiteLayout`. `Header`/`Footer` are hidden for any `/admin*` path (this includes `/admin-print/:kind/:id`, the chrome-free printable invoice/quotation page). `/admin` is wrapped in `ProtectedRoute` and renders `AdminLayout` with nested routes, each page wrapped in `RequireArea` so roles only see what they can use; `/admin/login` sits outside the guard.

**Static content lives in code, except news.** All service pages come from `src/data/services.js` (`categories` plus a `services` array with pricing, tech stack, FAQ, related services), which is the single source of truth for `Services` and `ServiceDetail`; the quotation line-item picker also reads its pricing. News articles live in the `articles` table (managed at `/admin/news`) and are fetched through `src/data/news.js`, which falls back to built-in copies if the API is down. `public/sitemap.xml` and the `SiteMap` page are maintained by hand.

**SEO.** Every page renders the shared `components/SEO.jsx` (react-helmet-async `Helmet`; `HelmetProvider` is set up in `src/index.jsx`) for meta tags, Open Graph/Twitter cards, and JSON-LD.

**Admin auth and roles.** `POST /api/login` returns a Sanctum plain-text token plus the user (with `role`). The frontend keeps both in `localStorage` (`web4rt_admin_token`, `web4rt_admin_user`) via `src/utils/adminAuth.js`; `AdminLayout` refreshes the user from `GET /user` on load. Roles are `admin`, `sales`, `finance`, `developer`. `User::AREA_ROLES` maps each area to allowed roles and the `area:<name>` middleware enforces it on routes; `src/pages/admin/permissions.js` mirrors the map for the UI, so change both together. Admins manage users at `/admin/users` (at least one admin must remain); the first admin still has to be created manually (e.g. `php artisan tinker`).

**Admin frontend structure.** Most modules (clients, projects, quotations, invoices, renewals, team, timesheets, tickets, news, users, audit log) are thin configs over `components/ResourcePage.jsx`, a generic list/search/filter/paginate/add-edit-form/CSV-export page. `api.js` holds the `useApi()` fetch wrapper (401 sends you to login), `downloadExport()`, and a cached `getLookups()` for id/name dropdowns. `moduleMeta.js`, `statusMeta.js` and `financeMeta.js` hold label/colour metadata; `companyInfo.js` holds the seller details printed on invoices (GSTIN and bank details are blank until filled in). Leads (`AdminSubmissions`) and Finances are hand-written pages that predate `ResourcePage`.

**Analytics are computed in the browser.** `GET /api/analytics` returns the full, unpaginated contact list with only the needed fields. `src/pages/admin/analyticsUtils.js` buckets it into week/month/quarter/half-year/year periods client-side (Monday-start weeks) for the `recharts` charts in `AdminOverview`; `components/PipelineInsights.jsx` derives win rates, deal size and lost reasons from the same data. `GET /api/dashboard` supplies the "needs attention" panel (follow-ups, stale leads, receivables, renewals, at-risk projects, tickets, monthly burn), including only the sections the user's role can access.

**Backend API (`backend/routes/api.php`).**
- Public: `POST /contacts` (contact/quote form, also emails admins), `GET /articles[/{slug}]`, `POST /login`, `GET /hello`.
- `auth:sanctum`, then gated by `area:*`: contacts/leads (plus `/contacts/{id}/activities` and `/contacts/{id}/convert` to create a client), `/clients`, `/projects`, `/quotations` (+ `/{id}/invoice`), `/invoices` (+ `/{id}/payments`, `DELETE /payments/{id}`), `/finance-entries`, `/renewals` (+ `/{id}/renew`), `/employees`, `/timesheets` (+ `/utilization`), `/tickets`, `/admin-articles`, `/users`, `/audit-logs`. Ungated for any admin: `/dashboard`, `/lookups`, `/export/{type}` (CSV; checks the area itself).
- Simple modules extend `ResourceController` (generic CRUD with `?search=`, `$filterable` query params and `?all=1` to skip pagination); subclasses supply `rules()` and optional `prepare()`/`applyFilters()` hooks.
- Money flow: recording an invoice payment creates a `FinanceEntry` (income/sale) and `Invoice::syncPayments()` moves the status between sent/partially_paid/paid; deleting the payment removes that entry. "Overdue" is never stored; it is the derived `display_status`. Quotation and invoice totals are always recomputed from the `items` JSON by the `HasLineItems` trait. Project cost = timesheet hours x `employees.hourly_cost` + `other_costs` (`Project::scopeWithFinancials`).
- Every business model uses the `Auditable` trait, which writes `audit_logs` rows on create/update/delete.
- Email: `AdminNotifier` sends to `ADMIN_NOTIFY_EMAIL` (comma separated) or else users with the right role, and swallows mail failures. `php artisan admin:daily-digest` is scheduled daily at 09:00, which only runs if `php artisan schedule:run` is triggered every minute (cron / Task Scheduler). Locally `MAIL_MAILER=log`, so mail lands in `storage/logs/laravel.log`.
- Rate limit: 300 requests/min for signed-in users, 60 for anonymous visitors (`RouteServiceProvider`).

## Notes

- `.env` files (root and `backend/`) are gitignored; only `backend/.env.example` is tracked.
- Production is planned as Docker (React + Laravel + MySQL) behind web4rttech.com, but no Dockerfile or compose file exists in this repo yet.
