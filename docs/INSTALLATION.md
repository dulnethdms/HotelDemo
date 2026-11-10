# Installation Guide (local development)

## Prerequisites

- **Node.js 18+** (`node -v`)
- **MongoDB 6+** running locally or a MongoDB Atlas connection string
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
| `MONGODB_URI` | MongoDB connection string (default `mongodb://127.0.0.1:27017`) |
| `MONGODB_DB` | database name (default `ocean_paradise`) |
| `JWT_SECRET` | long random string – generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | first admin login (password ≥ 10 chars) |
| `CLIENT_URL` | `http://localhost:5173` in development |

Install and initialise:

```bash
npm install
npm run setup     # creates indexes, the admin user, and sample content
npm run dev       # http://localhost:5000  (check /api/health)
```

`npm run setup` is safe to re-run – it never overwrites existing data or the admin password.

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
| `MongoServerSelectionError` | MongoDB is not running or `MONGODB_URI` is incorrect |
| `FATAL: JWT_SECRET must be set` | add a 24+ character `JWT_SECRET` to `.env` |
| Site loads but has no text/data | the API isn't running, or `npm run setup` wasn't executed |
| CORS error | `CLIENT_URL` must exactly match the browser origin (scheme + host + port) |
| Images show a blue gradient | the image URL failed to load; re-upload or fix the URL in the admin panel |
| Uploads fail | files must be JPG/PNG/WebP ≤ 5 MB and `backend/uploads` must be writable |
