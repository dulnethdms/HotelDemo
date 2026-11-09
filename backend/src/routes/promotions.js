const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { removeUpload } = require('../middleware/upload');

const CATEGORIES = ['seasonal', 'holiday', 'event'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const parse = (r) => ({ ...r, is_active: !!r.is_active });

function validate(b = {}) {
  const errors = [];
  const title = String(b.title || '').trim();
  const description = String(b.description || '').trim();
  const image_url = String(b.image_url || '').trim();
  if (!title) errors.push('Title is required');
  if (!description) errors.push('Description is required');
  if (!image_url) errors.push('An image is required');
  const from = b.valid_from ? String(b.valid_from).slice(0, 10) : null;
  const until = b.valid_until ? String(b.valid_until).slice(0, 10) : null;
  if ((from && !DATE_RE.test(from)) || (until && !DATE_RE.test(until))) errors.push('Dates must be YYYY-MM-DD');
  if (from && until && from > until) errors.push('"Valid until" must be after "Valid from"');
  return {
    errors,
    data: {
      title,
      category: CATEGORIES.includes(b.category) ? b.category : 'seasonal',
      description,
      discount_label: String(b.discount_label || '').trim() || null,
      image_url,
      valid_from: from,
      valid_until: until,
      is_active: b.is_active === false || b.is_active === 0 ? 0 : 1,
    },
  };
}

// PUBLIC: active promotions that have not expired
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM promotions
       WHERE is_active = 1 AND (valid_until IS NULL OR valid_until >= CURDATE())
       ORDER BY valid_until IS NULL, valid_until, id DESC`
    );
    res.json(rows.map(parse));
  } catch (e) { next(e); }
});

router.get('/admin/all', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM promotions ORDER BY id DESC');
    res.json(rows.map(parse));
  } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { errors, data } = validate(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const [r] = await db.query('INSERT INTO promotions SET ?', [data]);
    const [rows] = await db.query('SELECT * FROM promotions WHERE id = ?', [r.insertId]);
    res.status(201).json(parse(rows[0]));
  } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { errors, data } = validate(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const [old] = await db.query('SELECT image_url FROM promotions WHERE id = ?', [req.params.id]);
    if (!old[0]) return res.status(404).json({ error: 'Not found' });
    await db.query('UPDATE promotions SET ? WHERE id = ?', [data, req.params.id]);
    if (old[0].image_url !== data.image_url) removeUpload(old[0].image_url);
    const [rows] = await db.query('SELECT * FROM promotions WHERE id = ?', [req.params.id]);
    res.json(parse(rows[0]));
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const [old] = await db.query('SELECT image_url FROM promotions WHERE id = ?', [req.params.id]);
    if (!old[0]) return res.status(404).json({ error: 'Not found' });
    await db.query('DELETE FROM promotions WHERE id = ?', [req.params.id]);
    removeUpload(old[0].image_url);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
