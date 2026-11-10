const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const rows = await (await db.collection('site_content')).find().toArray();
    res.json(Object.fromEntries(rows.map((r) => [r.content_key, r.content_value])));
  } catch (e) { next(e); }
});

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const entries = Object.entries(req.body || {});
    if (!entries.length) return res.status(400).json({ error: 'Nothing to update' });
    for (const [key, value] of entries) {
      if (!/^[a-z0-9_]{1,80}$/.test(key)) return res.status(400).json({ error: `Invalid key: ${key}` });
      if (String(value ?? '').length > 20000) return res.status(400).json({ error: `${key} is too long` });
    }
    const content = await db.collection('site_content');
    await content.bulkWrite(entries.map(([key, value]) => ({
      updateOne: {
        filter: { content_key: key },
        update: { $set: { content_key: key, content_value: String(value ?? ''), updated_at: new Date() } },
        upsert: true,
      },
    })));
    res.json({ message: 'Content updated' });
  } catch (e) { next(e); }
});

module.exports = router;
