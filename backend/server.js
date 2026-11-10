require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./src/db');
const { UPLOAD_DIR } = require('./src/middleware/upload');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  console.error('FATAL: JWT_SECRET must be set in .env (at least 24 characters).');
  process.exit(1);
}

const app = express();
const isProd = process.env.NODE_ENV === 'production';
app.set('trust proxy', 1); // behind Nginx / a PaaS proxy

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        frameSrc: ["'self'", 'https://www.google.com', 'https://maps.google.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"], // inline JSON-LD in index.html
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()) }));
app.use(express.json({ limit: '200kb' }));
if (!isProd) app.use(morgan('dev'));

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));

app.get('/api/health', async (req, res, next) => {
  try {
    await (await db.getDb()).command({ ping: 1 });
    res.json({ status: 'ok', database: 'mongodb' });
  } catch (err) {
    next(err);
  }
});
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/packages', require('./src/routes/packages'));
app.use('/api/promotions', require('./src/routes/promotions'));
app.use('/api/gallery', require('./src/routes/gallery'));
app.use('/api/content', require('./src/routes/content'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/upload', require('./src/routes/upload'));
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Optionally serve the built React app from the same server (single-server deployment)
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '1h', index: false }));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Image must be 5 MB or smaller' });
  if (err.name === 'MulterError' || /Only JPG/.test(err.message)) return res.status(400).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const port = Number(process.env.PORT) || 5000;
db.getDb()
  .then(() => app.listen(port, () => console.log(`Ocean Paradise API listening on http://localhost:${port}`)))
  .catch((err) => {
    console.error(`FATAL: Could not connect to MongoDB: ${err.message}`);
    process.exit(1);
  });
