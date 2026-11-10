# Installation Guide (local development)

## Prerequisites

- **Node.js 18+** (`node -v`)
- **Supabase project** with access to the SQL Editor
- npm (bundled with Node)

## 1. Get the code

```bash
cd ocean-paradise-resort
```

## 2. Configure and set up the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

| Variable | What to set |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key; keep it server-side |
| `JWT_SECRET` | long random string – generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | first admin login (password ≥ 10 chars) |
| `CLIENT_URL` | `http://localhost:5173` in development |

Install and initialise:

```bash
npm install
npm run setup     # creates the admin user and sample content
npm run dev       # http://localhost:5000  (check /api/health)
```

Before `npm run setup`, run `database/schema.sql` in the Supabase SQL Editor. The setup is safe to re-run – it never overwrites existing data or the admin password.

## 3. Run the frontend

```bash
cd ../frontend
npm install
npm run dev       # http://localhost:5173
```

Vite proxies `/api` and `/uploads` to port 5000, so no extra configuration is needed.

## 4. Log in to the admin panel

Open <http://localhost:5173/admin/login> and sign in with the credentials from `.env`. Go to **Account** and change the password.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Supabase` errors | Check `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and that `database/schema.sql` was run |
| `FATAL: JWT_SECRET must be set` | add a 24+ character `JWT_SECRET` to `.env` |
| Site loads but has no text/data | the API isn't running, or `npm run setup` wasn't executed |
| CORS error | `CLIENT_URL` must exactly match the browser origin (scheme + host + port) |
| Images show a blue gradient | the image URL failed to load; re-upload or fix the URL in the admin panel |
| Uploads fail | files must be JPG/PNG/WebP ≤ 5 MB and `backend/uploads` must be writable |
