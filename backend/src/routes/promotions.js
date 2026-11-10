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
      title, category: CATEGORIES.includes(b.category) ? b.category : 'seasonal', description,
      discount_label: String(b.discount_label || '').trim() || null, image_url,
      valid_from: from, valid_until: until, is_active: !(b.is_active === false || b.is_active === 0),
    },
  };
}

router.get('/', async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const rows = await (await db.collection('promotions')).find({
      is_active: true,
      $or: [{ valid_until: null }, { valid_until: { $gte: today } }],
    }).sort({ valid_until: 1, id: -1 }).toArray();
    res.json(rows.map(parse));
  } catch (e) { next(e); }
});

router.get('/admin/all', requireAuth, async (req, res, next) => {
  try {
    const rows = await (await db.collection('promotions')).find().sort({ id: -1 }).toArray();
    res.json(rows.map(parse));
  } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { errors, data } = validate(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const record = { id: await db.nextId('promotions'), ...data, created_at: new Date(), updated_at: new Date() };
    await (await db.collection('promotions')).insertOne(record);
    res.status(201).json(parse(record));
  } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { errors, data } = validate(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const promotions = await db.collection('promotions');
    const id = Number(req.params.id);
    const old = await promotions.findOne({ id });
    if (!old) return res.status(404).json({ error: 'Not found' });
    const record = { ...old, ...data, updated_at: new Date() };
    await promotions.replaceOne({ id }, record);
    if (old.image_url !== data.image_url) removeUpload(old.image_url);
    res.json(parse(record));
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const promotions = await db.collection('promotions');
    const old = await promotions.findOne({ id: Number(req.params.id) });
    if (!old) return res.status(404).json({ error: 'Not found' });
    await promotions.deleteOne({ id: old.id });
    removeUpload(old.image_url);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
