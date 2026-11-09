const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { removeUpload } = require('../middleware/upload');

const parse = (r) => ({
  ...r,
  features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features || [],
  is_featured: !!r.is_featured,
  is_active: !!r.is_active,
});

function validate(b = {}) {
  const errors = [];
  const name = String(b.name || '').trim();
  const description = String(b.description || '').trim();
  const image_url = String(b.image_url || '').trim();
  const price = Number(b.price);
  if (!name) errors.push('Name is required');
  if (!description) errors.push('Description is required');
  if (!image_url) errors.push('An image is required');
  if (!Number.isFinite(price) || price < 0) errors.push('Price must be a positive number');
  const features = (Array.isArray(b.features) ? b.features : [])
    .map((f) => String(f).trim())
    .filter(Boolean)
    .slice(0, 30);
  return {
    errors,
    data: {
      name,
      category: b.category === 'package' ? 'package' : 'room',
      description,
      price,
      price_note: String(b.price_note || '').trim() || null,
      image_url,
      features: JSON.stringify(features),
      special_offer: String(b.special_offer || '').trim() || null,
      is_featured: b.is_featured ? 1 : 0,
      is_active: b.is_active === false || b.is_active === 0 ? 0 : 1,
      sort_order: Number.parseInt(b.sort_order, 10) || 0,
    },
  };
}

// PUBLIC: active packages
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM packages WHERE is_active = 1 ORDER BY sort_order, id');
    res.json(rows.map(parse));
  } catch (e) { next(e); }
});

// ADMIN: all packages (must be before '/:id')
router.get('/admin/all', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM packages ORDER BY sort_order, id');
    res.json(rows.map(parse));
  } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { errors, data } = validate(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const [r] = await db.query('INSERT INTO packages SET ?', [data]);
    const [rows] = await db.query('SELECT * FROM packages WHERE id = ?', [r.insertId]);
    res.status(201).json(parse(rows[0]));
  } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { errors, data } = validate(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const [old] = await db.query('SELECT image_url FROM packages WHERE id = ?', [req.params.id]);
    if (!old[0]) return res.status(404).json({ error: 'Not found' });
    await db.query('UPDATE packages SET ? WHERE id = ?', [data, req.params.id]);
    if (old[0].image_url !== data.image_url) removeUpload(old[0].image_url);
    const [rows] = await db.query('SELECT * FROM packages WHERE id = ?', [req.params.id]);
    res.json(parse(rows[0]));
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const [old] = await db.query('SELECT image_url FROM packages WHERE id = ?', [req.params.id]);
    if (!old[0]) return res.status(404).json({ error: 'Not found' });
    await db.query('DELETE FROM packages WHERE id = ?', [req.params.id]);
    removeUpload(old[0].image_url);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
