# Web4rtTech

The official website for **Web4rtTech** — a digital-first IT services and consulting company offering web & mobile development, SEO, PPC, digital marketing, and AI & data science solutions for businesses in India and worldwide.

Live at: https://web4rttech.com

## ✨ Features

- **Home** — rotating hero slider by service pillar, featured services, process, latest news
- **About Us**, **Careers**, **Contact / Get a Quote** (with service/budget/timeline qualification)
- **Services** — grouped by pillar (Web & Mobile Development, Digital Marketing & Growth, AI & Data Science), each with its own detail page: overview, pricing guide, tech stack, process, FAQ, related services
- **Newsroom** with individual article pages
- **Legal pages** — Terms of Use, Privacy Policy, Cookie Policy, Site Map
- **Admin panel** (`/admin`) — password-protected dashboard for reviewing contact submissions, tracking deal status/value, and analytics charts (inquiry volume, revenue, service breakdown, pipeline status) by week/month/quarter/half-year/year
- SEO: per-page meta tags, Open Graph/Twitter cards, JSON-LD structured data, sitemap.xml, robots.txt

## 🧱 Tech Stack

**Frontend**
- React 18 + React Router v6
- `react-helmet-async` for per-page SEO tags
- `recharts` for admin analytics charts
- Plain CSS (no framework)

**Backend**
- Laravel 9 with Sanctum (token auth for the admin panel)
- MySQL

## 📋 Project Structure

```
web4rttech/
├── public/                  # index.html, robots.txt, sitemap.xml, favicon, og-image
├── src/
│   ├── components/          # Header, Footer, SEO, HeroSlider, ServiceIcon, etc.
│   ├── data/                 services.js — single source of truth for all services/pricing
│   ├── pages/                public site pages
│   │   └── admin/            admin panel (login, dashboard, submissions, settings)
│   ├── utils/                 adminAuth.js
│   ├── App.jsx
│   └── index.jsx
├── backend/                 # Laravel API
│   ├── app/Http/Controllers/ (AuthController, ContactController)
│   ├── app/Models/            (User, Contact)
│   ├── database/migrations/
│   └── routes/api.php
└── package.json
```

## 🚀 Local Development

### Frontend

```bash
npm install
npm start
```
Runs at http://localhost:3000. Configure the API base URL in `.env`:
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Backend (Laravel)

```bash
cd backend
composer install
copy .env.example .env
# edit .env with your DB credentials, then:
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

## 🔌 API Overview

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/contacts` | Public | Submit the contact/quote form |
| POST | `/api/login` | Public | Admin login (issues Sanctum token) |
| POST | `/api/logout` | Token | Admin logout |
| PUT | `/api/settings/password` | Token | Change admin password |
| GET/PUT/PATCH/DELETE | `/api/contacts` / `/api/contacts/{id}` | Token | Manage submissions (paginated, searchable) |
| GET | `/api/analytics` | Token | Full contact dataset for admin dashboard charts |

## 📦 Available Scripts

- `npm start` — run the frontend in development mode
- `npm run build` — production build to `build/`
- `npm test` — run the test runner

## 🚀 Deployment

Production deployment targets Docker (containerized React + Laravel + MySQL) behind the `web4rttech.com` domain. See deployment notes (added separately) for the container setup.

## 📧 Contact

- Email: info@web4rttech.com
- Address: Near Monal Farm, Dehradun, Uttarakhand, India 248001
