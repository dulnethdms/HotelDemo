const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { removeUpload } = require('../middleware/upload');

const parse = (r) => ({
  ...r,
  features: Array.isArray(r.features) ? r.features : [],
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
      name, category: b.category === 'package' ? 'package' : 'room', description, price,
      price_note: String(b.price_note || '').trim() || null, image_url, features,
      special_offer: String(b.special_offer || '').trim() || null,
      is_featured: !!b.is_featured, is_active: !(b.is_active === false || b.is_active === 0),
      sort_order: Number.parseInt(b.sort_order, 10) || 0,
    },
  };
}

router.get('/', async (req, res, next) => {
  try {
    const packages = await db.collection('packages');
    const rows = await packages.find({ is_active: true }).sort({ sort_order: 1, id: 1 }).toArray();
    res.json(rows.map(parse));
  } catch (e) { next(e); }
});

router.get('/admin/all', requireAuth, async (req, res, next) => {
  try {
    const rows = await (await db.collection('packages')).find().sort({ sort_order: 1, id: 1 }).toArray();
    res.json(rows.map(parse));
  } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { errors, data } = validate(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const record = { id: await db.nextId('packages'), ...data, created_at: new Date(), updated_at: new Date() };
    await (await db.collection('packages')).insertOne(record);
    res.status(201).json(parse(record));
  } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { errors, data } = validate(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const packages = await db.collection('packages');
    const id = Number(req.params.id);
    const old = await packages.findOne({ id });
    if (!old) return res.status(404).json({ error: 'Not found' });
    const record = { ...old, ...data, updated_at: new Date() };
    await packages.replaceOne({ id }, record);
    if (old.image_url !== data.image_url) removeUpload(old.image_url);
    res.json(parse(record));
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const packages = await db.collection('packages');
    const old = await packages.findOne({ id: Number(req.params.id) });
    if (!old) return res.status(404).json({ error: 'Not found' });
    await packages.deleteOne({ id: old.id });
    removeUpload(old.image_url);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
