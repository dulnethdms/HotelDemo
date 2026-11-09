const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// PUBLIC: all content as { key: value }
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT content_key, content_value FROM site_content');
    res.json(Object.fromEntries(rows.map((r) => [r.content_key, r.content_value])));
  } catch (e) { next(e); }
});

// ADMIN: update many keys at once  { key: value, ... }
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const entries = Object.entries(req.body || {});
    if (!entries.length) return res.status(400).json({ error: 'Nothing to update' });
    for (const [key, value] of entries) {
      if (!/^[a-z0-9_]{1,80}$/.test(key)) return res.status(400).json({ error: `Invalid key: ${key}` });
      if (String(value ?? '').length > 20000) return res.status(400).json({ error: `${key} is too long` });
    }
    for (const [key, value] of entries) {
      await db.query(
        'INSERT INTO site_content (content_key, content_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)',
        [key, String(value ?? '')]
      );
    }
    res.json({ message: 'Content updated' });
  } catch (e) { next(e); }
});

module.exports = router;
