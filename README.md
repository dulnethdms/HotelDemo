# 🌊 Sample Hotel

A modern, responsive showcase website for a luxury beachfront hotel, with a secure admin panel for hotel staff to manage content.

> **Scope:** This is a *showcase / content-managed* website. It intentionally has **no** online booking, payments, reservation management or customer accounts.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Vite, HTML5, **custom CSS only** (no Bootstrap / Tailwind) |
| Backend | Node.js, Express.js |
| Database | Supabase |
| Auth | JWT (Bearer token) + bcrypt password hashing (`bcryptjs`, a pure-JS bcrypt implementation) |

## Features

**Public site:** Home (full-screen hero, intro, highlights, featured packages, promotions, reviews) · About (story, mission/vision, why choose us, facilities) · Accommodation & Packages (with Rooms/Packages filter) · Gallery (category filter + keyboard-friendly lightbox) · Promotions (seasonal, holiday, event) · Location (embedded Google Map, directions, nearby attractions) · Contact (validated form, honeypot spam trap, social links).

**Admin panel (`/admin`):** secure login · add/edit/delete packages and promotions · upload/manage gallery images · edit hotel descriptions, contact info, social links, reviews, amenities · read contact messages · change password.

**Design & quality:** ocean/gold luxury palette, Cormorant Garamond + Jost typography, scroll-reveal animations, smooth scrolling, mobile-first responsive layout, `prefers-reduced-motion` support, per-page titles/meta descriptions, JSON-LD `Hotel` schema, `robots.txt`, `sitemap.xml`, skip-link and ARIA labels.

## Folder structure

```
ocean-paradise-resort/
├── database/
│   └── schema.sql                 # all 6 tables
├── backend/
│   ├── server.js                  # Express app (helmet, CORS, static uploads, optional SPA hosting)
│   ├── .env.example
│   ├── scripts/
│   │   ├── setup.js               # creates indexes, first admin, sample content
│   │   └── seedData.js            # sample packages, promotions, gallery, site text
│   ├── uploads/                   # uploaded images (git-ignored)
│   └── src/
│       ├── db.js                  # Supabase connection and table adapter
│       ├── middleware/{auth,upload}.js
│       └── routes/{auth,packages,promotions,gallery,content,contact,upload}.js
├── frontend/
│   ├── index.html                 # SEO meta + JSON-LD
│   ├── vite.config.js             # dev proxy -> :5000
│   ├── public/                    # favicon, robots.txt, sitemap.xml
│   └── src/
│       ├── main.jsx · App.jsx · api.js
│       ├── context/ContentContext.jsx
│       ├── hooks/useApi.js
│       ├── components/            # Navbar, Footer, Layout, Logo, Reveal, SmartImg, Seo, Lightbox, PackageCard, PromoCard, Ui
│       ├── pages/                 # Home, About, Accommodation, Gallery, Promotions, Location, Contact, NotFound
│       ├── admin/                 # AdminLayout, AdminLogin, Dashboard, CrudManager, Packages/Promotions/Gallery/Content/Messages/Account
│       └── styles/                # base.css, layout.css, components.css, admin.css
└── docs/
    ├── INSTALLATION.md
    └── DEPLOYMENT.md
```

## Quick start

```bash
# 1. Backend
cd backend
cp .env.example .env        # set DB credentials, JWT_SECRET, ADMIN_PASSWORD
npm install
npm run setup               # creates DB + tables + admin + sample content
npm run dev                 # API on http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev                 # site on http://localhost:5173
```

Admin panel: <http://localhost:5173/admin/login> (username/password from your `.env`).

See [docs/INSTALLATION.md](docs/INSTALLATION.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

## Database tables

| Table | Purpose |
|---|---|
| `admins` | staff accounts (bcrypt hashes) |
| `packages` | rooms & packages (price, JSON feature list, special offer, featured/active flags) |
| `promotions` | seasonal / holiday / event offers with validity dates (expired offers hide automatically) |
| `gallery` | images by category: rooms, beach, pool, restaurant, activities |
| `contact_messages` | messages from the contact form |
| `site_content` | key/value store for all editable text, contact info, social links, reviews, amenities, attractions |

## API reference

Base URL: `/api`. 🔒 = requires `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | `{username, password}` → `{token}` (rate limited) |
| GET | `/auth/me` 🔒 | Validate session |
| PUT | `/auth/password` 🔒 | Change password |
| GET | `/packages` | Active packages |
| GET | `/packages/admin/all` 🔒 | All packages |
| POST / PUT `/:id` / DELETE `/:id` | `/packages` 🔒 | Create / update / delete |
| GET | `/promotions` | Active, non-expired promotions |
| GET | `/promotions/admin/all` 🔒 | All promotions |
| POST / PUT `/:id` / DELETE `/:id` | `/promotions` 🔒 | Create / update / delete |
| GET | `/gallery?category=beach` | Gallery images |
| POST | `/gallery` 🔒 | Multipart upload: `image`, `title`, `category` |
| PUT / DELETE | `/gallery/:id` 🔒 | Edit caption/category · delete |
| GET | `/content` | All site content as `{key: value}` |
| PUT | `/content` 🔒 | Update one or more keys |
| POST | `/contact` | Submit contact form (rate limited, validated) |
| GET | `/contact` 🔒 | List messages |
| PATCH | `/contact/:id/read` 🔒 | Mark read/unread |
| DELETE | `/contact/:id` 🔒 | Delete message |
| POST | `/upload` 🔒 | Upload an image, returns `{url}` |
| GET | `/health` | Health check |

## Security notes

- Passwords hashed with bcrypt (cost 12); JWT expires after 8 h (configurable).
- Login limited to 10 attempts / 15 min / IP; contact form 8 messages / hour / IP.
- All SQL uses parameterised queries; inputs validated server-side.
- Uploads restricted to JPG/PNG/WebP ≤ 5 MB with random filenames.
- `helmet` security headers with a CSP that allows only Google Maps embeds and Google Fonts.
- The server refuses to start without a strong `JWT_SECRET`.
- The JWT is stored in `localStorage`; for higher-security deployments consider moving it to an httpOnly cookie.

## Customising

- **Images:** sample photos are Unsplash placeholders. Replace them with your own through the admin panel (Upload button) before going live, and check Unsplash licence terms or use your own photography.
- **Content & contact details:** Admin → *Site Content & Contact*. List-type fields (highlights, reviews, amenities, attractions) are JSON arrays; the sample data shows the format.
- **Colours & fonts:** edit the CSS variables at the top of `frontend/src/styles/base.css`.
- **Google Map:** the embed uses the free `maps?q=…&output=embed` URL (no API key). For a custom-styled map, switch to the Maps Embed API with your own key.
- **SEO:** replace `www.example.com` in `index.html`, `robots.txt` and `sitemap.xml` with your domain.

## Licence

Provided as a starter project for Sample Hotel. Adapt freely.
