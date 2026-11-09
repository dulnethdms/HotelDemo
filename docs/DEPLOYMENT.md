# Deployment Guide

The simplest production setup is **one Node process** that serves both the API and the built React site, behind Nginx with HTTPS. An alternative split deployment is described at the end.

## Option A – Single VPS (Ubuntu 22.04/24.04) with Nginx + PM2

### 1. Server prerequisites

```bash
sudo apt update && sudo apt install -y nginx mysql-server certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm i -g pm2
sudo mysql_secure_installation
```

Create a dedicated, least-privilege MySQL user (don't use root):

```sql
CREATE DATABASE ocean_paradise CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ocean'@'localhost' IDENTIFIED BY 'a-strong-password';
GRANT ALL PRIVILEGES ON ocean_paradise.* TO 'ocean'@'localhost';
```

> `npm run setup` runs `CREATE DATABASE IF NOT EXISTS`, which requires that privilege on first run. Either run setup once with an account that can create databases, or pre-create the DB as above and grant privileges (setup then only creates tables).

### 2. Upload the project and build

```bash
# e.g. into /var/www/ocean-paradise
cd /var/www/ocean-paradise/backend
cp .env.example .env && nano .env   # NODE_ENV=production, real DB creds, strong JWT_SECRET
npm ci --omit=dev
npm run setup

cd ../frontend
npm ci
npm run build                       # creates frontend/dist
```

Production `.env` essentials:

```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://www.yourdomain.com
JWT_SECRET=<48+ random bytes in hex>
```

When `frontend/dist` exists, Express serves it automatically (with SPA fallback), so a single process delivers site + API + uploads.

### 3. Run with PM2

```bash
cd /var/www/ocean-paradise/backend
pm2 start server.js --name ocean-paradise
pm2 save && pm2 startup           # restart on reboot
```

### 4. Nginx reverse proxy

`/etc/nginx/sites-available/ocean-paradise`:

```nginx
server {
  server_name www.yourdomain.com yourdomain.com;
  client_max_body_size 6M;                 # image uploads (limit is 5 MB)

  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ocean-paradise /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com   # free HTTPS + auto-renew
```

### 5. Post-deploy checklist

- [ ] Log in at `/admin/login`, **change the admin password**, then remove `ADMIN_PASSWORD` from `.env`.
- [ ] Replace sample Unsplash images with the resort's own photos (Admin → Gallery / Packages / Site Content).
- [ ] Update address, phone, email, social links and map text (Admin → Site Content & Contact).
- [ ] Replace `www.example.com` in `frontend/index.html`, `public/robots.txt`, `public/sitemap.xml`, then rebuild (`npm run build`).
- [ ] Update the JSON-LD block in `index.html` with the real address and phone.
- [ ] Firewall: allow only 80/443/SSH (`sudo ufw allow 'Nginx Full' && sudo ufw allow OpenSSH && sudo ufw enable`); keep MySQL bound to localhost.
- [ ] Back up the database nightly (`mysqldump ocean_paradise | gzip > backup.sql.gz`) **and** `backend/uploads/`.
- [ ] Submit the sitemap to Google Search Console.

### Updating the site later

```bash
git pull   # or upload new files
cd backend && npm ci --omit=dev && pm2 restart ocean-paradise
cd ../frontend && npm ci && npm run build      # served immediately, no restart needed
```

## Option B – Split deployment (static frontend + hosted API)

- **Frontend** (Netlify, Vercel, Cloudflare Pages, S3+CloudFront): build command `npm run build`, publish directory `dist`. Add an SPA rewrite so every path serves `index.html` (e.g. Netlify `_redirects`: `/* /index.html 200`). Set build env vars:
  `VITE_API_URL=https://api.yourdomain.com/api` and `VITE_ASSET_URL=https://api.yourdomain.com`.
- **Backend** (Render, Railway, Fly.io, a VPS): start command `node server.js`; set `CLIENT_URL=https://www.yourdomain.com` and the DB/JWT variables. Use a managed MySQL (PlanetScale-compatible, Railway, AWS RDS, DigitalOcean) and run `npm run setup` once from your machine against it.
- The CSP in `server.js` only governs responses served by Express; configure equivalent headers on your static host if desired.
- ⚠️ **Uploaded images are stored on the API server's disk.** On platforms with ephemeral filesystems (Render free tier, Heroku, etc.) they disappear on redeploy – attach a persistent disk/volume, or switch the upload middleware to S3/Cloudflare R2.

## Docker (optional sketch)

Run MySQL as a container, mount a volume for `backend/uploads`, and use `node:20-alpine` for the app (`npm ci --omit=dev && node server.js`) after building `frontend/dist` in a multi-stage build.
